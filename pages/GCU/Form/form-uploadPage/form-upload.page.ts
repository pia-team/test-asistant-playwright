import { Page, Locator, expect } from '@playwright/test';
import { getEnvConfig } from '../../../../support/env';
import { uploadDocument } from '../../../../support/fileUpload';
import { testData } from '../../../../support/testData';

export class FormUploadPage {
  private readonly page: Page;
  
  // Login page locators (from MCP hints for /login route)
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly signInButton: Locator;
  
  // Customer360 page locators (from MCP hints for /customer360/:id route)
  private readonly plusIcon: Locator;
  private readonly addButton: Locator;
  private readonly attachmentFileInput: Locator;
  private readonly uploadSuccessIndicator: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Login page locators
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.signInButton = page.locator('#kc-login');
    
    // Customer360 page locators - using semantic fallbacks for MISSING elements
    this.plusIcon = page.getByText('+', { exact: true });
    this.addButton = page.getByRole('button', { name: 'Add' });
    this.attachmentFileInput = page.locator('input[type="file"]');
    this.uploadSuccessIndicator = page.getByText(/uploaded successfully|upload complete/i);
  }

  async navigateToLogin(): Promise<void> {
    const env = getEnvConfig();
    await this.page.goto(env.baseLoginUrl);
  }

  async enterCredentials(username: string, password: string): Promise<void> {
    await this.usernameInput.waitFor({ state: 'visible', timeout: 30000 });
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
  }

  async clickSignIn(): Promise<void> {
    await this.signInButton.waitFor({ state: 'visible', timeout: 30000 });
    await this.signInButton.click();
  }

  async clickPlusIcon(): Promise<void> {
    await this.plusIcon.waitFor({ state: 'visible', timeout: 30000 });
    await this.plusIcon.click();
  }

  async clickAddButton(): Promise<void> {
    await this.addButton.waitFor({ state: 'visible', timeout: 30000 });
    await this.addButton.click();
  }

  async uploadAttachment(bindingKey: string): Promise<void> {
    await uploadDocument(this.page, this.attachmentFileInput, bindingKey);
  }

  async verifyUploadSuccess(): Promise<void> {
    await this.uploadSuccessIndicator.waitFor({ state: 'visible', timeout: 30000 });
    await expect(this.uploadSuccessIndicator).toBeVisible();
  }
}