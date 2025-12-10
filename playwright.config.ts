import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  use: {
    viewport: { width: 1920, height: 1080 }, // Full HD resolution for consistent recording
    launchOptions: {
      args: ['--start-maximized'] // Maximize window (content matches viewport)
    },
    video: {
      mode: 'retain-on-failure',
      // Explicitly set video size to match viewport to avoid downscaling to 800x800
      size: { width: 1920, height: 1080 }
    },
    screenshot: 'on',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 } // Specific project override also set to FHD
      }
    }
  ]
});