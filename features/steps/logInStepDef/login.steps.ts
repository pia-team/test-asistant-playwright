import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../../../pages/logInPage/login.page';
import { ICustomWorld } from '../../../support/world';



Given('User is on the landing page', async function (this: ICustomWorld) {
  const loginPage = new LoginPage(this.page!);
  await loginPage.gotoUrl();
});

When('User enters user name as {string}', async function (this: ICustomWorld, username: string) {
  const loginPage = new LoginPage(this.page!);
  await loginPage.enterUsername(username);
});

When('User enters password as {string}', async function (this: ICustomWorld, password: string) {
  const loginPage = new LoginPage(this.page!);
  await loginPage.enterPassword(password);
});

When('User clicks singIn Btn', async function (this: ICustomWorld) {
  const loginPage = new LoginPage(this.page!);
  await loginPage.clickSignIn();
});

Then('User should see url contains {string}', async function (this: ICustomWorld, value: string) {
  const loginPage = new LoginPage(this.page!);
  await loginPage.assertUrlContains(value);
});

When('User goes to url {string}', async function (this: ICustomWorld,url:string) {
  await this.page?.waitForLoadState();
  await this.page?.goto(url)
});

Then('User enters the credentials',async function (this: ICustomWorld) {
  const loginPage = new LoginPage(this.page!);
  await loginPage.login1();
});

When('User should see the text as {string} on the Login page',async function (this: ICustomWorld, expectedText: string) {
    const loginPage = new LoginPage(this.page!);
    await loginPage.getHeaderByText(expectedText)
  });

Then('User should see that the {string} is seen on home page', async function (this: ICustomWorld,nameOfCustomer: string){
  const loginPage=new LoginPage(this.page!);
  await loginPage.controlOfUserName(nameOfCustomer);
});

When('User  logs out from the main page to the Log in page.', async function (this: ICustomWorld){
  const loginPage=new LoginPage(this.page!);
  await loginPage.logoutFunction();
});

Then('User should see the message {string} on Sign In page', async function (this: ICustomWorld, warningMessage:string) {
  const loginPage=new LoginPage(this.page!);
  await loginPage.warningMessageAssertionOnSignIn(warningMessage);
});
