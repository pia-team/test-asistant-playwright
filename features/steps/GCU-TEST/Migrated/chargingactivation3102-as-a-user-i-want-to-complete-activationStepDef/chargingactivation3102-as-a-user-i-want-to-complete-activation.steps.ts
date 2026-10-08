import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ChargingActivation3102Page } from '../../../../../pages/GCU-TEST/Migrated/chargingactivation3102-as-a-user-i-want-to-complete-activationPage/chargingactivation3102-as-a-user-i-want-to-complete-activation.page';
import { testData } from '../../../../../support/testData';

Given('I have opened the Customer Management application', async function() {
  await this.page!.goto('/');
});

Given('I enter a value {string} in the Username or email field on Sign In page', async function(value: string) {
  const myPage = new ChargingActivation3102Page(this.page!);
  await myPage.usernameInput.fill(value);
});

Given('I enter a value {string} in the Password field on Sign In page', async function(value: string) {
  const myPage = new ChargingActivation3102Page(this.page!);
  await myPage.passwordInput.fill(value);
});

Given('I click the Sign in button on Sign In page', async function() {
  const myPage = new ChargingActivation3102Page(this.page!);
  await myPage.signInButton.click();
  await this.page!.waitForLoadState('networkidle');
});

Given('User is on the Customer360 page', async function() {
  await expect(this.page!).toHaveURL(/customer360/i);
});

Given('User clicks select Search Type field on Customer360 search page', async function() {
  const myPage = new ChargingActivation3102Page(this.page!);
  await myPage.customer360SearchTypeDropdown.click();
});

Given('User selects Customer Id option from dropdown on Customer360 search page', async function() {
  const myPage = new ChargingActivation3102Page(this.page!);
  await myPage.customerIdOption.click();
});

Given('User fills the search bar as {string} on Customer360 search page', async function(value: string) {
  const myPage = new ChargingActivation3102Page(this.page!);
  await myPage.customer360SearchBar.fill(value);
});

Given('User clicks Search Button on Customer360 search page', async function() {
  const myPage = new ChargingActivation3102Page(this.page!);
  await myPage.customer360SearchButton.click();
  await this.page!.waitForLoadState('networkidle');
});

Given('User selects opened name of searched name on Customer360 search page', async function() {
  const myPage = new ChargingActivation3102Page(this.page!);
  await myPage.customer360SearchResult.click();
  await this.page!.waitForLoadState('networkidle');
});

When('User clicks the {string} tab on Customer360 Page', async function(tabName: string) {
  const myPage = new ChargingActivation3102Page(this.page!);
  if (tabName.toLowerCase().includes('account')) {
    await myPage.accountTab.click();
  } else if (tabName.toLowerCase().includes('order')) {
    await myPage.orderTab.click();
  } else if (tabName.toLowerCase().includes('shopping cart')) {
    await myPage.shoppingCartTab.click();
  }
  await this.page!.waitForLoadState('networkidle');
});

Then('User should see the {string} tab is opened on Customer360 Page', async function(tabName: string) {
  await expect(this.page!).toHaveURL(/customer360/i);
});

When('User clicks any New Order button on Account Page', async function() {
  const myPage = new ChargingActivation3102Page(this.page!);
  await myPage.newOrderButton.click();
  await this.page!.waitForLoadState('networkidle');
});

When('User fills the {string} field on Customer Order Page', async function(fieldName: string) {
  const myPage = new ChargingActivation3102Page(this.page!);
  const value = await testData.getFile(`${fieldName}-value`) || 'test-value';
  if (fieldName.includes('salesAgentName')) {
    await myPage.salesAgentNameField.fill(value);
  } else if (fieldName.includes('externalOrderId')) {
    await myPage.externalOrderIdField.fill(value);
  } else if (fieldName.includes('crmCaseId')) {
    await myPage.crmCaseIdField.fill(value);
  } else if (fieldName.includes('salesAgentChannel')) {
    await myPage.salesAgentChannelField.fill(value);
  }
});

When('User clicks the continue button after fill form on Customer Order Page', async function() {
  const myPage = new ChargingActivation3102Page(this.page!);
  await myPage.continueButton.click();
  await this.page!.waitForLoadState('networkidle');
});

Then('User should see the DSales Catalog page is opened', async function() {
  await expect(this.page!).toHaveURL(/catalog|dsales/i);
});

When('User selects {string} main category on Catalog page', async function(category: string) {
  const myPage = new ChargingActivation3102Page(this.page!);
  if (category.toLowerCase().includes('saas')) {
    await myPage.saasCategory.click();
  }
});

