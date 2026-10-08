import { Page, Locator } from '@playwright/test';
import { getEnvConfig } from '../../../../support/env';

export class CheckImsiResourcePage {
  private readonly page: Page;
  
  // Inventory Pools Navigation
  private readonly inventoryPoolsNavItem: Locator;
  private readonly pooledModeResourceIdItem: Locator;
  
  // Filters
  private readonly pooledResourceIdFilterInput: Locator;
  private readonly applyFilterButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Initialize locators using test ids as per scenario
    this.inventoryPoolsNavItem = page.getByTestId('sidebar-nav-item-inventory-pools');
    this.pooledModeResourceIdItem = page.getByTestId('inventory-pools-pooled-mode-resource-id');
    this.pooledResourceIdFilterInput = page.getByTestId('inventory-pools-filter-pooledResourceId');
    this.applyFilterButton = page.getByTestId('inventory-pools-filter-apply');
  }

  async navigateToBase(): Promise<void> {
    const env = getEnvConfig();
    await this.page.goto(env.baseLoginUrl);
  }

  async clickInventoryPoolsNav(): Promise<void> {
    await this.inventoryPoolsNavItem.click({ timeout: 30000 });
  }

  async clickPooledModeResourceId(): Promise<void> {
    await this.pooledModeResourceIdItem.waitFor({ state: 'visible', timeout: 30000 });
    await this.pooledModeResourceIdItem.click({ timeout: 30000 });
    await this.pooledResourceIdFilterInput.waitFor({ state: 'visible', timeout: 30000 });
  }

  async enterResourceId(value: string): Promise<void> {
    await this.pooledResourceIdFilterInput.waitFor({ state: 'visible', timeout: 30000 });
    await this.pooledResourceIdFilterInput.fill(value, { timeout: 30000 });
  }

  async clickApplyFilter(): Promise<void> {
    await this.applyFilterButton.click({ timeout: 30000 });
  }
}