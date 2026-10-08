import { Page, Locator, expect } from '@playwright/test';

export class SignInPage {
  readonly page: Page;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly signInButton: Locator;
  readonly loginHeaderText: Locator;
  /** Alias used by migrated step defs — same target as signInAccountText. */
  readonly signInHeader: Locator;
  readonly signInAccountText: Locator;
  readonly orSignInWithText: Locator;
  readonly googleText: Locator;
  readonly vodafoneAccountText: Locator;
  readonly invalidCredentialsMessage: Locator;
  readonly logoutButton: Locator;
  readonly userNameDisplay: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameField = page.getByLabel(/username|email/i, { exact: false });
    this.passwordField = page.getByLabel('Password', { exact: false });
    this.signInButton = page.getByRole('button', { name: /sign in|login/i });
    this.loginHeaderText = page.getByText('Login', { exact: false });
    this.signInAccountText = page.getByText('Sign in to your account', { exact: false });
    this.signInHeader = page.getByRole('heading', { name: /sign in to your account/i });
    this.orSignInWithText = page.getByText('Or sign in with', { exact: false });
    this.googleText = page.getByText('Google', { exact: false });
    this.vodafoneAccountText = page.getByText('Connect with Vodafone Account', { exact: false });
    this.invalidCredentialsMessage = page.getByText('Invalid username or password.', { exact: false });
    this.logoutButton = page.getByRole('button', { name: /logout/i });
    this.userNameDisplay = page.getByText('nora', { exact: false });
  }

  async navigate() {
    await this.page.goto('/');
  }

  /** Migrated Cucumber steps call `goto()`; keep `navigate()` for newer page objects. */
  async goto() {
    await this.navigate();
  }

  async enterUsername(username: string) {
    await this.usernameField.fill(username);
  }

  async enterPassword(password: string) {
    await this.passwordField.fill(password);
  }

  async clickSignIn() {
    await this.signInButton.click();
  }

  async signIn(username: string, password: string) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickSignIn();
  }

  async logout() {
    await this.logoutButton.click();
  }

  async verifyLoginHeaderText() {
    await expect(this.loginHeaderText).toBeVisible();
  }

  async verifySignInAccountText() {
    await expect(this.signInAccountText).toBeVisible();
  }

  async verifyOrSignInWithText() {
    await expect(this.orSignInWithText).toBeVisible();
  }

  async verifyGoogleText() {
    await expect(this.googleText).toBeVisible();
  }

  async verifyVodafoneAccountText() {
    await expect(this.vodafoneAccountText).toBeVisible();
  }

  async verifyUserNameDisplayed(username: string) {
    const userNameLocator = this.page.getByText(username, { exact: false });
    await expect(userNameLocator).toBeVisible();
  }

  async verifyInvalidCredentialsMessage() {
    await expect(this.invalidCredentialsMessage).toBeVisible();
  }
}