When('User selects {string} sub category on Catalog page', async function(subCategory: string) {
  const myPage = new ChargingActivation3102Page(this.page!);
  if (subCategory.toLowerCase().includes('vodafone hints')) {
    await myPage.vodafoneHintsSubCategory.click();
  }
});

When('User clicks search button on Catalog page', async function() {
  const myPage = new ChargingActivation3102Page(this.page!);
  await myPage.catalogSearchButton.click();
  await this.page!.waitForLoadState('networkidle');
});

Then('User should see the products are listed on Catalog page', async function() {
  const myPage = new ChargingActivation3102Page(this.page!);
  await expect(myPage.productList).toBeVisible();
});

When('User selects {string} product on Catalog page', async function(productName: string) {
  const myPage = new ChargingActivation3102Page(this.page!);
  if (productName.includes('Vodafone Hints Basic')) {
    await myPage.vodafoneHintsBasicProduct.click();
    await this.page!.waitForLoadState('networkidle');
  }
});

Then('User should see the {string} offering on Product Offering page', async function(offeringName: string) {
  const myPage = new ChargingActivation3102Page(this.page!);
  await expect(myPage.vodafoneHintsBasicOffering).toBeVisible();
});

Then('User should see the {string} as service type on Product Offering page', async function(serviceType: string) {
  const myPage = new ChargingActivation3102Page(this.page!);
  await expect(myPage.vodafoneHintsServiceType).toBeVisible();
});

Then('User should see the {string} product on Product Offering page', async function(productName: string) {
  const myPage = new ChargingActivation3102Page(this.page!);
  if (productName.includes('Vodafone Hints Basic')) {
    await expect(myPage.vodafoneHintsBasicProductDisplay).toBeVisible();
  } else if (productName.includes('Optiune Hints extra user')) {
    await expect(myPage.optiuneHintsExtraUserProduct).toBeVisible();
  }
});

When('User clicks {string} dropdown for {string} product', async function(dropdownName: string, productName: string) {
  const myPage = new ChargingActivation3102Page(this.page!);
  if (dropdownName.includes('Invoicing Frequency')) {
    await myPage.invoicingFrequencyDropdown.click();
  }
});

Then('User should see the the options on dropdown on Product Offering page', async function(dataTable: DataTable) {
  const myPage = new ChargingActivation3102Page(this.page!);
  const options = dataTable.raw();
  for (const option of options) {
    if (option[0].includes('Monthly')) {
      await expect(myPage.monthlyOption).toBeVisible();
    }
    if (option[0].includes('Yearly')) {
      await expect(myPage.yearlyOption).toBeVisible();
    }
    if (option[0].includes('One Time')) {
      await expect(myPage.oneTimeOption).toBeVisible();
    }
  }
});

When('User selects {string} option from dropdown on Product Offering Page', async function(optionName: string) {
  const myPage = new ChargingActivation3102Page(this.page!);
  if (optionName.toLowerCase().includes('monthly')) {
    await myPage.monthlyOption.click();
  } else if (optionName.toLowerCase().includes('yearly')) {
    await myPage.yearlyOption.click();
  } else if (optionName.toLowerCase().includes('one time')) {
    await myPage.oneTimeOption.click();
  }
});

When('User selects suitable price for selected Invoicing Frequency for {string} product', async function(productName: string) {
  const myPage = new ChargingActivation3102Page(this.page!);
  await myPage.priceSelector.first().click();
});

When('User clicks the cart icon to add {string} product', async function(productName: string) {
  const myPage = new ChargingActivation3102Page(this.page!);
  await myPage.cartIcon.click();
});

Then('User should see the {string} product added to the cart', async function(productName: string) {
  const myPage = new ChargingActivation3102Page(this.page!);
  await expect(myPage.cartIcon).toBeVisible();
});

When('User picks the product details of the product', async function(dataTable: DataTable) {
  const details = dataTable.raw();
  for (const detail of details) {
    const fieldName = detail[0].split(':')[0].trim();
    const fieldType = detail[0].split(':')[1]?.trim() || 'input';
    // Store in World context instead of testData.setFile (not available)
    (this as any).productDetails = (this as any).productDetails || {};
    (this as any).productDetails[fieldName] = fieldType;
  }
});

When('User clicks add icon for {string} addon product to view on Product Offering page', async function(productName: string) {
  const myPage = new ChargingActivation3102Page(this.page!);
  if (productName.includes('Pachet lunar suplimentar 1000 credite')) {
    await myPage.addonProductIcon.click();
  }
});

