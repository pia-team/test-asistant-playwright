import { Page, Locator } from '@playwright/test';

export class ShoppingCartPage {
  readonly page: Page;
  readonly checkoutButton: Locator;
  readonly productCountDisplay: Locator;
  readonly statusField: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.getByRole('button', { name: /checkout/i });
    this.productCountDisplay = page.getByTestId('product-count');
    this.statusField = page.getByLabel(/status/i);
    this.successMessage = page.getByText(/successfully submitted/i);
  }

  async clickCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async isCheckoutSuccessVisible(): Promise<boolean> {
    return await this.successMessage.isVisible();
  }

  async getStatus(): Promise<string> {
    return await this.statusField.inputValue();
  }
}