import { Page, Locator, expect } from '@playwright/test';

export class CustomerCreationPage {
  readonly page: Page;
  readonly generalInfoTab: Locator;
  readonly companyCuiField: Locator;
  readonly organizationNameField: Locator;
  readonly marketSegmentField: Locator;
  readonly treatmentSegmentField: Locator;
  readonly customerIdField: Locator;
  readonly customerNameField: Locator;
  readonly nextButtonGeneral: Locator;
  readonly agentInfoTab: Locator;
  readonly dealerCodeField: Locator;
  readonly agentNameField: Locator;
  readonly emailField: Locator;
  readonly specialistEmailField: Locator;
  readonly nextButtonAgent: Locator;
  readonly contactInfoTab: Locator;
  readonly contactTypeDropdown: Locator;
  readonly contactRoleDropdown: Locator;
  readonly contactNameField: Locator;
  readonly contactSurnameField: Locator;
  readonly countryCodeDropdown: Locator;
  readonly phoneNumberField: Locator;
  readonly contactIdField: Locator;
  readonly addContactButton: Locator;
  readonly nextButtonContact: Locator;
  readonly addressInfoTab: Locator;
  readonly shippingAddressSlider: Locator;
  readonly street1Field: Locator;
  readonly street2Field: Locator;
  readonly postCodeField: Locator;
  readonly cityField: Locator;
  readonly countryDropdown: Locator;
  readonly countyDropdown: Locator;
  readonly nextButtonAddress: Locator;
  readonly invoiceInfoTab: Locator;
  readonly invoiceNameField: Locator;
  readonly billingAccountField: Locator;
  readonly currencyField: Locator;

  constructor(page: Page) {
    this.page = page;
    this.generalInfoTab = page.getByRole('tab', { name: /general information/i });
    this.companyCuiField = page.getByLabel(/cui|company cui/i).first();
    this.organizationNameField = page.getByLabel(/organization name/i);
    this.marketSegmentField = page.getByLabel(/market segment/i);
    this.treatmentSegmentField = page.getByLabel(/treatment segment/i);
    this.customerIdField = page.getByLabel(/customer id/i);
    this.customerNameField = page.getByLabel(/customer name/i);
    this.nextButtonGeneral = page.getByRole('button', { name: /next/i }).first();
    this.agentInfoTab = page.getByRole('tab', { name: /agent information/i });
    this.dealerCodeField = page.getByLabel(/dealer code/i);
    this.agentNameField = page.getByLabel(/name/i).first();
    this.emailField = page.getByLabel(/email/i).first();
    this.specialistEmailField = page.getByLabel(/specialist email/i);
    this.nextButtonAgent = page.getByRole('button', { name: /next/i }).nth(1);
    this.contactInfoTab = page.getByRole('tab', { name: /contact information/i });
    this.contactTypeDropdown = page.getByRole('combobox', { name: /contact type/i });
    this.contactRoleDropdown = page.getByRole('combobox', { name: /contact role/i });
    this.contactNameField = page.getByLabel(/name/i).nth(1);
    this.contactSurnameField = page.getByLabel(/surname/i);
    this.countryCodeDropdown = page.getByRole('combobox', { name: /country code|phone code/i });
    this.phoneNumberField = page.getByLabel(/phone|mobile/i);
    this.contactIdField = page.getByLabel(/contact id/i).first();
    this.addContactButton = page.getByRole('button', { name: /add/i });
    this.nextButtonContact = page.getByRole('button', { name: /next/i }).nth(2);
    this.addressInfoTab = page.getByRole('tab', { name: /address information/i });
    this.shippingAddressSlider = page.getByRole('switch', { name: /shipping address/i });
    this.street1Field = page.getByLabel(/street 1|street1/i);
    this.street2Field = page.getByLabel(/street 2|street2/i);
    this.postCodeField = page.getByLabel(/post code|postcode/i);
    this.cityField = page.getByLabel(/city/i);
    this.countryDropdown = page.getByRole('combobox', { name: /country/i });
    this.countyDropdown = page.getByRole('combobox', { name: /county/i });
    this.nextButtonAddress = page.getByRole('button', { name: /next/i }).nth(3);
    this.invoiceInfoTab = page.getByRole('tab', { name: /invoice account/i });
    this.invoiceNameField = page.getByLabel(/name/i).nth(2);
    this.billingAccountField = page.getByLabel(/billing account/i);
    this.currencyField = page.getByLabel(/currency/i);
  }

  async verifyGeneralInfoTabOpened() {
    await expect(this.generalInfoTab).toHaveAttribute('aria-selected', 'true');
  }

  async verifyCompanyCuiDisabled() {
    await expect(this.companyCuiField).toBeDisabled();
  }

