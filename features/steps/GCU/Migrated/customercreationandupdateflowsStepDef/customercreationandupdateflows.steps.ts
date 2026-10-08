import { Given, When, Then } from '@cucumber/cucumber';
import { expect, Page } from '@playwright/test';
import { SignInPage } from '../../../../../pages/GCU/Migrated/signInPage/signIn.page';
import { Customer360Page } from '../../../../../pages/GCU/Migrated/customer360Page/customer360.page';
import { CustomerCreationPage } from '../../../../../pages/GCU/Migrated/customerCreationPage/customercreation.page';

Given('User is on the Customer360 page', async function() {
  const page = this.page as Page;
  const customer360Page = new Customer360Page(page);
  await customer360Page.navigate();
});

When('User clicks select Search Type field on Customer360 search page', async function() {
  const page = this.page as Page;
  const customer360Page = new Customer360Page(page);
  await customer360Page.searchTypeDropdown.click();
});

Then('User selects Company Name option from dropdown on Customer360 search page', async function() {
  const page = this.page as Page;
  const customer360Page = new Customer360Page(page);
  await customer360Page.selectSearchType('Company Name');
});

Then('User fills the search bar as {string} on Customer360 search page', async function(searchTerm: string) {
  const page = this.page as Page;
  const customer360Page = new Customer360Page(page);
  await customer360Page.enterSearchTerm(searchTerm);
});

Then('User clicks Search Button on Customer360 search page', async function() {
  const page = this.page as Page;
  const customer360Page = new Customer360Page(page);
  await customer360Page.clickSearch();
});

Then('User selects opened name of searched name on Customer360 search page', async function() {
  const page = this.page as Page;
  const customer360Page = new Customer360Page(page);
  await customer360Page.selectCustomerResult();
});

When('User fetches the data of existing customer from Main page', async function() {
  const page = this.page as Page;
  const customer360Page = new Customer360Page(page);
  await customer360Page.fetchCustomerData();
});

Given('User opens Customer Create page on Home page', async function() {
  const page = this.page as Page;
  const customer360Page = new Customer360Page(page);
  await customer360Page.openCustomerCreatePage();
});

Then('User enters specific number into the CUI field', async function() {
  const page = this.page as Page;
  const customer360Page = new Customer360Page(page);
  await customer360Page.enterCUI('12345678');
});

Then('User clicks search button on Create Customer page', async function() {
  const page = this.page as Page;
  const customer360Page = new Customer360Page(page);
  await customer360Page.clickCuiSearch();
});

Then('User clicks the Create New Customer on Customer Dialog Page', async function() {
  const page = this.page as Page;
  const customer360Page = new Customer360Page(page);
  await customer360Page.clickCreateNewCustomer();
});

Then('User should see the {string} tab is opened', async function(tabName: string) {
  const page = this.page as Page;
  const customerCreationPage = new CustomerCreationPage(page);
  if (tabName.toLowerCase().includes('general')) {
    await customerCreationPage.verifyGeneralInfoTabOpened();
  } else if (tabName.toLowerCase().includes('agent')) {
    await customerCreationPage.verifyAgentInfoTabOpened();
  } else if (tabName.toLowerCase().includes('contact')) {
    await customerCreationPage.verifyContactInfoTabOpened();
  } else if (tabName.toLowerCase().includes('address')) {
    await customerCreationPage.verifyAddressInfoTabOpened();
  } else if (tabName.toLowerCase().includes('invoice')) {
    await customerCreationPage.verifyInvoiceInfoTabOpened();
  }
});

Then('User should see {string} element as {string} on General Information Page', async function(elementName: string, state: string) {
  const page = this.page as Page;
  const customerCreationPage = new CustomerCreationPage(page);
  if (elementName.toLowerCase().includes('companycui')) {
    await customerCreationPage.verifyCompanyCuiDisabled();
  } else if (elementName.toLowerCase().includes('organizationname')) {
    await customerCreationPage.verifyOrganizationNameDisabled();
  } else if (elementName.toLowerCase().includes('marketsegment')) {
    await customerCreationPage.verifyMarketSegmentDisabled();
  } else if (elementName.toLowerCase().includes('treatmentsegment')) {
    await customerCreationPage.verifyTreatmentSegmentDisabled();
  }
});

