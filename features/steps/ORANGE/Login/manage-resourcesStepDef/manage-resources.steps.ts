import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../../../support/world';
import { ManageResourcesPage } from '../../../../../pages/ORANGE/Login/manage-resourcesPage/manage-resources.page';
import { getEnvConfig } from '../../../../../support/env';
import { expect } from '@playwright/test';

Given('the user is on the login page for manage-resources', async function (this: ICustomWorld) {
  const page = new ManageResourcesPage(this.page!);
  await page.navigateToLogin();
});

When('the user clicks the "Sign in with Keycloak" button for manage-resources', async function (this: ICustomWorld) {
  const page = new ManageResourcesPage(this.page!);
  await page.clickSignInWithKeycloak();
});

When('the user enters valid credentials for manage-resources', async function (this: ICustomWorld) {
  const env = getEnvConfig();
  if (!env.username || !env.password) {
    throw new Error('username/password not configured in environment profile');
  }
  const page = new ManageResourcesPage(this.page!);
  await page.enterCredentials(env.username, env.password);
});

When('the user clicks the "Sign In" button for manage-resources', async function (this: ICustomWorld) {
  const page = new ManageResourcesPage(this.page!);
  await page.clickSignIn();
});

When('the user clicks "Manage Resources" for manage-resources', async function (this: ICustomWorld) {
  const page = new ManageResourcesPage(this.page!);
  await page.clickManageResources();
});

When('the user clicks the "Filter" button for manage-resources', async function (this: ICustomWorld) {
  const page = new ManageResourcesPage(this.page!);
  await page.clickFilter();
});

Then('the user should see "Resource Id" in the table for manage-resources', async function (this: ICustomWorld) {
  const page = new ManageResourcesPage(this.page!);
  await page.verifyResourceIdVisible();
});