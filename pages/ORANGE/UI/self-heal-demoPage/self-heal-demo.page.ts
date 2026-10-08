import { Page, expect } from '@playwright/test';

/**
 * Demo page for Runtime Self-Healing.
 * Renders a real "Save" button with a stable data-testid, but click uses a
 * deliberately stale selector so COTESTER_SELF_HEAL can recover via match+retry.
 * Uses an in-page HTML fixture (not /login) so isLoginRoute does not skip healing.
 */
export class SelfHealDemoPage {
  private readonly page: Page;

  /** Intentionally wrong — does not exist in the DOM. */
  static readonly STALE_SAVE_SELECTOR = "[data-testid='save-button-STALE']";

  constructor(page: Page) {
    this.page = page;
  }

  async ready(): Promise<void> {
    await this.page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
        <head><meta charset="utf-8"><title>Self-heal demo</title></head>
        <body>
          <h1>Self-heal demo</h1>
          <button type="button" data-testid="save-button-v2" id="save-btn">Save</button>
          <p id="status" data-testid="save-status">idle</p>
          <script>
            document.getElementById('save-btn').addEventListener('click', function () {
              document.getElementById('status').textContent = 'saved';
            });
          </script>
        </body>
      </html>
    `);
  }

  async clickSaveWithStaleLocator(): Promise<void> {
    // Must go through page.locator so wrapPageForSelfHeal can intercept failures.
    await this.page.locator(SelfHealDemoPage.STALE_SAVE_SELECTOR).click({ timeout: 8000 });
  }

  async assertSaveClicked(): Promise<void> {
    await expect(this.page.locator("[data-testid='save-status']")).toHaveText('saved', {
      timeout: 5000,
    });
  }
}
