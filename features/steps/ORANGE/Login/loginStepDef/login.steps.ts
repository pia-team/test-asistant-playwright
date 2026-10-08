import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../../../support/world';
import { LoginPage } from '../../../../../pages/ORANGE/Login/loginPage/login.page';
import { getEnvConfig } from '../../../../../support/env';
import { expect } from '@playwright/test';

Given('the user is on the login page for login', async function (this: ICustomWorld) {
  const page = new LoginPage(this.page!);
  await page.navigate();
});

When('the user clicks the "Sign in with Keycloak" button for login', async function (this: ICustomWorld) {
  const page = new LoginPage(this.page!);
  await page.clickKeycloakButton();
});

When('the user enters valid credentials for login', async function (this: ICustomWorld) {
  const env = getEnvConfig();
  if (!env.username || !env.password) {
    throw new Error('username/password not configured in environment profile');
  }
  const page = new LoginPage(this.page!);
  await page.enterCredentials(env.username, env.password);
});

When('the user clicks the "Sign In" button for login', async function (this: ICustomWorld) {
  const page = new LoginPage(this.page!);
  await page.clickSignIn();
});

Then('the user should see "Welcome" for login', async function (this: ICustomWorld) {
  const page = new LoginPage(this.page!);
  await page.verifyWelcome();
});