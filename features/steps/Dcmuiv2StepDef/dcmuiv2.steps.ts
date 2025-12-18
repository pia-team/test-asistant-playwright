import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../support/world';
import { Dcmuiv2Page } from '../../../pages/Dcmuiv2Page/Dcmuiv2.page';
import { expect } from '@playwright/test';

let dcmuiv2Page: Dcmuiv2Page;

// ========== DCMUIV2 SPECIFIC STEPS ==========
// Common login steps are in loginStepDef/login.steps.ts

Given('I am on the DCM UI V2 page', async function (this: ICustomWorld) {
    dcmuiv2Page = new Dcmuiv2Page(this.page!);
    await dcmuiv2Page.gotoLoginPage();
});

When('I navigate to Search Customer', async function (this: ICustomWorld) {
    await dcmuiv2Page.clickSearchCustomerLink();
});

When('I select language {string}', async function (this: ICustomWorld, language: string) {
    await dcmuiv2Page.selectLanguage(language);
});

When('I press {string} key', async function (this: ICustomWorld, key: string) {
    await this.page!.keyboard.press(key);
    await this.page!.waitForLoadState('domcontentloaded');
});

When('I click the action button for the first customer in the search results', async function (this: ICustomWorld) {
    await dcmuiv2Page.clickFirstCustomerActionButton();
});

Then('I should see search results containing {string}', async function (this: ICustomWorld, customerName: string) {
    await dcmuiv2Page.assertSearchResultsContain(customerName);
});

Then('I should see the customer details page for {string}', async function (this: ICustomWorld, customerName: string) {
    await dcmuiv2Page.assertCustomerDetailsPageVisible(customerName);
});