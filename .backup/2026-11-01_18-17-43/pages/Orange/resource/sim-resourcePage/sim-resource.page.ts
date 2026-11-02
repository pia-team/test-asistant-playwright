import { Page, Locator } from '@playwright/test';
import { getEnvConfig } from '../../../../support/env';

export class SimResourcePage {
  readonly signInWithKeycloakButton: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly manageResourcesButton: Locator;
  readonly allCategoriesDropdown: Locator;
  readonly filterButton: Locator;

  constructor(private readonly page: Page) {
    this.signInWithKeycloakButton = page.locator("[data-testid='login-submit-button']");
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.signInButton = page.locator('#kc-login');
    this.manageResourcesButton = page.locator("[data-testid='sidebar-nav-item-manage-resources']");
    this.allCategoriesDropdown = page.locator("[data-testid='resource-table-filter-category']");
    this.filterButton = page.locator("[data-testid='resource-table-filter-apply']");
  }

  async clickSignInWithKeycloak(): Promise<void> {
    const env = getEnvConfig();
    await this.page.goto(env.baseLoginUrl);
    await this.signInWithKeycloakButton.click();
  }

  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickSignIn(): Promise<void> {
    await this.signInButton.click();
  }

  async clickManageResources(): Promise<void> {
    await this.manageResourcesButton.click();
  }

  async clickAllCategories(): Promise<void> {
    await this.allCategoriesDropdown.click();
  }

  async selectSimFromDropdown(): Promise<void> {
    throw new Error('UNRESOLVED: Dropdowndan SIM');
  }

  async clickFilter(): Promise<void> {
    await this.filterButton.click();
  }
}