Then('User controls the data on the disabled area on general Information Page with fetched data from General Page', async function() {
  const page = this.page as Page;
  const customerCreationPage = new CustomerCreationPage(page);
  await expect(customerCreationPage.companyCuiField).toBeVisible();
  await expect(customerCreationPage.organizationNameField).toBeVisible();
});

Then('User enters random data to {string} field on General Information Page', async function(fieldName: string) {
  const page = this.page as Page;
  const customerCreationPage = new CustomerCreationPage(page);
  if (fieldName.toLowerCase().includes('customerid')) {
    await customerCreationPage.enterRandomCustomerId();
  } else if (fieldName.toLowerCase().includes('customername')) {
    await customerCreationPage.enterRandomCustomerName();
  }
});

Then('User clicks next Button on General Information page', async function() {
  const page = this.page as Page;
  const customerCreationPage = new CustomerCreationPage(page);
  await customerCreationPage.clickNextGeneral();
});

Then('User enters random data to {string} field on Agent Information Page', async function(fieldName: string) {
  const page = this.page as Page;
  const customerCreationPage = new CustomerCreationPage(page);
  if (fieldName.toLowerCase().includes('dealercode')) {
    await customerCreationPage.enterRandomDealerCode();
  } else if (fieldName.toLowerCase().includes('name')) {
    await customerCreationPage.enterRandomAgentName();
  }
});

Then('User enters {string} as {string} on Agent Information Page', async function(email: string, fieldName: string) {
  const page = this.page as Page;
  const customerCreationPage = new CustomerCreationPage(page);
  if (fieldName.toLowerCase().includes('email')) {
    await customerCreationPage.enterEmail(email);
  } else if (fieldName.toLowerCase().includes('specialistemail')) {
    await customerCreationPage.enterSpecialistEmail(email);
  }
});

Then('User should see {string} and {string} and {string} inside of email structure on Agent Information page', async function(char1: string, char2: string, email: string) {
  const page = this.page as Page;
  const customerCreationPage = new CustomerCreationPage(page);
  await customerCreationPage.verifyEmailStructure(email);
});

Then('User clicks next Button on Agent Information page', async function() {
  const page = this.page as Page;
  const customerCreationPage = new CustomerCreationPage(page);
  await customerCreationPage.clickNextAgent();
});

When('User clicks {string} dropdown on Contact Information Page', async function(dropdownName: string) {
  const page = this.page as Page;
  const customerCreationPage = new CustomerCreationPage(page);
  if (dropdownName.toLowerCase().includes('contacttype')) {
    await customerCreationPage.clickContactTypeDropdown();
  } else if (dropdownName.toLowerCase().includes('contactrole')) {
    await customerCreationPage.clickContactRoleDropdown();
  }
});

Then('User verifies the contactRole values are correctly mapped', async function() {
  const page = this.page as Page;
  const customerCreationPage = new CustomerCreationPage(page);
  await customerCreationPage.verifyContactRoleValues();
});

Then('User selects any option from dropdown on Contact Information Page', async function() {
  const page = this.page as Page;
  const customerCreationPage = new CustomerCreationPage(page);
  await customerCreationPage.selectAnyContactTypeOption();
});

Then('User selects {string} as an option from dropdown on Contact Information Page', async function(option: string) {
  const page = this.page as Page;
  const customerCreationPage = new CustomerCreationPage(page);
  if (option.toLowerCase().includes('customer contact')) {
    await customerCreationPage.selectCustomerContactOption();
  }
});

Then('User enters random data to name field on Contact Information Page', async function() {
  const page = this.page as Page;
  const customerCreationPage = new CustomerCreationPage(page);
  await customerCreationPage.enterRandomContactName();
});

