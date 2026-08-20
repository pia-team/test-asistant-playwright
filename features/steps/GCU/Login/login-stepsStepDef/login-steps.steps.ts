import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../../../support/world';
import { LoginStepsPage } from '../../../../../pages/GCU/Login/login-stepsPage/login-steps.page';
import { getEnvConfig } from '../../../../../support/env';

Given('I am on the login page for login-steps', async function (this: ICustomWorld) {
  const loginPage = new LoginStepsPage(this.page!);
  await loginPage.navigate();
});

When('I enter valid credentials for login-steps', async function (this: ICustomWorld) {
  const env = getEnvConfig();
  if (!env.username || !env.password) {
    throw new Error('username/password not configured in environment profile');
  }
  const loginPage = new LoginStepsPage(this.page!);
  await loginPage.enterCredentials(env.username, env.password);
});

When('I click the Sign In button for login-steps', async function (this: ICustomWorld) {
  const loginPage = new LoginStepsPage(this.page!);
  await loginPage.clickSignIn();
});

Then('I should be redirected to the dashboard for login-steps', async function (this: ICustomWorld) {
  const loginPage = new LoginStepsPage(this.page!);
  await loginPage.verifyDashboardVisible();
});