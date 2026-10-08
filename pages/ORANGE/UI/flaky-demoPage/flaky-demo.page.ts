import { Page } from '@playwright/test';

/**
 * Demo page object for Flaky Test Health.
 * Intentionally fails ~50% of the time so the scenario can appear on /flaky-tests
 * after ≥5 valid runs with pass rate between 20% and 90%.
 */
export class FlakyDemoPage {
  private readonly page: Page;
  private lastFlipPassed: boolean = false;

  constructor(page: Page) {
    this.page = page;
  }

  async ready(): Promise<void> {
    await this.page.goto('about:blank');
  }

  async flipCoin(): Promise<void> {
    this.lastFlipPassed = Math.random() < 0.5;
  }

  async assertPassAboutHalfTheTime(): Promise<void> {
    if (!this.lastFlipPassed) {
      throw new Error(
        'Flaky demo failed (intentional ~50% pass rate for Test Health demo)'
      );
    }
  }
}
