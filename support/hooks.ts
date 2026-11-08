import { Before, After, Status, AfterStep, BeforeStep } from '@cucumber/cucumber';
// Heal stale PLAYWRIGHT_BROWSERS_PATH before any browser launch (world.openBrowser).
import './playwright-browsers-path';
import type { ICustomWorld } from './world';
import { CustomWorld } from './world';
import {
  extractProjectKeyFromFeatureUri,
  setScenarioProjectKey,
  setScenarioCredentialProfile,
  resetEnvConfigLogCache,
} from './env';
import * as fs from 'fs/promises';
import * as path from 'path';
import chalk from "chalk";
import { setDefaultTimeout } from '@cucumber/cucumber';
import { randomUUID } from 'crypto';
import { FlowCaptureSession } from './flow-capture';
import { publicFlowValues } from './flowContext';
import { clearLocatorOverrides } from './locator-registry';
import { resetTestDataCache } from './testData';
import { runGeneratedAfter, runGeneratedBefore } from './lifecycleRegistry';
import {
  buildExecutionUnitKey,
  buildScenarioKey,
  emitStepEvent,
  emitStepScreenshot,
  parseRowIndexFromEnv,
  parseRowLabelFromEnv,
  type StepEventKind,
} from './step-event';
import { stepEventFromCucumberStatus } from './step-status';
import { ensureInitialPageForFirstStep } from './initial-page';
import { applyPostStepWait, configuredStepDelayMs, domFingerprint } from './navigation-click';
import { markScenarioStart } from './waitSteps';

function parsePositiveInt(envKey: string, fallbackMs: number): number {
  const raw = process.env[envKey];
  if (raw == null || raw.trim() === '') {
    return fallbackMs;
  }
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallbackMs;
}

setDefaultTimeout(parsePositiveInt('COTESTER_STEP_TIMEOUT_MS', 120 * 1000));

// Screenshots directory
const SCREENSHOTS_DIR = 'reports/screenshots';

/** Tracks cucumber-js scenario attempts (initial run + retries) per pickle id. */
const attemptByPickleId = new Map<string, number>();
/** 0-based step counter per pickle attempt key. */
const stepIndexByAttempt = new Map<string, number>();
/** Scenario context stashed in Before for step events. */
const scenarioCtxByWorld = new WeakMap<object, {
  featurePath: string;
  featureName: string;
  scenarioName: string;
  scenarioKey: string;
  attempt: number;
  pickleId: string;
  outlineLine?: number;
  rowIndex?: number;
  rowLabel?: string;
  executionUnitKey: string;
}>();

function attemptKey(pickleId: string, attempt: number): string {
  return `${pickleId}#${attempt}`;
}

function featureNameFromUri(featureUri: string): string {
  if (!featureUri) {
    return '';
  }
  if (featureUri.includes('/')) {
    return featureUri.substring(featureUri.lastIndexOf('/') + 1).replace('.feature', '');
  }
  if (featureUri.includes('\\')) {
    return featureUri.substring(featureUri.lastIndexOf('\\') + 1).replace('.feature', '');
  }
  return featureUri.replace('.feature', '');
}

function pickleKey(pickle: { id?: string; uri?: string } | undefined): string {
  return pickle?.id ?? pickle?.uri ?? 'unknown';
}

type ScreenshotMode = 'ALL_STEPS' | 'FAIL_ONLY' | 'FAIL_AND_LAST_PASS' | 'NONE';

function getScreenshotMode(): ScreenshotMode {
  const raw = (process.env.SCREENSHOT_MODE ?? process.env.screenshot ?? 'ALL_STEPS').toUpperCase();
  if (raw === 'ON') return 'ALL_STEPS';
  if (raw === 'OFF') return 'NONE';
  if (raw === 'ALL_STEPS' || raw === 'FAIL_ONLY' || raw === 'FAIL_AND_LAST_PASS' || raw === 'NONE') {
    return raw;
  }
  return 'ALL_STEPS';
}

function shouldTakeStepScreenshot(mode: ScreenshotMode, status: string, isLastStep: boolean): boolean {
  switch (mode) {
    case 'ALL_STEPS':
      return true;
    case 'FAIL_ONLY':
      return status !== 'PASSED';
    case 'FAIL_AND_LAST_PASS':
      return status !== 'PASSED' || isLastStep;
    case 'NONE':
      return false;
    default:
      return true;
  }
}

// Ensure screenshots directory exists
async function ensureScreenshotsDir() {
  try {
    await fs.mkdir(SCREENSHOTS_DIR, { recursive: true });
  } catch (e) {
    // Ignore if already exists
  }
}

