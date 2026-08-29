import { randomUUID } from 'crypto';
import type { Page, Locator } from '@playwright/test';
import { scrapePageDom, isLoginRoute } from './dom-scrape';
import { registerOverride } from './locator-registry';

export interface HealingContext {
  enabled: boolean;
  runJobId: string;
  featurePath: string;
  apiUrl: string;
  maxFeature: number;
  maxSuite: number;
  featureAttempts: number;
  suiteAttempts: number;
  currentStepKey: string;
  currentStepText: string;
  currentScenarioName: string;
  retriedSteps: Set<string>;
  events: HealingEventPayload[];
  flowId?: string;
  flowStepIndex?: number;
}

export interface HealingEventPayload {
  id: string;
  runJobId: string;
  featurePath: string;
  scenarioName: string;
  stepText: string;
  route: string;
  oldSelector: string;
  oldStrategy?: string;
  intentLabel?: string;
  newSelector?: string;
  newStrategy?: string;
  confidence: string;
  outcome: string;
  candidates?: Array<{ label: string; selector: string; strategy: string; quality: string; route: string }>;
  retryAttempted: boolean;
  retrySucceeded?: boolean;
  timestamp: string;
  flowId?: string;
  flowStepIndex?: number;
}

function parseOptionalInt(value: string | undefined): number | undefined {
  if (value == null || value.trim() === '') return undefined;
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function attachFlowMeta(event: HealingEventPayload, ctx: HealingContext): HealingEventPayload {
  if (ctx.flowId) {
    event.flowId = ctx.flowId;
  }
  if (ctx.flowStepIndex != null) {
    event.flowStepIndex = ctx.flowStepIndex;
  }
  return event;
}

export function createHealingContext(): HealingContext {
  const enabled = (process.env.COTESTER_SELF_HEAL_ENABLED ?? 'false').toLowerCase() === 'true';
  const suiteRemaining = parseInt(
    process.env.COTESTER_SUITE_HEAL_BUDGET_REMAINING
      ?? process.env.COTESTER_SELF_HEAL_MAX_SUITE
      ?? '20',
    10,
  );
  return {
    enabled,
    runJobId: process.env.COTESTER_RUN_JOB_ID ?? '',
    featurePath: process.env.COTESTER_FEATURE_PATH ?? '',
    apiUrl: (process.env.COTESTER_API_URL ?? 'http://localhost:8080').replace(/\/$/, ''),
    maxFeature: parseInt(process.env.COTESTER_SELF_HEAL_MAX_FEATURE ?? '3', 10),
    maxSuite: Number.isFinite(suiteRemaining) ? Math.max(0, suiteRemaining) : 20,
    featureAttempts: 0,
    suiteAttempts: 0,
    currentStepKey: '',
    currentStepText: '',
    currentScenarioName: '',
    retriedSteps: new Set<string>(),
    events: [],
    flowId: process.env.COTESTER_FLOW_ID || undefined,
    flowStepIndex: parseOptionalInt(process.env.COTESTER_FLOW_STEP_INDEX),
  };
}

export function isLocatorFailure(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  if (/expect\s*\(/i.test(message)) return false;
  return /locator.*not found|waiting for.*(?:failed|exceeded|timeout)|strict mode violation|Timeout.*exceeded/i.test(
    message,
  );
}

export function extractSelectorFromError(error: unknown): string | undefined {
  const message = error instanceof Error ? error.message : String(error);
  const quoted = message.match(/locator\(['"]([^'"]+)['"]\)/i);
  if (quoted) return quoted[1];
  const waiting = message.match(/waiting for locator\(['"]([^'"]+)['"]\)/i);
  if (waiting) return waiting[1];
  return undefined;
}

export function emitHealEvent(event: HealingEventPayload): void {
  console.log(`COTESTER_HEAL_EVENT:${JSON.stringify(event)}`);
}

export async function attemptSelfHeal(
  ctx: HealingContext,
  page: Page,
  selectorKey: string,
  error: unknown,
): Promise<{ retry: boolean; newSelector?: string }> {
  if (!ctx.enabled) {
    return { retry: false };
  }
  if (ctx.retriedSteps.has(ctx.currentStepKey)) {
    return { retry: false };
  }
  if (ctx.featureAttempts >= ctx.maxFeature || ctx.suiteAttempts >= ctx.maxSuite) {
    emitSkipped(ctx, selectorKey, 'SKIPPED_BUDGET');
    return { retry: false };
  }

  const scraped = await scrapePageDom(page);
  if (isLoginRoute(scraped.route)) {
    return { retry: false };
  }

  const failedSelector = selectorKey || extractSelectorFromError(error) || '';
  if (!failedSelector) {
    return { retry: false };
  }

  const matchResponse = await fetch(`${ctx.apiUrl}/api/self-heal/match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      runJobId: ctx.runJobId,
      featurePath: ctx.featurePath,
      route: scraped.route,
      failedSelector,
      intentLabel: inferIntentLabel(failedSelector, ctx.currentStepText),
      scenarioName: ctx.currentScenarioName,
      stepText: ctx.currentStepText,
      elements: scraped.elements,
    }),
  });

  if (matchResponse.status === 429) {
    emitSkipped(ctx, selectorKey, 'SKIPPED_BUDGET');
    return { retry: false };
  }

  if (matchResponse.status === 503) {
    emitSkipped(ctx, selectorKey, 'SKIPPED_DISABLED');
    return { retry: false };
  }

  if (!matchResponse.ok) {
    return { retry: false };
  }

  ctx.featureAttempts += 1;
  ctx.suiteAttempts += 1;

  const match = (await matchResponse.json()) as {
    confidence: string;
    selected?: { label: string; selector: string; strategy: string; quality: string; route: string };
    candidates?: Array<{ label: string; selector: string; strategy: string; quality: string; route: string }>;
  };

  const eventBase: HealingEventPayload = {
    id: randomUUID(),
    runJobId: ctx.runJobId,
    featurePath: ctx.featurePath,
    scenarioName: ctx.currentScenarioName,
    stepText: ctx.currentStepText,
    route: scraped.route,
    oldSelector: failedSelector,
    confidence: match.confidence,
    outcome: match.confidence === 'HIGH' ? 'RECOVERED' : match.confidence,
    candidates: match.candidates,
    retryAttempted: match.confidence === 'HIGH',
    timestamp: new Date().toISOString(),
  };

  if (match.confidence !== 'HIGH' || !match.selected?.selector) {
    eventBase.outcome = match.confidence === 'AMBIGUOUS' ? 'AMBIGUOUS' : 'STILL_FAILED';
    eventBase.retryAttempted = false;
    attachFlowMeta(eventBase, ctx);
    ctx.events.push(eventBase);
    emitHealEvent(eventBase);
    return { retry: false };
  }

  registerOverride(page.url(), ctx.currentStepKey, failedSelector, match.selected.selector);
  ctx.retriedSteps.add(ctx.currentStepKey);
  eventBase.newSelector = match.selected.selector;
  eventBase.newStrategy = match.selected.strategy;
  eventBase.intentLabel = match.selected.label;
  attachFlowMeta(eventBase, ctx);
  ctx.events.push(eventBase);
  emitHealEvent(eventBase);
  return { retry: true, newSelector: match.selected.selector };
}

function emitSkipped(ctx: HealingContext, selectorKey: string, outcome: string): void {
  const event: HealingEventPayload = attachFlowMeta(
    {
      id: randomUUID(),
      runJobId: ctx.runJobId,
      featurePath: ctx.featurePath,
      scenarioName: ctx.currentScenarioName,
      stepText: ctx.currentStepText,
      route: '/',
      oldSelector: selectorKey,
      confidence: 'UNRESOLVED',
      outcome,
      retryAttempted: false,
      timestamp: new Date().toISOString(),
    },
    ctx,
  );
  ctx.events.push(event);
  emitHealEvent(event);
}

function inferIntentLabel(selector: string, stepText: string): string {
  const roleMatch = selector.match(/role=\w+\[name='([^']+)'\]/);
  if (roleMatch) return roleMatch[1];
  const quoted = stepText.match(/"([^"]+)"/);
  if (quoted) return quoted[1];
  return selector;
}

export function locatorFromSelector(page: Page, selector: string): Locator {
  const roleMatch = selector.match(/^role=(\w+)\[name='([^']+)'\]$/);
  if (roleMatch) {
    return page.getByRole(roleMatch[1] as 'button', { name: roleMatch[2] });
  }
  return page.locator(selector);
}

export async function withLocatorHeal<T>(
  ctx: HealingContext,
  page: Page,
  selectorKey: string,
  action: (locator: Locator) => Promise<T>,
  buildLocator: () => Locator,
): Promise<T> {
  try {
    return await action(buildLocator());
  } catch (error) {
    if (!isLocatorFailure(error)) throw error;
    const healed = await attemptSelfHeal(ctx, page, selectorKey, error);
    if (!healed.retry) throw error;
    const retryLocator = healed.newSelector ? locatorFromSelector(page, healed.newSelector) : buildLocator();
    try {
      const result = await action(retryLocator);
      const last = ctx.events[ctx.events.length - 1];
      if (last) {
        last.retrySucceeded = true;
        last.outcome = 'RECOVERED';
        emitHealEvent(last);
      }
      return result;
    } catch (retryError) {
      const last = ctx.events[ctx.events.length - 1];
      if (last) {
        last.retrySucceeded = false;
        last.outcome = 'STILL_FAILED';
        emitHealEvent(last);
      }
      throw retryError;
    }
  }
}
