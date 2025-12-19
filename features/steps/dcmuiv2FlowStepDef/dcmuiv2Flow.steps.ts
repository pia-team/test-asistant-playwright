import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../support/world';
import { DCMUIV2FlowPage } from '../../../pages/dcmuiv2FlowPage/dcmuiv2Flow.page';
import { getEnvConfig } from '../../../support/env';

let dcmuiv2FlowPage: DCMUIV2FlowPage;
const config = getEnvConfig(); // Access environment configuration

Given('I navigate to the DCM UI V2 login page', async function (this: ICustomWorld) {
    dcmuiv2FlowPage = new DCMUIV2FlowPage(this.page!);
    await dcmuiv2FlowPage.gotoLoginPage();
});

When('I log in to the DCM UI V2 application', async function (this: ICustomWorld) {
    await dcmuiv2FlowPage.performLogin();
});

Then('I should be successfully logged into DCM UI V2', async function (this: ICustomWorld) {
    await dcmuiv2FlowPage.assertLoggedInToDCMUIV2();
});

When('I change the application language to {string}', async function (this: ICustomWorld, language: string) {
    await dcmuiv2FlowPage.selectLanguage(language);
});

When('I navigate to the customer search page', async function (this: ICustomWorld) {
    await dcmuiv2FlowPage.navigateToCustomerSearch();
});

When('I search for customer {string}', async function (this: ICustomWorld, searchTerm: string) {
    await dcmuiv2FlowPage.searchCustomer(searchTerm);
});

Then('I should see customer {string} in the search results', async function (this: ICustomWorld, searchTerm: string) {
    await dcmuiv2FlowPage.assertCustomerSearchResults(searchTerm);
});

When('I interact with the first customer in the results', async function (this: ICustomWorld) {
    await dcmuiv2FlowPage.interactWithFirstCustomer();
});

Then('I should be on the customer details page', async function (this: ICustomWorld) {
    await dcmuiv2FlowPage.assertOnCustomerDetailsPage();
});