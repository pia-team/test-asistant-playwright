import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium, firefox, webkit } from 'playwright';
import type { BrowserContextOptions } from 'playwright';
import type { IBasePage } from './pageFactory';
import { createHealingContext, type HealingContext } from './self-heal';
import { wrapPageForSelfHeal } from './healing-page';
import { ActivePageManager } from './active-page';

// Supported browsers: chromium, firefox, webkit (Safari)
type BrowserType = 'chromium' | 'firefox' | 'webkit';

function isVideoRecordingEnabled(): boolean {
  const raw = (process.env.VIDEO_RECORDING ?? process.env.video ?? 'on').toLowerCase();
  return raw !== 'off' && raw !== 'false' && raw !== '0';
}

function resolveSlowMo(): number {
  const explicit = process.env.SLOW_MO;
  if (explicit != null && explicit.trim() !== '') {
    const parsed = parseInt(explicit, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  const screenshotMode = (process.env.SCREENSHOT_MODE ?? process.env.screenshot ?? 'ALL_STEPS').toUpperCase();
  const normalized = screenshotMode === 'ON' ? 'ALL_STEPS' : screenshotMode === 'OFF' ? 'NONE' : screenshotMode;
  return normalized === 'ALL_STEPS' ? 200 : 0;
}

/**
 * Custom fields merged onto Cucumber's {@link World}.
 * Use a `World & { ... }` intersection so step defs see these members on `this: ICustomWorld`
 * (the default `World` class type does not carry `IWorld`'s index signature through `extends`).
 */
type CustomWorldState = {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  /** Unwrapped Playwright page currently bound via applyActivePage (for identity checks). */
  activeRawPage?: Page;
  /** Scenario-scoped popup/tab active-page tracker (not a global singleton). */
  activePageManager?: ActivePageManager;
  /** Per-scenario page object instance (not shared globally). Cleared on active page change. */
  pageInstance?: IBasePage;
  /** Set in Before hook from the running feature path; used in step logging. */
  currentFeatureName?: string;
  /** Set in Before hook from features/{project}/… path; drives per-project env config. */
  scenarioProjectKey?: string;
  /**
   * Per-scenario key/value data between steps.
   * Reset to `{}` in `support/hooks.ts` Before hook.
   */
  scenarioVars: Record<string, string>;
  /** Optional network capture for Test Flow bindings. */
  flowCapture?: import('./flow-capture').FlowCaptureSession;
  /** Runtime self-heal state for the active scenario. */
  healingContext?: HealingContext;
  /**
   * Video handle captured before context close (page refs are cleared on teardown).
   * Used only for optional failure attachment — never throws if missing.
   */
  pendingVideo?: { path: () => Promise<string> };
  openBrowser: () => Promise<void>;
  closeBrowser: () => Promise<void>;
  /** Apply raw Playwright page as world.page (heal wrap + invalidate PO cache). */
  applyActivePage: (rawPage: Page) => void;
};

export type ICustomWorld = World & CustomWorldState;

export class CustomWorld extends World implements ICustomWorld {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  activeRawPage?: Page;
  activePageManager?: ActivePageManager;
  pageInstance?: IBasePage;
  currentFeatureName?: string;
  scenarioProjectKey?: string;
  scenarioVars: Record<string, string> = {};
  flowCapture?: import('./flow-capture').FlowCaptureSession;
  healingContext?: HealingContext;
  pendingVideo?: { path: () => Promise<string> };

  constructor(options: IWorldOptions) {
    super(options);
  }

  /**
   * Bind the scenario's active Playwright page for steps/screenshots.
   * Invalidates cached page objects so they are not stuck on a closed/previous tab.
   */
  applyActivePage(rawPage: Page) {
    if (this.activeRawPage === rawPage && this.page && !this.page.isClosed()) {
      if (this.flowCapture) {
        this.flowCapture.attach(rawPage);
      }
      return;
    }
    this.pageInstance = undefined;
    this.activeRawPage = rawPage;
    if (this.healingContext?.enabled) {
      this.page = wrapPageForSelfHeal(rawPage, this.healingContext);
    } else {
      this.page = rawPage;
    }
    if (this.flowCapture) {
      this.flowCapture.attach(rawPage);
    }
  }

  private getBrowserType(): BrowserType {
    const browserEnv = process.env.BROWSER?.toLowerCase() || 'chromium';
    if (['chromium', 'firefox', 'webkit'].includes(browserEnv)) {
      return browserEnv as BrowserType;
    }
    console.log(`⚠️ Unknown browser "${browserEnv}", defaulting to chromium`);
    return 'chromium';
  }

  async openBrowser() {
    const browserType = this.getBrowserType();
    const headless = process.env.HEADLESS !== 'false'; // default true
    const slowMo = resolveSlowMo();

    console.log(`🌐 Browser: ${browserType} | Headless: ${headless} | SlowMo: ${slowMo}ms | Video: ${isVideoRecordingEnabled() ? 'on' : 'off'}`);

    const launchOptions = {
      headless,
      slowMo,
      ...(browserType === 'chromium' ? { args: ['--start-maximized'] } : {})
    };

    switch (browserType) {
      case 'firefox':
        this.browser = await firefox.launch(launchOptions);
        break;
      case 'webkit':
        this.browser = await webkit.launch(launchOptions);
        break;
      default:
        this.browser = await chromium.launch(launchOptions);
    }
    const contextOptions: BrowserContextOptions = {
      viewport: { width: 1920, height: 1080 },
    };
    // Snapshot SLICE-G: path only — never log file contents
    const storageStatePath = process.env.COTESTER_SNAPSHOT_STORAGE_STATE_PATH;
    if (storageStatePath && storageStatePath.trim()) {
      contextOptions.storageState = storageStatePath.trim();
    }
    if (isVideoRecordingEnabled()) {
      contextOptions.recordVideo = {
        dir: 'reports/videos/',
        size: { width: 1920, height: 1080 },
      };
    }
    this.context = await this.browser.newContext(contextOptions);

    const navRaw = process.env.COTESTER_NAVIGATION_TIMEOUT_MS;
    if (navRaw != null && navRaw.trim() !== '') {
      const navTimeout = Number.parseInt(navRaw, 10);
      if (Number.isFinite(navTimeout) && navTimeout > 0) {
        this.context.setDefaultNavigationTimeout(navTimeout);
      }
    }
    const actionRaw = process.env.COTESTER_ACTION_TIMEOUT_MS;
    if (actionRaw != null && actionRaw.trim() !== '') {
      const actionTimeout = Number.parseInt(actionRaw, 10);
      if (Number.isFinite(actionTimeout) && actionTimeout > 0) {
        this.context.setDefaultTimeout(actionTimeout);
      }
    }

    const rawPage = await this.context.newPage();
    this.healingContext = createHealingContext();
    this.activePageManager = new ActivePageManager(this.context, rawPage, {
      onActivePageChanged: (page) => {
        this.applyActivePage(page);
      },
    });
    this.applyActivePage(rawPage);
  }

  async closeBrowser() {
    const featureName = this.currentFeatureName || 'unknown';

    try {
      await this.activePageManager?.settle();
    } catch {
      // ignore settle errors during teardown
    }

    // Prefer active (or last open) page for video; fall back to world.page.
    const videoPage =
      this.activePageManager?.getActivePage() ??
      (this.page && !this.page.isClosed() ? this.page : undefined);
    const video = videoPage?.video();
    this.pendingVideo = video ?? undefined;

    this.activePageManager?.dispose();
    this.activePageManager = undefined;
    this.pageInstance = undefined;

    // Close context (all tabs) after disposing listeners — do not leave closed page as active.
    try {
      await this.context?.close();
    } catch (e) {
      console.error(`❌ Context close error: ${e}`);
    }
    try {
      await this.browser?.close();
    } catch (e) {
      console.error(`❌ Browser close error: ${e}`);
    }
    this.page = undefined;
    this.activeRawPage = undefined;
    this.context = undefined;
    this.browser = undefined;

    // Now get the path - Playwright guarantees it's ready after context close
    if (video) {
      try {
        const videoPath = await video.path();
        // CRITICAL: Include feature name in brackets for routing [feature-name]
        console.log(`🎥 Video kaydedildi [${featureName}]: ${videoPath}`);
      } catch (e) {
        console.error(`❌ Video path extraction error: ${e}`);
      }
    }
  }
}

setWorldConstructor(CustomWorld);
