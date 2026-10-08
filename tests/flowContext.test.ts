import { afterEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { flowContext, publicFlowValues } from '../support/flowContext';

const RUNNERS_ROOT = path.resolve(__dirname, '..', '..');
const API_COPY = 'playwright-cucumber-api-test/src/utils/flowContext.ts';

function runFile(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'flow-ctx-'));
  return path.join(dir, 'context.json');
}

describe('flowContext', () => {
  const original = process.env.COTESTER_FLOW_CONTEXT_PATH;
  afterEach(() => {
    if (original === undefined) {
      delete process.env.COTESTER_FLOW_CONTEXT_PATH;
    } else {
      process.env.COTESTER_FLOW_CONTEXT_PATH = original;
    }
  });

  it('API runner ships an identical copy', () => {
    const ui = fs.readFileSync(path.join(__dirname, '..', 'support', 'flowContext.ts'), 'utf8');
    assert.equal(fs.readFileSync(path.join(RUNNERS_ROOT, API_COPY), 'utf8'), ui);
  });

  it('hands a scalar from producer to consumer through the run file', () => {
    process.env.COTESTER_FLOW_CONTEXT_PATH = runFile();
    flowContext.set('mig_orderId_1a2b3c4d', 4711);
    assert.equal(flowContext.require('mig_orderId_1a2b3c4d'), '4711');
    assert.equal(flowContext.has('mig_orderId_1a2b3c4d'), true);
    assert.deepEqual(publicFlowValues(), { mig_orderId_1a2b3c4d: '4711' });
  });

  it('keeps sensitive values out of preloaded variables and error messages', () => {
    const file = runFile();
    process.env.COTESTER_FLOW_CONTEXT_PATH = file;
    flowContext.set('mig_token_00ff00ff', 'super-secret-value', { sensitive: true });
    flowContext.set('mig_user_11aa22bb', 'alice');
    assert.equal(flowContext.isSensitive('mig_token_00ff00ff'), true);
    assert.equal(flowContext.require('mig_token_00ff00ff'), 'super-secret-value');
    assert.deepEqual(publicFlowValues(), { mig_user_11aa22bb: 'alice' });
    const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
    assert.deepEqual(raw._meta.sensitive, ['mig_token_00ff00ff']);
    if (process.platform !== 'win32') {
      assert.equal(fs.statSync(file).mode & 0o777, 0o600);
    }
    assert.throws(() => flowContext.set('mig_token_00ff00ff', { a: 1 } as unknown as string), (e: Error) =>
      !e.message.includes('super-secret-value'));
  });

  it('a consumer fails when the producer did not write the value', () => {
    process.env.COTESTER_FLOW_CONTEXT_PATH = runFile();
    assert.throws(() => flowContext.require('mig_missing_deadbeef'), /must run earlier in the same CoTester Flow/);
  });

  it('a consumer outside a Flow fails instead of using a fake value', () => {
    delete process.env.COTESTER_FLOW_CONTEXT_PATH;
    assert.throws(() => flowContext.require('mig_orderId_1a2b3c4d'), /must run inside a CoTester Flow/);
    assert.deepEqual(publicFlowValues(), {});
  });

  it('rejects non-scalar values such as files or objects', () => {
    process.env.COTESTER_FLOW_CONTEXT_PATH = runFile();
    assert.throws(() => flowContext.set('mig_file_12345678', Buffer.from('x') as unknown as string), /string, number or boolean/);
    assert.throws(() => flowContext.set('_meta', 'x'), /invalid/);
  });

  it('isolates values per Flow run file', () => {
    const first = runFile();
    const second = runFile();
    process.env.COTESTER_FLOW_CONTEXT_PATH = first;
    flowContext.set('mig_orderId_1a2b3c4d', 'run-1');
    process.env.COTESTER_FLOW_CONTEXT_PATH = second;
    assert.equal(flowContext.get('mig_orderId_1a2b3c4d'), undefined);
    flowContext.set('mig_orderId_1a2b3c4d', 'run-2');
    process.env.COTESTER_FLOW_CONTEXT_PATH = first;
    assert.equal(flowContext.require('mig_orderId_1a2b3c4d'), 'run-1');
  });
});
