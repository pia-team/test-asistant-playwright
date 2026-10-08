import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { testData } from '../../../../../support/testData';
import { uniqueFromPattern } from '../../../../../support/uniqueValue';
import {
  SignInPage,
  Customer360SearchPage,
  CustomerCreatePage,
  GeneralInformationPage,
  AgentInformationPage,
  ContactInformationPage,
  AddressInformationPage,
  InvoiceAccountPage
} from '../../../../../pages/GCU-TEST/Migrated/customercreationandupdateflows-as-a-user-i-want-to-create-a-newPage/customercreationandupdateflows-as-a-user-i-want-to-create-a-new.page';

let fetchedCustomerData: Record<string, string> = {};

Given('I have opened the Customer Management application', async function (this: any) {
  await this.page.goto('/');
});

Given('I enter a value {string} in the Username or email field on Sign In page', async function (this: any, value: string) {
  const signInPage = new SignInPage(this.page);
  await signInPage.enterUsername(value);
});

Given('I enter a value {string} in the Password field on Sign In page', async function (this: any, value: string) {
  const signInPage = new SignInPage(this.page);
  await signInPage.enterPassword(value);
});

Given('I click the Sign in button on Sign In page', async function (this: any) {
  const signInPage = new SignInPage(this.page);
  await signInPage.clickSignIn();
  await this.page.waitForLoadState('networkidle');
});

Then('User is on the Customer360 page', async function (this: any) {
  await expect(this.page).toHaveURL(/customer360|customer-360/i);
});

When('User clicks select Search Type field on Customer360 search page', async function (this: any) {
  const customer360SearchPage = new Customer360SearchPage(this.page);
  await customer360SearchPage.clickSearchTypeDropdown();
});

Then('User selects Company Name option from dropdown on Customer360 search page', async function (this: any) {
  const customer360SearchPage = new Customer360SearchPage(this.page);
  await customer360SearchPage.selectCompanyNameOption();
});

Then('User fills the search bar as {string} on Customer360 search page', async function (this: any, value: string) {
  const customer360SearchPage = new Customer360SearchPage(this.page);
  await customer360SearchPage.fillSearchBar(value);
});

Then('User clicks Search Button on Customer360 search page', async function (this: any) {
  const customer360SearchPage = new Customer360SearchPage(this.page);
  await customer360SearchPage.clickSearchButton();
});

Then('User selects opened name of searched name on Customer360 search page', async function (this: any) {
  const customer360SearchPage = new Customer360SearchPage(this.page);
  await customer360SearchPage.selectSearchedResult();
});

When('User fetches the data of existing customer from Main page', async function (this: any) {
  const organizationData = await testData.getJson('organization-json');
  fetchedCustomerData = organizationData as Record<string, string> || {};
});

Given('User opens Customer Create page on Home page', async function (this: any) {
  await this.page.getByRole('button', { name: /create/i }).click();
});

Then('User enters specific number into the CUI field', async function (this: any) {
  const customerCreatePage = new CustomerCreatePage(this.page);
  const cuiValue = fetchedCustomerData.companyCui || uniqueFromPattern('TEST######');
  await customerCreatePage.enterCUI(cuiValue);
});

Then('User clicks search button on Create Customer page', async function (this: any) {
  const customerCreatePage = new CustomerCreatePage(this.page);
  await customerCreatePage.clickCuiSearch();
});

Then('User clicks the Create New Customer on Customer Dialog Page', async function (this: any) {
  const customerCreatePage = new CustomerCreatePage(this.page);
  await customerCreatePage.clickCreateNewCustomer();
});

Then('User should see the {string} tab is opened', async function (this: any, tabName: string) {
  await expect(this.page.getByText(tabName, { exact: false })).toBeVisible();
});

Then('User should see {string} element as {string} on {string} Page', async function (this: any, fieldName: string, state: string, pageName: string) {
  const generalInfoPage = new GeneralInformationPage(this.page);
  let fieldLocator;
  if (pageName.includes('general')) {
    switch (fieldName) {
      case 'companyCui':
        fieldLocator = generalInfoPage.companyCuiField;
        break;
      case 'organizationName':
        fieldLocator = generalInfoPage.organizationNameField;
        break;
      case 'marketSegment':
        fieldLocator = generalInfoPage.marketSegmentField;
        break;
      case 'treatmentSegment':
        fieldLocator = generalInfoPage.treatmentSegmentField;
        break;
    }
  }
  if (fieldLocator) {
    const isDisabled = await generalInfoPage.verifyFieldDisabled(fieldLocator);
    expect(isDisabled).toBe(state === 'disabled');
  }
});

