import { Page, Locator, expect } from '@playwright/test';
import { getEnvConfig } from '../../../../support/env';

export class ManageResourcesPage {
  private readonly page: Page;
  
  // Login page locators (Keycloak)
  private readonly usernameField: Locator;
  private readonly passwordField: Locator;
  private readonly signInButton: Locator;
  
  // Post-login navigation locators
  private readonly manageResourcesNav: Locator;
  
  // Manage Resources page locators
  private readonly filterButton: Locator;
  private readonly resourceIdColumn: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Login page locators (Keycloak /login route)
    this.usernameField = page.locator('#username');
    this.passwordField = page.locator('#password');
    this.signInButton = page.locator('#kc-login');
    
    // Post-login navigation (sidebar)
    this.manageResourcesNav = page.getByTestId('sidebar-nav-item-manage-resources');
    
    // Manage Resources page locators (/ui/stockOrderManagement/manage-resources route)
    this.filterButton = page.getByTestId('resource-table-filter-apply');
    this.resourceIdColumn = page.getByRole('columnheader', { name: 'Resource Id' });
  }

  async navigateToLogin(): Promise<void> {
    const env = getEnvConfig();
    await this.page.goto(env.baseLoginUrl);
  }

  async clickSignInWithKeycloak(): Promise<void> {
    // Note: If the login page is already Keycloak, this step may be skipped
    // Check for Keycloak entry button on portal page
    const keycloakButton = this.page.getByText(/Sign in with Keycloak/i);
    if (await keycloakButton.isVisible().catch(() => false)) {
      await keycloakButton.click();
    }
  }

  async enterCredentials(username: string, password: string): Promise<void> {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
  }

  async clickSignIn(): Promise<void> {
    await this.signInButton.click();
  }

  async clickManageResources(): Promise<void> {
    await this.manageResourcesNav.click();
  }

  async clickFilter(): Promise<void> {
    await this.filterButton.click();
  }

  async verifyResourceIdVisible(): Promise<void> {
    await expect(this.resourceIdColumn).toBeVisible({ timeout: 30000 });
  }
}