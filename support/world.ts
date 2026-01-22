import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium, firefox, webkit } from 'playwright';

// Supported browsers: chromium, firefox, webkit (Safari)
type BrowserType = 'chromium' | 'firefox' | 'webkit';

export interface ICustomWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  openBrowser: () => Promise<void>;
  closeBrowser: () => Promise<void>;
}

export class CustomWorld extends World implements ICustomWorld {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;

  currentFeatureName?: string;

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
    const slowMo = parseInt(process.env.SLOW_MO || '200', 10);

    console.log(`🌐 Browser: ${browserType} | Headless: ${headless} | SlowMo: ${slowMo}ms`);

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
    // ✅ Video kaydı burada açıldı
    this.context = await this.browser.newContext({
      viewport: { width: 1920, height: 1080 }, // Viewport video ile aynı olmalı
      recordVideo: {
        dir: 'reports/videos/',
        size: { width: 1920, height: 1080 } // Global ayarlar ile uyumlu 1080p
      }
    });

    this.page = await this.context.newPage();
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
