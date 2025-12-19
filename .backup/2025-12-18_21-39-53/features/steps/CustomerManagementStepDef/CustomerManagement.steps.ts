import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../support/world';
import { CustomerManagementPage } from '../../../pages/CustomerManagementPage/CustomerManagement.page';
import { expect } from '@playwright/test';

let customerManagementPage: CustomerManagementPage;

// ========== GIVEN ==========
Given('I am on the login page', async function (this: ICustomWorld) {
    customerManagementPage = new CustomerManagementPage(this.page!);
    await customerManagementPage.gotoLoginPage();
});

// ========== WHEN (also handles "And" from feature files) ==========
When('I log in with valid credentials', async function (this: ICustomWorld) {
    await customerManagementPage.login();
});

When('I navigate to the Customer Search page', async function (this: ICustomWorld) {
    await customerManagementPage.navigateToSearchCustomer();
});

When('I search for customer {string}', async function (this: ICustomWorld, searchValue: string) {
    await customerManagementPage.searchCustomer(searchValue);
});

When('I click the action icon for the first search result', async function (this: ICustomWorld) {
    await customerManagementPage.clickFirstResultAction();
});

When('I select the language {string}', async function (this: ICustomWorld, language: string) {
    await customerManagementPage.selectLanguage(language);
});

// ========== THEN ==========
Then('I should be successfully logged in', async function (this: ICustomWorld) {
    await customerManagementPage.assertLoggedIn();
});

Then('I should see {string}', async function (this: ICustomWorld, text: string) {
    await customerManagementPage.assertTextVisible(text);
});

Then('I should see the search results for {string}', async function (this: ICustomWorld, expectedText: string) {
    await customerManagementPage.assertSearchResultVisible(expectedText);
});

Then('I should see "Customer Details"', async function (this: ICustomWorld) {
    await customerManagementPage.assertCustomerDetailsPageVisible();
});

Then('the language should be set to {string}', async function (this: ICustomWorld, language: string) {
    // This assertion checks if the selected language text is visible on the page,
    // which serves as an indicator that the language has been changed.
    await customerManagementPage.assertTextVisible(language);
});