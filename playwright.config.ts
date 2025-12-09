import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 60000,
  // retries:2,//retry numbers
  // workers:4,//browser numbers
  reporter: [["line"], ["allure-playwright"]],
  use: {
    //headless: false,// headless modu world.ts içerisindenden yönetiliyor ya da consolde npm run ...:headless koduyla koşulabilir

    viewport: { width: 1920, height: 1080 }, // Tam ekran video için sabit viewport
    launchOptions: {
      args: ['--start-maximized'] // ✅ Chrome/Edge için pencereyi büyüt
    },
    screenshot: 'on', // test başarısız olursa ekran görüntüsü al
    video: {
      mode: 'on', // Her zaman video kaydı al
      size: { width: 1920, height: 1080 } // Video boyutunu viewport ile eşleştir
    },
  },
});
