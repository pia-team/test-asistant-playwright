import { Page, Locator } from '@playwright/test';
import { getEnvConfig } from '../../../support/env';

export class AddressContactEditPage {
  private readonly page: Page;

  // --- Locators ---
  private readonly usernameOrEmailField: Locator;
  private readonly passwordField: Locator;
  private readonly signInButton: Locator;
  private readonly searchCustomer: Locator;
  private readonly searchValueInput: Locator;
  private readonly searchSubmitButton: Locator;
  private readonly secondActionButtonInSearchResults: Locator;
  private readonly customerMainTabAddress: Locator;
  private readonly addressEditTrigger: Locator;
  private readonly addressEditAddress1: Locator;
  private readonly addressEditPostcode: Locator;
  private readonly addressEditCity: Locator;
  private readonly addressEditSave: Locator;
  private readonly customerMainTabContact: Locator;
  private readonly addContactTrigger: Locator;
  private readonly contactFormFirstName: Locator;
  private readonly contactFormLastName: Locator;
  private readonly addContactCancel: Locator;
  private readonly users: Locator;
  private readonly editButtonInUsersTableCell: Locator;
  private readonly editUsernameInput: Locator;
  private readonly editUserSave: Locator;

  constructor(page: Page) {
    this.page = page;
    // --- Initialize Locators ---
    this.usernameOrEmailField = page.getByRole('textbox', { name: 'Username or email' });
    this.passwordField = page.getByRole('textbox', { name: 'Password' });
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    this.searchCustomer = page.getByTestId('search-customer');
    this.searchValueInput = page.getByTestId('search-value-input');
    this.searchSubmitButton = page.getByTestId('search-submit-button');
    this.secondActionButtonInSearchResults = page.getByTestId('search-results-table').getByRole('button').nth(1);
    this.customerMainTabAddress = page.getByTestId('customer-main-tab-address');
    this.addressEditTrigger = page.getByTestId('address-edit-trigger');
    this.addressEditAddress1 = page.getByTestId('address-edit-address1');
    this.addressEditPostcode = page.getByTestId('address-edit-postcode');
    this.addressEditCity = page.getByTestId('address-edit-city');
    this.addressEditSave = page.getByTestId('address-edit-save');
    this.customerMainTabContact = page.getByTestId('customer-main-tab-contact');
    this.addContactTrigger = page.getByTestId('add-contact-trigger');
    this.contactFormFirstName = page.getByTestId('contact-form-first-name');
    this.contactFormLastName = page.getByTestId('contact-form-last-name');
    this.addContactCancel = page.getByTestId('add-contact-cancel');
    this.users = page.getByTestId('users');
    this.editButtonInUsersTableCell = page.getByTestId('users-table-cell-2-actions').getByRole('button', { name: 'Edit' });
    this.editUsernameInput = page.getByTestId('edit-username-input');
    this.editUserSave = page.getByTestId('edit-user-save');
  }

  // --- Actions ---
  public async getEnvironmentConfig() {
    return getEnvConfig();
  }

  public async navigateToUrl(url: string): Promise<void> {
    await this.page.goto(url);
  }

  public async clickElement(elementIdentifier: string): Promise<void> {
    switch (elementIdentifier) {
      case 'Sign In':
        await this.signInButton.click();
        break;
      case 'search-customer':
        await this.searchCustomer.click();
        break;
      case 'search-submit-button':
        await this.searchSubmitButton.click();
        break;
      case 'second action button in search results':
        await this.secondActionButtonInSearchResults.click();
        // Wait for page navigation/load after clicking action button
        await this.page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
        await this.page.waitForTimeout(1000);
        break;
      case 'customer-main-tab-address':
        // Wait for tab to be visible before clicking (page might still be loading)
        await this.customerMainTabAddress.waitFor({ state: 'visible', timeout: 15000 });
        await this.page.waitForTimeout(300);
        await this.customerMainTabAddress.click();
        break;
      case 'address-edit-trigger':
        await this.addressEditTrigger.click();
        break;
      case 'address-edit-save':
        await this.addressEditSave.click();
        break;
      case 'customer-main-tab-contact':
        // Wait for tab to be visible before clicking (page might still be loading)
        await this.customerMainTabContact.waitFor({ state: 'visible', timeout: 15000 });
        await this.page.waitForTimeout(300);
        await this.customerMainTabContact.click();
        break;
      case 'add-contact-trigger':
        await this.addContactTrigger.click();
        break;
      case 'add-contact-cancel':
        await this.addContactCancel.click();
        break;
      case 'users':
        await this.users.click();
        break;
      case 'Edit button in users-table-cell-2-actions':
        await this.editButtonInUsersTableCell.click();
        break;
      case 'edit-user-save':
        await this.editUserSave.click();
        break;
      default:
        throw new Error(`Element "${elementIdentifier}" not found in clickElement method.`);
    }
  }

  public async fillField(fieldIdentifier: string, value: string): Promise<void> {
    switch (fieldIdentifier) {
      case 'Username or email':
        await this.usernameOrEmailField.fill(value);
        break;
      case 'Password':
        await this.passwordField.fill(value);
        break;
      case 'search-value-input':
        await this.searchValueInput.fill(value);
        break;
      case 'address-edit-address1':
        await this.addressEditAddress1.fill(value);
        break;
      case 'address-edit-postcode':
        await this.addressEditPostcode.fill(value);
        break;
      case 'address-edit-city':
        await this.addressEditCity.fill(value);
        break;
      case 'contact-form-first-name':
        await this.contactFormFirstName.fill(value);
        break;
      case 'contact-form-last-name':
        await this.contactFormLastName.fill(value);
        break;
      case 'edit-username-input':
        await this.editUsernameInput.fill(value);
        break;
      default:
        throw new Error(`Field "${fieldIdentifier}" not found in fillField method.`);
    }
  }
}