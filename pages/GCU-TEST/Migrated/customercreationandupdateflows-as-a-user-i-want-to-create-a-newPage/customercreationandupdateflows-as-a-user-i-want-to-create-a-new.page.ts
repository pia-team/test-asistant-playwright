import { Page, Locator } from '@playwright/test';

export class SignInPage {
  readonly page: Page;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly signInButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameField = page.getByLabel(/username|email/i);
    this.passwordField = page.getByLabel('Password', { exact: false });
    this.signInButton = page.getByRole('button', { name: /sign in|login/i });
  }

  async enterUsername(username: string): Promise<void> {
    await this.usernameField.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordField.fill(password);
  }

  async clickSignIn(): Promise<void> {
    await this.signInButton.click();
  }
}

export class Customer360SearchPage {
  readonly page: Page;
  readonly searchTypeDropdown: Locator;
  readonly companyNameOption: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchResultItem: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchTypeDropdown = page.getByRole('combobox', { name: /search type/i });
    this.companyNameOption = page.getByRole('option', { name: /company name/i });
    this.searchInput = page.locator('.search-wrapper input');
    this.searchButton = page.getByRole('button', { name: /search/i });
    this.searchResultItem = page.locator('[role="listbox"] .mat-option-text').first();
  }

  async clickSearchTypeDropdown(): Promise<void> {
    await this.searchTypeDropdown.click();
  }

  async selectCompanyNameOption(): Promise<void> {
    await this.companyNameOption.click();
  }

  async fillSearchBar(value: string): Promise<void> {
    await this.searchInput.fill(value);
  }

  async clickSearchButton(): Promise<void> {
    await this.searchButton.click();
  }

  async selectSearchedResult(): Promise<void> {
    await this.searchResultItem.click();
  }
}

export class CustomerCreatePage {
  readonly page: Page;
  readonly cuiField: Locator;
  readonly cuiSearchButton: Locator;
  readonly createNewCustomerButton: Locator;
  readonly customerIdField: Locator;
  readonly customerNameField: Locator;
  readonly generalNextButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cuiField = page.getByLabel(/cui|company cui/i);
    this.cuiSearchButton = page.getByRole('button', { name: /search/i }).first();
    this.createNewCustomerButton = page.getByRole('button', { name: /create new customer/i });
    this.customerIdField = page.getByLabel(/customer id/i);
    this.customerNameField = page.getByLabel(/customer name/i);
    this.generalNextButton = page.getByRole('button', { name: /next/i }).first();
  }

  async enterCUI(value: string): Promise<void> {
    await this.cuiField.fill(value);
  }

  async clickCuiSearch(): Promise<void> {
    await this.cuiSearchButton.click();
  }

  async clickCreateNewCustomer(): Promise<void> {
    await this.createNewCustomerButton.click();
  }

  async enterCustomerId(value: string): Promise<void> {
    await this.customerIdField.fill(value);
  }

  async enterCustomerName(value: string): Promise<void> {
    await this.customerNameField.fill(value);
  }

  async clickGeneralNext(): Promise<void> {
    await this.generalNextButton.click();
  }
}

export class GeneralInformationPage {
  readonly page: Page;
  readonly companyCuiField: Locator;
  readonly organizationNameField: Locator;
  readonly marketSegmentField: Locator;
  readonly treatmentSegmentField: Locator;

  constructor(page: Page) {
    this.page = page;
    this.companyCuiField = page.locator('app-corporate-customer-general [formcontrolname="companyCui"]');
    this.organizationNameField = page.locator('app-corporate-customer-general [formcontrolname="organizationName"]');
    this.marketSegmentField = page.locator('app-corporate-customer-general [formcontrolname="marketSegment"]');
    this.treatmentSegmentField = page.locator('app-corporate-customer-general [formcontrolname="treatmentSegment"]');
  }

  async verifyFieldDisabled(locator: Locator): Promise<boolean> {
    return await locator.isDisabled();
  }

  async getFieldValue(locator: Locator): Promise<string> {
    return await locator.inputValue();
  }
}

export class AgentInformationPage {
  readonly page: Page;
  readonly dealerCodeField: Locator;
  readonly nameField: Locator;
  readonly emailField: Locator;
  readonly specialistEmailField: Locator;
  readonly agentNextButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dealerCodeField = page.getByLabel(/dealer code/i);
    this.nameField = page.getByLabel(/name/i).first();
    this.emailField = page.getByLabel(/email/i).first();
    this.specialistEmailField = page.getByLabel(/specialist email/i);
    this.agentNextButton = page.locator('#agent-information-next-button');
  }

  async enterDealerCode(value: string): Promise<void> {
    await this.dealerCodeField.fill(value);
  }

  async enterName(value: string): Promise<void> {
    await this.nameField.fill(value);
  }

  async enterEmail(value: string): Promise<void> {
    await this.emailField.fill(value);
  }

  async enterSpecialistEmail(value: string): Promise<void> {
    await this.specialistEmailField.fill(value);
  }

  async clickNext(): Promise<void> {
    await this.agentNextButton.click();
  }

  async verifyEmailStructure(email: string): Promise<boolean> {
    const inputValue = await this.emailField.inputValue();
    return inputValue.includes('.') && inputValue.includes('@') && inputValue.includes(email);
  }
}

