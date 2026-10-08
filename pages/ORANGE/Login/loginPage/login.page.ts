import { Page, Locator, expect } from '@playwright/test';
import { getEnvConfig } from '../../../../support/env';

export class LoginPage {
  private readonly page: Page;
  private readonly keycloakButton: Locator;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly signInButton: Locator;
  private readonly welcomeMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.keycloakButton = page.getByRole('button', { name: 'Sign in with Keycloak' });
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.signInButton = page.locator('#kc-login');
    this.welcomeMessage = page.getByText('Welcome');
  }

  async navigate(): Promise<void> {
    const env = getEnvConfig();
    await this.page.goto(env.baseLoginUrl);
  }

  async clickKeycloakButton(): Promise<void> {
    await this.keycloakButton.click({ timeout: 30000 });
  }

  /** Migrated step alias — same action as clickKeycloakButton. */
  async clickKeycloakEntry(): Promise<void> {
    await this.clickKeycloakButton();
  }

  async enterCredentials(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
  }

  async clickSignIn(): Promise<void> {
    await this.signInButton.click({ timeout: 30000 });
  }

  async verifyWelcome(): Promise<void> {
    await expect(this.welcomeMessage).toBeVisible({ timeout: 30000 });
  }
}