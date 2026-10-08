import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../../../support/world';
import { CreateImsiResourcePage } from '../../../../../pages/ORANGE/Create/create_imsi_resourcePage/create_imsi_resource.page';
import { LoginPage } from '../../../../../pages/ORANGE/Login/loginPage/login.page';
import { uniqueFromPattern } from '../../../../../support/uniqueValue';
import { getEnvConfig } from '../../../../../support/env';
import { expect } from '@playwright/test';

Given('the user is on the login page for create_imsi_resource', async function (this: ICustomWorld) {
  const loginPage = new LoginPage(this.page!);
  await loginPage.navigate();
});

When('the user clicks the "Sign in with Keycloak" button for create_imsi_resource', async function (this: ICustomWorld) {
  const loginPage = new LoginPage(this.page!);
  await loginPage.clickKeycloakEntry();
});

When('the user enters valid credentials for create_imsi_resource', async function (this: ICustomWorld) {
  const env = getEnvConfig();
  if (!env.username || !env.password) {
    throw new Error('username/password not configured in environment profile');
  }
  const loginPage = new LoginPage(this.page!);
  await loginPage.enterCredentials(env.username, env.password);
});

When('the user clicks the "Sign In" button for create_imsi_resource', async function (this: ICustomWorld) {
  const loginPage = new LoginPage(this.page!);
  await loginPage.clickSignIn();
});

When('the user clicks the element with test id "sidebar-nav-item-create-order" for create_imsi_resource', async function (this: ICustomWorld) {
  const imsPage = new CreateImsiResourcePage(this.page!);
  await imsPage.clickSidebarCreateOrder();
});

When('the user checks the element with test id "order-create-action-create" for create_imsi_resource', async function (this: ICustomWorld) {
  const imsPage = new CreateImsiResourcePage(this.page!);
  await imsPage.checkActionCreate();
});

When('the user checks the element with test id "order-create-category-IMSI" for create_imsi_resource', async function (this: ICustomWorld) {
  const imsPage = new CreateImsiResourcePage(this.page!);
  await imsPage.checkCategoryImsi();
});

When('the user clicks the element with test id "order-create-next-button" for create_imsi_resource', async function (this: ICustomWorld) {
  const imsPage = new CreateImsiResourcePage(this.page!);
  await imsPage.clickNext();
});

When('the user enters "10000" into the element with test id "prepare-file-itemcount-0" for create_imsi_resource', async function (this: ICustomWorld) {
  const imsPage = new CreateImsiResourcePage(this.page!);
  await imsPage.enterItemCount('10000');
});

When('the user enters a unique value matching the pattern "543############" into the element with test id "prepare-file-imsiStart-0" for create_imsi_resource', async function (this: ICustomWorld) {
  const pattern = "543############";
  const value = uniqueFromPattern(pattern);
  (this.scenarioVars ?? {})['imsiStart'] = value;
  const imsPage = new CreateImsiResourcePage(this.page!);
  await imsPage.enterImsiStart(value);
});

When('the user clicks the element with test id "prepare-file-submit" for create_imsi_resource', async function (this: ICustomWorld) {
  const imsPage = new CreateImsiResourcePage(this.page!);
  await imsPage.clickSubmitFile();
});

Then('the user should see "Resource pool created" for create_imsi_resource', async function (this: ICustomWorld) {
  const imsPage = new CreateImsiResourcePage(this.page!);
  await imsPage.verifySuccessMessage();
});