/** Prefer active open page; fall back if the tab closed mid-step. */
async function resolveScreenshotPage(world: ICustomWorld): Promise<import('playwright').Page | undefined> {
  try {
    await world.activePageManager?.settle();
  } catch {
    // ignore
  }
  const managed = world.activePageManager?.getActivePage();
  if (managed && !managed.isClosed()) {
    if (world.activeRawPage !== managed || !world.page || world.page.isClosed()) {
      world.applyActivePage(managed);
    }
    return world.page && !world.page.isClosed() ? world.page : managed;
  }
  if (world.page && !world.page.isClosed()) {
    return world.page;
  }
  return undefined;
}

async function captureStepScreenshot(
  world: ICustomWorld,
  featureName: string,
  meta?: {
    featurePath: string;
    scenarioKey: string;
    attempt: number;
    stepIndex: number;
    pickleStepId?: string;
    rowIndex?: number;
    executionUnitKey: string;
  },
): Promise<void> {
  const page = await resolveScreenshotPage(world);
  if (!page) return;

  const buffer = await page.screenshot({ fullPage: false });
  const filename = `${randomUUID()}.png`;
  const filepath = path.join(SCREENSHOTS_DIR, filename);
  await fs.writeFile(filepath, buffer);
  console.log(chalk.cyan(`📸 Screenshot [${featureName}]: ${filepath}`));
  await world.attach(buffer, 'image/png');
  if (meta) {
    emitStepScreenshot({
      v: 1,
      kind: 'SCREENSHOT',
      runner: 'WEB',
      featurePath: meta.featurePath,
      featureName,
      scenarioKey: meta.scenarioKey,
      attempt: meta.attempt,
      stepIndex: meta.stepIndex,
      pickleStepId: meta.pickleStepId,
      rowIndex: meta.rowIndex,
      fileName: filename,
      executionUnitKey: meta.executionUnitKey,
    });
  }
}

Before(async function (this: CustomWorld, scenario) {
  await ensureScreenshotsDir();

  this.scenarioVars = {};
  markScenarioStart(this);
  clearLocatorOverrides();
  resetTestDataCache();

  // Load execution-scoped Test Flow shared context (if present); sensitive values are never preloaded
  if (process.env.COTESTER_FLOW_CONTEXT_PATH) {
    try {
      this.scenarioVars = { ...publicFlowValues() };
    } catch {
      console.warn('Failed to load flow context');
    }
  }

  // CRITICAL: Extract and store feature name for multi-feature parallel execution
  // This allows us to include feature context in every step log
  const pickleUri = scenario.pickle?.uri || '';
  const originalFeature = process.env.COTESTER_FLOW_ORIGINAL_FEATURE || '';
  const featureUri = originalFeature || pickleUri;
  const projectKey =
    extractProjectKeyFromFeatureUri(pickleUri) || extractProjectKeyFromFeatureUri(originalFeature);
  this.scenarioProjectKey = projectKey;
  setScenarioProjectKey(projectKey);
  resetEnvConfigLogCache();

  const credentialTag = scenario.pickle?.tags?.find((tag) =>
    tag.name.toLowerCase().startsWith('credential:'),
  );
  if (credentialTag) {
    const slug = credentialTag.name.split(':').slice(1).join(':').trim();
    if (slug) {
      setScenarioCredentialProfile(slug);
    }
  }

  const featureName = featureNameFromUri(featureUri);
  const pickleId = pickleKey(scenario.pickle);
  const attempt = (attemptByPickleId.get(pickleId) ?? 0) + 1;
  attemptByPickleId.set(pickleId, attempt);
  stepIndexByAttempt.set(attemptKey(pickleId, attempt), 0);

  this.currentFeatureName = featureName;

  const scenarioName = scenario.pickle?.name || 'Unknown Scenario';
  const outlineLine =
    typeof (scenario.pickle as { locations?: { line?: number }[] })?.locations?.[0]?.line === 'number'
      ? (scenario.pickle as { locations?: { line?: number }[] }).locations![0]!.line
      : undefined;
  const rowIndex = parseRowIndexFromEnv();
  const rowLabel = parseRowLabelFromEnv();
  const scenarioKey = buildScenarioKey({
    featurePath: featureUri || featureName,
    scenarioName,
    pickleId,
    outlineLine,
    rowIndex,
  });
  const executionUnitKey = buildExecutionUnitKey({
    featurePath: featureUri || featureName,
    scenarioKey,
    attempt,
    rowIndex,
  });
  scenarioCtxByWorld.set(this, {
    featurePath: featureUri || featureName,
    featureName,
    scenarioName,
    scenarioKey,
    attempt,
    pickleId,
    outlineLine,
    rowIndex,
    rowLabel,
    executionUnitKey,
  });

  if (featureName) {
    if (attempt > 1) {
      console.log(chalk.cyan(`⟳ RETRY ATTEMPT ${attempt}: ${featureName}`));
    }
    console.log(chalk.magenta(`🎯 FEATURE START: ${featureName}`));
    console.log(chalk.magenta(`📁 Feature File: ${featureUri}`));
    if (projectKey) {
      console.log(chalk.magenta(`🏷️ Project env: ${projectKey} (TEST_ENV=${process.env.TEST_ENV || 'dev'})`));
    }
  }

  await this.openBrowser();

  if (process.env.COTESTER_FLOW_CAPTURE === '1' && this.page) {
    this.flowCapture = new FlowCaptureSession();
    this.flowCapture.attach(this.page);
  }

  // Scoped BEFORE lifecycle of migrated tests (no-op for features without a registration).
  await runGeneratedBefore(featureUri, this);
});

