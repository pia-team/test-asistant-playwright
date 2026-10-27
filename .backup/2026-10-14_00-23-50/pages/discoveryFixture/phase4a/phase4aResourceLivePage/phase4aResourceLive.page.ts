import { Page, Locator, expect } from '@playwright/test';
import { getEnvConfig } from '../../../../support/env';

export class Phase4aResourceLivePage {
  private readonly page: Page;
  private readonly createResourceLink: Locator;
  private readonly createForm: Locator;
  private readonly resourceNameInput: Locator;
  private readonly createSubmitButton: Locator;
  private readonly searchInput: Locator;
  private readonly searchSubmitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createResourceLink = page.getByTestId('nav-create');
    this.createForm = page.getByTestId('create-form');
    this.resourceNameInput = page.getByTestId('resource-name');
    this.createSubmitButton = page.getByTestId('create-submit');
    this.searchInput = page.getByLabel('Resource ID');
    this.searchSubmitButton = page.getByTestId('search-submit');
  }

  private getAppBaseUrl(): string {
    const env = getEnvConfig();
    if (!env.baseLoginUrl) {
      throw new Error('baseLoginUrl is not configured in environment profile');
    }
    return new URL(env.baseLoginUrl).origin;
  }

  private async gotoResourcesPage(): Promise<void> {
    await this.page.goto(`${this.getAppBaseUrl()}/resources`);
    await this.page.waitForLoadState('networkidle');
  }

  async openResourcesPage(): Promise<void> {
    await this.gotoResourcesPage();
    await this.createResourceLink.waitFor({ state: 'visible', timeout: 30000 });
  }

  async startCreateResource(): Promise<void> {
    await this.createResourceLink.click();
    await this.page.waitForURL('**/resources/new');
    await this.createForm.waitFor({ state: 'visible', timeout: 30000 });
  }

  async enterResourceName(name: string): Promise<void> {
    await this.resourceNameInput.fill(name);
  }

  async submitCreateAndCaptureId(): Promise<string> {
    const createRespPromise = this.page.waitForResponse(
      r =>
        r.request().method() === 'POST' &&
        r.url().includes('/api/resources') &&
        r.status() >= 200 &&
        r.status() < 300,
      { timeout: 30000 }
    );

    await this.createSubmitButton.click();
    const createResp = await createRespPromise;

    let json: any;
    try {
      json = await createResp.json();
    } catch {
      throw new Error('POST /api/resources response could not be parsed as JSON');
    }

    const id = json?.id;
    if (id === undefined || id === null) {
      throw new Error(
        `Resource id not found in POST /api/resources response. Available top-level fields: ${Object.keys(json || {}).join(', ')}`
      );
    }

    return String(id);
  }

  async navigateToResourcesPage(): Promise<void> {
    await this.gotoResourcesPage();
    await this.searchInput.waitFor({ state: 'visible', timeout: 30000 });
  }

  async searchByResourceId(id: string): Promise<void> {
    await this.searchInput.fill(id);
    await this.searchSubmitButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifySearchResult(resourceName: string): Promise<void> {
    const result = this.page.getByText(resourceName).first();
    await expect(result).toBeVisible({ timeout: 30000 });
  }
}