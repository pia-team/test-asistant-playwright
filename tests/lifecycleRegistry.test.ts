import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'fs';
import * as path from 'path';
import {
  lifecycleKeyFromUri,
  registerGeneratedLifecycle,
  resetGeneratedLifecycleRegistry,
  runGeneratedAfter,
  runGeneratedBefore,
} from '../support/lifecycleRegistry';

const RUNNERS_ROOT = path.resolve(__dirname, '..', '..');
const API_COPY = 'playwright-cucumber-api-test/src/core/lifecycle/lifecycleRegistry.ts';
const KEY = 'SHOP/checkout/pay-by-card--0123456789abcdef.feature';

describe('lifecycleRegistry', () => {
  beforeEach(() => resetGeneratedLifecycleRegistry());

  it('derives the stable feature key from UI, API and absolute Windows uris', () => {
    assert.equal(lifecycleKeyFromUri(`features/${KEY}`), KEY);
    assert.equal(lifecycleKeyFromUri(`src/features/${KEY}`), KEY);
    assert.equal(lifecycleKeyFromUri(`C:\\runner\\features\\${KEY.replace(/\//g, '\\')}`), KEY);
    assert.equal(lifecycleKeyFromUri('features/steps/SHOP/x.steps.ts'), undefined);
    assert.equal(lifecycleKeyFromUri(undefined), undefined);
  });

  it('runs BEFORE actions in ordinal order and stops at the first failure', async () => {
    const calls: string[] = [];
    registerGeneratedLifecycle(KEY, {
      before: [
        { id: 'b3', ordinal: 3, run: () => { calls.push('b3'); } },
        { id: 'b1', ordinal: 1, run: async () => { calls.push('b1'); } },
        { id: 'b2', ordinal: 2, run: () => { calls.push('b2'); throw new Error('boom'); } },
      ],
      after: [],
    });
    await assert.rejects(runGeneratedBefore(`features/${KEY}`, {}), /b2 failed: boom/);
    assert.deepEqual(calls, ['b1', 'b2']);
  });

  it('always attempts every AFTER action and reports collected failures', async () => {
    const calls: string[] = [];
    registerGeneratedLifecycle(KEY, {
      before: [],
      after: [
        { id: 'a2', ordinal: 2, run: () => { calls.push('a2'); throw new Error('second'); } },
        { id: 'a1', ordinal: 1, run: () => { calls.push('a1'); throw new Error('first'); } },
        { id: 'a3', ordinal: 3, run: () => { calls.push('a3'); } },
      ],
    });
    await assert.rejects(runGeneratedAfter(`src/features/${KEY}`, {}), /failed \(2\): a1: first; a2: second/);
    assert.deepEqual(calls, ['a1', 'a2', 'a3']);
  });

  it('passes the scenario world and ignores features without a registration', async () => {
    const world = { marker: 1 };
    let seen: unknown;
    registerGeneratedLifecycle(KEY, { before: [{ id: 'b', ordinal: 0, run: (w) => { seen = w; } }], after: [] });
    await runGeneratedBefore(`features/${KEY}`, world);
    assert.equal(seen, world);
    await runGeneratedBefore('features/SHOP/other.feature', world);
    await runGeneratedAfter('features/SHOP/other.feature', world);
  });

  it('re-registration replaces the previous entry (idempotent module reload)', async () => {
    const calls: string[] = [];
    registerGeneratedLifecycle(KEY, { before: [{ id: 'old', ordinal: 0, run: () => { calls.push('old'); } }], after: [] });
    registerGeneratedLifecycle(KEY, { before: [{ id: 'new', ordinal: 0, run: () => { calls.push('new'); } }], after: [] });
    await runGeneratedBefore(`features/${KEY}`, {});
    assert.deepEqual(calls, ['new']);
  });

  it('API runner copy is identical and both runners dispatch from their single hooks', () => {
    const ui = fs.readFileSync(path.resolve(__dirname, '..', 'support', 'lifecycleRegistry.ts'), 'utf8');
    const api = fs.readFileSync(path.join(RUNNERS_ROOT, API_COPY), 'utf8');
    const body = (text: string) => text.substring(text.indexOf('export type'));
    assert.equal(body(api), body(ui));
    const uiHooks = fs.readFileSync(path.resolve(__dirname, '..', 'support', 'hooks.ts'), 'utf8');
    const apiHooks = fs.readFileSync(
      path.join(RUNNERS_ROOT, 'playwright-cucumber-api-test/src/core/hooks/beforeEach.ts'), 'utf8');
    for (const hooks of [uiHooks, apiHooks]) {
      assert.equal((hooks.match(/await runGeneratedBefore\(/g) ?? []).length, 1);
      assert.equal((hooks.match(/await runGeneratedAfter\(/g) ?? []).length, 1);
    }
  });
});
