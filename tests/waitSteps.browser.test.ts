import './e2e/playwright-browsers';
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { chromium, type Browser, type Page } from 'playwright';
import { markScenarioStart, waitForNewCard, thatCard, waitSeconds, pickNewCards, parseCardDate, waitStepTimeoutMs, WAIT_MAX_MS } from '../support/waitSteps';

const card = (id: string, customer: string, status: string, label: string, date: string) => `
  <li class="task-list-item" id="${id}">
    <div><span>Order ID: o-${id}</span><span>Task ID: ${id}</span></div>
    <div><span class="user-name">${customer}</span><span>${date}</span></div>
    <div> ${status} </div>
    <div><span class="task-label" onclick="window.clicked='${id}'">${label}</span></div>
  </li>`;
const NEW_ID = 'aaaa1111-1d6f-43f0-82be-9a0d58482e97';
const list = (withNew: boolean) => `<!doctype html><body><ul>${[
  withNew ? card(NEW_ID, 'ACTIVAITONAUTOMATION', 'NEW', 'PM Task', '01/01/2020 10:00:00') : '',
  card('bbbb2222-a0ea-4c26-8a24-7d45c75ba2b4', 'ELANUR NEWW', 'NEW', 'PM Task', '01/01/2020 09:00:00'),
  card('cccc3333-a0ea-4c26-8a24-7d45c75ba2b4', 'ACTIVAITONAUTOMATION', 'NEW', 'PM Task', '01/01/2020 08:00:00'),
].join('')}</ul><script>window.clicked=null</script></body>`;

describe('waitSteps (WEB runner)', () => {
  let browser: Browser;
  before(async () => { browser = await chromium.launch(); });
  after(async () => { await browser.close(); });

  it('waitStepTimeoutMs covers the wait plus reload slack and caps at the max', () => {
    assert.equal(waitStepTimeoutMs(600_000), 660_000);
    assert.equal(waitStepTimeoutMs(Number.NaN), 180_000);
    assert.equal(waitStepTimeoutMs(10 * 60_000 * 5), WAIT_MAX_MS + 60_000);
  });

  it('pure helpers', () => {
    assert.equal(parseCardDate('08/11/2026 14:43:39'), new Date(2026, 10, 8, 14, 43, 39).getTime());
    const fresh = pickNewCards([{ key: 'a', id: 'a', anchorText: null, text: '01/01/2020 00:00:00' }], ['a'], Date.now());
    assert.equal(fresh.length, 0);
  });

  it('waits for a card that was not there at the first look and clicks inside it only', async () => {
    const page: Page = await browser.newPage();
    let loads = 0;
    await page.route('https://app.example/**', (route) => { loads += 1; return route.fulfill({ contentType: 'text/html', body: list(loads >= 3) }); });
    await page.goto('https://app.example/orders/my-group-tasks');
    const world = { page };
    markScenarioStart(world);
    const found = await waitForNewCard(world, { label: 'PM Task', contains: ['ACTIVAITONAUTOMATION', 'NEW'], timeoutMs: 20_000, pollMs: 500 });
    assert.equal(found.id, NEW_ID);
    await thatCard(world).getByText('PM Task', { exact: true }).click();
    assert.equal(await page.evaluate(() => (window as unknown as { clicked: string }).clicked), NEW_ID);
    await page.close();
  });

  it('times out with a clear error, never picks an old card', async () => {
    const page: Page = await browser.newPage();
    await page.route('https://app.example/**', (route) => route.fulfill({ contentType: 'text/html', body: list(false) }));
    await page.goto('https://app.example/orders/my-group-tasks');
    const world = { page };
    markScenarioStart(world);
    await assert.rejects(
      waitForNewCard(world, { label: 'PM Task', contains: ['ACTIVAITONAUTOMATION', 'NEW'], timeoutMs: 1500, pollMs: 500 }),
      /No new "PM Task" card containing "ACTIVAITONAUTOMATION" and "NEW" appeared/);
    assert.throws(() => thatCard(world), /needs an earlier/);
    await page.close();
  });

  it('waitSeconds validates its range', async () => {
    const page: Page = await browser.newPage();
    await waitSeconds({ page }, 0.2);
    await assert.rejects(waitSeconds({ page }, 601), /between/);
    await page.close();
  });
});
