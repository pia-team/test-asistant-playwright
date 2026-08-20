import { Page, Locator, expect } from '@playwright/test';
import { getEnvConfig } from '../../../../support/env';

export class LoginStepsPage {
  private readonly page: Page;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly signInButton: Locator;
  private readonly dashboard: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.signInButton = page.locator('button[type=submit]');
    this.dashboard = page.locator('[data-testid="dashboard"], .dashboard, #dashboard');
  }

  async navigate() {
    const env = getEnvConfig();
    await this.page.goto(env.baseLoginUrl);
  }

  async enterCredentials(username: string, password: string) {
    await this.usernameInput.waitFor({ state: 'visible', timeout: 30000 });
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
  }

  async clickSignIn() {
    await this.signInButton.waitFor({ state: 'visible', timeout: 30000 });
    await this.signInButton.click();
  }

  async verifyDashboardVisible() {
    await this.dashboard.first().waitFor({ state: 'visible', timeout: 30000 });
    await expect(this.dashboard.first()).toBeVisible();
  }
}