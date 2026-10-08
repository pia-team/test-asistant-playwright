import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../../../support/world';
import { getEnvConfig } from '../../../../../support/env';
import { expect } from '@playwright/test';
import { uniqueFromPattern } from '../../../../../support/uniqueValue';
import { CreateImsi2Page } from '../../../../../pages/ORANGE/IMSI/create-imsi-2Page/create-imsi-2.page';

Given('the user is on the login page for create-imsi-2', async function (this: ICustomWorld) {
  const page = new CreateImsi2Page(this.page!);
  await page.navigateToLoginPage();
});

When('the user clicks the {string} button for create-imsi-2', async function (this: ICustomWorld, label: string) {
  const page = new CreateImsi2Page(this.page!);
  if (label === 'Sign in with Keycloak') {
    await page.clickSignInWithKeycloak();
  } else if (label === 'Sign In') {
    await page.clickSignIn();
  } else {
    throw new Error(`Unsupported button label: ${label}`);
  }
});

When('the user enters valid credentials for create-imsi-2', async function (this: ICustomWorld) {
  const env = getEnvConfig();
  if (!env.username || !env.password) {
    throw new Error('username/password not configured in environment profile');
  }
  const page = new CreateImsi2Page(this.page!);
  await page.enterCredentials(env.username, env.password);
});

When('the user checks the element with test id {string} for create-imsi-2', async function (this: ICustomWorld, testId: string) {
  const page = new CreateImsi2Page(this.page!);
  if (testId === 'order-create-action-create') {
    await page.checkCreateAction();
  } else if (testId === 'order-create-category-IMSI') {
    await page.checkCategoryImsi();
  } else {
    throw new Error(`Unsupported test id for check action: ${testId}`);
  }
});

When('the user clicks the element with test id {string} for create-imsi-2', async function (this: ICustomWorld, testId: string) {
  const page = new CreateImsi2Page(this.page!);
  if (testId === 'sidebar-nav-item-create-order') {
    await page.clickCreateResources();
  } else if (testId === 'order-create-next-button') {
    await page.clickNext();
  } else if (testId === 'prepare-file-submit') {
    await page.clickSubmit();
  } else {
    throw new Error(`Unsupported test id for click action: ${testId}`);
  }
});

When('the user enters {string} into the element with test id {string} for create-imsi-2', async function (this: ICustomWorld, value: string, testId: string) {
  const page = new CreateImsi2Page(this.page!);
  if (testId === 'prepare-file-itemcount-0') {
    await page.enterItemCount(value);
  } else {
    throw new Error(`Unsupported test id for enter action: ${testId}`);
  }
});

When('the user enters a unique value matching the pattern {string} into the element with test id {string} for create-imsi-2', async function (this: ICustomWorld, pattern: string, testId: string) {
  const value = uniqueFromPattern(pattern);
  (this.scenarioVars ?? {})['imsiStart'] = value;
  const page = new CreateImsi2Page(this.page!);
  if (testId === 'prepare-file-imsiStart-0') {
    await page.enterImsiStart(value);
  } else {
    throw new Error(`Unsupported test id for unique value entry: ${testId}`);
  }
});

Then('the user should see {string} for create-imsi-2', async function (this: ICustomWorld, text: string) {
  const page = new CreateImsi2Page(this.page!);
  if (text === 'Resource pool created') {
    await page.verifyResourcePoolCreated();
  } else {
    throw new Error(`Unsupported text assertion: ${text}`);
  }
});