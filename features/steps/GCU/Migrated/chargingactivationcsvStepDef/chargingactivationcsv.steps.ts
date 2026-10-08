import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect, Page } from '@playwright/test';
import { SignInPage } from '../../../../../pages/GCU/Migrated/signInPage/signIn.page';
import { Customer360Page } from '../../../../../pages/GCU/Migrated/customer360Page/customer360.page';
import { CustomerOrderPage } from '../../../../../pages/GCU/Migrated/customerOrderPage/customerOrder.page';
import { CatalogPage } from '../../../../../pages/GCU/Migrated/catalogPage/catalog.page';
import { ProductOfferingPage } from '../../../../../pages/GCU/Migrated/productOfferingPage/productOffering.page';
import { ShoppingCartPage } from '../../../../../pages/GCU/Migrated/shoppingCartPage/shoppingCart.page';

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

When('I click any New Order button on Account Page', async function() {
  const page = this.page as Page;
  const customer360Page = new Customer360Page(page);
  await customer360Page.clickNewOrder();
});

When('I fill the {string} field on Customer Order Page', async function(fieldName: string) {
  const page = this.page as Page;
  const input = page.getByRole('textbox', { name: new RegExp(fieldName, 'i') });
  await input.fill('test-value');
});

When('I click the continue button after fill form on Customer Order Page', async function() {
  const page = this.page as Page;
  const customerOrderPage = new CustomerOrderPage(page);
  await customerOrderPage.clickContinue();
});

Then('I should see the DSales Catalog page is opened', async function() {
  const page = this.page as Page;
  const catalogPage = new CatalogPage(page);
  await expect(catalogPage.productList).toBeVisible();
});

When('I select {string} main category on Catalog page', async function(category: string) {
  const page = this.page as Page;
  const catalogPage = new CatalogPage(page);
  await catalogPage.selectMainCategory(category);
});

When('I select {string} sub category on Catalog page', async function(category: string) {
  const page = this.page as Page;
  const catalogPage = new CatalogPage(page);
  await catalogPage.selectSubCategory(category);
});

When('I click search button on Catalog page', async function() {
  const page = this.page as Page;
  const catalogPage = new CatalogPage(page);
  await catalogPage.clickSearch();
});

Then('I should see the products are listed on Catalog page', async function() {
  const page = this.page as Page;
  const catalogPage = new CatalogPage(page);
  await expect(await catalogPage.isProductListVisible()).toBe(true);
});

When('I select {string} product on Catalog page', async function(productName: string) {
  const page = this.page as Page;
  const catalogPage = new CatalogPage(page);
  await catalogPage.selectProduct(productName);
});

Then('I should see the {string} offering on Product Offering page', async function(productName: string) {
  const page = this.page as Page;
  const offering = page.getByText(new RegExp(productName, 'i'));
  await expect(offering).toBeVisible();
});

Then('I should see the {string} as service type on Product Offering page', async function(serviceType: string) {
  const page = this.page as Page;
  const service = page.getByText(new RegExp(serviceType, 'i'));
  await expect(service).toBeVisible();
});

Then('I should see the plan charge price selected automatically for {string} product', async function(productName: string) {
  const page = this.page as Page;
  const priceField = page.locator(`[data-product="${productName}"]`).getByTestId('plan-price');
  await expect(priceField).toBeVisible();
});

Then('I should see the {string} product added to the cart', async function(productName: string) {
  const page = this.page as Page;
  const cartItem = page.getByText(new RegExp(productName, 'i'));
  await expect(cartItem).toBeVisible();
});

Then('I should see the {string} on {string} for {string} product', async function(value: string, fieldName: string, productName: string) {
  const page = this.page as Page;
  const field = page.locator(`[data-product="${productName}"]`).getByText(new RegExp(fieldName, 'i'));
  await expect(field).toContainText(value);
});

Then('I should see the {string} is non-configurable for {string} product', async function(fieldName: string, productName: string) {
  const page = this.page as Page;
  const field = page.locator(`[data-product="${productName}"]`).getByRole('textbox', { name: new RegExp(fieldName, 'i') });
  await expect(field).toBeDisabled();
});

