import { Page, Locator, expect } from '@playwright/test';
import { getEnvConfig } from '../../../../support/env';

export class Phase4aResourceLivePage {
  private readonly page: Page;
  private readonly createResourceNav: Locator;
  private readonly resourceNameInput: Locator;
  private readonly createSubmit: Locator;
  private readonly searchInput: Locator;
  private readonly searchSubmit: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createResourceNav = page.getByTestId('nav-create');
    this.resourceNameInput = page.getByTestId('resource-name');
    this.createSubmit = page.getByTestId('create-submit');
    this.searchInput = page.getByLabel('Resource ID');
    this.searchSubmit = page.getByTestId('search-submit');
  }

  async navigateToResources(): Promise<void> {
    await this.page.goto(getEnvConfig().baseLoginUrl);
    await expect(this.createResourceNav).toBeVisible({ timeout: 30000 });
  }

  async clickCreateResource(): Promise<void> {
    await expect(this.createResourceNav).toBeVisible({ timeout: 30000 });
    await this.createResourceNav.click();
    await expect(this.resourceNameInput).toBeVisible({ timeout: 30000 });
  }

  async enterResourceName(name: string): Promise<void> {
    await expect(this.resourceNameInput).toBeVisible({ timeout: 30000 });
    await this.resourceNameInput.fill(name);
  }

  async clickCreateAndCaptureId(): Promise<string> {
    await expect(this.createSubmit).toBeVisible({ timeout: 30000 });
    const createResponsePromise = this.page.waitForResponse(
      r =>
        r.request().method() === 'POST' &&
        r.url().includes('/api/resources') &&
        r.status() >= 200 &&
        r.status() < 300
    );
    await this.createSubmit.click();
    const createResponse = await createResponsePromise;
    const body = await createResponse.json();
    const resourceId = body?.id;
    if (!resourceId) {
      throw new Error('POST /api/resources response did not contain an id field');
    }
    return String(resourceId);
  }

  async enterSearchResourceId(resourceId: string): Promise<void> {
    await expect(this.searchInput).toBeVisible({ timeout: 30000 });
    await this.searchInput.fill(resourceId);
  }

  async clickSearch(): Promise<void> {
    await expect(this.searchSubmit).toBeVisible({ timeout: 30000 });
    await this.searchSubmit.click();
  }

  async verifySearchResult(resourceId: string, resourceName: string): Promise<void> {
    const resultRow = this.page
      .getByRole('row')
      .filter({ hasText: resourceId })
      .filter({ hasText: resourceName });
    await expect(resultRow).toBeVisible({ timeout: 30000 });
  }
}