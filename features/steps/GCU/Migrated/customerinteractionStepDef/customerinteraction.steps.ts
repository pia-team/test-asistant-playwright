import { Given, When, Then } from '@cucumber/cucumber';
import { expect, Page } from '@playwright/test';
import { SignInPage } from '../../../../../pages/GCU/Migrated/signInPage/signIn.page';
import { Customer360Page } from '../../../../../pages/GCU/Migrated/customer360Page/customer360.page';
import { CustomerInteractionPage } from '../../../../../pages/GCU/Migrated/customerInteractionPage/customerinteraction.page';

Given('I sign in with valid credentials', async function() {
  const page = this.page as Page;
  const signInPage = new SignInPage(page);
  await signInPage.signIn('nora', '1234');
});

Given('I search for customer by Customer Id {string}', async function(customerId: string) {
  const page = this.page as Page;
  const customer360Page = new Customer360Page(page);
  await customer360Page.searchCustomerById(customerId);
});

When('User clicks the {string} tab on Customer360 Page', async function(tabName: string) {
  const page = this.page as Page;
  const customer360Page = new Customer360Page(page);
  await customer360Page.clickCustomerInteractionTab();
});

Then('User should see the {string} tab is opened on Customer360 Page', async function(tabName: string) {
  const page = this.page as Page;
  const customer360Page = new Customer360Page(page);
  await customer360Page.verifyCustomerInteractionTabOpened();
});

When('User clicks the add button on Customer Account Page', async function() {
  const page = this.page as Page;
  const customer360Page = new Customer360Page(page);
  await customer360Page.clickAddButton();
});

When('User clicks the edit button on Customer Interaction Page', async function() {
  const page = this.page as Page;
  const customerInteractionPage = new CustomerInteractionPage(page);
  await customerInteractionPage.clickEditButton();
});

When('User enters random data to {string} field on Customer Interaction Page', async function(fieldName: string) {
  const page = this.page as Page;
  const customerInteractionPage = new CustomerInteractionPage(page);
  if (fieldName.toLowerCase().includes('reason')) {
    await customerInteractionPage.enterRandomReason();
  } else if (fieldName.toLowerCase().includes('description')) {
    await customerInteractionPage.enterRandomDescription();
  } else if (fieldName.toLowerCase().includes('text')) {
    await customerInteractionPage.enterRandomText();
  }
});

When('User clicks {string} dropdown on Customer Interaction Page', async function(dropdownName: string) {
  const page = this.page as Page;
  const customerInteractionPage = new CustomerInteractionPage(page);
  if (dropdownName.toLowerCase().includes('channel')) {
    await customerInteractionPage.clickChannelDropdown();
  } else if (dropdownName.toLowerCase().includes('direction')) {
    await customerInteractionPage.clickDirectionDropdown();
  } else if (dropdownName.toLowerCase().includes('status')) {
    await customerInteractionPage.clickStatusDropdown();
  }
});

Then('User should see the {string} option on dropdown', async function(optionName: string) {
  const page = this.page as Page;
  const customerInteractionPage = new CustomerInteractionPage(page);
  if (optionName.toLowerCase().includes('call center')) {
    await customerInteractionPage.verifyCallCenterOption();
  } else if (optionName.toLowerCase().includes('inbound')) {
    await customerInteractionPage.verifyInboundOption();
  } else if (optionName.toLowerCase().includes('outbound')) {
    await customerInteractionPage.verifyOutboundOption();
  } else if (optionName.toLowerCase().includes('opened')) {
    await customerInteractionPage.verifyOpenedOption();
  } else if (optionName.toLowerCase().includes('inprogress')) {
    await customerInteractionPage.verifyInProgressOption();
  } else if (optionName.toLowerCase().includes('closed')) {
    await customerInteractionPage.verifyClosedOption();
  }
});

Then('User selects any option from dropdown on Customer Interaction Page', async function() {
  const page = this.page as Page;
  const customerInteractionPage = new CustomerInteractionPage(page);
  const dropdown = customerInteractionPage.page.getByRole('combobox').last();
  await customerInteractionPage.selectAnyDropdownOption(dropdown);
});

Then('User collects the new address data on Customer Interaction Page', async function() {
  const page = this.page as Page;
  const customerInteractionPage = new CustomerInteractionPage(page);
  await customerInteractionPage.collectAddressData();
});

Then('User clicks the save button on Customer Interaction Page', async function() {
  const page = this.page as Page;
  const customerInteractionPage = new CustomerInteractionPage(page);
  await customerInteractionPage.clickSave();
});

Then('User should see the {string} success message', async function(message: string) {
  const page = this.page as Page;
  const customerInteractionPage = new CustomerInteractionPage(page);
  await customerInteractionPage.verifySuccessMessage();
});

Then('User should see the customer address data are {string}d on Customer Interaction Page', async function(action: string) {
  const page = this.page as Page;
  const customerInteractionPage = new CustomerInteractionPage(page);
  if (action.toLowerCase().includes('create')) {
    await customerInteractionPage.verifyAddressDataCreated();
  } else if (action.toLowerCase().includes('update')) {
    await customerInteractionPage.verifyAddressDataUpdated();
  }
});

Then('User should see {string} element as {string} on Customer Interaction Page', async function(elementName: string, state: string) {
  const page = this.page as Page;
  const customerInteractionPage = new CustomerInteractionPage(page);
  if (elementName.toLowerCase().includes('direction') && state.toLowerCase().includes('disabled')) {
    await customerInteractionPage.verifyDirectionDisabled();
  } else if (elementName.toLowerCase().includes('text') && state.toLowerCase().includes('disabled')) {
    await customerInteractionPage.verifyTextDisabled();
  }
});

Then('User adds extra note for interaction on Customer Interaction Page', async function() {
  const page = this.page as Page;
  const customerInteractionPage = new CustomerInteractionPage(page);
  await customerInteractionPage.addExtraNote();
});

Then('User enters {string} to the second note field on Customer Interaction Page', async function(note: string) {
  const page = this.page as Page;
  const customerInteractionPage = new CustomerInteractionPage(page);
  await customerInteractionPage.enterSecondNote(note);
});