Then('User enters random data to {string} field on Contact Information Page', async function(fieldName: string) {
  const page = this.page as Page;
  const customerCreationPage = new CustomerCreationPage(page);
  if (fieldName.toLowerCase().includes('surname')) {
    await customerCreationPage.enterRandomContactSurname();
  } else if (fieldName.toLowerCase().includes('contact id')) {
    await customerCreationPage.enterRandomContactId();
  }
});

Then('User clicks the country code dropdown on Contact Information Page', async function() {
  const page = this.page as Page;
  const customerCreationPage = new CustomerCreationPage(page);
  await customerCreationPage.clickCountryCodeDropdown();
});

Then('User selects {string} option on Contact Information Page', async function(code: string) {
  const page = this.page as Page;
  const customerCreationPage = new CustomerCreationPage(page);
  await customerCreationPage.selectCountryCode(code);
});

Then('User enters random mobile phone number on Contact Information Page', async function() {
  const page = this.page as Page;
  const customerCreationPage = new CustomerCreationPage(page);
  await customerCreationPage.enterRandomPhoneNumber();
});

Then('User ensures the add sign is {string} clickable on Contact Information Page', async function(state: string) {
  const page = this.page as Page;
  const customerCreationPage = new CustomerCreationPage(page);
  if (state.toLowerCase().includes('false')) {
    await customerCreationPage.verifyAddSignNotClickable();
  } else if (state.toLowerCase().includes('true')) {
    await customerCreationPage.verifyAddSignClickable();
  }
});

Then('User enters {string} on Contact Information Page', async function(email: string) {
  const page = this.page as Page;
  const customerCreationPage = new CustomerCreationPage(page);
  await customerCreationPage.enterContactEmail(email);
});

Then('User should see {string} and {string} and {string} inside of email structure on Contact Information page', async function(char1: string, char2: string, email: string) {
  const page = this.page as Page;
  const customerCreationPage = new CustomerCreationPage(page);
  await customerCreationPage.verifyContactEmailStructure(email);
});

When('User clicks {string} dropdown on Contact Information Page for additional contact', async function(dropdownName: string) {
  const page = this.page as Page;
  const customerCreationPage = new CustomerCreationPage(page);
  if (dropdownName.toLowerCase().includes('contacttype')) {
    await customerCreationPage.clickContactTypeDropdownForAdditional();
  } else if (dropdownName.toLowerCase().includes('contactrole')) {
    await customerCreationPage.clickContactRoleDropdownForAdditional();
  }
});

Then('User enters random data to name field for additional contact on Contact Information Page', async function() {
  const page = this.page as Page;
  const customerCreationPage = new CustomerCreationPage(page);
  await customerCreationPage.enterRandomAdditionalContactName();
});

Then('User enters random data to {string} for additional contact on Contact Information Page', async function(fieldName: string) {
  const page = this.page as Page;
  const customerCreationPage = new CustomerCreationPage(page);
  if (fieldName.toLowerCase().includes('surname')) {
    await customerCreationPage.enterRandomAdditionalContactSurname();
  } else if (fieldName.toLowerCase().includes('contact id')) {
    await customerCreationPage.enterRandomContactId2();
  } else if (fieldName.toLowerCase().includes('phonenumber')) {
    await customerCreationPage.enterRandomAdditionalPhoneNumber();
  } else if (fieldName.toLowerCase().includes('email')) {
    await customerCreationPage.enterRandomAdditionalEmail();
  }
});

Then('User clicks Next button on Contact Information Page', async function() {
  const page = this.page as Page;
  const customerCreationPage = new CustomerCreationPage(page);
  await customerCreationPage.clickNextContact();
});

Then('User clicks the Shipping Address slider button on Address Information Page', async function() {
  const page = this.page as Page;
  const customerCreationPage = new CustomerCreationPage(page);
  await customerCreationPage.clickShippingAddressSlider();
});

