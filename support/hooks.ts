import { Before, After, Status, AfterStep, BeforeStep } from '@cucumber/cucumber';
import type { ICustomWorld } from './world';
import { CustomWorld } from './world';
import {
  extractProjectKeyFromFeatureUri,
  resetEnvConfigLogCache,
  setScenarioProjectKey,
} from './env';
import * as fs from 'fs/promises';
import * as path from 'path';
import chalk from "chalk";
import { setDefaultTimeout } from '@cucumber/cucumber';
import { randomUUID } from 'crypto';

setDefaultTimeout(120 * 1000);

// Screenshots directory
const SCREENSHOTS_DIR = 'reports/screenshots';

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

async function captureStepScreenshot(world: ICustomWorld, featureName: string): Promise<void> {
  if (!world.page) return;

  const buffer = await world.page.screenshot({ fullPage: false });
  const filename = `${randomUUID()}.png`;
  const filepath = path.join(SCREENSHOTS_DIR, filename);
  await fs.writeFile(filepath, buffer);
  console.log(chalk.cyan(`📸 Screenshot [${featureName}]: ${filepath}`));
  await world.attach(buffer, 'image/png');
}

Before(async function (this: CustomWorld, scenario) {
  await ensureScreenshotsDir();

  this.scenarioVars = {};

  // CRITICAL: Extract and store feature name for multi-feature parallel execution
  // This allows us to include feature context in every step log
  const featureUri = scenario.pickle?.uri || '';
  const projectKey = extractProjectKeyFromFeatureUri(featureUri);
  this.scenarioProjectKey = projectKey;
  setScenarioProjectKey(projectKey);
  resetEnvConfigLogCache();

  const featureName = featureUri.includes('/')
    ? featureUri.substring(featureUri.lastIndexOf('/') + 1).replace('.feature', '')
    : featureUri.includes('\\')
      ? featureUri.substring(featureUri.lastIndexOf('\\') + 1).replace('.feature', '')
      : featureUri.replace('.feature', '');

  this.currentFeatureName = featureName;

  if (featureName) {
    console.log(chalk.magenta(`🎯 FEATURE START: ${featureName}`));
    console.log(chalk.magenta(`📁 Feature File: ${featureUri}`));
    if (projectKey) {
      console.log(chalk.magenta(`🏷️ Project env: ${projectKey} (TEST_ENV=${process.env.TEST_ENV || 'dev'})`));
    }
  }

  await this.openBrowser();
});

// CRITICAL: Include feature name in EVERY step log for parallel execution support
BeforeStep(function (this: ICustomWorld, { pickleStep }) {
  const featureName = this.currentFeatureName || 'unknown';
  // Format: ➡ STEP START [feature-name]: step text
  console.error(chalk.yellow(`➡ STEP START [${featureName}]: ${pickleStep.text}`));
});

AfterStep(async function (this: ICustomWorld, { result, pickleStep, pickle }) {
  const featureName = this.currentFeatureName || 'unknown';
  const status = result.status;

  if (status === 'PASSED') {
    console.error(chalk.green(`✓ STEP PASS [${featureName}]: ${pickleStep.text}`));
  } else {
    console.error(chalk.red(`✗ STEP FAIL [${featureName}]: ${pickleStep.text}`));
  }

  const mode = getScreenshotMode();
  const steps = pickle?.steps ?? [];
  const isLastStep = steps.length > 0 && steps[steps.length - 1].id === pickleStep.id;

  if (!shouldTakeStepScreenshot(mode, status, isLastStep)) {
    return;
  }

  try {
    await captureStepScreenshot(this, featureName);
  } catch (e) {
    console.warn(`⚠️ Step screenshot failed: ${e}`);
  }
});

After(async function (this: ICustomWorld, scenario) {
  const status = scenario.result?.status;
  const screenshotMode = getScreenshotMode();

  this.scenarioProjectKey = undefined;
  setScenarioProjectKey(undefined);

  if (this.page && status === Status.FAILED && screenshotMode !== 'NONE') {
    try {
      const png = await this.page.screenshot({ fullPage: true, timeout: 10000 });
      await this.attach(png, 'image/png');
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
  if (status !== Status.FAILED) return;

  // For failure, we try to attach the video to Allure
  // The video path is logged by closeBrowser, but we can still get it here for attachment
  try {
    const video = this.page?.video();
    if (!video) return;

    const videoPath = await video.path();
    let videoBuffer: Buffer | null = null;

    for (let i = 0; i < 10; i++) {
      try {
        videoBuffer = await fs.readFile(videoPath);
        break;
      } catch (e: any) {
        if (e.code !== 'ENOENT') throw e;
        await new Promise(r => setTimeout(r, 200));
      }
    }

    if (videoBuffer) {
      await this.attach(videoBuffer, 'video/webm');
    }
  } catch (e) {
    console.warn(`⚠️ Video attachment failed: ${e}`);
  }
});
