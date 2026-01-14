import { Page, Locator } from '@playwright/test';
import { getEnvConfig } from '../../../support/env';

export class Dcmv2NewPage {
  private readonly page: Page;

  // --- Locators ---
  private readonly usernameOrEmailField: Locator;
  private readonly passwordField: Locator;
  private readonly signInButton: Locator;
  private readonly searchCustomerButton: Locator;
  private readonly searchValueInput: Locator;
  private readonly searchSubmitButton: Locator;
  private readonly secondSearchResultButton: Locator;
  private readonly customerMainTabAddress: Locator;
  private readonly addressEditTrigger: Locator;
  private readonly addressEditAddress1Input: Locator;
  private readonly addressEditPostcodeInput: Locator;
  private readonly addressEditCityInput: Locator;
  private readonly addressEditSaveButton: Locator;
  private readonly customerMainTabContact: Locator;
  private readonly addContactTriggerButton: Locator;
  private readonly contactFormFirstNameInput: Locator;
  private readonly contactFormLastNameInput: Locator;
  private readonly addContactCancelButton: Locator;
  private readonly usersTab: Locator;
  private readonly usersTableEditButton: Locator;
  private readonly editUsernameInput: Locator;
  private readonly editUserSaveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // --- Initialize Locators ---
    this.usernameOrEmailField = page.getByRole('textbox', { name: 'Username or email' });
    this.passwordField = page.getByRole('textbox', { name: 'Password' });
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    this.searchCustomerButton = page.getByTestId('search-customer');
    this.searchValueInput = page.getByTestId('search-value-input');
    this.searchSubmitButton = page.getByTestId('search-submit-button');
    this.secondSearchResultButton = page.getByTestId('search-results-table').getByRole('button').nth(1);
    this.customerMainTabAddress = page.getByTestId('customer-main-tab-address');
    this.addressEditTrigger = page.getByTestId('address-edit-trigger');
    this.addressEditAddress1Input = page.getByTestId('address-edit-address1');
    this.addressEditPostcodeInput = page.getByTestId('address-edit-postcode');
    this.addressEditCityInput = page.getByTestId('address-edit-city');
    this.addressEditSaveButton = page.getByTestId('address-edit-save');
    this.customerMainTabContact = page.getByTestId('customer-main-tab-contact');
    this.addContactTriggerButton = page.getByTestId('add-contact-trigger');
    this.contactFormFirstNameInput = page.getByTestId('contact-form-first-name');
    this.contactFormLastNameInput = page.getByTestId('contact-form-last-name');
    this.addContactCancelButton = page.getByTestId('add-contact-cancel');
    this.usersTab = page.getByTestId('users');
    this.usersTableEditButton = page.getByTestId('users-table-cell-2-actions').getByRole('button', { name: 'Edit' });
    this.editUsernameInput = page.getByTestId('edit-username-input');
    this.editUserSaveButton = page.getByTestId('edit-user-save');
  }

  // --- Actions ---
  public async getEnvironmentConfig() {
    return getEnvConfig();
  }

  public async navigateToUrl(url: string): Promise<void> {
    await this.page.goto(url);
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
        await this.addressEditAddress1Input.fill(value);
        break;
      case 'address-edit-postcode':
        await this.addressEditPostcodeInput.fill(value);
        break;
      case 'address-edit-city':
        await this.addressEditCityInput.fill(value);
        break;
      case 'contact-form-first-name':
        await this.contactFormFirstNameInput.fill(value);
        break;
      case 'contact-form-last-name':
        await this.contactFormLastNameInput.fill(value);
        break;
      case 'edit-username-input':
        await this.editUsernameInput.fill(value);
        break;
      default:
        throw new Error(`Field with identifier "${fieldIdentifier}" not found.`);
    }
  }

  public async clickElement(elementIdentifier: string): Promise<void> {
    switch (elementIdentifier) {
      case 'Sign In':
        await this.signInButton.click();
        break;
      case 'search-customer':
        await this.searchCustomerButton.click();
        break;
      case 'search-submit-button':
        await this.searchSubmitButton.click();
        break;
      case 'second action button in search results':
        await this.secondSearchResultButton.click();
        // Wait for page navigation/load after clicking
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
        await this.addressEditSaveButton.click();
        break;
      case 'customer-main-tab-contact':
         // Wait for tab to be visible before clicking
        await this.customerMainTabContact.waitFor({ state: 'visible', timeout: 15000 });
        await this.page.waitForTimeout(300);
        await this.customerMainTabContact.click();
        break;
      case 'add-contact-trigger':
        await this.addContactTriggerButton.click();
        break;
      case 'add-contact-cancel':
        await this.addContactCancelButton.click();
        break;
      case 'users':
        await this.usersTab.click();
        break;
      case 'Edit button in users table':
        await this.usersTableEditButton.click();
        break;
      case 'edit-user-save':
        await this.editUserSaveButton.click();
        break;
      default:
        throw new Error(`Element with identifier "${elementIdentifier}" not found.`);
    }
  }
}