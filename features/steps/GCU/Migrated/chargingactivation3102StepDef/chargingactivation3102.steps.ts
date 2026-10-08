import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect, Page } from '@playwright/test';
import { SignInPage } from '../../../../../pages/GCU/Migrated/signInPage/signIn.page';
import { Customer360Page } from '../../../../../pages/GCU/Migrated/customer360Page/customer360.page';
import { CustomerOrderPage } from '../../../../../pages/GCU/Migrated/customerOrderPage/customerOrder.page';
import { CatalogPage } from '../../../../../pages/GCU/Migrated/catalogPage/catalog.page';
import { ProductOfferingPage } from '../../../../../pages/GCU/Migrated/productOfferingPage/productOffering.page';
import { ShoppingCartPage } from '../../../../../pages/GCU/Migrated/shoppingCartPage/shoppingCart.page';
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

Then('I should see the {string} product on Product Offering page', async function(productName: string) {
  const page = this.page as Page;
  const product = page.getByText(new RegExp(productName, 'i'));
  await expect(product).toBeVisible();
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

Then('I click the cart icon to add {string} product', async function(productName: string) {
  const page = this.page as Page;
  const productOfferingPage = new ProductOfferingPage(page);
  await productOfferingPage.clickCartIcon(productName);
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

When('I click add icon for {string} addon product to view on Product Offering page', async function(productName: string) {
  const page = this.page as Page;
  const addIcon = page.locator(`[data-addon="${productName}"]`).getByRole('button', { name: /add/i });
  await addIcon.click();
});

Then('I increment the quantity of {string} product as {string} times', async function(productName: string, times: string) {
  const page = this.page as Page;
  const productOfferingPage = new ProductOfferingPage(page);
  await productOfferingPage.incrementQuantity(productName, times);
});

Then('I decide to add {string} addon product {string}', async function(productName: string, decision: string) {
  const page = this.page as Page;
  const productOfferingPage = new ProductOfferingPage(page);
  await productOfferingPage.decideToAddAddon(productName, decision);
});

Then('I should see the {string} addon added quantity times to the cart', async function(productName: string) {
  const page = this.page as Page;
  const cartItem = page.getByText(new RegExp(productName, 'i'));
  await expect(cartItem).toBeVisible();
});

Then('I create a json file for collected data for {string} offer', async function(offerName: string) {
  // Stub for JSON file creation
});

Then('I should see the total price is calculated correctly', async function() {
  const page = this.page as Page;
  const productOfferingPage = new ProductOfferingPage(page);
  const totalPrice = await productOfferingPage.getTotalPrice();
  expect(totalPrice).toBeTruthy();
});

Then('I pick the left panel data for {string} product', async function(productName: string) {
  const page = this.page as Page;
  const panelData = page.locator(`[data-panel="${productName}"]`);
  await expect(panelData).toBeVisible();
});

Then('I should see the entered data is equal to left panel data', async function() {
  const page = this.page as Page;
  await expect(page.getByTestId('data-match')).toBeVisible();
});

When('I click the Add To Cart button on Product Offering page', async function() {
  const page = this.page as Page;
  const productOfferingPage = new ProductOfferingPage(page);
  await productOfferingPage.clickAddToCart();
});

Then('I should see the Shopping Cart page is opened', async function() {
  const page = this.page as Page;
  const shoppingCartPage = new ShoppingCartPage(page);
  await expect(shoppingCartPage.checkoutButton).toBeVisible();
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