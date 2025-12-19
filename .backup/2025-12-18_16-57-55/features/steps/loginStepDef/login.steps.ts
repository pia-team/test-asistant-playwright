import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../support/world';
import { LoginPage } from '../../../pages/loginPage/login.page';

let loginPage: LoginPage;

Given('I am on the login page', async function (this: ICustomWorld) {
    loginPage = new LoginPage(this.page!);
    await loginPage.gotoLoginPage();
});

When('I log in with valid credentials', async function (this: ICustomWorld) {
    await loginPage.login();
});

Then('I should be successfully logged in', async function (this: ICustomWorld) {
    await loginPage.assertLoggedIn();
});