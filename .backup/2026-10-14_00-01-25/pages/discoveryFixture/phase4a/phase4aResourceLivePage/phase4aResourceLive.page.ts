import { Page, Locator, expect } from '@playwright/test';
import { getEnvConfig } from '../../../../support/env';

export class Phase4aResourceLivePage {
  private readonly page: Page;
  private readonly createResourceNav: Locator;
  private readonly resourceNameInput: Locator;
  private readonly createSubmit: Locator;
  private readonly searchIdInput: Locator;
  private readonly searchSubmit: Locator;
  private readonly resourceRow: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createResourceNav = page.getByTestId('nav-create');
    this.resourceNameInput = page.getByTestId('resource-name');
    this.createSubmit = page.getByTestId('create-submit');
    this.searchIdInput = page.getByTestId('search-id');
    this.searchSubmit = page.getByTestId('search-submit');
    this.resourceRow = page.getByTestId('resource-row');
  }

  async navigateToResourcesPage(): Promise<void> {
    const loginUrl = getEnvConfig().baseLoginUrl;
    if (!loginUrl) {
      throw new Error('baseLoginUrl is not configured in environment profile');
    }
    await this.page.goto(loginUrl);
    await this.page.waitForLoadState('networkidle');
    await this.createResourceNav.waitFor({ state: 'visible', timeout: 30000 });
  }

  async clickCreateResource(): Promise<void> {
    await this.createResourceNav.click();
  }

  async enterResourceName(name: string): Promise<void> {
    await this.resourceNameInput.fill(name);
  }

  async submitCreateAndCaptureId(): Promise<string> {
    const responsePromise = this.page.waitForResponse(
      response =>
        response.request().method() === 'POST' &&
        response.url().includes('/api/resources') &&
        response.status() === 201,
      { timeout: 30000 }
    );
    await this.createSubmit.click();
    const response = await responsePromise;
    const body = await response.json();
    if (typeof body.id !== 'string') {
      throw new Error(`Expected POST /api/resources response to contain string "id", received: ${JSON.stringify(body)}`);
    }
    return body.id;
  }

  async searchResourceById(resourceId: string): Promise<void> {
    await this.searchIdInput.fill(resourceId);
    await this.searchSubmit.click();
    await this.page.waitForLoadState('networkidle');
  }

  async assertResourceVisible(resourceId: string, resourceName: string): Promise<void> {
    const row = this.resourceRow
      .filter({ hasText: resourceId })
      .filter({ hasText: resourceName });
    await expect(row).toBeVisible({ timeout: 30000 });
  }
}