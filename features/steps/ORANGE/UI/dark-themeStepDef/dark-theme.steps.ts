import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../../../support/world';
import { DarkThemePage } from '../../../../../pages/ORANGE/UI/dark-themePage/dark-theme.page';
import { LoginPage } from '../../../../../pages/ORANGE/Login/loginPage/login.page';
import { getEnvConfig } from '../../../../../support/env';

Given('the user is on the login page for dark-theme', async function (this: ICustomWorld) {
  const loginPage = new LoginPage(this.page!);
  await loginPage.navigate();
});

When('the user clicks the "Sign in with Keycloak" button for dark-theme', async function (this: ICustomWorld) {
  const darkThemePage = new DarkThemePage(this.page!);
  await darkThemePage.clickKeycloakEntry();
});

When('the user enters valid credentials for dark-theme', async function (this: ICustomWorld) {
  const env = getEnvConfig();
  if (!env.username || !env.password) {
    throw new Error('username/password not configured in environment profile');
  }
  const loginPage = new LoginPage(this.page!);
  await loginPage.enterCredentials(env.username, env.password);
});

When('the user clicks the "Sign In" button for dark-theme', async function (this: ICustomWorld) {
  const loginPage = new LoginPage(this.page!);
  await loginPage.clickSignIn();
});

Then('the user should see "Welcome" for dark-theme', async function (this: ICustomWorld) {
  const darkThemePage = new DarkThemePage(this.page!);
  await darkThemePage.waitForWelcome();
});

When('the user clicks the theme toggle button for dark-theme', async function (this: ICustomWorld) {
  const darkThemePage = new DarkThemePage(this.page!);
  await darkThemePage.clickThemeToggle();
});

When('the user clicks "Dark" for dark-theme', async function (this: ICustomWorld) {
  const darkThemePage = new DarkThemePage(this.page!);
  await darkThemePage.clickDarkOption();
});