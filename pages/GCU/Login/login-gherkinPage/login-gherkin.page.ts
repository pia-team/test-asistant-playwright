import { Page, Locator } from '@playwright/test';
import { getEnvConfig } from '../../../../support/env';

export class LoginGherkinPage {
  private readonly page: Page;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly signInButton: Locator;
  private readonly dashboard: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.signInButton = page.locator("button[type=submit]").first();
    this.dashboard = page.locator("[data-testid='dashboard'], .dashboard, #dashboard").first();
  }

  async navigate(): Promise<void> {
    const env = getEnvConfig();
    await this.page.goto(env.baseLoginUrl);
  }

  async enterCredentials(username: string, password: string): Promise<void> {
    await this.usernameInput.waitFor({ state: 'visible', timeout: 30000 });
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
  }

  async clickSignIn(): Promise<void> {
    await this.signInButton.waitFor({ state: 'visible', timeout: 30000 });
    await this.signInButton.click();
  }

  async isDashboardVisible(): Promise<boolean> {
    try {
      await this.dashboard.waitFor({ state: 'visible', timeout: 30000 });
      return true;
    } catch {
      return false;
    }
  }
}