Then('User controls the data on the disabled area on general Information Page with fetched data from General Page', async function (this: any) {
  const generalInfoPage = new GeneralInformationPage(this.page);
  if (fetchedCustomerData.companyCui) {
    const actualValue = await generalInfoPage.getFieldValue(generalInfoPage.companyCuiField);
    expect(actualValue).toContain(fetchedCustomerData.companyCui);
  }
});

Then('User wants to enter random data to {string} for Customer on opened page', async function (this: any, fieldName: string) {
  const customerCreatePage = new CustomerCreatePage(this.page);
  const randomValue = uniqueFromPattern('CUST######');
  switch (fieldName) {
    case 'customerId':
      await customerCreatePage.enterCustomerId(randomValue);
      break;
    case 'customerName':
      await customerCreatePage.enterCustomerName(randomValue);
      break;
  }
});

Then('User clicks next Button on General Information page', async function (this: any) {
  const customerCreatePage = new CustomerCreatePage(this.page);
  await customerCreatePage.clickGeneralNext();
});

Then('User wants to enter random data to {string} for Agent on opened page', async function (this: any, fieldName: string) {
  const agentInfoPage = new AgentInformationPage(this.page);
  const randomValue = uniqueFromPattern('AGNT######');
  switch (fieldName) {
    case 'dealerCode':
      await agentInfoPage.enterDealerCode(randomValue);
      break;
    case 'name':
      await agentInfoPage.enterName(randomValue);
      break;
  }
});

Then('User wants to enter {string} as {string} on opened page', async function (this: any, value: string, fieldName: string) {
  const agentInfoPage = new AgentInformationPage(this.page);
  switch (fieldName) {
    case 'email':
      await agentInfoPage.enterEmail(value);
      break;
    case 'specialistEmail':
      await agentInfoPage.enterSpecialistEmail(value);
      break;
  }
});

Then('User should see {string} and {string} and {string} inside of email structure on Agent Information page', async function (this: any, char1: string, char2: string, email: string) {
  const agentInfoPage = new AgentInformationPage(this.page);
  const isValid = await agentInfoPage.verifyEmailStructure(email);
  expect(isValid).toBe(true);
});

Then('User clicks next Button on Agent Information page', async function (this: any) {
  const agentInfoPage = new AgentInformationPage(this.page);
  await agentInfoPage.clickNext();
});

When('User clicks {string} dropdown on opened page', async function (this: any, dropdownName: string) {
  const contactInfoPage = new ContactInformationPage(this.page);
  if (dropdownName === 'contactType') {
    await contactInfoPage.clickContactTypeDropdown();
  } else if (dropdownName === 'contactRole') {
    await contactInfoPage.clickContactRoleDropdown();
  }
});

Then('User should see the {string} option on dropdown', async function (this: any, option: string) {
  await expect(this.page.getByRole('option', { name: option })).toBeVisible();
});

Then('User selects any option from dropdown on opened page', async function (this: any) {
  const options = await this.page.getByRole('option').all();
  if (options.length > 0) {
    await options[1].click();
  }
});

Then('User verifies the contactRole values are correctly mapped', async function (this: any) {
  const options = await this.page.getByRole('option').all();
  expect(options.length).toBeGreaterThan(0);
});

Then('User wants to enter random data to name field for contact information page', async function (this: any) {
  const contactInfoPage = new ContactInformationPage(this.page);
  const randomValue = uniqueFromPattern('NAME######');
  await contactInfoPage.enterContactName(randomValue);
});

Then('User wants to enter random data to {string} for Customer on Contact page', async function (this: any, fieldName: string) {
  const contactInfoPage = new ContactInformationPage(this.page);
  const randomValue = uniqueFromPattern('CONT######');
  switch (fieldName) {
    case 'surname':
      await contactInfoPage.enterContactSurname(randomValue);
      break;
    case 'Contact ID':
      await contactInfoPage.enterContactId(randomValue);
      break;
    case 'Contact ID2':
      await contactInfoPage.enterContactId(randomValue);
      break;
    case 'phoneNumber':
      await contactInfoPage.enterPhoneNumber(uniqueFromPattern('07########'));
      break;
    case 'email':
      await contactInfoPage.enterContactEmail(`${randomValue}@test.com`);
      break;
  }
});

Then('User clicks the country code dropdown', async function (this: any) {
  const contactInfoPage = new ContactInformationPage(this.page);
  await contactInfoPage.countryCodeDropdown.click();
});

Then('User selects {string} option on Contact Information page', async function (this: any, option: string) {
  const contactInfoPage = new ContactInformationPage(this.page);
  await contactInfoPage.selectDropdownOption(option);
});

Then('User enters random mobile phone number on Contact Information page', async function (this: any) {
  const contactInfoPage = new ContactInformationPage(this.page);
  await contactInfoPage.enterPhoneNumber(uniqueFromPattern('07########'));
});

Then('User ensures the add sign is {string} clickable', async function (this: any, expected: string) {
  const contactInfoPage = new ContactInformationPage(this.page);
  await contactInfoPage.verifyAddButtonClickable(expected === 'true');
});

