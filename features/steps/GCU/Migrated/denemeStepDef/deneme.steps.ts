import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect, Page } from '@playwright/test';
import { SignInPage } from '../../../../../pages/GCU/Migrated/signInPage/signIn.page';
import { Customer360Page } from '../../../../../pages/GCU/Migrated/customer360Page/customer360.page';
import { CustomerOrderPage } from '../../../../../pages/GCU/Migrated/customerOrderPage/customerOrder.page';
import { BackOfficePage } from '../../../../../pages/GCU/Migrated/backOfficePage/backOffice.page';

Given('I have opened the Customer Management application', async function() {
  const page = this.page as Page;
  const customer360Page = new Customer360Page(page);
  await customer360Page.goto();
});

Given('I sign in with credentials {string} and {string}', async function(username: string, password: string) {
  const page = this.page as Page;
  const signInPage = new SignInPage(page);
  await signInPage.signIn(username, password);
});

Given('I am on the Customer360 page', async function() {
  const page = this.page as Page;
  const customer360Page = new Customer360Page(page);
  await customer360Page.goto();
});

Given('I search for customer by Customer Id {string}', async function(customerId: string) {
  const page = this.page as Page;
  const customer360Page = new Customer360Page(page);
  await customer360Page.searchByCustomerId(customerId);
});

Given('I select the searched customer', async function() {
  const page = this.page as Page;
  const customer360Page = new Customer360Page(page);
  await customer360Page.selectCustomer();
});

When('I click the {string} tab on Customer360 Page', async function(tabName: string) {
  const page = this.page as Page;
  const customer360Page = new Customer360Page(page);
  await customer360Page.clickTab(tabName);
});

Then('I should see the {string} tab is opened on Customer360 Page', async function(tabName: string) {
  const page = this.page as Page;
  const tab = page.getByRole('tab', { name: new RegExp(tabName, 'i'), selected: true });
  await expect(tab).toBeVisible();
});

When('I switch to Backoffice on new window', async function() {
  const page = this.page as Page;
  const newPage = await page.context().newPage();
  (this as any).page = newPage;
});

Then('I log out from the system', async function() {
  const page = this.page as Page;
  const logoutButton = page.getByRole('button', { name: /logout/i });
  await logoutButton.click();
});

Then('I should see the {string} header on Sign In page', async function(header: string) {
  const page = this.page as Page;
  const signInPage = new SignInPage(page);
  await expect(signInPage.signInHeader).toBeVisible();
});

When('I sign in with credentials {string} and {string}', async function(username: string, password: string) {
  const page = this.page as Page;
  const signInPage = new SignInPage(page);
  await signInPage.signIn(username, password);
});

Then('I should see the name of {string} progressed customer on BackOffice page', async function(customerName: string) {
  const page = this.page as Page;
  const customer = page.getByText(new RegExp(customerName, 'i'));
  await expect(customer).toBeVisible();
});

Then('I click the name of {string} customer on BackOffice page', async function(customerName: string) {
  const page = this.page as Page;
  const backOfficePage = new BackOfficePage(page);
  await backOfficePage.clickCustomer(customerName);
});

Then('I click the three dots on opened page on Backoffice page', async function() {
  const page = this.page as Page;
  const backOfficePage = new BackOfficePage(page);
  await backOfficePage.clickThreeDots();
});

Then('I click the ClaimEdit button on opened segment on BackOffice page', async function() {
  const page = this.page as Page;
  const backOfficePage = new BackOfficePage(page);
  await backOfficePage.clickClaimEdit();
});

Then('I should see the {string} header on BackOffice page', async function(header: string) {
  const page = this.page as Page;
  const headerElement = page.getByRole('heading', { name: new RegExp(header, 'i') });
  await expect(headerElement).toBeVisible();
});

When('I fill the {string} input on BackOfficePage', async function(fieldName: string) {
  const page = this.page as Page;
  const input = page.getByRole('textbox', { name: new RegExp(fieldName, 'i') });
  await input.fill('test-value');
});

Then('I select document category for PM User on BackOfficePage', async function() {
  const page = this.page as Page;
  const backOfficePage = new BackOfficePage(page);
  await backOfficePage.documentCategoryDropdown.click();
});

