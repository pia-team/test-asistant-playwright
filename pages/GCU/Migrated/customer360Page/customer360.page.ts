import { Page, Locator, expect } from '@playwright/test';

export class Customer360Page {
  readonly page: Page;
  readonly searchTypeDropdown: Locator;
  readonly customerIdOption: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly customerResult: Locator;
  readonly accountTab: Locator;
  readonly orderTab: Locator;
  readonly productTab: Locator;
  readonly shoppingCartTab: Locator;
  readonly newOrderButton: Locator;
  readonly goBackButton: Locator;
  readonly customerInteractionTab: Locator;
  readonly addButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchTypeDropdown = page.getByRole('combobox', { name: /search type/i });
    this.customerIdOption = page.getByRole('option', { name: /customer id/i });
    this.searchInput = page.getByRole('textbox', { name: /search/i });
    this.searchButton = page.getByRole('button', { name: /search/i });
    this.customerResult = page.getByRole('listitem').first();
    this.accountTab = page.getByRole('tab', { name: /account/i });
    this.orderTab = page.getByRole('tab', { name: /order/i });
    this.productTab = page.getByRole('tab', { name: /product/i });
    this.shoppingCartTab = page.getByRole('tab', { name: /shopping cart/i });
    this.newOrderButton = page.getByRole('button', { name: /new order/i });
    this.goBackButton = page.getByRole('button', { name: /go back|back/i });
    this.customerInteractionTab = page.getByRole('tab', { name: /customer interaction/i });
    this.addButton = page.getByRole('button', { name: /add/i });
  }

  async goto(): Promise<void> {
    await this.page.goto('/customer360');
  }

  async navigate(): Promise<void> {
    await this.goto();
  }

  async searchByCustomerId(customerId: string): Promise<void> {
    await this.searchTypeDropdown.click();
    await this.customerIdOption.click();
    await this.searchInput.fill(customerId);
    await this.searchButton.click();
  }

  async searchCustomerById(customerId: string): Promise<void> {
    await this.searchByCustomerId(customerId);
  }

  async selectCustomer(): Promise<void> {
    await this.customerResult.click();
  }

  async selectCustomerResult(): Promise<void> {
    await this.selectCustomer();
  }

  async clickTab(tabName: string): Promise<void> {
    const tab = this.page.getByRole('tab', { name: new RegExp(tabName, 'i') });
    await tab.click();
  }

  async clickCustomerInteractionTab(): Promise<void> {
    await this.clickTab('Customer Interaction');
  }

  async verifyCustomerInteractionTabOpened(): Promise<void> {
    await expect(this.customerInteractionTab).toHaveAttribute('aria-selected', 'true');
  }

  async clickAddButton(): Promise<void> {
    await this.addButton.click();
  }

  async clickNewOrder(): Promise<void> {
    await this.newOrderButton.click();
  }

  async clickGoBack(): Promise<void> {
    await this.goBackButton.click();
  }

  async getOrderStatus(): Promise<string> {
    const statusField = this.page.getByLabel(/order status/i);
    return await statusField.inputValue();
  }

  async getProductStatus(): Promise<string> {
    const statusField = this.page.getByLabel(/product status/i);
    return await statusField.inputValue();
  }

  async selectSearchType(type: string): Promise<void> {
    await this.searchTypeDropdown.click();
    const option = this.page.getByRole('option', { name: new RegExp(type, 'i') });
    await option.click();
  }

  async enterSearchTerm(term: string): Promise<void> {
    await this.searchInput.fill(term);
  }

  async clickSearch(): Promise<void> {
    await this.searchButton.click();
  }

  async fetchCustomerData(): Promise<void> {
    // Stub for fetching data
    await this.page.waitForLoadState('networkidle');
  }

  async openCustomerCreatePage(): Promise<void> {
    const createBtn = this.page.getByRole('button', { name: /create.*customer/i });
    await createBtn.click();
  }

  async enterCUI(cui: string): Promise<void> {
    const cuiInput = this.page.getByLabel(/cui/i);
    await cuiInput.fill(cui);
  }

  async clickCuiSearch(): Promise<void> {
    const searchBtn = this.page.getByRole('button', { name: /search/i });
    await searchBtn.click();
  }

  async clickCreateNewCustomer(): Promise<void> {
    const createBtn = this.page.getByRole('button', { name: /create new customer/i });
    await createBtn.click();
  }
}