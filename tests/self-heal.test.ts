import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  createHealingContext,
  emitHealEvent,
  isLocatorFailure,
  extractSelectorFromError,
  attemptSelfHeal,
  type HealingEventPayload,
  type HealingContext,
} from '../support/self-heal';
import { normalizeRoutePath, isLoginRoute } from '../support/dom-scrape';
import type { Page } from '@playwright/test';

describe('self-heal', { concurrency: 1 }, () => {
  const envBackup = { ...process.env };
  let logLines: string[];

  beforeEach(() => {
    logLines = [];
    process.env = { ...envBackup };
    const origLog = console.log;
    console.log = (...args: unknown[]) => {
      logLines.push(args.map(String).join(' '));
      origLog.apply(console, args);
    };
  });

  afterEach(() => {
    process.env = { ...envBackup };
  });

  it('self-heal: normalizeRoutePath collapses ids', () => {
    assert.equal(normalizeRoutePath('https://app.example/customer/123/edit'), '/customer/:id/edit');
    assert.equal(normalizeRoutePath('/login'), '/login');
  });

  it('self-heal: isLoginRoute detects auth paths', () => {
    assert.equal(isLoginRoute('/realms/master/login'), true);
    assert.equal(isLoginRoute('/customer/create'), false);
  });

  it('self-heal: isLocatorFailure ignores assertions', () => {
    assert.equal(isLocatorFailure(new Error('expect(received).toBe(expected)')), false);
    assert.equal(isLocatorFailure(new Error('locator.click: Timeout 30000ms exceeded')), true);
  });

  it('self-heal: extractSelectorFromError parses quoted locator', () => {
    const err = new Error("locator('[data-testid=save]') not found");
    assert.equal(extractSelectorFromError(err), '[data-testid=save]');
  });

  it('self-heal: createHealingContext reads flow and suite budget env', () => {
    process.env.COTESTER_SELF_HEAL_ENABLED = 'true';
    process.env.COTESTER_FLOW_ID = 'flow-abc';
    process.env.COTESTER_FLOW_STEP_INDEX = '2';
    process.env.COTESTER_SUITE_HEAL_BUDGET_REMAINING = '5';
    const ctx = createHealingContext();
    assert.equal(ctx.enabled, true);
    assert.equal(ctx.flowId, 'flow-abc');
    assert.equal(ctx.flowStepIndex, 2);
    assert.equal(ctx.maxSuite, 5);
  });

  it('self-heal: emitHealEvent writes COTESTER_HEAL_EVENT prefix line', () => {
    const captured: string[] = [];
    const prevLog = console.log;
    console.log = (...args: unknown[]) => {
      captured.push(args.map(String).join(' '));
    };
    const event: HealingEventPayload = {
      id: 'evt-1',
      runJobId: 'job-1',
      featurePath: 'proj/group/a.feature',
      scenarioName: 'Scenario',
      stepText: 'click Save',
      route: '/save',
      oldSelector: '[data-testid=old]',
      confidence: 'HIGH',
      outcome: 'RECOVERED',
      retryAttempted: true,
      timestamp: '2026-01-01T00:00:00.000Z',
    };
    emitHealEvent(event);
    console.log = prevLog;
    assert.equal(captured.length, 1);
    assert.match(captured[0], /^COTESTER_HEAL_EVENT:/);
    const parsed = JSON.parse(captured[0].replace('COTESTER_HEAL_EVENT:', ''));
    assert.equal(parsed.outcome, 'RECOVERED');
    assert.equal(parsed.featurePath, 'proj/group/a.feature');
  });

  it('self-heal: budget exhaustion emits SKIPPED_BUDGET without API call', async () => {
    process.env.COTESTER_SELF_HEAL_ENABLED = 'true';
    const ctx: HealingContext = createHealingContext();
    ctx.enabled = true;
    ctx.maxFeature = 1;
    ctx.featureAttempts = 1;

    let fetchCalled = false;
    const origFetch = global.fetch;
    global.fetch = async () => {
      fetchCalled = true;
      return new Response('{}', { status: 200 });
    };

    const stubPage = {} as Page;
    const result = await attemptSelfHeal(ctx, stubPage, '[data-testid=missing]', new Error('locator not found'));

    global.fetch = origFetch;

    assert.equal(result.retry, false);
    assert.equal(fetchCalled, false);
    assert.ok(logLines.some((line) => line.includes('SKIPPED_BUDGET')));
    const eventLine = logLines.find((line) => line.startsWith('COTESTER_HEAL_EVENT:'));
    assert.ok(eventLine);
    const parsed = JSON.parse(eventLine!.replace('COTESTER_HEAL_EVENT:', ''));
    assert.equal(parsed.outcome, 'SKIPPED_BUDGET');
  });

  it('self-heal: flow meta attached on skipped budget event', async () => {
    process.env.COTESTER_SELF_HEAL_ENABLED = 'true';
    process.env.COTESTER_FLOW_ID = 'flow-xyz';
    process.env.COTESTER_FLOW_STEP_INDEX = '1';
    const ctx = createHealingContext();
    ctx.enabled = true;
    ctx.maxFeature = 0;

    const stubPage = {} as Page;
    await attemptSelfHeal(ctx, stubPage, '[sel]', new Error('locator not found'));

    const eventLine = logLines.find((line) => line.startsWith('COTESTER_HEAL_EVENT:'));
    assert.ok(eventLine);
    const parsed = JSON.parse(eventLine!.replace('COTESTER_HEAL_EVENT:', ''));
    assert.equal(parsed.flowId, 'flow-xyz');
    assert.equal(parsed.flowStepIndex, 1);
  });
});