  async verifyOrganizationNameDisabled() {
    await expect(this.organizationNameField).toBeDisabled();
  }

  async verifyMarketSegmentDisabled() {
    await expect(this.marketSegmentField).toBeDisabled();
  }

  async verifyTreatmentSegmentDisabled() {
    await expect(this.treatmentSegmentField).toBeDisabled();
  }

  async enterRandomCustomerId() {
    const randomId = `CUST_${Date.now()}`;
    await this.customerIdField.fill(randomId);
  }

  async enterRandomCustomerName() {
    const randomName = `Customer_${Date.now()}`;
    await this.customerNameField.fill(randomName);
  }

  async clickNextGeneral() {
    await this.nextButtonGeneral.click();
  }

  async verifyAgentInfoTabOpened() {
    await expect(this.agentInfoTab).toHaveAttribute('aria-selected', 'true');
  }

  async enterRandomDealerCode() {
    const randomCode = `DEALER_${Date.now()}`;
    await this.dealerCodeField.fill(randomCode);
  }

  async enterRandomAgentName() {
    const randomName = `Agent_${Date.now()}`;
    await this.agentNameField.fill(randomName);
  }

  async enterEmail(email: string) {
    await this.emailField.fill(email);
  }

  async verifyEmailStructure(email: string) {
    await expect(this.emailField).toHaveValue(email);
    await expect(this.emailField).toContainText('@');
    await expect(this.emailField).toContainText('.');
  }

  async enterSpecialistEmail(email: string) {
    await this.specialistEmailField.fill(email);
  }

  async verifySpecialistEmailStructure(email: string) {
    await expect(this.specialistEmailField).toHaveValue(email);
    await expect(this.specialistEmailField).toContainText('@');
    await expect(this.specialistEmailField).toContainText('.');
  }

  async clickNextAgent() {
    await this.nextButtonAgent.click();
  }

  async verifyContactInfoTabOpened() {
    await expect(this.contactInfoTab).toHaveAttribute('aria-selected', 'true');
  }

  async clickContactTypeDropdown() {
    await this.contactTypeDropdown.click();
  }

  async verifyCustomerContactOption() {
    const option = this.page.getByRole('option', { name: /customer contact/i });
    await expect(option).toBeVisible();
  }

  async selectAnyContactTypeOption() {
    await this.contactTypeDropdown.click();
    const options = this.page.getByRole('option');
    await options.first().click();
  }

  async selectCustomerContactOption() {
    const option = this.page.getByRole('option', { name: /customer contact/i });
    await option.click();
  }

  async clickContactRoleDropdown() {
    await this.contactRoleDropdown.click();
  }

  async verifyContactRoleValues() {
    const options = this.page.getByRole('option');
    await expect(options.count()).toBeGreaterThan(0);
  }

  async selectAnyContactRoleOption() {
    await this.contactRoleDropdown.click();
    const options = this.page.getByRole('option');
    await options.first().click();
  }

  async enterRandomContactName() {
    const randomName = `Contact_${Date.now()}`;
    await this.contactNameField.fill(randomName);
  }

  async enterRandomContactSurname() {
    const randomSurname = `Surname_${Date.now()}`;
    await this.contactSurnameField.fill(randomSurname);
  }

  async clickCountryCodeDropdown() {
    await this.countryCodeDropdown.click();
  }

  async selectCountryCode(code: string) {
    const option = this.page.getByRole('option', { name: code });
    await option.click();
  }

  async enterRandomPhoneNumber() {
    const randomPhone = `07${Math.floor(Math.random() * 100000000)}`;
    await this.phoneNumberField.fill(randomPhone);
  }

  async enterRandomContactId() {
    const randomId = `CONTACT_${Date.now()}`;
    await this.contactIdField.fill(randomId);
  }

  async verifyAddSignNotClickable() {
    await expect(this.addContactButton).toBeDisabled();
  }

  async enterContactEmail(email: string) {
    const contactEmailField = this.page.getByLabel(/email/i).nth(1);
    await contactEmailField.fill(email);
  }

  async verifyContactEmailStructure(email: string) {
    const contactEmailField = this.page.getByLabel(/email/i).nth(1);
    await expect(contactEmailField).toHaveValue(email);
  }

  async clickContactTypeDropdownForAdditional() {
    const additionalContactTypeDropdown = this.page.getByRole('combobox', { name: /contact type/i }).nth(1);
    await additionalContactTypeDropdown.click();
  }

  async clickContactRoleDropdownForAdditional() {
    const additionalContactRoleDropdown = this.page.getByRole('combobox', { name: /contact role/i }).nth(1);
    await additionalContactRoleDropdown.click();
  }

  async enterRandomAdditionalContactName() {
    const additionalNameField = this.page.getByLabel(/name/i).nth(2);
    const randomName = `Contact2_${Date.now()}`;
    await additionalNameField.fill(randomName);
  }

