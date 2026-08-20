import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { ICustomWorld } from '../../../../../support/world';
import { LoginGherkinPage } from '../../../../../pages/GCU/Login/login-gherkinPage/login-gherkin.page';
import { getEnvConfig } from '../../../../../support/env';

Given('I am on the login page for login-gherkin', async function (this: ICustomWorld) {
  const page = new LoginGherkinPage(this.page!);
  await page.navigate();
});

When('I enter valid credentials for login-gherkin', async function (this: ICustomWorld) {
  const env = getEnvConfig();
  if (!env.username || !env.password) {
    throw new Error('username/password not configured in environment profile');
  }
  const page = new LoginGherkinPage(this.page!);
  await page.enterCredentials(env.username, env.password);
});

When('I click Sign In for login-gherkin', async function (this: ICustomWorld) {
  const page = new LoginGherkinPage(this.page!);
  await page.clickSignIn();
});

Then('I should be redirected to the dashboard for login-gherkin', async function (this: ICustomWorld) {
  const page = new LoginGherkinPage(this.page!);
  const isDashboardVisible = await page.isDashboardVisible();
  expect(isDashboardVisible).toBeTruthy();
});