import { Page, Locator, Response, expect } from '@playwright/test';
import { getEnvConfig } from '../../../../support/env';

export class Phase4aResourceLivePage {
  private readonly page: Page;
  private readonly createResourceButton: Locator;
  private readonly createForm: Locator;
  private readonly resourceNameInput: Locator;
  private readonly createSubmitButton: Locator;
  private readonly searchInput: Locator;
  private readonly searchSubmitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createResourceButton = page.getByTestId('nav-create');
    this.createForm = page.getByTestId('create-form');
    this.resourceNameInput = page.getByTestId('resource-name');
    this.createSubmitButton = page.getByTestId('create-submit');
    this.searchInput = page.getByLabel('Resource ID');
    this.searchSubmitButton = page.getByTestId('search-submit');
  }

  async navigateToResources(): Promise<void> {
    const env = getEnvConfig();
    if (!env.baseLoginUrl) {
      throw new Error('baseUrl is not configured in the environment profile');
    }
    await this.page.goto(`${env.baseLoginUrl}/resources`);
    await this.createResourceButton.waitFor({ timeout: 30000 });
  }

  async clickCreateResource(): Promise<void> {
    await this.createResourceButton.waitFor({ timeout: 30000 });
    await this.createResourceButton.click();
    await this.createForm.waitFor({ timeout: 30000 });
  }

  async enterResourceName(name: string): Promise<void> {
    await this.resourceNameInput.waitFor({ timeout: 30000 });
    await this.resourceNameInput.fill(name);
  }

  async submitCreateForm(): Promise<Response> {
    await this.createSubmitButton.waitFor({ timeout: 30000 });
    const responsePromise = this.page.waitForResponse(
      response =>
        response.request().method() === 'POST' &&
        response.url().includes('/api/resources') &&
        response.status() >= 200 &&
        response.status() < 300,
      { timeout: 30000 }
    );
    await this.createSubmitButton.click();
    return await responsePromise;
  }

  async searchByResourceId(id: string): Promise<void> {
    await this.searchInput.waitFor({ timeout: 30000 });
    await this.searchInput.fill(id);
    await this.searchSubmitButton.click();
  }

  async verifySearchResultContains(name: string, id: string): Promise<void> {
    const nameLocator = this.page.getByText(name, { exact: false }).first();
    const idLocator = this.page.getByText(id, { exact: true }).first();
    await expect(nameLocator).toBeVisible({ timeout: 30000 });
    await expect(idLocator).toBeVisible({ timeout: 30000 });
  }
}