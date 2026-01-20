import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  use: {
    viewport: { width: 1366, height: 768 }, // Full HD resolution for consistent recording
    launchOptions: {
      args: [
        '--start-maximized', // Maximize window (content matches viewport)
        '--disable-gpu',
        '--disable-extensions',
        '--disable-dev-shm-usage',
        '--disable-background-timer-throttling',
        '--disable-renderer-backgrounding',
        '--disable-features=site-per-process',
        '--no-sandbox'
      ]
    },
    video: {
      mode: 'retain-on-failure',
      // Explicitly set video size to match viewport to avoid downscaling to 800x800
      size: { width: 1366, height: 768 }
    },
    screenshot: 'on',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 768 } // Specific project override also set to FHD
      }
    }
  ]
});