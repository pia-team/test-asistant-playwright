import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../../../support/world';
import { ArnavutlukSigninPage } from '../../../../../pages/ALBENIA/Login/loginPage/login.page';

Given('I am on the login page for arnavutluk_signin', async function (this: ICustomWorld) {
  const loginPage = new ArnavutlukSigninPage(this.page!);
  await loginPage.navigateToLogin();
});

When('I click the {string} textbox for arnavutluk_signin', async function (this: ICustomWorld, fieldName: string) {
  const loginPage = new ArnavutlukSigninPage(this.page!);
  if (fieldName === 'Username or email') {
    await loginPage.clickUsernameField();
  } else if (fieldName === 'Password') {
    await loginPage.clickPasswordField();
  } else {
    throw new Error(`Unsupported textbox: ${fieldName}`);
  }
});

When('I enter {string} into the {string} textbox for arnavutluk_signin', async function (this: ICustomWorld, value: string, fieldName: string) {
  const loginPage = new ArnavutlukSigninPage(this.page!);
  if (fieldName === 'Username or email') {
    await loginPage.enterUsername(value);
  } else if (fieldName === 'Password') {
    await loginPage.enterPassword(value);
  } else {
    throw new Error(`Unsupported textbox: ${fieldName}`);
  }
});

When('I click the {string} button for arnavutluk_signin', async function (this: ICustomWorld, buttonName: string) {
  const loginPage = new ArnavutlukSigninPage(this.page!);
  if (buttonName === 'Sign In') {
    await loginPage.clickSignIn();
  } else {
    throw new Error(`Unsupported button: ${buttonName}`);
  }
});

When('I click the {string} heading for arnavutluk_signin', async function (this: ICustomWorld, headingName: string) {
  const loginPage = new ArnavutlukSigninPage(this.page!);
  if (headingName === 'Individual') {
    await loginPage.clickIndividualHeading();
  } else {
    throw new Error(`Unsupported heading: ${headingName}`);
  }
});