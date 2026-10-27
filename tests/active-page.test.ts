import './e2e/playwright-browsers';
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';
import { ActivePageManager, waitForNewPageAndActivate } from '../support/active-page';
import { startStaticServer, type StaticServerHandle } from './e2e/static-server';
import * as path from 'path';

const FIXTURE_DIR = path.join(__dirname, 'e2e', 'fixtures', 'popup-app');

describe('ActivePageManager @active-page', { concurrency: 1 }, () => {
  let server: StaticServerHandle | undefined;
  let browser: Browser | undefined;

  before(async () => {
    server = await startStaticServer(FIXTURE_DIR);
    browser = await chromium.launch({ headless: true });
  });

  after(async () => {
    await browser?.close();
    browser = undefined;
    if (server) {
      await server.close();
      server = undefined;
    }
  });

  async function openManaged(): Promise<{
    context: BrowserContext;
    main: Page;
    manager: ActivePageManager;
    switches: Page[];
  }> {
    const context = await browser!.newContext();
    const main = await context.newPage();
    await main.goto(`${server!.url}/index.html`, { waitUntil: 'domcontentloaded' });
    const switches: Page[] = [];
    const manager = new ActivePageManager(context, main, {
      onActivePageChanged: (page) => {
        switches.push(page);
      },
    });
    return { context, main, manager, switches };
  }

  /** Same-step popup: pair click with page wait (mirrors generated helper usage). */
  async function openPopup(
    world: { context: BrowserContext; page: Page; activePageManager: ActivePageManager },
    testId: string,
  ): Promise<Page> {
    return waitForNewPageAndActivate(world, async () => {
      await world.page.getByTestId(testId).click();
    });
  }

  it('keeps main page active for single-tab navigation', async () => {
    const { context, main, manager } = await openManaged();
    try {
      await main.getByTestId('main-heading').waitFor({ state: 'visible' });
      await manager.settle();
      assert.equal(manager.getActivePage(), main);
      const shot = await manager.getActivePage()!.screenshot({ fullPage: false });
      assert.ok(shot.length > 100, 'screenshot from main tab');
    } finally {
      manager.dispose();
      await context.close();
    }
  });

  it('switches active page when target=_blank opens', async () => {
    const { context, main, manager, switches } = await openManaged();
    try {
      const active = await openPopup({ context, page: main, activePageManager: manager }, 'open-popup');
      assert.ok(active && active !== main, 'active page should be the popup');
      assert.match(active.url(), /popup\.html/);
      await active.getByTestId('popup-heading').waitFor({ state: 'visible' });
      assert.ok(switches.some((p) => p === active), 'onActivePageChanged fired for popup');
      const text = await active.getByTestId('popup-marker').textContent();
      assert.equal(text?.trim(), 'popup-one-content');
    } finally {
      manager.dispose();
      await context.close();
    }
  });

  it('assertion on new tab can pass using active page', async () => {
    const { context, main, manager } = await openManaged();
    try {
      const active = await openPopup({ context, page: main, activePageManager: manager }, 'open-popup');
      await assert.doesNotReject(async () => {
        await active.getByTestId('popup-heading').waitFor({ state: 'visible', timeout: 5_000 });
      });
      const heading = await active.getByTestId('popup-heading').textContent();
      assert.equal(heading?.trim(), 'Popup One');
    } finally {
      manager.dispose();
      await context.close();
    }
  });

  it('assertion on new tab can fail without poisoning main page', async () => {
    const { context, main, manager } = await openManaged();
    try {
      const active = await openPopup({ context, page: main, activePageManager: manager }, 'open-popup');
      await assert.rejects(
        async () => {
          await active.getByTestId('does-not-exist').waitFor({ state: 'visible', timeout: 500 });
        },
        /Timeout|waiting/i,
      );
      assert.equal(main.isClosed(), false);
      assert.match(main.url(), /index\.html/);
    } finally {
      manager.dispose();
      await context.close();
    }
  });

  it('AfterStep-style screenshot uses popup after switch', async () => {
    const { context, main, manager } = await openManaged();
    try {
      const active = await openPopup({ context, page: main, activePageManager: manager }, 'open-popup');
      const buffer = await active.screenshot({ fullPage: false });
      assert.ok(buffer.length > 100);
      assert.equal(await active.getByTestId('popup-marker').isVisible(), true);
      assert.equal(await main.getByTestId('main-heading').isVisible(), true);
    } finally {
      manager.dispose();
      await context.close();
    }
  });

  it('returns to main when popup closes', async () => {
    const { context, main, manager } = await openManaged();
    try {
      const popup = await openPopup({ context, page: main, activePageManager: manager }, 'open-popup');
      assert.notEqual(popup, main);
      await popup.close();
      await manager.settle();
      assert.equal(manager.getActivePage(), main);
      await main.getByTestId('main-heading').waitFor({ state: 'visible' });
    } finally {
      manager.dispose();
      await context.close();
    }
  });

  it('stacks multiple popups and pops on close', async () => {
    const { context, main, manager } = await openManaged();
    try {
      const first = await openPopup({ context, page: main, activePageManager: manager }, 'open-popup');
      assert.match(first.url(), /popup\.html/);

      const second = await openPopup({ context, page: main, activePageManager: manager }, 'open-popup-2');
      assert.match(second.url(), /popup2\.html/);
      assert.notEqual(second, first);

      await second.close();
      await manager.settle();
      assert.equal(manager.getActivePage(), first);

      await first.close();
      await manager.settle();
      assert.equal(manager.getActivePage(), main);
    } finally {
      manager.dispose();
      await context.close();
    }
  });

  it('isolates active page across parallel contexts', async () => {
    const a = await openManaged();
    const b = await openManaged();
    try {
      await openPopup({ context: a.context, page: a.main, activePageManager: a.manager }, 'open-popup');
      assert.match(a.manager.getActivePage()!.url(), /popup\.html/);
      assert.equal(b.manager.getActivePage(), b.main);
      assert.match(b.manager.getActivePage()!.url(), /index\.html/);
    } finally {
      a.manager.dispose();
      b.manager.dispose();
      await a.context.close();
      await b.context.close();
    }
  });

  it('waitForNewPageAndActivate races safely with context listener', async () => {
    const { context, main, manager } = await openManaged();
    try {
      const world = { context, page: main, activePageManager: manager };
      const activated = await waitForNewPageAndActivate(world, async () => {
        await main.getByTestId('open-window').click();
      });
      await manager.settle();
      assert.match(activated.url(), /popup\.html/);
      assert.equal(manager.getActivePage(), activated);
      await activated.getByTestId('popup-heading').waitFor({ state: 'visible' });
    } finally {
      manager.dispose();
      await context.close();
    }
  });

  it('auto-switches after delayed page event (between-step settle)', async () => {
    const { context, main, manager } = await openManaged();
    try {
      // Click without waitForEvent — mimics end of step N; page event may lag click().
      const clickDone = main.getByTestId('open-popup').click();
      // Between-step gap (AfterStep / next BeforeStep) — event arrives then settle.
      await new Promise((r) => setTimeout(r, 300));
      await clickDone;
      await manager.settle();
      const active = manager.getActivePage()!;
      assert.notEqual(active, main);
      assert.match(active.url(), /popup\.html/);
    } finally {
      manager.dispose();
      await context.close();
    }
  });

  it('dispose removes page listener so later pages are ignored', async () => {
    const { context, main, manager } = await openManaged();
    manager.dispose();
    try {
      const popupPromise = context.waitForEvent('page');
      await main.getByTestId('open-window').click();
      const popup = await popupPromise;
      await popup.waitForLoadState('domcontentloaded');
      assert.equal(manager.getActivePage(), undefined);
      await popup.close();
    } finally {
      await context.close();
    }
  });
});
