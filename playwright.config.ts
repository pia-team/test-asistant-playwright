import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 60000,
  // retries:2,//retry numbers
  // workers:4,//browser numbers
   reporter: [["line"], ["allure-playwright"]],
  use: {
    //headless: false,// headless modu world.ts içerisindenden yönetiliyor ya da consolde npm run ...:headless koduyla koşulabilir

    viewport:null,
    launchOptions: {
    args: ['--start-maximized'] // ✅ Chrome/Edge için pencereyi büyüt
  },
    //viewport: { width: 1280, height: 720 },
    screenshot: 'on', // test başarısız olursa ekran görüntüsü al
    //video: 'retain-on-failure', //video kaydı al
  },
});
