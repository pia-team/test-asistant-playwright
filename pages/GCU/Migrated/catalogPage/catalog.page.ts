import { Page, Locator } from '@playwright/test';

export class CatalogPage {
  readonly page: Page;
  readonly mainCategoryDropdown: Locator;
  readonly subCategoryDropdown: Locator;
  readonly searchButton: Locator;
  readonly productList: Locator;
  readonly productItem: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainCategoryDropdown = page.getByRole('combobox', { name: /main category/i });
    this.subCategoryDropdown = page.getByRole('combobox', { name: /sub category/i });
    this.searchButton = page.getByRole('button', { name: /search/i });
    this.productList = page.getByRole('list', { name: /products/i });
    this.productItem = page.getByRole('listitem');
  }

  async selectMainCategory(category: string): Promise<void> {
    await this.mainCategoryDropdown.click();
    const option = this.page.getByRole('option', { name: new RegExp(category, 'i') });
    await option.click();
  }

  async selectSubCategory(category: string): Promise<void> {
    await this.subCategoryDropdown.click();
    const option = this.page.getByRole('option', { name: new RegExp(category, 'i') });
    await option.click();
  }

  async clickSearch(): Promise<void> {
    await this.searchButton.click();
  }

  async selectProduct(productName: string): Promise<void> {
    const product = this.page.getByRole('listitem', { name: new RegExp(productName, 'i') });
    await product.click();
  }

  async isProductListVisible(): Promise<boolean> {
    return await this.productList.isVisible();
  }
}