Then('I should see the {string} option on dropdown', async function(option: string) {
  const page = this.page as Page;
  const optionElement = page.getByRole('option', { name: new RegExp(option, 'i') });
  await expect(optionElement).toBeVisible();
});

Then('I select {string} as an option from dropdown on opened page', async function(option: string) {
  const page = this.page as Page;
  const backOfficePage = new BackOfficePage(page);
  await backOfficePage.selectDocumentCategory(option);
});

Then('I upload a document {string} with binding key {string} on PM User BackOffice Page', async function(fileName: string, bindingKey: string) {
  const page = this.page as Page;
  const fileLocator = page.locator('input[type="file"]');
  await fileLocator.click();
});

Then('I should see the {string} success message', async function(message: string) {
  const page = this.page as Page;
  const msg = page.getByText(new RegExp(message, 'i'));
  await expect(msg).toBeVisible();
});

Then('I should see the document is added on PM User BackOffice Page', async function() {
  const page = this.page as Page;
  const backOfficePage = new BackOfficePage(page);
  const documentRow = backOfficePage.documentTable.getByRole('row').first();
  await expect(documentRow).toBeVisible();
});

Then('I should see the {string} for {string} on BackOffice Page', async function(value: string, fieldName: string) {
  const page = this.page as Page;
  const field = page.getByText(new RegExp(fieldName, 'i'));
  await expect(field).toContainText(value);
});

When('I click the document delete button for {string} on BackOffice Page', async function(documentName: string) {
  const page = this.page as Page;
  const backOfficePage = new BackOfficePage(page);
  await backOfficePage.deleteDocument(documentName);
});

Then('I should see the {string} document deleted on BackOffice Page', async function(documentName: string) {
  const page = this.page as Page;
  const deletedDoc = page.getByText(new RegExp(documentName, 'i'));
  await expect(deletedDoc).not.toBeVisible();
});

Then('I verify the {string} document can be viewed on BackOffice Page', async function(documentName: string) {
  const page = this.page as Page;
  const doc = page.getByText(new RegExp(documentName, 'i'));
  await expect(doc).toBeVisible();
});

Then('I click the Complete Task button on the right button of the on BackOffice page', async function() {
  const page = this.page as Page;
  const backOfficePage = new BackOfficePage(page);
  await backOfficePage.clickCompleteTask();
});

Then('I should see {string} message on BackOffice page', async function(message: string) {
  const page = this.page as Page;
  const backOfficePage = new BackOfficePage(page);
  await expect(backOfficePage.taskCompletedMessage).toBeVisible();
});

Then('I return to Customer Management after task completion on BackOffice page', async function() {
  const page = this.page as Page;
  const pages = page.context().pages();
  (this as any).page = pages[0];
});

Then('I wait for task creation for {string} customer on Vbu McDc Team', async function(customerName: string) {
  const page = this.page as Page;
  await page.waitForTimeout(5000);
});

Then('I should see the service characteristics for {string} product for {string} as correctly on BackOffice page', async function(productName: string, offering: string) {
  const page = this.page as Page;
  const characteristics = page.getByText(new RegExp(productName, 'i'));
  await expect(characteristics).toBeVisible();
});

Then('I select {string} checkbox on BackOfficePage', async function(checkboxName: string) {
  const page = this.page as Page;
  const checkbox = page.getByRole('checkbox', { name: new RegExp(checkboxName, 'i') });
  await checkbox.check();
});

Then('I wait for order completion on Customer Order Page', async function() {
  const page = this.page as Page;
  await page.waitForTimeout(10000);
});

Then('I should see {string} for {string} field on Customer Order Page', async function(value: string, fieldName: string) {
  const page = this.page as Page;
  const field = page.getByLabel(new RegExp(fieldName, 'i'));
  await expect(field).toHaveValue(value);
});

Then('I should see {string} for {string} field on Customer Product Page', async function(value: string, fieldName: string) {
  const page = this.page as Page;
  const field = page.getByLabel(new RegExp(fieldName, 'i'));
  await expect(field).toHaveValue(value);
});

Then('I should see {string} for {string} field for inner products on Customer Product Page', async function(value: string, fieldName: string) {
  const page = this.page as Page;
  const field = page.getByLabel(new RegExp(fieldName, 'i'));
  await expect(field).toHaveValue(value);
});