import { Page, Locator, expect, Response } from '@playwright/test';

export class Phase4aResourceLivePage {
  private readonly page: Page;
  private readonly createResourceLink: Locator;
  private readonly createForm: Locator;
  private readonly resourceNameInput: Locator;
  private readonly createSubmitButton: Locator;
  private readonly createStatus: Locator;
  private readonly resourceIdSearchInput: Locator;
  private readonly searchSubmitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createResourceLink = page.getByTestId('nav-create');
    this.createForm = page.getByTestId('create-form');
    this.resourceNameInput = page.getByTestId('resource-name');
    this.createSubmitButton = page.getByTestId('create-submit');
    this.createStatus = page.getByTestId('create-status');
    this.resourceIdSearchInput = page.getByLabel('Resource ID');
    this.searchSubmitButton = page.getByTestId('search-submit');
  }

  async gotoResources(): Promise<void> {
    await this.page.goto('http://127.0.0.1:8799/resources');
    await expect(this.searchSubmitButton).toBeVisible({ timeout: 30000 });
  }

  async openCreateResource(): Promise<void> {
    await this.createResourceLink.click();
    await this.page.waitForURL('**/resources/new', { timeout: 30000 });
    await expect(this.createForm).toBeVisible({ timeout: 30000 });
  }

  async enterResourceName(name: string): Promise<void> {
    await this.resourceNameInput.fill(name);
  }

  async clickCreateSubmit(): Promise<void> {
    await this.createSubmitButton.click();
  }

  async waitForCreateResponse(): Promise<Response> {
    return this.page.waitForResponse(
      r => r.request().method() === 'POST' && r.url().includes('/api/resources') && r.ok(),
      { timeout: 30000 }
    );
  }

  async gotoResourcesSearch(): Promise<void> {
    await this.page.goto('http://127.0.0.1:8799/resources');
    await expect(this.resourceIdSearchInput).toBeVisible({ timeout: 30000 });
  }

  async enterResourceId(id: string): Promise<void> {
    await this.resourceIdSearchInput.fill(id);
  }

  async submitSearch(): Promise<void> {
    await this.searchSubmitButton.click();
  }

  async verifySearchResultContainsResourceId(resourceId: string): Promise<void> {
    const result = this.page.getByText(resourceId).first();
    await expect(result).toBeVisible({ timeout: 30000 });
  }
}