import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { testData, resetTestDataCache } from '../support/testData';

describe('testData datasets', { concurrency: 1 }, () => {
  const envBackup = { ...process.env };
  let workDir: string;

  function writeJson(name: string, value: unknown): string {
    const file = path.join(workDir, name).replace(/\\/g, '/');
    fs.writeFileSync(file, JSON.stringify(value), 'utf8');
    return file;
  }

  beforeEach(() => {
    workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cotester-dataset-'));
    const csv = writeJson('users.dataset.json', {
      format: 'cotester.dataset/v1',
      sourceFormat: 'CSV',
      defaultSheet: 'default',
      sheets: [
        {
          name: 'default',
          hidden: false,
          headerRow: true,
          columns: ['username', 'password'],
          rowCount: 2,
          rows: [
            { username: 'u1', password: 'p1' },
            { username: 'u2', password: 'p2' },
          ],
        },
      ],
    });
    const workbook = writeJson('customers.dataset.json', {
      format: 'cotester.dataset/v1',
      sourceFormat: 'XLSX',
      defaultSheet: null,
      sheets: [
        { name: 'Customers', hidden: false, headerRow: true, columns: ['email'], rowCount: 1, rows: [{ email: 'c1' }] },
        { name: 'Archive', hidden: false, headerRow: true, columns: ['email'], rowCount: 1, rows: [{ email: 'a1' }] },
      ],
    });
    const legacy = writeJson('legacy.json', [{ id: 1 }, { id: 2 }]);
    const manifest = writeJson('manifest.json', {
      runId: 'run-1',
      resources: {
        users: { type: 'DATASET', bindingKey: 'users', localPath: `${workDir}/users.csv`, datasetPath: csv },
        customers: { type: 'DATASET', bindingKey: 'customers', localPath: `${workDir}/c.xlsx`, datasetPath: workbook },
        legacy: { type: 'DATASET', bindingKey: 'legacy', localPath: legacy },
      },
      configs: {},
    });
    process.env.COTESTER_RUN_DATA_MANIFEST_PATH = manifest;
    resetTestDataCache();
  });

  afterEach(() => {
    process.env = { ...envBackup };
    resetTestDataCache();
    fs.rmSync(workDir, { recursive: true, force: true });
  });

  it('returns CSV rows keyed by header columns', async () => {
    assert.deepEqual(await testData.getRows('users'), [
      { username: 'u1', password: 'p1' },
      { username: 'u2', password: 'p2' },
    ]);
    const dataset = await testData.getDataset('users');
    assert.equal(dataset.sourceFormat, 'CSV');
    assert.deepEqual(dataset.sheets.map((s) => [s.name, s.columns, s.rowCount]), [
      ['default', ['username', 'password'], 2],
    ]);
    assert.equal(dataset.rows?.length, 2);
  });

  it('requires an explicit sheet for a multi-sheet workbook', async () => {
    await assert.rejects(testData.getRows('customers'), /pass \{ sheet \}/);
    await assert.rejects(testData.getRows('customers', { sheet: 'Missing' }), /no sheet "Missing"/);
    assert.deepEqual(await testData.getRows('customers', { sheet: 'Archive' }), [{ email: 'a1' }]);
    const dataset = await testData.getDataset('customers');
    assert.equal(dataset.defaultSheet, null);
    assert.equal(dataset.rows, undefined);
    assert.deepEqual(dataset.sheets.map((s) => s.name), ['Customers', 'Archive']);
  });

  it('keeps JSON array datasets readable', async () => {
    assert.deepEqual(await testData.getRows('legacy'), [{ id: 1 }, { id: 2 }]);
    assert.deepEqual((await testData.getDataset('legacy')).rows, [{ id: 1 }, { id: 2 }]);
  });
});
