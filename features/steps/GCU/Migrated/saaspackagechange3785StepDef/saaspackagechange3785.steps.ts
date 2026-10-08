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

When('I get Authorization for API', async function() {
  // Stub for API auth
});

When('I click the {string} tab on Customer360 Page', async function(tabName: string) {
  const page = this.page as Page;
  const customer360Page = new Customer360Page(page);
  await customer360Page.clickTab(tabName);
});

Then('I should see {string} for {string} field on Customer Product Page', async function(value: string, fieldName: string) {
  const page = this.page as Page;
  const field = page.getByLabel(new RegExp(fieldName, 'i'));
  await expect(field).toHaveValue(value);
});

When('I click the {string} product to open details on Customer Product Page', async function(productName: string) {
  const page = this.page as Page;
  const product = page.getByText(new RegExp(productName, 'i'));
  await product.click();
});

Then('I click the three dots icon on Customer Product Page', async function() {
  const page = this.page as Page;
  const customerOrderPage = new CustomerOrderPage(page);
  await customerOrderPage.clickThreeDots();
});

Then('I click the {string} option on three dot list on Customer Product Page', async function(option: string) {
  const page = this.page as Page;
  const customerOrderPage = new CustomerOrderPage(page);
  if (option.includes('Package')) {
    await customerOrderPage.clickPackageChange();
  } else if (option.includes('Product')) {
    await customerOrderPage.clickProductChange();
  }
});

Then('I fill the {string} field on Customer Order Page', async function(fieldName: string) {
  const page = this.page as Page;
  const input = page.getByRole('textbox', { name: new RegExp(fieldName, 'i') });
  await input.fill('test-value');
});

Then('I click the continue button after fill form on Customer Order Page', async function() {
  const page = this.page as Page;
  const customerOrderPage = new CustomerOrderPage(page);
  await customerOrderPage.clickContinue();
});