  async enterRandomAdditionalContactSurname() {
    const additionalSurnameField = this.page.getByLabel(/surname/i).nth(1);
    const randomSurname = `Surname2_${Date.now()}`;
    await additionalSurnameField.fill(randomSurname);
  }

  async enterRandomContactId2() {
    const additionalContactIdField = this.page.getByLabel(/contact id/i).nth(1);
    const randomId = `CONTACT2_${Date.now()}`;
    await additionalContactIdField.fill(randomId);
  }

  async enterRandomAdditionalPhoneNumber() {
    const additionalPhoneField = this.page.getByLabel(/phone|mobile/i).nth(1);
    const randomPhone = `07${Math.floor(Math.random() * 100000000)}`;
    await additionalPhoneField.fill(randomPhone);
  }

  async enterRandomAdditionalEmail() {
    const additionalEmailField = this.page.getByLabel(/email/i).nth(2);
    const randomEmail = `contact2_${Date.now()}@gmail.com`;
    await additionalEmailField.fill(randomEmail);
  }

  async verifyAddSignClickable() {
    await expect(this.addContactButton).toBeEnabled();
  }

  async clickNextContact() {
    await this.nextButtonContact.click();
  }

  async clickShippingAddressSlider() {
    await this.shippingAddressSlider.click();
  }

  async verifyAddressInfoTabOpened() {
    await expect(this.addressInfoTab).toHaveAttribute('aria-selected', 'true');
  }

  async verifyContactTypeElement() {
    const contactTypeElement = this.page.getByLabel(/contact type/i).nth(2);
    await expect(contactTypeElement).toBeVisible();
  }

  async verifyStreet1Element() {
    await expect(this.street1Field).toBeVisible();
  }

  async enterRandomStreet1() {
    const randomStreet = `Street_${Date.now()}`;
    await this.street1Field.fill(randomStreet);
  }

  async verifyStreet2Element() {
    await expect(this.street2Field).toBeVisible();
  }

  async enterRandomStreet2() {
    const randomStreet = `Street2_${Date.now()}`;
    await this.street2Field.fill(randomStreet);
  }

  async verifyPostCodeElement() {
    await expect(this.postCodeField).toBeVisible();
  }

  async enterRandomPostCode() {
    const randomPostCode = `${Math.floor(Math.random() * 90000) + 10000}`;
    await this.postCodeField.fill(randomPostCode);
  }

  async verifyCityElement() {
    await expect(this.cityField).toBeVisible();
  }

  async enterCity(city: string) {
    await this.cityField.fill(city);
  }

  async clickCountryDropdown() {
    await this.countryDropdown.click();
  }

  async selectCountry(country: string) {
    const option = this.page.getByRole('option', { name: country });
    await option.click();
  }

  async clickCountyDropdown() {
    await this.countyDropdown.click();
  }

  async selectCounty(county: string) {
    const option = this.page.getByRole('option', { name: county });
    await option.click();
  }

  async verifyServiceContactTypeElement() {
    const serviceContactType = this.page.getByLabel(/service contact type/i);
    await expect(serviceContactType).toBeVisible();
  }

  async verifyServiceStreet1Element() {
    const serviceStreet1 = this.page.getByLabel(/service street 1|servicestreet1/i);
    await expect(serviceStreet1).toBeVisible();
  }

  async verifyServiceStreet2Element() {
    const serviceStreet2 = this.page.getByLabel(/service street 2|servicestreet2/i);
    await expect(serviceStreet2).toBeVisible();
  }

  async verifyServicePostCodeElement() {
    const servicePostCode = this.page.getByLabel(/service post code|servicepostcode/i);
    await expect(servicePostCode).toBeVisible();
  }

  async verifyServiceCityElement() {
    const serviceCity = this.page.getByLabel(/service city|servicecity/i);
    await expect(serviceCity).toBeVisible();
  }

  async verifySelectElements() {
    const selectElements = this.page.getByRole('combobox', { name: /select/i });
    await expect(selectElements.count()).toBeGreaterThan(0);
  }

  async clickNextAddress() {
    await this.nextButtonAddress.click();
  }

  async verifyInvoiceInfoTabOpened() {
    await expect(this.invoiceInfoTab).toHaveAttribute('aria-selected', 'true');
  }

  async enterRandomInvoiceName() {
    const randomName = `Invoice_${Date.now()}`;
    await this.invoiceNameField.fill(randomName);
  }

  async enterRandomBillingAccount() {
    const randomAccount = `BILL_${Date.now()}`;
    await this.billingAccountField.fill(randomAccount);
  }

  async verifyCurrencyElement() {
    await expect(this.currencyField).toBeVisible();
  }
}