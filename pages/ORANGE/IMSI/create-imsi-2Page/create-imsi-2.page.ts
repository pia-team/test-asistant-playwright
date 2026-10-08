import { Page, Locator, expect } from '@playwright/test';
import { getEnvConfig } from '../../../../support/env';

export class CreateImsi2Page {
  private readonly page: Page;
  private readonly signInWithKeycloakButton: Locator;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly signInButton: Locator;
  private readonly createResourcesNavItem: Locator;
  private readonly createActionRadio: Locator;
  private readonly categoryImsiRadio: Locator;
  private readonly nextButton: Locator;
  private readonly itemCountInput: Locator;
  private readonly imsiStartInput: Locator;
  private readonly submitButton: Locator;
  private readonly resourcePoolCreatedText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signInWithKeycloakButton = page.getByRole('button', { name: 'Sign in with Keycloak' });
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.signInButton = page.locator('#kc-login');
    this.createResourcesNavItem = page.getByTestId('sidebar-nav-item-create-order');
    this.createActionRadio = page.getByTestId('order-create-action-create');
    this.categoryImsiRadio = page.getByTestId('order-create-category-IMSI');
    this.nextButton = page.getByTestId('order-create-next-button');
    this.itemCountInput = page.getByTestId('prepare-file-itemcount-0');
    this.imsiStartInput = page.getByTestId('prepare-file-imsiStart-0');
    this.submitButton = page.getByTestId('prepare-file-submit');
    this.resourcePoolCreatedText = page.getByText('Resource pool created');
  }

  async navigateToLoginPage(): Promise<void> {
    await this.page.goto(getEnvConfig().baseLoginUrl);
  }

  async clickSignInWithKeycloak(): Promise<void> {
    await this.signInWithKeycloakButton.click();
  }

  async enterCredentials(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
  }

  async clickSignIn(): Promise<void> {
    await this.signInButton.click();
  }

  async clickCreateResources(): Promise<void> {
    await this.createResourcesNavItem.click();
  }

  async checkCreateAction(): Promise<void> {
    await this.createActionRadio.check();
  }

  async checkCategoryImsi(): Promise<void> {
    await this.categoryImsiRadio.check();
  }

  async clickNext(): Promise<void> {
    await this.nextButton.click();
  }

  async enterItemCount(value: string): Promise<void> {
    await this.itemCountInput.fill(value);
  }

  async enterImsiStart(value: string): Promise<void> {
    await this.imsiStartInput.fill(value);
  }

  async clickSubmit(): Promise<void> {
    await this.submitButton.click();
  }

  async verifyResourcePoolCreated(): Promise<void> {
    await expect(this.resourcePoolCreatedText).toBeVisible({ timeout: 30000 });
  }
}