// CRITICAL: Include feature name in EVERY step log for parallel execution support
BeforeStep(async function (this: ICustomWorld, { pickleStep, pickle }) {
  try {
    await this.activePageManager?.settle();
    const managed = this.activePageManager?.getActivePage();
    if (managed && !managed.isClosed() && this.activeRawPage !== managed) {
      this.applyActivePage(managed);
    }
  } catch {
    // ignore settle errors — step will fail on its own if page is unusable
  }
  const featureName = this.currentFeatureName || 'unknown';
  if (this.healingContext) {
    this.healingContext.currentStepKey = pickleStep.id;
    this.healingContext.currentStepText = pickleStep.text ?? '';
    this.healingContext.currentScenarioName = pickle.name ?? '';
  }
  this.stepUrlBefore = this.page && !this.page.isClosed() ? this.page.url() : '';
  this.stepDomBefore = await domFingerprint(this.page);
  // Format: ➡ STEP START [feature-name]: step text
  console.error(chalk.yellow(`➡ STEP START [${featureName}]: ${pickleStep.text}`));

  const ctx = scenarioCtxByWorld.get(this);
  if (ctx) {
    const aKey = attemptKey(ctx.pickleId, ctx.attempt);
    const currentIndex = stepIndexByAttempt.get(aKey) ?? 0;
    if (currentIndex === 0) {
      await ensureInitialPageForFirstStep(
        this.page,
        pickleStep.text ?? '',
        `${this.currentFeatureName || ''}\n${pickle.name ?? ''}`,
      );
    }
    const next = currentIndex + 1;
    stepIndexByAttempt.set(aKey, next);
    emitStepEvent({
      v: 1,
      event: 'START',
      runner: 'WEB',
      featurePath: ctx.featurePath,
      featureName: ctx.featureName || featureName,
      scenarioKey: ctx.scenarioKey,
      scenarioName: ctx.scenarioName,
      attempt: ctx.attempt,
      stepIndex: next,
      pickleStepId: pickleStep.id,
      rowIndex: ctx.rowIndex,
      rowLabel: ctx.rowLabel,
      text: pickleStep.text ?? '',
      executionUnitKey: ctx.executionUnitKey,
    });
  }
});

AfterStep(async function (this: ICustomWorld, { result, pickleStep, pickle }) {
  const featureName = this.currentFeatureName || 'unknown';
  const status = result.status;

  const mapped = stepEventFromCucumberStatus(status);
  let event: StepEventKind = mapped.event;
  let reason: string | undefined = mapped.reason;
  if (event === 'PASS') {
    console.error(chalk.green(`✓ STEP PASS [${featureName}]: ${pickleStep.text}`));
  } else if (event === 'SKIP') {
    console.error(chalk.gray(`⊘ STEP SKIPPED [${featureName}]: ${pickleStep.text}`));
  } else {
    if (!reason && String(result?.message || '').toLowerCase().includes('timed out')) {
      reason = 'timeout';
    }
    console.error(chalk.red(`✗ STEP FAIL [${featureName}]: ${pickleStep.text}`));
  }

  const ctx = scenarioCtxByWorld.get(this);
  const aKey = ctx ? attemptKey(ctx.pickleId, ctx.attempt) : '';
  const stepIndex = aKey ? stepIndexByAttempt.get(aKey) ?? 0 : 0;
  const steps = pickle?.steps ?? [];
  const lastStep = steps.length > 0 ? steps[steps.length - 1] : undefined;
  const isLastStep = lastStep?.id === pickleStep.id;
  const afterUrl = this.page && !this.page.isClosed() ? this.page.url() : '';
  const afterDom = event === 'PASS' ? await domFingerprint(this.page) : '';
  const changed =
    afterUrl !== (this.stepUrlBefore || '') || afterDom !== (this.stepDomBefore || '');
  const stepDelayMs = event === 'PASS' && !isLastStep ? configuredStepDelayMs() : 0;
  if (ctx && stepIndex > 0) {
    emitStepEvent({
      v: 1,
      event,
      runner: 'WEB',
      featurePath: ctx.featurePath,
      featureName: ctx.featureName || featureName,
      scenarioKey: ctx.scenarioKey,
      scenarioName: ctx.scenarioName,
      attempt: ctx.attempt,
      stepIndex,
      pickleStepId: pickleStep.id,
      rowIndex: ctx.rowIndex,
      rowLabel: ctx.rowLabel,
      text: pickleStep.text ?? '',
      reason,
      executionUnitKey: ctx.executionUnitKey,
      ...(stepDelayMs > 0 ? { stepDelayMs } : {}),
    });
  }
  await applyPostStepWait({
    passed: event === 'PASS',
    isLastStep,
    changed,
    page: this.page,
  });

  const mode = getScreenshotMode();

  if (!shouldTakeStepScreenshot(mode, status, isLastStep)) {
    return;
  }

  try {
    await captureStepScreenshot(
      this,
      featureName,
      ctx && stepIndex > 0
        ? {
            featurePath: ctx.featurePath,
            scenarioKey: ctx.scenarioKey,
            attempt: ctx.attempt,
            stepIndex,
            pickleStepId: pickleStep.id,
            rowIndex: ctx.rowIndex,
            executionUnitKey: ctx.executionUnitKey,
          }
        : undefined,
    );
  } catch (e) {
    console.warn(`⚠️ Step screenshot failed: ${e}`);
  }
});

