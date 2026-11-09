import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { chromium } from 'playwright';
import { downloadBindingKey, resetAutoDownloadKeys, testData } from '../support/testData';
import { flushPendingDownloads } from '../support/downloadCapture';

test('binding key comes from the step texts, scope first, and stays unique', () => {
  resetAutoDownloadKeys();
  assert.equal(downloadBindingKey('I click "Download" in "Input File" for x', 'a.csv'), 'input-file-download');
  assert.equal(downloadBindingKey('I click "Download" in "Input File" for x', 'a.csv'), 'input-file-download-2');
  assert.equal(downloadBindingKey('I press the button', 'Order Report.pdf'), 'order-report');
});

test('a download the step did not save is written to the run manifest and pending uploads', async (t) => {
  let browser;
  try {
    browser = await chromium.launch();
  } catch (err) {
    t.skip(`Chromium not available: ${err}`);
    return;
  }
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'cotester-dl-'));
  const manifest = path.join(dir, 'manifest.json');
  await fs.writeFile(manifest, JSON.stringify({ resources: {} }));
  const prev = process.env.COTESTER_RUN_DATA_MANIFEST_PATH;
  process.env.COTESTER_RUN_DATA_MANIFEST_PATH = manifest;
  resetAutoDownloadKeys();
  try {
    const context = await browser.newContext({ acceptDownloads: true });
    const world: { pendingDownloads: any[] } = { pendingDownloads: [] };
    context.on('page', (p) => p.on('download', (download) => {
      world.pendingDownloads.push({ download, stepText: 'I click "Download" in "Input File"' });
    }));
    const page = await context.newPage();
    await page.route('https://app.example/**', (route) => {
      if (route.request().url().endsWith('/files/input.csv')) {
        return route.fulfill({
          status: 200,
          headers: { 'content-type': 'text/csv', 'content-disposition': 'attachment; filename="input.csv"' },
          body: 'a,b\n1,2\n',
        });
      }
      return route.fulfill({
        contentType: 'text/html',
        body: '<a id="dl" href="/files/input.csv">Download</a>',
      });
    });
    await page.goto('https://app.example/order/1');
    const done = page.waitForEvent('download');
    await page.click('#dl');
    await done;
    await flushPendingDownloads(world);
    await context.close();

    const pending = (await fs.readFile(path.join(dir, 'pending-uploads.jsonl'), 'utf8')).trim().split('\n');
    assert.equal(pending.length, 1);
    const row = JSON.parse(pending[0]);
    assert.equal(row.bindingKey, 'input-file-download');
    assert.equal(await fs.readFile(row.localPath, 'utf8'), 'a,b\n1,2\n');
    assert.match(await fs.readFile(manifest, 'utf8'), /input-file-download/);
  } finally {
    if (prev === undefined) delete process.env.COTESTER_RUN_DATA_MANIFEST_PATH;
    else process.env.COTESTER_RUN_DATA_MANIFEST_PATH = prev;
    await browser.close();
    await fs.rm(dir, { recursive: true, force: true });
  }
});

test('a download the step saved itself is not saved twice', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'cotester-dl-'));
  const manifest = path.join(dir, 'manifest.json');
  await fs.writeFile(manifest, JSON.stringify({ resources: {} }));
  const prev = process.env.COTESTER_RUN_DATA_MANIFEST_PATH;
  process.env.COTESTER_RUN_DATA_MANIFEST_PATH = manifest;
  try {
    const fake: any = {
      suggestedFilename: () => 'x.csv',
      saveAs: async (target: string) => fs.writeFile(target, 'x'),
    };
    await testData.saveDownload('order-file', fake);
    await flushPendingDownloads({ pendingDownloads: [{ download: fake, stepText: 'I click "Download"' }] });
    const pending = (await fs.readFile(path.join(dir, 'pending-uploads.jsonl'), 'utf8')).trim().split('\n');
    assert.equal(pending.length, 1);
    assert.equal(JSON.parse(pending[0]).bindingKey, 'order-file');
  } finally {
    if (prev === undefined) delete process.env.COTESTER_RUN_DATA_MANIFEST_PATH;
    else process.env.COTESTER_RUN_DATA_MANIFEST_PATH = prev;
    await fs.rm(dir, { recursive: true, force: true });
  }
});
