import { Page, Locator } from '@playwright/test';
import { getEnvConfig } from '../../../../support/env';

export class Login10720260Page {
  private readonly page: Page;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly signInButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.signInButton = page.locator('#kc-login');
  }

  async openLoginPage() {
    await this.page.goto(getEnvConfig().baseLoginUrl);
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

  async expectSuccessfulLogin() {
    // Wait for URL to change away from Keycloak login endpoint
    await this.page.waitForURL(url => !url.href.includes('keycloak'), { timeout: 30000 });
  }
}