import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../../../support/world';
import { UploadPage } from '../../../../../pages/GCU/Create/uploadPage/upload.page';
import { getEnvConfig } from '../../../../../support/env';
import { expect } from '@playwright/test';

Given('I am on the login page for upload', async function (this: ICustomWorld) {
  const page = new UploadPage(this.page!);
  await page.navigate();
});

When('I enter valid credentials for upload', async function (this: ICustomWorld) {
  const env = getEnvConfig();
  if (!env.username || !env.password) {
    throw new Error('username/password not configured in environment profile');
  }
  const page = new UploadPage(this.page!);
  await page.enterCredentials(env.username, env.password);
});

When('I click the "Sign In" button for upload', async function (this: ICustomWorld) {
  const page = new UploadPage(this.page!);
  await page.clickSignIn();
});

When('I click the "Create Partner" link for upload', async function (this: ICustomWorld) {
  const page = new UploadPage(this.page!);
  await page.clickCreatePartner();
});

When('I click the "organizationSearch" textbox for upload', async function (this: ICustomWorld) {
  const page = new UploadPage(this.page!);
  await page.clickOrganizationSearch();
});

When('I fill the "organizationSearch" textbox with {string} for upload', async function (this: ICustomWorld, value: string) {
  const page = new UploadPage(this.page!);
  await page.fillOrganizationSearch(value);
});

When('I click the "search" button for upload', async function (this: ICustomWorld) {
  const page = new UploadPage(this.page!);
  await page.clickSearchButton();
});

When('I select the "ANGULARYIRMI ORGANIZATION" option for upload', async function (this: ICustomWorld) {
  const page = new UploadPage(this.page!);
  await page.selectOrganizationOption();
});

When('I click the "next-button" for upload', async function (this: ICustomWorld) {
  const page = new UploadPage(this.page!);
  await page.clickNextButton();
});

When('I click the "add-document-button" for upload', async function (this: ICustomWorld) {
  const page = new UploadPage(this.page!);
  await page.clickAddDocumentButton();
});

When('I upload the {string} document to the {string} file input for upload', async function (this: ICustomWorld, businessLabel: string, fieldName: string) {
  const bindingKey = businessLabel.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const page = new UploadPage(this.page!);
  await page.uploadDocument(bindingKey);
});