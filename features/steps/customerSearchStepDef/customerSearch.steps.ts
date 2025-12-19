import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../support/world';
import { LoginPage } from '../../../pages/loginPage/login.page';
import { CustomerSearchPage } from '../../../pages/customerSearchPage/customerSearch.page';

let loginPage: LoginPage;
let customerSearchPage: CustomerSearchPage;

Given('I am on the application login page', async function (this: ICustomWorld) {
    loginPage = new LoginPage(this.page!);
    await loginPage.gotoLoginPage();
});

When('I complete the login process', async function (this: ICustomWorld) {
    await loginPage.login();
});

Then('I should be successfully logged in to the application', async function (this: ICustomWorld) {
    await loginPage.assertLoggedIn();
    // Initialize customerSearchPage after successful login
    customerSearchPage = new CustomerSearchPage(this.page!);
});

When('I navigate to the customer search section', async function () {
    await customerSearchPage.navigateToCustomerSearch();
});

When('I search for customer {string}', async function (customerName: string) {
    await customerSearchPage.searchForCustomer(customerName);
});

Then('I should see search results containing {string}', async function (customerName: string) {
    await customerSearchPage.assertSearchResults(customerName);
});

When('I select the first customer record from the results', async function () {
    await customerSearchPage.clickFirstCustomerResult();
});