Then('User should see {string} element on Address Information Page', async function(elementName: string) {
  const page = this.page as Page;
  const customerCreationPage = new CustomerCreationPage(page);
  if (elementName.toLowerCase().includes('contacttype')) {
    await customerCreationPage.verifyContactTypeElement();
  } else if (elementName.toLowerCase().includes('street1')) {
    await customerCreationPage.verifyStreet1Element();
  } else if (elementName.toLowerCase().includes('street2')) {
    await customerCreationPage.verifyStreet2Element();
  } else if (elementName.toLowerCase().includes('postcode')) {
    await customerCreationPage.verifyPostCodeElement();
  } else if (elementName.toLowerCase().includes('city')) {
    await customerCreationPage.verifyCityElement();
  } else if (elementName.toLowerCase().includes('servicecontacttype')) {
    await customerCreationPage.verifyServiceContactTypeElement();
  } else if (elementName.toLowerCase().includes('servicestreet1')) {
    await customerCreationPage.verifyServiceStreet1Element();
  } else if (elementName.toLowerCase().includes('servicestreet2')) {
    await customerCreationPage.verifyServiceStreet2Element();
  } else if (elementName.toLowerCase().includes('servicepostcode')) {
    await customerCreationPage.verifyServicePostCodeElement();
  } else if (elementName.toLowerCase().includes('servicecity')) {
    await customerCreationPage.verifyServiceCityElement();
  } else if (elementName.toLowerCase().includes('select')) {
    await customerCreationPage.verifySelectElements();
  }
});

Then('User enters random input for {string} on Customer Address Page', async function(fieldName: string) {
  const page = this.page as Page;
  const customerCreationPage = new CustomerCreationPage(page);
  if (fieldName.toLowerCase().includes('street1')) {
    await customerCreationPage.enterRandomStreet1();
  } else if (fieldName.toLowerCase().includes('street2')) {
    await customerCreationPage.enterRandomStreet2();
  } else if (fieldName.toLowerCase().includes('postcode')) {
    await customerCreationPage.enterRandomPostCode();
  }
});

Then('User enters {string} as {string} on Address Information Page', async function(value: string, fieldName: string) {
  const page = this.page as Page;
  const customerCreationPage = new CustomerCreationPage(page);
  if (fieldName.toLowerCase().includes('city')) {
    await customerCreationPage.enterCity(value);
  }
});

Then('User clicks the country dropdown on Address Information Page', async function() {
  const page = this.page as Page;
  const customerCreationPage = new CustomerCreationPage(page);
  await customerCreationPage.clickCountryDropdown();
});

Then('User selects {string} as an option from dropdown on Address Information Page', async function(option: string) {
  const page = this.page as Page;
  const customerCreationPage = new CustomerCreationPage(page);
  if (option.toLowerCase().includes('romania')) {
    await customerCreationPage.selectCountry('ROMANIA');
  } else if (option.toLowerCase().includes('alba')) {
    await customerCreationPage.selectCounty('Alba');
  }
});

Then('User clicks the county dropdown on Address Information Page', async function() {
  const page = this.page as Page;
  const customerCreationPage = new CustomerCreationPage(page);
  await customerCreationPage.clickCountyDropdown();
});

Then('User clicks Next button on Address Information Page', async function() {
  const page = this.page as Page;
  const customerCreationPage = new CustomerCreationPage(page);
  await customerCreationPage.clickNextAddress();
});

Then('User enters random data to name field for Invoice Information Page', async function() {
  const page = this.page as Page;
  const customerCreationPage = new CustomerCreationPage(page);
  await customerCreationPage.enterRandomInvoiceName();
});

Then('User enters random data to {string} field on Invoice Information Page', async function(fieldName: string) {
  const page = this.page as Page;
  const customerCreationPage = new CustomerCreationPage(page);
  if (fieldName.toLowerCase().includes('billingaccount')) {
    await customerCreationPage.enterRandomBillingAccount();
  }
});

Then('User should see {string} element on Invoice Account Page', async function(elementName: string) {
  const page = this.page as Page;
  const customerCreationPage = new CustomerCreationPage(page);
  if (elementName.toLowerCase().includes('currency')) {
    await customerCreationPage.verifyCurrencyElement();
  }
});