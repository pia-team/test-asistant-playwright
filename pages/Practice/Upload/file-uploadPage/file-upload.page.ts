import { Page, Locator } from '@playwright/test';
import { uploadDocument } from '../../../../support/fileUpload';

export class FileUploadPage {
  private readonly page: Page;
  readonly contactUsLink: Locator;
  readonly chooseFileButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.contactUsLink = page.getByRole('link', { name: ' Contact us' });
    this.chooseFileButton = page.getByRole('button', { name: 'Choose File' });
  }

  async clickContactUsLink(): Promise<void> {
    await this.contactUsLink.click();
  }

  async clickChooseFileButton(): Promise<void> {
    await this.chooseFileButton.click();
  }

  async uploadFile(bindingKey: string): Promise<void> {
    await uploadDocument(this.page, this.chooseFileButton, bindingKey);
  }
}