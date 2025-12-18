import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../support/world';
import { LoginPage } from '../../../pages/loginPage/login.page';
import { expect } from '@playwright/test'; // For assertTextVisible or similar direct assertions

let loginPage: LoginPage;

// ========== GIVEN ==========
Given('I am on the login page', async function (this: ICustomWorld) {
    loginPage = new LoginPage(this.page!);
    await loginPage.gotoLoginPage();
});

// ========== WHEN (also handles "And" from feature files) ==========
When('I log in with valid credentials', async function (this: ICustomWorld) {
    await loginPage.login();
});

When('I click on {string}', async function (this: ICustomWorld, buttonName: string) {
    await this.page!.getByRole('button', { name: buttonName }).click();
});

When('I enter {string} in the {string} field', async function (this: ICustomWorld, value: string, fieldName: string) {
    await this.page!.getByLabel(fieldName).fill(value);
});

When('I navigate to {string}', async function (this: ICustomWorld, pageName: string) {
    await this.page!.getByRole('link', { name: pageName }).click();
    await this.page!.waitForLoadState('domcontentloaded');
});

// ========== THEN ==========
Then('I should be successfully logged in', async function (this: ICustomWorld) {
    await loginPage.assertLoggedIn();
});

Then('I should see {string}', async function (this: ICustomWorld, text: string) {
    await expect(this.page!.getByText(text)).toBeVisible({ timeout: 10000 });
});

Then('the {string} should be visible', async function (this: ICustomWorld, elementName: string) {
    // This generic step might need refinement based on actual element type (button, link, etc.)
    // For now, it assumes it could be a button or text.
    await expect(this.page!.getByRole('button', { name: elementName }).or(this.page!.getByText(elementName))).toBeVisible();
});