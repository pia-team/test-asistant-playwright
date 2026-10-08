import type { ICustomWorld } from '../../../../../support/world';
import { CheckImsiResourcePage } from '../../../../../pages/ORANGE/Create/check_imsi_resourcePage/check_imsi_resource.page';
import { LoginPage } from '../../../../../pages/ORANGE/Login/loginPage/login.page';
import { getEnvConfig } from '../../../../../support/env';
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given('the user is on the login page for check_imsi_resource', async function (this: ICustomWorld) {
  const loginPage = new LoginPage(this.page!);
  const env = getEnvConfig();
  await this.page!.goto(env.baseLoginUrl);
});

When('the user clicks the "Sign in with Keycloak" button for check_imsi_resource', async function (this: ICustomWorld) {
  const loginPage = new LoginPage(this.page!);
  await loginPage.clickKeycloakEntry();
});

When('the user enters valid credentials for check_imsi_resource', async function (this: ICustomWorld) {
  const loginPage = new LoginPage(this.page!);
  const env = getEnvConfig();
  if (!env.username || !env.password) {
    throw new Error('username/password not configured in environment profile');
  }
  await loginPage.enterCredentials(env.username, env.password);
});

When('the user clicks the "Sign In" button for check_imsi_resource', async function (this: ICustomWorld) {
  const loginPage = new LoginPage(this.page!);
  await loginPage.clickSignIn();
});

When('the user clicks the element with test id "sidebar-nav-item-inventory-pools" for check_imsi_resource', async function (this: ICustomWorld) {
  const checkImsiResourcePage = new CheckImsiResourcePage(this.page!);
  await checkImsiResourcePage.clickInventoryPoolsNav();
});

When('the user clicks the element with test id "inventory-pools-pooled-mode-resource-id" for check_imsi_resource', async function (this: ICustomWorld) {
  const checkImsiResourcePage = new CheckImsiResourcePage(this.page!);
  await checkImsiResourcePage.clickPooledModeResourceId();
});

When('the user enters {string} into the element with test id {string} for check_imsi_resource', async function (
  this: ICustomWorld,
  value: string,
  _testId: string,
) {
  const checkImsiResourcePage = new CheckImsiResourcePage(this.page!);
  await checkImsiResourcePage.enterResourceId(value);
});

When('the user clicks the element with test id "inventory-pools-filter-apply" for check_imsi_resource', async function (this: ICustomWorld) {
  const checkImsiResourcePage = new CheckImsiResourcePage(this.page!);
  await checkImsiResourcePage.clickApplyFilter();
});