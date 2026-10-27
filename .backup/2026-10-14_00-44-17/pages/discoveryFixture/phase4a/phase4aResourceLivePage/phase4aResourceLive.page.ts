import { Page, Locator, expect } from '@playwright/test';
import { getEnvConfig } from '../../../../support/env';

export class Phase4aResourceLivePage {
  private readonly page: Page;
  private readonly createResourceNav: Locator;
  private readonly resourceNameInput: Locator;
  private readonly createSubmit: Locator;
  private readonly resourceIdInput: Locator;
  private readonly searchSubmit: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createResourceNav = page.getByTestId('nav-create');
    this.resourceNameInput = page.getByTestId('resource-name');
    this.createSubmit = page.getByTestId('create-submit');
    this.resourceIdInput = page.getByRole('textbox', { name: 'Resource ID' });
    this.searchSubmit = page.getByTestId('search-submit');
  }

  async navigateToResources(): Promise<void> {
    const baseUrl = getEnvConfig().baseLoginUrl;
    await this.page.goto(new URL('/resources', baseUrl).toString());
  }

  async clickCreateResource(): Promise<void> {
    await this.createResourceNav.click();
  }

  async enterResourceName(name: string): Promise<void> {
    await this.resourceNameInput.fill(name);
  }

  async submitCreateAndCaptureId(): Promise<string> {
    const createResponsePromise = this.page.waitForResponse(
      response =>
        response.request().method() === 'POST' &&
        response.url().includes('/api/resources') &&
        response.ok(),
      { timeout: 30000 }
    );

    await this.createSubmit.click();
    const response = await createResponsePromise;
    const body = await response.json();
    const resourceId = body?.id;

    if (!resourceId) {
      throw new Error(
        `Resource id not found in POST /api/resources response. Response body: ${JSON.stringify(body)}`
      );
    }

    return String(resourceId);
  }

  async enterSearchResourceId(id: string): Promise<void> {
    await this.resourceIdInput.fill(id);
  }

  async clickSearch(): Promise<void> {
    await this.searchSubmit.click();
  }

  async expectSearchResultContainsResource(resourceId: string, resourceName: string): Promise<void> {
    const results = this.page.locator('body');
    await expect(results).toContainText(resourceId);
    await expect(results).toContainText(resourceName);
  }
}