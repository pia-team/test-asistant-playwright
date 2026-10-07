import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../../../support/world';
import { Login10720260Page } from '../../../../../pages/ABC/10720260_logingrup/10720260_loginPage/10720260_login.page';
import { getEnvConfig } from '../../../../../support/env';

Given('I am on the login page for 10720260_login', async function (this: ICustomWorld) {
  const loginPage = new Login10720260Page(this.page!);
  await loginPage.openLoginPage();
});

When('I enter valid credentials for 10720260_login', async function (this: ICustomWorld) {
  const env = getEnvConfig();
  if (!env.username || !env.password) {
    throw new Error('username/password not configured in environment profile');
  }
  const loginPage = new Login10720260Page(this.page!);
  await loginPage.enterCredentials(env.username, env.password);
});

When('I click Sign In for 10720260_login', async function (this: ICustomWorld) {
  const loginPage = new Login10720260Page(this.page!);
  await loginPage.clickSignIn();
});

Then('I should see a page for 10720260_login', async function (this: ICustomWorld) {
  const loginPage = new Login10720260Page(this.page!);
  await loginPage.expectSuccessfulLogin();
});