import { Given, Then, When } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../../../support/world';
import { FormUploadPage } from '../../../../../pages/GCU/Form/form-uploadPage/form-upload.page';
import { getEnvConfig } from '../../../../../support/env';
import { expect } from '@playwright/test';

Given('the user is on the login page for form-upload',
  async function (this: ICustomWorld) {
    const page = new FormUploadPage(this.page!);
    await page.navigateToLogin();
  });

When('the user enters valid credentials for form-upload',
  async function (this: ICustomWorld) {
    const env = getEnvConfig();
    if (!env.username || !env.password) {
      throw new Error('username/password not configured in environment profile');
    }
    const page = new FormUploadPage(this.page!);
    await page.enterCredentials(env.username, env.password);
  });

When('the user clicks the "Sign In" button for form-upload',
  async function (this: ICustomWorld) {
    const page = new FormUploadPage(this.page!);
    await page.clickSignIn();
  });

When('the user clicks the "+" icon for form-upload',
  async function (this: ICustomWorld) {
    const page = new FormUploadPage(this.page!);
    await page.clickPlusIcon();
  });

When('the user clicks the "Add" button in the "Attachment Information" section for form-upload',
  async function (this: ICustomWorld) {
    const page = new FormUploadPage(this.page!);
    await page.clickAddButton();
  });

When('the user uploads the {string} document to the {string} file input for form-upload',
  async function (this: ICustomWorld, businessLabel: string, fieldName: string) {
    const bindingKey = businessLabel.toLowerCase().replace(/\\s+/g, '-');
    const page = new FormUploadPage(this.page!);
    await page.uploadAttachment(bindingKey);
    (this.scenarioVars ?? {})['uploadedDocument'] = bindingKey;
  });

Then('the file should be uploaded successfully for form-upload',
  async function (this: ICustomWorld) {
    const page = new FormUploadPage(this.page!);
    await page.verifyUploadSuccess();
  });