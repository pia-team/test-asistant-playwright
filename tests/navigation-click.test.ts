import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { chromium, type Browser, type Page } from 'playwright';
import {
  applyPostStepWait,
  clickExpectingChange,
  clickOpeningNewTab,
  configuredStepDelayMs,
  navigationClickMode,
  pageChanged,
} from '../support/navigation-click';

describe('navigation click mode', () => {
  it('guards login and real links; buttons accept any change', () => {
    assert.equal(navigationClickMode("role=button[name='Sign in with Keycloak']"), 'any');
    assert.equal(navigationClickMode('login-submit-button'), 'any');
    assert.equal(navigationClickMode('kc-login'), 'any');
    assert.equal(navigationClickMode("role=link[name='Orders']"), 'url');
    assert.equal(navigationClickMode('sidebar-nav-item-manage-resources'), 'any');
    assert.equal(navigationClickMode("role=button[name='Saas']"), null);
    assert.equal(navigationClickMode("role=checkbox[name='Remember']"), null);
  });

  it('url expectation ignores a DOM-only change', () => {
    assert.equal(pageChanged('https://a', 't|1|1', 'https://a', 't|2|9', 'url'), false);
    assert.equal(pageChanged('https://a', 't|1|1', 'https://b', 't|1|1', 'url'), true);
    assert.equal(pageChanged('https://a', 't|1|1', 'https://a', 't|2|9', 'any'), true);
    // url expected, same URL, but a dialog opened (overlay count 0 -> 1): a real effect.
    assert.equal(pageChanged('https://a/cart', 't|10|50|0', 'https://a/cart', 't|14|80|1', 'url'), true);
    // url expected, same URL, content changed but no dialog: still not a navigation.
    assert.equal(pageChanged('https://a/cart', 't|10|50|0', 'https://a/cart', 't|14|80|0', 'url'), false);
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

  it('accepts a DOM-only change for an in-page button', async () => {
    const page = await browser.newPage();
    await page.route('**/products', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: `<!doctype html><body>
          <aside><div role="button" id="saas">Saas</div></aside>
          <main id="list">All products</main>
          <script>
            document.getElementById('saas').addEventListener('click', () => {
              document.getElementById('list').textContent = 'Saas products only';
            });
          </script>
        </body>`,
      });
    });
    await page.goto('https://app.example.test/products', { waitUntil: 'load' });
    try {
      await clickExpectingChange(page, page.locator('#saas'), {
        expect: 'any',
        timeoutMs: 1000,
        label: 'Saas',
      });
      assert.equal(page.url(), 'https://app.example.test/products');
      assert.equal(await page.locator('#list').textContent(), 'Saas products only');
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

  it('clickOpeningNewTab returns the opened page and a url expectation clicks once', async () => {
    const context = await browser.newContext();
    await context.route('https://app.example.test/**', async (route) => {
      const url = route.request().url();
      if (url.includes('/catalog')) {
        await route.fulfill({
          status: 200,
          contentType: 'text/html',
          body: '<!doctype html><h1>Please select a category!</h1>',
        });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: `<!doctype html><body>
          <button id="go">Continue</button>
          <script>
            window.clicks = 0;
            document.getElementById('go').addEventListener('click', () => {
              window.clicks += 1;
              window.open('https://app.example.test/catalog', '_blank');
            });
          </script>
        </body>`,
      });
    });
    const page = await context.newPage();
    try {
      await page.goto('https://app.example.test/customer360/1', { waitUntil: 'load' });
      const opened = await clickOpeningNewTab(page, page.locator('#go'), { timeoutMs: 5000 });
      assert.match(opened.url(), /\/catalog$/);
      assert.equal(await page.evaluate(() => (window as unknown as { clicks: number }).clicks), 1);

      await page.goto('https://app.example.test/customer360/1', { waitUntil: 'load' });
      await clickExpectingChange(page, page.locator('#go'), {
        expect: 'url',
        timeoutMs: 2000,
        label: 'Continue',
      });
      assert.equal(await page.evaluate(() => (window as unknown as { clicks: number }).clicks), 1);
    } finally {
      await context.close();
    }
  });

  it('same-tab navigation still satisfies clickExpectingChange', async () => {
    const context = await browser.newContext();
    await context.route('https://app.example.test/**', async (route) => {
      const url = route.request().url();
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: url.includes('/orders')
          ? '<!doctype html><h1>Orders</h1>'
          : `<!doctype html><button id="go">Orders</button>
             <script>
               window.clicks = 0;
               document.getElementById('go').addEventListener('click', () => {
                 window.clicks += 1;
                 location.href = 'https://app.example.test/orders';
               });
             </script>`,
      });
    });
    const page = await context.newPage();
    try {
      await page.goto('https://app.example.test/home', { waitUntil: 'load' });
      await clickExpectingChange(page, page.locator('#go'), {
        expect: 'url',
        timeoutMs: 3000,
        label: 'Orders',
      });
      assert.match(page.url(), /\/orders$/);
      assert.equal(context.pages().length, 1);
    } finally {
      await context.close();
    }
  });

  it('an unchanged page still reports that the page did not change and retries once', async () => {
    const page = await browser.newPage();
    await page.setContent(`<!doctype html><button id="go">Continue</button>
      <script>
        window.clicks = 0;
        document.getElementById('go').addEventListener('click', () => { window.clicks += 1; });
      </script>`, { waitUntil: 'load' });
    try {
      await assert.rejects(
        () => clickExpectingChange(page, page.locator('#go'), {
          expect: 'url',
          timeoutMs: 200,
          label: 'Continue',
        }),
        /Continue" tıklandı ama sayfa değişmedi/,
      );
      assert.equal(await page.evaluate(() => (window as unknown as { clicks: number }).clicks), 2);
    } finally {
      await page.close();
    }
  });
});
