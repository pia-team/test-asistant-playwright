import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { chromium, type Browser, type Page } from 'playwright';
import {
  applyPostStepWait,
  clickExpectingChange,
  configuredStepDelayMs,
  navigationClickMode,
  pageChanged,
} from '../support/navigation-click';

describe('navigation click mode', () => {
  it('guards login and sidebar clicks only', () => {
    assert.equal(navigationClickMode("role=button[name='Sign in with Keycloak']"), 'any');
    assert.equal(navigationClickMode('login-submit-button'), 'any');
    assert.equal(navigationClickMode('kc-login'), 'any');
    assert.equal(navigationClickMode('sidebar-nav-item-manage-resources'), 'url');
    assert.equal(navigationClickMode("role=checkbox[name='Remember']"), null);
  });

  it('url expectation ignores a DOM-only change', () => {
    assert.equal(pageChanged('https://a', 't|1|1', 'https://a', 't|2|9', 'url'), false);
    assert.equal(pageChanged('https://a', 't|1|1', 'https://b', 't|1|1', 'url'), true);
    assert.equal(pageChanged('https://a', 't|1|1', 'https://a', 't|2|9', 'any'), true);
  });
});

describe('post-step wait', () => {
  const previousDelay = process.env.COTESTER_STEP_DELAY_MS;
  const previousReady = process.env.COTESTER_WAIT_PAGE_READY_AFTER_STEP;

  after(() => {
    if (previousDelay === undefined) delete process.env.COTESTER_STEP_DELAY_MS;
    else process.env.COTESTER_STEP_DELAY_MS = previousDelay;
    if (previousReady === undefined) delete process.env.COTESTER_WAIT_PAGE_READY_AFTER_STEP;
    else process.env.COTESTER_WAIT_PAGE_READY_AFTER_STEP = previousReady;
  });

  it('waits the configured delay between steps and not after the last or a failure', async () => {
    process.env.COTESTER_STEP_DELAY_MS = '300';
    process.env.COTESTER_WAIT_PAGE_READY_AFTER_STEP = 'off';
    assert.equal(configuredStepDelayMs(), 300);
    const calls: number[] = [];
    const page = {
      waitForTimeout: async (ms: number) => {
        calls.push(ms);
      },
    };
    const between = await applyPostStepWait({
      passed: true,
      isLastStep: false,
      changed: false,
      page,
    });
    const last = await applyPostStepWait({
      passed: true,
      isLastStep: true,
      changed: true,
      page,
    });
    const failed = await applyPostStepWait({
      passed: false,
      isLastStep: false,
      changed: true,
      page,
    });
    assert.equal(between, 300);
    assert.deepEqual(calls, [300]);
    assert.equal(last, 0);
    assert.equal(failed, 0);
  });
});

describe('click expecting a page change', () => {
  let browser: Browser;

  before(async () => {
    browser = await chromium.launch({ headless: true });
  });

  after(async () => {
    await browser?.close();
  });

  async function open(html: string): Promise<Page> {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'load' });
    return page;
  }

  it('retries once when the click handler attaches late', async () => {
    const page = await browser.newPage();
    await page.route('**/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: `<!doctype html><body>
          <button id="go">Sign in with Keycloak</button>
          <script>
            setTimeout(() => {
              document.getElementById('go').addEventListener('click', () => {
                document.body.innerHTML = '<main><h1>Signed in</h1></main>';
                history.pushState({}, '', '/home');
              });
            }, 250);
          </script>
        </body>`,
      });
    });
    await page.goto('https://app.example.test/login', { waitUntil: 'load' });
    try {
      await clickExpectingChange(page, page.locator('#go'), {
        expect: 'any',
        timeoutMs: 500,
        label: 'Sign in with Keycloak',
      });
      assert.match(page.url(), /\/home$/);
      assert.equal(await page.locator('h1').textContent(), 'Signed in');
    } finally {
      await page.close();
    }
  });

  it('fails with an ineffective-click message when the handler never attaches', async () => {
    const page = await open('<button id="go">Sign in with Keycloak</button>');
    try {
      await assert.rejects(
        () =>
          clickExpectingChange(page, page.locator('#go'), {
            expect: 'any',
            timeoutMs: 150,
            label: 'Sign in with Keycloak',
          }),
        /Sign in with Keycloak" tıklandı ama sayfa değişmedi/,
      );
    } finally {
      await page.close();
    }
  });

  it('finds the next control after a slow navigation when page-ready wait is on', async () => {
    const page = await browser.newPage();
    await page.route('**/resources', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<main><button id="filter">Filter</button></main>',
      });
    });
    await page.setContent(
      '<a id="nav" href="https://app.example.test/resources">Manage Resources</a>',
      { waitUntil: 'load' },
    );
    process.env.COTESTER_WAIT_PAGE_READY_AFTER_STEP = 'on';
    process.env.COTESTER_PAGE_READY_TIMEOUT_MS = '5000';
    try {
      const requested = page.waitForRequest('**/resources');
      await page.locator('#nav').click({ noWaitAfter: true });
      await requested;
      await applyPostStepWait({
        passed: true,
        isLastStep: false,
        changed: true,
        page,
      });
      await page.locator('#filter').waitFor({ timeout: 400 });
      assert.equal(await page.locator('#filter').textContent(), 'Filter');
    } finally {
      await page.close();
    }
  });
});
