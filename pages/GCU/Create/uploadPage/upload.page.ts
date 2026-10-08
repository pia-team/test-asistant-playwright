import { Page, Locator, expect } from '@playwright/test';
import { getEnvConfig } from '../../../../support/env';
import { uploadDocument } from '../../../../support/fileUpload';

export class UploadPage {
  private readonly page: Page;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly signInButton: Locator;
  private readonly createPartnerLink: Locator;
  private readonly organizationSearchInput: Locator;
  private readonly searchButton: Locator;
  private readonly organizationOption: Locator;
  private readonly nextButton: Locator;
  private readonly addDocumentButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.signInButton = page.locator('#kc-login');
    this.createPartnerLink = page.getByRole('link', { name: 'add Create Partner' });
    this.organizationSearchInput = page.getByTestId('organizationSearch');
    this.searchButton = page.getByRole('button').filter({ hasText: 'search' });
    this.organizationOption = page.getByRole('option', { name: 'ANGULARYIRMI ORGANIZATION' });
    this.nextButton = page.getByTestId('next-button');
    this.addDocumentButton = page.getByTestId('add-document-button');
  }

  async navigate(): Promise<void> {
    const env = getEnvConfig();
    await this.page.goto(env.baseLoginUrl);
  }

  async enterCredentials(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
  }

  async clickSignIn(): Promise<void> {
    await this.signInButton.click();
  }

  async clickCreatePartner(): Promise<void> {
    await this.createPartnerLink.click();
  }

  async clickOrganizationSearch(): Promise<void> {
    await this.organizationSearchInput.click();
  }

  async fillOrganizationSearch(value: string): Promise<void> {
    await this.organizationSearchInput.fill(value);
  }

  async clickSearchButton(): Promise<void> {
    await this.searchButton.click();
  }

  async selectOrganizationOption(): Promise<void> {
    await this.organizationOption.click();
  }

  async clickNextButton(): Promise<void> {
    await this.nextButton.click();
  }

  async clickAddDocumentButton(): Promise<void> {
    await this.addDocumentButton.click();
  }

  async uploadDocument(bindingKey: string): Promise<void> {
    await uploadDocument(this.page, this.addDocumentButton, bindingKey);
  }
}