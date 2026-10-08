import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../../../support/world';
import { TranslatePage } from '../../../../../pages/ORANGE/UI/translatePage/translate.page';
import { getEnvConfig } from '../../../../../support/env';
import { expect } from '@playwright/test';

Given('the user is on the login page for translate', async function (this: ICustomWorld) {
  const page = new TranslatePage(this.page!);
  await page.navigateToLoginPage();
});

When('the user clicks the "Sign in with Keycloak" button for translate', async function (this: ICustomWorld) {
  const page = new TranslatePage(this.page!);
  await page.clickKeycloakSignIn();
});

When('the user enters valid credentials for translate', async function (this: ICustomWorld) {
  const env = getEnvConfig();
  if (!env.username || !env.password) {
    throw new Error('username/password not configured in environment profile');
  }
  const page = new TranslatePage(this.page!);
  await page.enterCredentials(env.username, env.password);
});

When('the user clicks the "Sign In" button for translate', async function (this: ICustomWorld) {
  const page = new TranslatePage(this.page!);
  await page.clickSignIn();
});

Then('the user should see "Welcome" for translate', async function (this: ICustomWorld) {
  const page = new TranslatePage(this.page!);
  await page.verifyWelcomeText();
});

When('the user clicks "English" for translate', async function (this: ICustomWorld) {
  const page = new TranslatePage(this.page!);
  await page.clickEnglishLanguage();
});

When('the user selects "Türkçe" for translate', async function (this: ICustomWorld) {
  const page = new TranslatePage(this.page!);
  await page.selectTurkishLanguage();
});

Then('the user should see "Hoş Geldiniz" for translate', async function (this: ICustomWorld) {
  const page = new TranslatePage(this.page!);
  await page.verifyTurkishWelcomeText();
});