After(async function (this: ICustomWorld, scenario) {
  const status = scenario.result?.status;
  const screenshotMode = getScreenshotMode();
  const featureName = this.currentFeatureName || 'unknown';

  if (scenario.willBeRetried) {
    const pickleId = pickleKey(scenario.pickle);
    const nextAttempt = (attemptByPickleId.get(pickleId) ?? 1) + 1;
    console.log(
      chalk.cyan(
        `⟳ RETRY SCHEDULED: ${featureName} yeniden denenecek (attempt ${nextAttempt})`,
      ),
    );
  } else {
    attemptByPickleId.delete(pickleKey(scenario.pickle));
  }

  // Scoped AFTER lifecycle of migrated tests: runs while the browser and project context are still open; its
  // failure is reported after the regular cleanup below has completed.
  let generatedAfterError: unknown;
  try {
    await runGeneratedAfter(
      process.env.COTESTER_FLOW_ORIGINAL_FEATURE || scenario.pickle?.uri || '',
      this,
    );
  } catch (e) {
    generatedAfterError = e;
  }

  if (this.flowCapture) {
    try {
      await this.flowCapture.flushToContextAndArtifact();
      this.flowCapture.detachAll();
    } catch (e) {
      console.warn('Flow capture flush failed:', e);
    }
    this.flowCapture = undefined;
  }

  this.scenarioProjectKey = undefined;
  setScenarioProjectKey(undefined);
  setScenarioCredentialProfile(undefined);
  clearLocatorOverrides();
  this.healingContext = undefined;

  if (status === Status.FAILED && screenshotMode !== 'NONE') {
    try {
      const page = await resolveScreenshotPage(this);
      if (page) {
        const png = await page.screenshot({ fullPage: true, timeout: 10000 });
        await this.attach(png, 'image/png');
      }
    } catch (e) {
      console.warn(`⚠️ Final screenshot failed: ${e}`);
    }
  }

  // CRITICAL: closeBrowser now handles video logging and closing browsers in correct order
  try {
    await this.closeBrowser();
  } catch (e) {
    console.error(`❌ Browser closure error: ${e}`);
  }

  // Video attachment for Allure (only on failure)
  if (status === Status.FAILED) {
    await attachFailureVideo(this);
  }

  if (generatedAfterError) {
    throw generatedAfterError;
  }
});

// The video path is logged by closeBrowser, but we can still get it here for attachment
async function attachFailureVideo(world: ICustomWorld): Promise<void> {
  try {
    // Prefer handle stashed in closeBrowser (page refs are cleared after context close).
    const video = world.pendingVideo ?? world.page?.video();
    world.pendingVideo = undefined;
    if (!video) return;

    const videoPath = await video.path();
    let videoBuffer: Buffer | null = null;

    for (let i = 0; i < 10; i++) {
      try {
        videoBuffer = await fs.readFile(videoPath);
        break;
      } catch (e: any) {
        if (e.code !== 'ENOENT') {
          console.warn(`⚠️ Video attachment failed: ${e}`);
          return;
        }
        await new Promise((r) => setTimeout(r, 200));
      }
    }

    if (videoBuffer) {
      await world.attach(videoBuffer, 'video/webm');
    }
  } catch (e) {
    console.warn(`⚠️ Video attachment failed: ${e}`);
  }
}
