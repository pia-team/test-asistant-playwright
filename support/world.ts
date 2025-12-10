import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium, firefox } from 'playwright';

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


  constructor(options: IWorldOptions) {
    super(options);
  }


  async openBrowser() {
    this.browser = await chromium.launch({
      headless: true,                     // 🔵 Tarayıcıyı headless(true) ya da headed(false) modda açıyoruz
      args: ['--start-maximized'], // pencereyi büyüt
      slowMo: 200
    });

    /*                                           //Firefox opsiyonu için aktif edin
     async  openBrowser() {                            
   // 🟠 Tarayıcıyı Firefox olarak başlatıyoruz
   this.browser = await firefox.launch({
     headless: true, // Tarayıcıyı headless(true) ya da headed(false) modda açıyoruz
     slowMo: 200,     // adımlar arası yavaşlatma
     //args: ['--start-maximized']
   });
 */
    // ✅ Video kaydı burada açıldı
    this.context = await this.browser.newContext({
      viewport: { width: 1920, height: 1080 }, // Viewport video ile aynı olmalı
      recordVideo: {
        dir: 'reports/videos/',
        size: { width: 1920, height: 1080 } // Global ayarlar ile uyumlu 1080p
      }
    });

    this.page = await this.context.newPage();
    // (Opsiyonel) sayfa yüklenene kadar beklet
    await this.page.waitForLoadState('domcontentloaded');
  }

  async closeBrowser() {
    // ✅ Video dosyasını senaryo bitince almak için:
    const video = this.page?.video();
    if (video) {
      const videoPath = await video.path();
      console.log(`🎥 Video kaydedildi: ${videoPath}`);
    }
    await this.page?.close();
    await this.context?.close();
    await this.browser?.close();
  }
}

setWorldConstructor(CustomWorld);
