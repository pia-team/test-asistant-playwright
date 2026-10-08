import { Page, Locator } from '@playwright/test';
import { getEnvConfig } from '../../../../support/env';

export class ArnavutlukSigninPage {
  private readonly page: Page;
  private readonly usernameField: Locator;
  private readonly passwordField: Locator;
  private readonly signInButton: Locator;
  private readonly individualHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameField = page.getByRole('textbox', { name: 'Username or email' });
    this.passwordField = page.getByRole('textbox', { name: 'Password' });
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    this.individualHeading = page.getByRole('heading', { name: 'Individual' });
  }

  async navigateToLogin(): Promise<void> {
    await this.page.goto(getEnvConfig().baseLoginUrl);
  }

  async clickUsernameField(): Promise<void> {
    await this.usernameField.waitFor({ state: 'visible', timeout: 30000 });
    await this.usernameField.click();
  }

  async enterUsername(username: string): Promise<void> {
    await this.usernameField.waitFor({ state: 'visible', timeout: 30000 });
    await this.usernameField.fill(username);
  }

  async clickPasswordField(): Promise<void> {
    await this.passwordField.waitFor({ state: 'visible', timeout: 30000 });
    await this.passwordField.click();
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordField.waitFor({ state: 'visible', timeout: 30000 });
    await this.passwordField.fill(password);
  }

  async enterCredentials(username: string, password: string): Promise<void> {
    await this.clickUsernameField();
    await this.enterUsername(username);
    await this.clickPasswordField();
    await this.enterPassword(password);
  }

  async clickSignIn(): Promise<void> {
    await this.signInButton.waitFor({ state: 'visible', timeout: 30000 });
    await this.signInButton.click();
  }

  async clickIndividualHeading(): Promise<void> {
    await this.individualHeading.waitFor({ state: 'visible', timeout: 30000 });
    await this.individualHeading.click();
  }
}