import { Page, Locator } from '@playwright/test';

export class ManageResourcePage {
  readonly signInKeycloakButton: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly manageResourcesSidebarButton: Locator;
  readonly filterButton: Locator;
  readonly searchByIdsButton: Locator;
  readonly resourceIdInput: Locator;

  constructor(private page: Page) {
    this.signInKeycloakButton = page.getByRole('button', { name: 'sign in with keycloak' });
    this.usernameInput = page.getByLabel('username');
    this.passwordInput = page.getByLabel('password');
    this.signInButton = page.getByRole('button', { name: 'sign in' });
    this.manageResourcesSidebarButton = page.getByText('manage resources', { exact: true }).first();
    this.filterButton = page.getByRole('button', { name: 'filter' });
    this.searchByIdsButton = page.getByRole('button', { name: 'search by ids' });
    this.resourceIdInput = page.getByLabel('resource id');
  }

  async clickSignInKeycloakButton() {
    await this.signInKeycloakButton.click();
  }

  async enterUsername(username: string) {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickSignInButton() {
    await this.signInButton.click();
  }

  async clickManageResourcesSidebarButton() {
    await this.manageResourcesSidebarButton.click();
  }

  async clickFilterButton() {
    await this.filterButton.click();
  }

  async clickSearchByIdsButton() {
    await this.searchByIdsButton.click();
  }

  async enterResourceId(id: string) {
    await this.resourceIdInput.fill(id);
  }

  /** Throws to indicate that a concrete locator for the first row ID is not available in the inventory. */
  getFirstRowIdLocator(): Locator {
    throw new Error('UNRESOLVED: first row ID locator');
  }
}