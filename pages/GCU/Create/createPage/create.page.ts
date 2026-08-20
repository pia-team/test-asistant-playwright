import { Page, Locator } from '@playwright/test';
import { getEnvConfig } from '../../../../support/env';

export class CreatePage {
  private readonly page: Page;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly signInButton: Locator;
  private readonly createIndividualCustomerButton: Locator;
  private readonly identificationNumberInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.signInButton = page.locator('button[type=submit]');
    this.createIndividualCustomerButton = page.getByRole('button', { name: /create individual customer/i });
    this.identificationNumberInput = page.getByLabel(/identification number/i).or(page.getByPlaceholder(/identification number/i));
  }

  async navigate(): Promise<void> {
    const env = getEnvConfig();
    if (!env.baseLoginUrl) {
      throw new Error('baseLoginUrl not configured in environment profile');
    }
    await this.page.goto(env.baseLoginUrl, { timeout: 30000 });
    await this.page.waitForLoadState('networkidle');
  }

  async enterCredentials(username: string, password: string): Promise<void> {
    await this.usernameInput.waitFor({ state: 'visible', timeout: 30000 });
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
  }

  async clickSignIn(): Promise<void> {
    await this.signInButton.waitFor({ state: 'visible', timeout: 30000 });
    await this.signInButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickCreateIndividualCustomer(): Promise<void> {
    await this.createIndividualCustomerButton.waitFor({ state: 'visible', timeout: 30000 });
    await this.createIndividualCustomerButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickIdentificationNumber(): Promise<void> {
    await this.identificationNumberInput.waitFor({ state: 'visible', timeout: 30000 });
    await this.identificationNumberInput.click();
  }

  async enterIdentificationNumber(id: string): Promise<void> {
    await this.identificationNumberInput.fill(id);
  }

  async getIdentificationNumberValue(): Promise<string | null> {
    return await this.identificationNumberInput.inputValue();
  }
}