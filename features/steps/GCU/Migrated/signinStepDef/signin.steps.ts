import { Given, When, Then } from '@cucumber/cucumber';
import { expect, Page } from '@playwright/test';
import { SignInPage } from '../../../../../pages/GCU/Migrated/signInPage/signIn.page';

Given('I have opened the Customer Management application', async function() {
  const page = this.page as Page;
  const signInPage = new SignInPage(page);
  await signInPage.goto();
});

When('User should see the text as {string} on the Login page', async function(text: string) {
  const page = this.page as Page;
  const signInPage = new SignInPage(page);
  await signInPage.verifyLoginHeaderText();
});

When('User should see the text as {string} over credentials', async function(text: string) {
  const page = this.page as Page;
  const signInPage = new SignInPage(page);
  await signInPage.verifySignInAccountText();
});

When('User should see the text as {string} under Sign in button', async function(text: string) {
  const page = this.page as Page;
  const signInPage = new SignInPage(page);
  await signInPage.verifyOrSignInWithText();
});

When('User should see the text as {string} under Or Sign with text', async function(text: string) {
  const page = this.page as Page;
  const signInPage = new SignInPage(page);
  await signInPage.verifyGoogleText();
});

When('User should see the text as {string} under Google text', async function(text: string) {
  const page = this.page as Page;
  const signInPage = new SignInPage(page);
  await signInPage.verifyVodafoneAccountText();
});

When('I enter a value {string} in the Username or email field on Sign In page', async function(value: string) {
  const page = this.page as Page;
  const signInPage = new SignInPage(page);
  await signInPage.enterUsername(value);
});

When('I enter a value {string} in the Password field on Sign In page', async function(value: string) {
  const page = this.page as Page;
  const signInPage = new SignInPage(page);
  await signInPage.enterPassword(value);
});

When('I click the Sign in button on Sign In page', async function() {
  const page = this.page as Page;
  const signInPage = new SignInPage(page);
  await signInPage.clickSignIn();
});

Then('I should be seeing that the {string} is shown on opened home page', async function(username: string) {
  const page = this.page as Page;
  const signInPage = new SignInPage(page);
  await signInPage.verifyUserNameDisplayed(username);
});

When('I have log out into the system on the home page', async function() {
  const page = this.page as Page;
  const signInPage = new SignInPage(page);
  await signInPage.logout();
});

Then('I should be seeing that the {string} header on Sign In page', async function(text: string) {
  const page = this.page as Page;
  const signInPage = new SignInPage(page);
  await signInPage.verifySignInAccountText();
});

Then('I should be seeing the message {string} on Sign In page', async function(message: string) {
  const page = this.page as Page;
  const signInPage = new SignInPage(page);
  await signInPage.verifyInvalidCredentialsMessage();
});