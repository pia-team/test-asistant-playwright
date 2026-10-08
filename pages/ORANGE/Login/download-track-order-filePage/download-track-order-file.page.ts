import type { Page, Locator } from '@playwright/test';
import { getEnvConfig } from '../../../../support/env';

export class DownloadTrackOrderFilePage {
  private readonly page: Page;
  private readonly loginSubmitButton: Locator;
  private readonly usernameField: Locator;
  private readonly passwordField: Locator;
  private readonly signInButton: Locator;
  private readonly trackOrdersSidebarItem: Locator;
  private readonly downloadButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginSubmitButton = page.getByTestId('login-submit-button');
    this.usernameField = page.getByRole('textbox', { name: 'Username or email' });
    this.passwordField = page.getByRole('textbox', { name: 'Password' });
    this.signInButton = page.locator('#kc-login');
    this.trackOrdersSidebarItem = page.getByTestId('sidebar-nav-item-track-orders');
    this.downloadButton = page.getByRole('button', { name: 'Download' });
  }

  async navigateToLogin(): Promise<void> {
    await this.page.goto(getEnvConfig().baseLoginUrl);
    await this.page.waitForLoadState('networkidle');
  }

  async clickLoginSubmitButton(): Promise<void> {
    await this.loginSubmitButton.click({ timeout: 30000 });
  }

  async clickUsernameField(): Promise<void> {
    await this.usernameField.click({ timeout: 30000 });
  }

  async fillUsername(username: string): Promise<void> {
    await this.usernameField.fill(username);
  }

  async clickPasswordField(): Promise<void> {
    await this.passwordField.click({ timeout: 30000 });
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordField.fill(password);
  }

  async clickSignInButton(): Promise<void> {
    await this.signInButton.click({ timeout: 30000 });
  }

  async clickTrackOrdersSidebarItem(): Promise<void> {
    await this.trackOrdersSidebarItem.click({ timeout: 30000 });
  }

  async clickOrderLink(orderId: string): Promise<void> {
    await this.page.getByRole('cell', { name: orderId }).click({ timeout: 30000 });
  }

  async clickDownloadButton(): Promise<void> {
    await this.downloadButton.click({ timeout: 30000 });
  }
}