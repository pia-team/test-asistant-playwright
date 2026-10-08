import { Page, Locator } from '@playwright/test';

export class ProductOfferingPage {
  readonly page: Page;
  readonly addToCartButton: Locator;
  readonly cartIcon: Locator;
  readonly invoicingFrequencyDropdown: Locator;
  readonly quantityIncrementButton: Locator;
  readonly addAddonButton: Locator;
  readonly productDetailsPanel: Locator;
  readonly totalPriceDisplay: Locator;
  readonly keepButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = page.getByRole('button', { name: /add to cart/i });
    this.cartIcon = page.getByRole('button', { name: /cart|add/i });
    this.invoicingFrequencyDropdown = page.getByRole('combobox', { name: /invoicing frequency/i });
    this.quantityIncrementButton = page.getByRole('button', { name: /increment|\+/i });
    this.addAddonButton = page.getByRole('button', { name: /add icon|add addon/i });
    this.productDetailsPanel = page.getByRole('complementary', { name: /product details/i });
    this.totalPriceDisplay = page.getByTestId('total-price');
    this.keepButton = page.getByRole('button', { name: /keep/i });
  }

  async clickInvoicingFrequencyDropdown(productName: string): Promise<void> {
    const dropdown = this.page.locator(`[data-product="${productName}"]`).getByRole('combobox', { name: /invoicing frequency/i });
    await dropdown.click();
  }

  async selectDropdownOption(option: string): Promise<void> {
    const optionElement = this.page.getByRole('option', { name: new RegExp(option, 'i') });
    await optionElement.click();
  }

  async clickCartIcon(productName: string): Promise<void> {
    const cartIcon = this.page.locator(`[data-product="${productName}"]`).getByRole('button', { name: /cart|add/i });
    await cartIcon.click();
  }

  async incrementQuantity(productName: string, times: string): Promise<void> {
    for (let i = 0; i < parseInt(times); i++) {
      const incrementBtn = this.page.locator(`[data-product="${productName}"]`).getByRole('button', { name: /increment|\+/i });
      await incrementBtn.click();
    }
  }

  async decideToAddAddon(productName: string, decision: string): Promise<void> {
    const decisionBtn = this.page.locator(`[data-product="${productName}"]`).getByRole('button', { name: decision === 'true' ? /yes|add/i : /no|cancel/i });
    await decisionBtn.click();
  }

  async clickAddToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async clickKeep(): Promise<void> {
    await this.keepButton.click();
  }

  async getTotalPrice(): Promise<string> {
    return await this.totalPriceDisplay.textContent() || '';
  }
}