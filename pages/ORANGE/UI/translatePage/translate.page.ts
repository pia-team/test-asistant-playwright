import { Page, Locator, expect } from '@playwright/test';
import { getEnvConfig } from '../../../../support/env';

export class TranslatePage {
  private readonly page: Page;
  private readonly keycloakSignInButton: Locator;
  private readonly usernameField: Locator;
  private readonly passwordField: Locator;
  private readonly keycloakLoginButton: Locator;
  private readonly welcomeText: Locator;
  private readonly englishLanguageOption: Locator;
  private readonly turkishLanguageOption: Locator;
  private readonly hosGeldinizText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.keycloakSignInButton = page.getByText('Sign in with Keycloak', { exact: false });
    this.usernameField = page.locator('#username');
    this.passwordField = page.locator('#password');
    this.keycloakLoginButton = page.locator('#kc-login');
    this.welcomeText = page.getByText('Welcome', { exact: false });
    this.englishLanguageOption = page.getByText('English', { exact: true });
    this.turkishLanguageOption = page.getByText('Türkçe', { exact: true });
    this.hosGeldinizText = page.getByText('Hoş Geldiniz', { exact: false });
  }

  async navigateToLoginPage(): Promise<void> {
    const env = getEnvConfig();
    await this.page.goto(env.baseLoginUrl);
  }

  async clickKeycloakSignIn(): Promise<void> {
    await this.keycloakSignInButton.waitFor({ state: 'visible', timeout: 30000 });
    await this.keycloakSignInButton.click();
  }

  async enterCredentials(username: string, password: string): Promise<void> {
    await this.usernameField.waitFor({ state: 'visible', timeout: 30000 });
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
  }

  async clickSignIn(): Promise<void> {
    await this.keycloakLoginButton.waitFor({ state: 'visible', timeout: 30000 });
    await this.keycloakLoginButton.click();
  }

  async verifyWelcomeText(): Promise<void> {
    await this.welcomeText.waitFor({ state: 'visible', timeout: 30000 });
    await expect(this.welcomeText).toBeVisible();
  }

  async clickEnglishLanguage(): Promise<void> {
    await this.englishLanguageOption.waitFor({ state: 'visible', timeout: 30000 });
    await this.englishLanguageOption.click();
  }

  async selectTurkishLanguage(): Promise<void> {
    await this.turkishLanguageOption.waitFor({ state: 'visible', timeout: 30000 });
    await this.turkishLanguageOption.click();
  }

  async verifyTurkishWelcomeText(): Promise<void> {
    await this.hosGeldinizText.waitFor({ state: 'visible', timeout: 30000 });
    await expect(this.hosGeldinizText).toBeVisible();
  }
}