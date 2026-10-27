import type { BrowserContext, Page } from 'playwright';

/** Bounded wait so popup about:blank / slow nav does not hang the scenario. */
const PAGE_READY_TIMEOUT_MS = 5_000;

export type ActivePageChangeHandler = (
  page: Page,
  previous: Page | undefined,
) => void | Promise<void>;

export type ActivePageManagerOptions = {
  onActivePageChanged?: ActivePageChangeHandler;
  readyTimeoutMs?: number;
};

function isOpen(page: Page | undefined): page is Page {
  return !!page && !page.isClosed();
}

/**
 * Scenario-scoped active Page tracker for Playwright BrowserContext.
 * Listens for new pages (tab/popup), switches active page after bounded readiness,
 * and restores the previous open page when the active one closes.
 *
 * Async work is serialized on an internal chain so `context.on('page')` never
 * leaves unhandled rejections or races overlapping switches.
 */
export class ActivePageManager {
  private readonly context: BrowserContext;
  private readonly readyTimeoutMs: number;
  private readonly onActivePageChanged?: ActivePageChangeHandler;
  private readonly pageHandler: (page: Page) => void;
  private readonly known = new Set<Page>();
  private stack: Page[] = [];
  private active: Page | undefined;
  private disposed = false;
  private chain: Promise<void> = Promise.resolve();

  constructor(
    context: BrowserContext,
    initialPage: Page,
    options: ActivePageManagerOptions = {},
  ) {
    this.context = context;
    this.readyTimeoutMs = options.readyTimeoutMs ?? PAGE_READY_TIMEOUT_MS;
    this.onActivePageChanged = options.onActivePageChanged;
    this.pageHandler = (page: Page) => {
      this.enqueue(() => this.handleNewPage(page));
    };

    this.adopt(initialPage, /* activate */ true);
    this.context.on('page', this.pageHandler);
  }

  /** Raw (unwrapped) active page, or undefined if none open / disposed. */
  getActivePage(): Page | undefined {
    if (this.disposed) return undefined;
    if (isOpen(this.active)) return this.active;
    return this.pickFallback();
  }

  /**
   * Wait until queued popup/close handling finishes, then adopt any open
   * context pages the 'page' event has not delivered yet (click vs popup race).
   */
  async settle(): Promise<void> {
    await this.chain;
    await this.reconcileUnknownPages();
    await this.chain;
  }

  /**
   * Explicitly activate a page (e.g. after `waitForEvent('page')` in a step helper).
   * Idempotent if the page is already known/active.
   */
  async switchTo(page: Page): Promise<void> {
    await this.settle();
    if (this.disposed || page.isClosed()) return;
    this.adopt(page, /* activate */ false);
    await this.setActive(page);
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    try {
      this.context.off('page', this.pageHandler);
    } catch {
      // context may already be closing
    }
    this.stack = [];
    this.known.clear();
    this.active = undefined;
  }

  private enqueue(work: () => Promise<void>): void {
    this.chain = this.chain
      .then(() => work())
      .catch((err) => {
        console.warn(`[ActivePage] ${err instanceof Error ? err.message : String(err)}`);
      });
  }

  private adopt(page: Page, activate: boolean): void {
    if (this.disposed || page.isClosed()) return;
    if (!this.known.has(page)) {
      this.known.add(page);
      this.stack.push(page);
      page.on('close', () => {
        this.enqueue(() => this.handlePageClosed(page));
      });
    }
    if (activate) {
      this.active = page;
    }
  }

  private async reconcileUnknownPages(): Promise<void> {
    if (this.disposed) return;
    let pages: Page[];
    try {
      pages = this.context.pages();
    } catch {
      return;
    }
    for (const page of pages) {
      if (this.disposed || page.isClosed() || this.known.has(page)) continue;
      await this.handleNewPage(page);
    }
  }

  private async handleNewPage(page: Page): Promise<void> {
    if (this.disposed || page.isClosed()) return;
    if (this.known.has(page)) {
      // Already tracked (initial page, switchTo, or prior reconcile).
      return;
    }
    await this.waitUntilReady(page);
    if (this.disposed || page.isClosed()) return;
    // Re-check after await — parallel switchTo/reconcile may have adopted.
    if (this.known.has(page)) {
      if (this.active !== page && !page.isClosed()) {
        await this.setActive(page);
      }
      return;
    }
    this.adopt(page, /* activate */ false);
    await this.setActive(page);
  }

  private async handlePageClosed(page: Page): Promise<void> {
    if (this.disposed) return;
    this.known.delete(page);
    this.stack = this.stack.filter((p) => p !== page && !p.isClosed());
    if (this.active === page || !isOpen(this.active)) {
      const next = this.pickFallback();
      if (next) {
        await this.setActive(next);
      } else {
        this.active = undefined;
      }
    }
  }

  private pickFallback(): Page | undefined {
    for (let i = this.stack.length - 1; i >= 0; i--) {
      if (isOpen(this.stack[i])) return this.stack[i];
    }
    try {
      const open = this.context.pages().filter((p) => !p.isClosed());
      return open.length > 0 ? open[open.length - 1] : undefined;
    } catch {
      return undefined;
    }
  }

  private async setActive(page: Page): Promise<void> {
    if (this.disposed || page.isClosed()) return;
    if (this.active === page) return;
    const previous = isOpen(this.active) ? this.active : undefined;
    this.active = page;
    if (this.onActivePageChanged) {
      await this.onActivePageChanged(page, previous);
    }
  }

  private async waitUntilReady(page: Page): Promise<void> {
    try {
      await page.waitForLoadState('domcontentloaded', { timeout: this.readyTimeoutMs });
    } catch {
      // Popup may stay on about:blank briefly or already be past load — continue.
    }
  }
}

/**
 * Click/action that opens a new tab/popup: wait for the page event, then settle active page.
 * Prefer this over ad-hoc `waitForEvent` + local Page variables in generated steps.
 */
export async function waitForNewPageAndActivate(
  world: {
    context?: BrowserContext;
    page?: Page;
    activePageManager?: ActivePageManager;
  },
  trigger: () => Promise<void>,
  timeoutMs = 15_000,
): Promise<Page> {
  const context = world.context;
  if (!context) {
    throw new Error('waitForNewPageAndActivate: BrowserContext is not open');
  }
  const pagePromise = context.waitForEvent('page', { timeout: timeoutMs });
  await trigger();
  const newPage = await pagePromise;
  if (world.activePageManager) {
    await world.activePageManager.switchTo(newPage);
    await world.activePageManager.settle();
  }
  const active = world.activePageManager?.getActivePage() ?? world.page ?? newPage;
  if (!isOpen(active)) {
    throw new Error('waitForNewPageAndActivate: new page closed before activation');
  }
  return active;
}