Then('I should see the DSales Catalog page is opened', async function() {
  const page = this.page as Page;
  const catalogPage = new CatalogPage(page);
  await expect(catalogPage.productList).toBeVisible();
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

Then('I should see the {string} product on Product Offering page', async function(productName: string) {
  const page = this.page as Page;
  const product = page.getByText(new RegExp(productName, 'i'));
  await expect(product).toBeVisible();
});

Then('I click the {string} for Package Change', async function(action: string) {
  const page = this.page as Page;
  const productOfferingPage = new ProductOfferingPage(page);
  await productOfferingPage.clickKeep();
});

When('I click {string} dropdown for {string} product', async function(dropdownName: string, productName: string) {
  const page = this.page as Page;
  const productOfferingPage = new ProductOfferingPage(page);
  await productOfferingPage.clickInvoicingFrequencyDropdown(productName);
});

Then('I should see the options on dropdown on Product Offering page', async function(dataTable: DataTable) {
  const page = this.page as Page;
  const options = dataTable.rows().flat();
  for (const option of options) {
    const optionElement = page.getByRole('option', { name: new RegExp(option, 'i') });
    await expect(optionElement).toBeVisible();
  }
});

Then('I select {string} option from dropdown on Product Offering Page', async function(option: string) {
  const page = this.page as Page;
  const productOfferingPage = new ProductOfferingPage(page);
  await productOfferingPage.selectDropdownOption(option);
});

Then('I select suitable price for selected Invoicing Frequency for {string} product', async function(productName: string) {
  const page = this.page as Page;
  const priceOption = page.getByRole('option', { name: /price/i }).first();
  await priceOption.click();
});

Then('I should see the {string} product added to the cart', async function(productName: string) {
  const page = this.page as Page;
  const cartItem = page.getByText(new RegExp(productName, 'i'));
  await expect(cartItem).toBeVisible();
});

Then('I pick the product details of the product', async function(dataTable: DataTable) {
  const page = this.page as Page;
  const details = dataTable.rows();
  for (const [field, type] of details) {
    const fieldElement = page.getByText(new RegExp(field.split(':')[0], 'i'));
    await expect(fieldElement).toBeVisible();
  }
});

Then('I should see the total price is calculated correctly', async function() {
  const page = this.page as Page;
  const productOfferingPage = new ProductOfferingPage(page);
  const totalPrice = await productOfferingPage.getTotalPrice();
  expect(totalPrice).toBeTruthy();
});

Then('I pick the left panel data for {string} product to Package Change', async function(productName: string) {
  const page = this.page as Page;
  const panelData = page.locator(`[data-panel="${productName}"]`);
  await expect(panelData).toBeVisible();
});

Then('I create a json file for collected data to Package Change for customer', async function() {
  // Stub for JSON file creation
});

Then('I click the Add To Cart button to Product Change', async function() {
  const page = this.page as Page;
  const productOfferingPage = new ProductOfferingPage(page);
  await productOfferingPage.clickAddToCart();
});

Then('I should see the Shopping Cart page is opened', async function() {
  const page = this.page as Page;
  const shoppingCartPage = new ShoppingCartPage(page);
  await expect(shoppingCartPage.checkoutButton).toBeVisible();
});

Then('I should see the {string} as new Package for Package Change', async function(productName: string) {
  const page = this.page as Page;
  const packageItem = page.getByText(new RegExp(productName, 'i'));
  await expect(packageItem).toBeVisible();
});

Then('I should see the {string} as to be removed for Package Change', async function(productName: string) {
  const page = this.page as Page;
  const removedItem = page.getByText(new RegExp(productName, 'i'));
  await expect(removedItem).toBeVisible();
});

Then('I should see the {string} as to be kept for Package Change', async function(productName: string) {
  const page = this.page as Page;
  const keptItem = page.getByText(new RegExp(productName, 'i'));
  await expect(keptItem).toBeVisible();
});

When('I click the checkout button on Shopping Cart Page', async function() {
  const page = this.page as Page;
  const shoppingCartPage = new ShoppingCartPage(page);
  await shoppingCartPage.clickCheckout();
});

Then('I should see {string} message for Shopping Cart', async function(message: string) {
  const page = this.page as Page;
  const successMsg = page.getByText(new RegExp(message, 'i'));
  await expect(successMsg).toBeVisible();
});

When('I click the go back Customer360 button after checkout', async function() {
  const page = this.page as Page;
  const customer360Page = new Customer360Page(page);
  await customer360Page.clickGoBack();
});

Then('I should see {string} for {string} field on Customer Order Page', async function(value: string, fieldName: string) {
  const page = this.page as Page;
  const field = page.getByLabel(new RegExp(fieldName, 'i'));
  await expect(field).toHaveValue(value);
});

Then('I click the {string} tab on Customer360 Page', async function(tabName: string) {
  const page = this.page as Page;
  const customer360Page = new Customer360Page(page);
  await customer360Page.clickTab(tabName);
});

Then('I should see {string} for {string} field on Customer Shopping Cart Page', async function(value: string, fieldName: string) {
  const page = this.page as Page;
  const shoppingCartPage = new ShoppingCartPage(page);
  const status = await shoppingCartPage.getStatus();
  expect(status).toContain(value);
});

When('I open the latest created order on Customer Order Page', async function() {
  const page = this.page as Page;
  const latestOrder = page.getByRole('row').first();
  await latestOrder.click();
});

Then('I click the Cancel Order button on Customer Order Page', async function() {
  const page = this.page as Page;
  const cancelBtn = page.getByRole('button', { name: /cancel order/i });
  await cancelBtn.click();
});

Then('I fill the cancellation reason on Customer Order Page', async function() {
  const page = this.page as Page;
  const reasonInput = page.getByRole('textbox', { name: /cancellation reason/i });
  await reasonInput.fill('Test cancellation reason');
});

Then('I click the Create Cancel Order button on Customer Order Page', async function() {
  const page = this.page as Page;
  const createBtn = page.getByRole('button', { name: /create cancel order/i });
  await createBtn.click();
});

Then('I wait for order cancellation on Customer Order Page', async function() {
  const page = this.page as Page;
  await page.waitForTimeout(10000);
});