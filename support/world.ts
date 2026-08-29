import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium, firefox, webkit } from 'playwright';
import type { BrowserContextOptions } from 'playwright';
import type { IBasePage } from './pageFactory';
import { createHealingContext, type HealingContext } from './self-heal';
import { wrapPageForSelfHeal } from './healing-page';

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
  /** Per-scenario page object instance (not shared globally). */
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
  openBrowser: () => Promise<void>;
  closeBrowser: () => Promise<void>;
};

export type ICustomWorld = World & CustomWorldState;

export class CustomWorld extends World implements ICustomWorld {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  pageInstance?: IBasePage;
  currentFeatureName?: string;
  scenarioProjectKey?: string;
  scenarioVars: Record<string, string> = {};
  flowCapture?: import('./flow-capture').FlowCaptureSession;
  healingContext?: HealingContext;

  constructor(options: IWorldOptions) {
    super(options);
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
    if (isVideoRecordingEnabled()) {
      contextOptions.recordVideo = {
        dir: 'reports/videos/',
        size: { width: 1920, height: 1080 },
      };
    }
    this.context = await this.browser.newContext(contextOptions);

    this.page = await this.context.newPage();
    this.healingContext = createHealingContext();
    if (this.healingContext.enabled) {
      this.page = wrapPageForSelfHeal(this.page, this.healingContext);
    }
  }

  async closeBrowser() {
    const video = this.page?.video();
    const featureName = this.currentFeatureName || 'unknown';

    // Close everything first to allow the video to be finalized
    await this.page?.close();
    await this.context?.close();
    await this.browser?.close();

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
