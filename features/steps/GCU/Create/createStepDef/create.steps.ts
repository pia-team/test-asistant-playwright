import { expect } from '@playwright/test';
import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../../../support/world';
import { getEnvConfig } from '../../../../../support/env';
import { CreatePage } from '../../../../../pages/GCU/Create/createPage/create.page';

Given('I am on the login page for create', async function (this: ICustomWorld) {
  const createPage = new CreatePage(this.page!);
  await createPage.navigate();
});

When('I enter valid credentials for create', async function (this: ICustomWorld) {
  const env = getEnvConfig();
  if (!env.username || !env.password) {
    throw new Error('username/password not configured in environment profile');
  }
  const createPage = new CreatePage(this.page!);
  await createPage.enterCredentials(env.username, env.password);
});

When('I click Sign In for create', async function (this: ICustomWorld) {
  const createPage = new CreatePage(this.page!);
  await createPage.clickSignIn();
});

Then('I click Create Individual Customer for create', async function (this: ICustomWorld) {
  const createPage = new CreatePage(this.page!);
  await createPage.clickCreateIndividualCustomer();
});

Then('I click identification number for create', async function (this: ICustomWorld) {
  const createPage = new CreatePage(this.page!);
  await createPage.clickIdentificationNumber();
});

Then('I enter an {int} digit random id for create', async function (this: ICustomWorld, digits: number) {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  const randomId = Math.floor(min + Math.random() * (max - min + 1)).toString();

  this.scenarioVars = this.scenarioVars || {};
  this.scenarioVars.randomId = randomId;

  const createPage = new CreatePage(this.page!);
  await createPage.enterIdentificationNumber(randomId);
});

Then('I should see the {int} digit id populated in the field for create', async function (this: ICustomWorld, digits: number) {
  const expectedId = this.scenarioVars?.randomId as string;
  const createPage = new CreatePage(this.page!);
  const actualId = await createPage.getIdentificationNumberValue();
  
  expect(actualId).not.toBeNull();
  expect(actualId).toBe(expectedId);
  expect(actualId!.length).toBe(digits);
});