export class ContactInformationPage {
  readonly page: Page;
  readonly contactTypeDropdown: Locator;
  readonly contactRoleDropdown: Locator;
  readonly contactNameField: Locator;
  readonly contactSurnameField: Locator;
  readonly countryCodeDropdown: Locator;
  readonly phoneNumberField: Locator;
  readonly contactIdField: Locator;
  readonly contactEmailField: Locator;
  readonly addContactButton: Locator;
  readonly contactNextButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.contactTypeDropdown = page.locator('[formcontrolname="contactType"]');
    this.contactRoleDropdown = page.locator('[formcontrolname="contactRole"]');
    this.contactNameField = page.locator('app-customer-contact-medium input[formcontrolname="name"]').first();
    this.contactSurnameField = page.getByLabel(/surname/i).first();
    this.countryCodeDropdown = page.locator('[formcontrolname="phoneCode"]');
    this.phoneNumberField = page.locator('[formcontrolname="phoneNumber"]');
    this.contactIdField = page.getByLabel(/contact id/i).first();
    this.contactEmailField = page.locator('app-customer-contact-medium input[formcontrolname="email"]').first();
    this.addContactButton = page.locator('app-customer-contact-medium button').filter({ hasText: /add/i });
    this.contactNextButton = page.locator('#contact-information-next-button');
  }

  async clickContactTypeDropdown(): Promise<void> {
    await this.contactTypeDropdown.click();
  }

  async clickContactRoleDropdown(): Promise<void> {
    await this.contactRoleDropdown.click();
  }

  async selectDropdownOption(option: string): Promise<void> {
    await this.page.getByRole('option', { name: option }).click();
  }

  async enterContactName(value: string): Promise<void> {
    await this.contactNameField.fill(value);
  }

  async enterContactSurname(value: string): Promise<void> {
    await this.contactSurnameField.fill(value);
  }

  async selectCountryCode(code: string): Promise<void> {
    await this.countryCodeDropdown.click();
    await this.page.getByRole('option', { name: code }).click();
  }

  async enterPhoneNumber(value: string): Promise<void> {
    await this.phoneNumberField.fill(value);
  }

  async enterContactId(value: string): Promise<void> {
    await this.contactIdField.fill(value);
  }

  async enterContactEmail(value: string): Promise<void> {
    await this.contactEmailField.fill(value);
  }

  async verifyAddButtonClickable(expected: boolean): Promise<void> {
    const isClickable = await this.addContactButton.isEnabled();
    if (expected !== isClickable) {
      throw new Error(`Add button clickable state mismatch. Expected: ${expected}, Actual: ${isClickable}`);
    }
  }

  async clickNext(): Promise<void> {
    await this.contactNextButton.click();
  }
}

export class AddressInformationPage {
  readonly page: Page;
  readonly shippingAddressToggle: Locator;
  readonly street1Field: Locator;
  readonly street2Field: Locator;
  readonly postCodeField: Locator;
  readonly cityField: Locator;
  readonly countryDropdown: Locator;
  readonly countyDropdown: Locator;
  readonly addressNextButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.shippingAddressToggle = page.locator('.mat-slide-toggle-thumb');
    this.street1Field = page.getByLabel(/street 1|street1/i);
    this.street2Field = page.getByLabel(/street 2|street2/i);
    this.postCodeField = page.getByLabel(/post code|postcode/i);
    this.cityField = page.getByLabel(/city/i);
    this.countryDropdown = page.locator('app-address-information mat-select').filter({ hasText: /country/i }).first();
    this.countyDropdown = page.locator('app-address-information mat-select').filter({ hasText: /county/i }).first();
    this.addressNextButton = page.locator('#address-information-next-button');
  }

  async toggleShippingAddress(): Promise<void> {
    await this.shippingAddressToggle.click();
  }

  async enterStreet1(value: string): Promise<void> {
    await this.street1Field.fill(value);
  }

  async enterStreet2(value: string): Promise<void> {
    await this.street2Field.fill(value);
  }

  async enterPostCode(value: string): Promise<void> {
    await this.postCodeField.fill(value);
  }

  async enterCity(value: string): Promise<void> {
    await this.cityField.fill(value);
  }

  async selectCountry(option: string): Promise<void> {
    await this.countryDropdown.click();
    await this.page.getByRole('option', { name: option }).click();
  }

  async selectCounty(option: string): Promise<void> {
    await this.countyDropdown.click();
    await this.page.getByRole('option', { name: option }).click();
  }

  async clickNext(): Promise<void> {
    await this.addressNextButton.click();
  }
}

export class InvoiceAccountPage {
  readonly page: Page;
  readonly invoiceNameField: Locator;
  readonly billingAccountField: Locator;

  constructor(page: Page) {
    this.page = page;
    this.invoiceNameField = page.getByLabel(/name/i).nth(2);
    this.billingAccountField = page.getByLabel(/billing account/i);
  }

  async enterInvoiceName(value: string): Promise<void> {
    await this.invoiceNameField.fill(value);
  }

  async enterBillingAccount(value: string): Promise<void> {
    await this.billingAccountField.fill(value);
  }
}