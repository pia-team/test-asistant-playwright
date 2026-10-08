import { Page, Locator, expect } from '@playwright/test';
import { getEnvConfig } from '../../../../support/env';

export class CreateImsiResourcePage {
  private readonly page: Page;

  // IMSI Creation Flow Locators
  private readonly sidebarCreateOrder: Locator;
  private readonly actionCreateCheckbox: Locator;
  private readonly categoryImsiCheckbox: Locator;
  private readonly nextButton: Locator;
  private readonly itemCountInput: Locator;
  private readonly imsiStartInput: Locator;
  private readonly submitFileButton: Locator;
  private readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebarCreateOrder = page.getByTestId('sidebar-nav-item-create-order');
    this.actionCreateCheckbox = page.getByTestId('order-create-action-create');
    this.categoryImsiCheckbox = page.getByTestId('order-create-category-IMSI');
    this.nextButton = page.getByTestId('order-create-next-button');
    this.itemCountInput = page.getByTestId('prepare-file-itemcount-0');
    this.imsiStartInput = page.getByTestId('prepare-file-imsiStart-0');
    this.submitFileButton = page.getByTestId('prepare-file-submit');
    this.successMessage = page.getByText('Resource pool created');
  }

  async navigateToBase(): Promise<void> {
    const env = getEnvConfig();
    await this.page.goto(env.baseLoginUrl);
  }

  async clickSidebarCreateOrder(): Promise<void> {
    await this.sidebarCreateOrder.click({ timeout: 30000 });
  }

  async checkActionCreate(): Promise<void> {
    await this.actionCreateCheckbox.waitFor({ state: 'visible', timeout: 30000 });
    await this.actionCreateCheckbox.click({ timeout: 30000 });
  }

  async checkCategoryImsi(): Promise<void> {
    await this.categoryImsiCheckbox.waitFor({ state: 'visible', timeout: 30000 });
    await this.categoryImsiCheckbox.click({ timeout: 30000 });
  }

  async clickNext(): Promise<void> {
    await this.nextButton.click({ timeout: 30000 });
  }

  async enterItemCount(count: string): Promise<void> {
    await this.itemCountInput.fill(count, { timeout: 30000 });
  }

  async enterImsiStart(value: string): Promise<void> {
    await this.imsiStartInput.fill(value, { timeout: 30000 });
  }

  async clickSubmitFile(): Promise<void> {
    await this.submitFileButton.click({ timeout: 30000 });
  }

  async verifySuccessMessage(): Promise<void> {
    await expect(this.successMessage).toBeVisible({ timeout: 30000 });
  }
}