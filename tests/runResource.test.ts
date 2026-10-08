import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';

describe('runResource', () => {
  let dir: string;
  let contextPath: string;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cotester-rr-'));
    contextPath = path.join(dir, 'context.json');
    fs.writeFileSync(contextPath, '{}', { mode: 0o600 });
    process.env.COTESTER_RUN_RESOURCE_DIR = dir;
    process.env.COTESTER_FLOW_CONTEXT_PATH = contextPath;
  });

  afterEach(() => {
    delete process.env.COTESTER_RUN_RESOURCE_DIR;
    delete process.env.COTESTER_FLOW_CONTEXT_PATH;
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it('publishes bytes and resolves the same run-scoped file; context stores only resourceId', async () => {
    const { runResource } = await import('../support/runResource');
    const published = await runResource.publish('invoice', Buffer.from('%PDF-1.4'), {
      fileName: 'invoice.pdf',
      mediaType: 'application/pdf',
    });
    const ctx = JSON.parse(fs.readFileSync(contextPath, 'utf8'));
    assert.equal(ctx.invoice, published.resourceId);
    assert.equal(typeof ctx.invoice, 'string');
    assert.ok(!JSON.stringify(ctx).includes('%PDF'));
    assert.ok(!JSON.stringify(ctx).includes(published.path));

    const resolved = await runResource.require('invoice');
    assert.equal(resolved.resourceId, published.resourceId);
    assert.equal(fs.readFileSync(resolved.path, 'utf8'), '%PDF-1.4');
    assert.ok(resolved.path.startsWith(dir));
  });

  it('rejects path traversal and isolates concurrent run dirs', async () => {
    const { runResource } = await import('../support/runResource');
    await runResource.publish('a', Buffer.from('x'), { fileName: 'ok.bin' });

    const other = fs.mkdtempSync(path.join(os.tmpdir(), 'cotester-rr-other-'));
    process.env.COTESTER_RUN_RESOURCE_DIR = other;
    process.env.COTESTER_FLOW_CONTEXT_PATH = path.join(other, 'context.json');
    fs.writeFileSync(process.env.COTESTER_FLOW_CONTEXT_PATH, '{}', { mode: 0o600 });
    await assert.rejects(() => runResource.require('a'));
    fs.rmSync(other, { recursive: true, force: true });
  });
});