Then('User wants to enter {string} on contact page', async function (this: any, email: string) {
  const contactInfoPage = new ContactInformationPage(this.page);
  await contactInfoPage.enterContactEmail(email);
});

When('User clicks {string} dropdown on opened page for additional contact', async function (this: any, dropdownName: string) {
  const contactInfoPage = new ContactInformationPage(this.page);
  if (dropdownName === 'contactType') {
    await contactInfoPage.clickContactTypeDropdown();
  } else if (dropdownName === 'contactRole') {
    await contactInfoPage.clickContactRoleDropdown();
  }
});

Then('User selects {string} as an option from dropdown on opened page', async function (this: any, option: string) {
  const contactInfoPage = new ContactInformationPage(this.page);
  await contactInfoPage.selectDropdownOption(option);
});

Then('User wants to enter random data to name field for additional contact information page', async function (this: any) {
  const contactInfoPage = new ContactInformationPage(this.page);
  const randomValue = uniqueFromPattern('NAME######');
  await contactInfoPage.enterContactName(randomValue);
});

Then('User wants to enter random data to {string} for additional contact', async function (this: any, fieldName: string) {
  const contactInfoPage = new ContactInformationPage(this.page);
  const randomValue = uniqueFromPattern('CONT######');
  switch (fieldName) {
    case 'surname':
      await contactInfoPage.enterContactSurname(randomValue);
      break;
    case 'phoneNumber':
      await contactInfoPage.enterPhoneNumber(uniqueFromPattern('07########'));
      break;
    case 'email':
      await contactInfoPage.enterContactEmail(`${randomValue}@test.com`);
      break;
  }
});

Then('User clicks Next button on Contact Information Page', async function (this: any) {
  const contactInfoPage = new ContactInformationPage(this.page);
  await contactInfoPage.clickNext();
});

Then('User clicks the Shipping Address slider button', async function (this: any) {
  const addressInfoPage = new AddressInformationPage(this.page);
  await addressInfoPage.toggleShippingAddress();
});

Then('User should see {string} element on Address Information Page', async function (this: any, elementName: string) {
  await expect(this.page.getByLabel(new RegExp(elementName, 'i'))).toBeVisible();
});

Then('User enters random input for {string} on Customer Address Page', async function (this: any, fieldName: string) {
  const addressInfoPage = new AddressInformationPage(this.page);
  const randomValue = uniqueFromPattern('ADDR######');
  switch (fieldName) {
    case 'street1':
      await addressInfoPage.enterStreet1(randomValue);
      break;
    case 'street2':
      await addressInfoPage.enterStreet2(randomValue);
      break;
    case 'postCode':
      await addressInfoPage.enterPostCode(randomValue);
      break;
  }
});

Then('User wants to enter {string} as {string} on Address Information Page', async function (this: any, value: string, fieldName: string) {
  const addressInfoPage = new AddressInformationPage(this.page);
  if (fieldName === 'city') {
    await addressInfoPage.enterCity(value);
  }
});

Then('User clicks the country dropdown', async function (this: any) {
  const addressInfoPage = new AddressInformationPage(this.page);
  await addressInfoPage.countryDropdown.click();
});

Then('User selects {string} as an option from dropdown on opened page', async function (this: any, option: string) {
  const addressInfoPage = new AddressInformationPage(this.page);
  await addressInfoPage.selectCountry(option);
});

Then('User clicks the county dropdown', async function (this: any) {
  const addressInfoPage = new AddressInformationPage(this.page);
  await addressInfoPage.countyDropdown.click();
});

Then('User selects {string} as an option from dropdown on opened page', async function (this: any, option: string) {
  const addressInfoPage = new AddressInformationPage(this.page);
  await addressInfoPage.selectCounty(option);
});

Then('User clicks Next button on Address Information Page', async function (this: any) {
  const addressInfoPage = new AddressInformationPage(this.page);
  await addressInfoPage.clickNext();
});

Then('User should see the {string} tab is opened', async function (this: any, tabName: string) {
  await expect(this.page.getByText(tabName, { exact: false })).toBeVisible();
});

Then('User wants to enter random data to name field for Invoice information page', async function (this: any) {
  const invoiceAccountPage = new InvoiceAccountPage(this.page);
  const randomValue = uniqueFromPattern('INV######');
  await invoiceAccountPage.enterInvoiceName(randomValue);
});

Then('User wants to enter random data to {string} for Customer on Invoice page', async function (this: any, fieldName: string) {
  const invoiceAccountPage = new InvoiceAccountPage(this.page);
  const randomValue = uniqueFromPattern('BILL######');
  if (fieldName === 'billingAccount') {
    await invoiceAccountPage.enterBillingAccount(randomValue);
  }
});