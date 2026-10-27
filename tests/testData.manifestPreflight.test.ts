/**
 * WP7 Finding 3: when COTESTER_RUN_DATA_MANIFEST_PATH is set, WEB testData.getFile
 * must not use legacy demo-path fallback.
 */
import { afterEach, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { resetTestDataCache, testData } from '../support/testData';

describe('testData.getFile manifest preflight (WP7 Finding 3)', { concurrency: 1 }, () => {
  let workDir: string;
  let prevManifest: string | undefined;

  beforeEach(() => {
    workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cotester-web-preflight-'));
    prevManifest = process.env.COTESTER_RUN_DATA_MANIFEST_PATH;
    resetTestDataCache();
  });

  afterEach(() => {
    if (prevManifest === undefined) delete process.env.COTESTER_RUN_DATA_MANIFEST_PATH;
    else process.env.COTESTER_RUN_DATA_MANIFEST_PATH = prevManifest;
    resetTestDataCache();
    fs.rmSync(workDir, { recursive: true, force: true });
  });

  function writeManifest(resources: Record<string, unknown>): string {
    const manifestPath = path.join(workDir, 'manifest.json');
    fs.writeFileSync(
      manifestPath,
      JSON.stringify({ runId: 'web-preflight', resources, configs: {} }, null, 2),
      'utf8',
    );
    return manifestPath;
  }

  it('manifest set + example-document missing → PREFLIGHT error (no legacy)', async () => {
    process.env.COTESTER_RUN_DATA_MANIFEST_PATH = writeManifest({});
    resetTestDataCache();
    await assert.rejects(
      () => testData.getFile('example-document'),
      /PREFLIGHT:.*example-document/i,
    );
  });

  it('manifest set + customer-contract missing → PREFLIGHT error (no legacy)', async () => {
    process.env.COTESTER_RUN_DATA_MANIFEST_PATH = writeManifest({});
    resetTestDataCache();
    await assert.rejects(
      () => testData.getFile('customer-contract'),
      /PREFLIGHT:.*customer-contract/i,
    );
  });

  it('manifest unset + demo key → legacy docs/example.pdf when present', async () => {
    delete process.env.COTESTER_RUN_DATA_MANIFEST_PATH;
    resetTestDataCache();
    const legacy = path.resolve(process.cwd(), 'docs/example.pdf');
    if (!fs.existsSync(legacy)) {
      // Environment without demo asset: resolveLegacyPath still returns the path string.
      const resolved = await testData.getFile('example-document');
      assert.equal(resolved, legacy);
      return;
    }
    const resolved = await testData.getFile('example-document');
    assert.equal(resolved, legacy);
  });

  it('manifest set + valid entry → resolves localPath', async () => {
    const filePath = path.join(workDir, 'files', 'doc.bin');
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const bytes = Buffer.from([1, 2, 3, 4]);
    fs.writeFileSync(filePath, bytes);
    const checksum = crypto.createHash('sha256').update(bytes).digest('hex');
    process.env.COTESTER_RUN_DATA_MANIFEST_PATH = writeManifest({
      document: {
        bindingKey: 'document',
        localPath: filePath.replace(/\\/g, '/'),
        checksumSha256: checksum,
        type: 'FILE',
      },
    });
    resetTestDataCache();
    const resolved = await testData.getFile('document');
    assert.equal(path.resolve(resolved), path.resolve(filePath));
  });

  it('manifest set + missing on-disk path → PREFLIGHT error', async () => {
    const gone = path.join(workDir, 'files', 'gone.bin');
    fs.mkdirSync(path.dirname(gone), { recursive: true });
    fs.writeFileSync(gone, Buffer.from([9]));
    process.env.COTESTER_RUN_DATA_MANIFEST_PATH = writeManifest({
      ghost: {
        bindingKey: 'ghost',
        localPath: gone.replace(/\\/g, '/'),
        type: 'FILE',
      },
    });
    resetTestDataCache();
    fs.unlinkSync(gone);
    await assert.rejects(() => testData.getFile('ghost'), /PREFLIGHT:.*missing on disk/i);
  });

  it('manifest set + checksum mismatch → PREFLIGHT error', async () => {
    const filePath = path.join(workDir, 'files', 'bad.bin');
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, Buffer.from([1, 2, 3]));
    process.env.COTESTER_RUN_DATA_MANIFEST_PATH = writeManifest({
      bad: {
        bindingKey: 'bad',
        localPath: filePath.replace(/\\/g, '/'),
        checksumSha256: '0'.repeat(64),
        type: 'FILE',
      },
    });
    resetTestDataCache();
    await assert.rejects(() => testData.getFile('bad'), /PREFLIGHT:.*checksum mismatch/i);
  });
});