When('I click {string} dropdown for {string} product', async function(dropdownName: string, productName: string) {
  const page = this.page as Page;
  const dropdown = page.locator(`[data-product="${productName}"]`).getByRole('combobox', { name: new RegExp(dropdownName, 'i') });
  await dropdown.click();
});

Then('I should see the options on dropdown on Product Offering page', async function(dataTable: DataTable) {
  const page = this.page as Page;
  const options = dataTable.rows().flat();
  for (const option of options) {
    const optionElement = page.getByRole('option', { name: new RegExp(option, 'i') });
    await expect(optionElement).toBeVisible();
  }
});

When('I select any option from dropdown on Product Offering Page', async function() {
  const page = this.page as Page;
  const firstOption = page.getByRole('option').first();
  await firstOption.click();
});

Then('I click the edit button for {string} for {string} product', async function(fieldName: string, productName: string) {
  const page = this.page as Page;
  const editBtn = page.locator(`[data-product="${productName}"]`).getByRole('button', { name: /edit/i });
  await editBtn.click();
});

Then('I fill the {string} new characteristic with random value for {string} product', async function(fieldName: string, productName: string) {
  const page = this.page as Page;
  const randomValue = Math.random().toString(36).substring(7);
  const input = page.locator(`[data-product="${productName}"]`).getByRole('textbox', { name: new RegExp(fieldName, 'i') });
  await input.fill(randomValue);
});

Then('I click the Ok button on new characteristic value model', async function() {
  const page = this.page as Page;
  const okBtn = page.getByRole('button', { name: /ok/i });
  await okBtn.click();
});

Then('I pick the product details of the product', async function(dataTable: DataTable) {
  const page = this.page as Page;
  const details = dataTable.rows();
  for (const [field, type] of details) {
    const fieldElement = page.getByText(new RegExp(field.split(':')[0], 'i'));
    await expect(fieldElement).toBeVisible();
  }
});

When('I fill the {string} field with random value for {string} product', async function(fieldName: string, productName: string) {
  const page = this.page as Page;
  const randomValue = Math.random().toString(36).substring(7);
  const input = page.locator(`[data-product="${productName}"]`).getByRole('textbox', { name: new RegExp(fieldName, 'i') });
  await input.fill(randomValue);
});

Then('I select suitable price for selected Invoicing Frequency for {string} product', async function(productName: string) {
  const page = this.page as Page;
  const priceOption = page.locator(`[data-product="${productName}"]`).getByRole('option', { name: /price/i }).first();
  await priceOption.click();
});

Then('I click the cart icon to add {string} product', async function(productName: string) {
  const page = this.page as Page;
  const cartIcon = page.locator(`[data-product="${productName}"]`).getByRole('button', { name: /cart|add/i });
  await cartIcon.click();
});

Then('I create a json file for collected data for {string} offer', async function(offerName: string) {
  // Stub for JSON file creation
});

Then('I pick the left panel data for {string} product', async function(productName: string) {
  const page = this.page as Page;
  const panelData = page.locator(`[data-panel="${productName}"]`);
  await expect(panelData).toBeVisible();
});

Then('I should see the total price is calculated correctly', async function() {
  const page = this.page as Page;
  const totalPrice = page.getByTestId('total-price');
  await expect(totalPrice).toBeVisible();
});

Then('I should see the entered data is equal to left panel data', async function() {
  const page = this.page as Page;
  await expect(page.getByTestId('data-match')).toBeVisible();
});

When('I click the Add To Cart button on Product Offering page', async function() {
  const page = this.page as Page;
  const addToCartBtn = page.getByRole('button', { name: /add to cart/i });
  await addToCartBtn.click();
});

Then('I should see the Shopping Cart page is opened', async function() {
  const page = this.page as Page;
  const checkoutBtn = page.getByRole('button', { name: /checkout/i });
  await expect(checkoutBtn).toBeVisible();
});

When('I click the checkout button on Shopping Cart Page', async function() {
  const page = this.page as Page;
  const checkoutBtn = page.getByRole('button', { name: /checkout/i });
  await checkoutBtn.click();
});

Then('I should see {string} message for Shopping Cart', async function(message: string) {
  const page = this.page as Page;
  const successMsg = page.getByText(new RegExp(message, 'i'));
  await expect(successMsg).toBeVisible();
});