import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../../../support/world';
import { SimResourcePage } from '../../../../../pages/Orange/resource/sim-resourcePage/sim-resource.page';
import { getEnvConfig } from '../../../../../support/env';

Given('I click "Sign in with Keycloak" button for sim-resource', async function (this: ICustomWorld) {
  const page = new SimResourcePage(this.page!);
  await page.clickSignInWithKeycloak();
});

Given('sign in with keycloak butonuna tıkla for sim-resource', async function (this: ICustomWorld) {
  const page = new SimResourcePage(this.page!);
  await page.clickSignInWithKeycloak();
});

When('username gir for sim-resource', async function (this: ICustomWorld) {
  const env = getEnvConfig();
  if (!env.username) {
    throw new Error('Missing username in environment config');
  }
  const page = new SimResourcePage(this.page!);
  await page.fillUsername(env.username);
});

When('password gir for sim-resource', async function (this: ICustomWorld) {
  const env = getEnvConfig();
  if (!env.password) {
    throw new Error('Missing password in environment config');
  }
  const page = new SimResourcePage(this.page!);
  await page.fillPassword(env.password);
});

When('sign in butonuna tıkla for sim-resource', async function (this: ICustomWorld) {
  const page = new SimResourcePage(this.page!);
  await page.clickSignIn();
});

When('I click "Sign in" button for sim-resource', async function (this: ICustomWorld) {
  const page = new SimResourcePage(this.page!);
  await page.clickSignIn();
});

When('manage resources butonuna tıkla for sim-resource', async function (this: ICustomWorld) {
  const page = new SimResourcePage(this.page!);
  await page.clickManageResources();
});

When('I click "Manage resources" button for sim-resource', async function (this: ICustomWorld) {
  const page = new SimResourcePage(this.page!);
  await page.clickManageResources();
});

When('all categories butonuna tıkla for sim-resource', async function (this: ICustomWorld) {
  const page = new SimResourcePage(this.page!);
  await page.clickAllCategories();
});

When('I click "All categories" button for sim-resource', async function (this: ICustomWorld) {
  const page = new SimResourcePage(this.page!);
  await page.clickAllCategories();
});

When('Dropdowndan SIM seç for sim-resource', async function (this: ICustomWorld) {
  const page = new SimResourcePage(this.page!);
  await page.selectSimFromDropdown();
});

When('I select "SIM" from the dropdown for sim-resource', async function (this: ICustomWorld) {
  const page = new SimResourcePage(this.page!);
  await page.selectSimFromDropdown();
});

Then('Filter butonuna tıkla for sim-resource', async function (this: ICustomWorld) {
  const page = new SimResourcePage(this.page!);
  await page.clickFilter();
});

Then('I click "Filter" button for sim-resource', async function (this: ICustomWorld) {
  const page = new SimResourcePage(this.page!);
  await page.clickFilter();
});