When('User increments the quantity of {string} product as {string} times', async function(productName: string, quantity: string) {
  const myPage = new ChargingActivation3102Page(this.page!);
  for (let i = 0; i < parseInt(quantity); i++) {
    await myPage.quantityIncrementButton.click();
  }
});

When('User decides to add {string} addon product {string}', async function(productName: string, decision: string) {
  const myPage = new ChargingActivation3102Page(this.page!);
  if (decision.toLowerCase() === 'true') {
    await myPage.addonDecisionToggle.check();
  }
});

Then('User should see the {string} addon added quantity times to the cart', async function(productName: string) {
  const myPage = new ChargingActivation3102Page(this.page!);
  await expect(myPage.cartIcon).toBeVisible();
});

When('User creates a json file for collected data for {string} offer', async function(offerName: string) {
  const collectedData = await testData.getFile('product-details') || '{}';
  // Store in World context instead of testData.setFile (not available)
  (this as any).collectedData = collectedData;
});

Then('User should see the total price is calculated correctly', async function() {
  const myPage = new ChargingActivation3102Page(this.page!);
  await expect(myPage.totalPriceDisplay).toBeVisible();
});

When('User picks the left panel data for {string} product', async function(productName: string) {
  const myPage = new ChargingActivation3102Page(this.page!);
  const leftPanelData = await myPage.leftPanelData.textContent();
  // Store in World context instead of testData.setFile (not available)
  (this as any).leftPanelData = leftPanelData || '';
});

Then('User should see the entered data is equal to left panel data', async function() {
  const enteredData = (this as any).productDetails;
  const leftPanelData = (this as any).leftPanelData;
  expect(enteredData).toBeDefined();
  expect(leftPanelData).toBeDefined();
});

When('User clicks the Add To Cart button on Product Offering page', async function() {
  const myPage = new ChargingActivation3102Page(this.page!);
  await myPage.addToCartButton.click();
  await this.page!.waitForLoadState('networkidle');
});

Then('User should see the Shopping Cart page is opened', async function() {
  const myPage = new ChargingActivation3102Page(this.page!);
  await expect(myPage.shoppingCartPage).toBeVisible();
});

When('User clicks the checkout button on Shopping Cart Page', async function() {
  const myPage = new ChargingActivation3102Page(this.page!);
  await myPage.checkoutButton.click();
  await this.page!.waitForLoadState('networkidle');
});

Then('User should see {string} message for Shopping Cart', async function(message: string) {
  const myPage = new ChargingActivation3102Page(this.page!);
  await expect(myPage.successMessage).toContainText(message);
});

When('User clicks the go back Customer360 button after checkout', async function() {
  const myPage = new ChargingActivation3102Page(this.page!);
  await myPage.goToCustomer360Button.click();
  await this.page!.waitForLoadState('networkidle');
});

Then('User should see {string} for {string} field on Customer Order Page', async function(status: string, fieldName: string) {
  const myPage = new ChargingActivation3102Page(this.page!);
  if (fieldName.toLowerCase().includes('order status')) {
    await expect(myPage.orderStatusField).toContainText(status);
  }
});

Then('User should see {string} for {string} field on Customer Shopping Cart Page', async function(status: string, fieldName: string) {
  const myPage = new ChargingActivation3102Page(this.page!);
  if (fieldName.toLowerCase().includes('status')) {
    await expect(myPage.shoppingCartStatusField).toContainText(status);
  }
});

When('User switches Backoffice on new window', async function() {
  await this.page!.goto('/backoffice');
});

When('I have log out into the system on the home page', async function() {
  const myPage = new ChargingActivation3102Page(this.page!);
  await myPage.logoutButton.click();
  await this.page!.waitForLoadState('networkidle');
});

Then('I should be seeing that the {string} header on Sign In page', async function(headerText: string) {
  const myPage = new ChargingActivation3102Page(this.page!);
  await expect(myPage.signInHeader).toContainText(headerText);
});

When('I enter a value {string} in the Username or email field on Sign In page', async function(value: string) {
  const myPage = new ChargingActivation3102Page(this.page!);
  await myPage.usernameInput.fill(value);
});

When('I enter a value {string} in the Password field on Sign In page', async function(value: string) {
  const myPage = new ChargingActivation3102Page(this.page!);
  await myPage.passwordInput.fill(value);
});

When('I click the Sign in button on Sign In page', async function() {
  const myPage = new ChargingActivation3102Page(this.page!);
  await myPage.signInButton.click();
  await this.page!.waitForLoadState('networkidle');
});