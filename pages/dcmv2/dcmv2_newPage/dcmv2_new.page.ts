import { Page, Locator } from '@playwright/test';
import { getEnvConfig } from '../../../support/env';

export class Dcmv2NewPage {
  private readonly page: Page;
  
  // --- Locators ---
  private readonly usernameOrEmailTextbox: Locator;
  private readonly passwordTextbox: Locator;
  private readonly signInButton: Locator;
  private readonly searchCustomerButton: Locator;
  private readonly searchValueInput: Locator;
  private readonly searchSubmitButton: Locator;
  private readonly searchResultsActionButton: Locator;
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
  private readonly usersButton: Locator;
  private readonly userActionsEditButton: Locator;
  private readonly editUsernameInput: Locator;
  private readonly editUserSaveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // --- Initialize Locators ---
    this.usernameOrEmailTextbox = page.getByRole('textbox', { name: 'Username or email' });
    this.passwordTextbox = page.getByRole('textbox', { name: 'Password' });
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    this.searchCustomerButton = page.getByTestId('search-customer');
    this.searchValueInput = page.getByTestId('search-value-input');
    this.searchSubmitButton = page.getByTestId('search-submit-button');
    this.searchResultsActionButton = page.getByTestId('search-results-table').getByRole('button').nth(1);
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
    this.usersButton = page.getByTestId('users');
    this.userActionsEditButton = page.getByTestId('users-table-cell-2-actions').getByRole('button', { name: 'Edit' });
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

  public async clickElement(elementIdentifier: string): Promise<void> {
    switch (elementIdentifier) {
      case 'Username or email':
        await this.usernameOrEmailTextbox.click();
        break;
      case 'Password':
        await this.passwordTextbox.click();
        break;
      case 'Sign In':
        await this.signInButton.click();
        break;
      case 'search-customer':
        await this.searchCustomerButton.click();
        break;
      case 'search-value-input':
        await this.searchValueInput.click();
        break;
      case 'search-submit-button':
        await this.searchSubmitButton.click();
        break;
      case 'the second action button in the search results table':
        await this.searchResultsActionButton.click();
        await this.page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
        await this.page.waitForTimeout(1000);
        break;
      case 'customer-main-tab-address':
        await this.customerMainTabAddress.waitFor({ state: 'visible', timeout: 15000 });
        await this.page.waitForTimeout(300);
        await this.customerMainTabAddress.click();
        break;
      case 'address-edit-trigger':
        await this.addressEditTrigger.click();
        break;
      case 'address-edit-address1':
        await this.addressEditAddress1Input.click();
        break;
      case 'address-edit-postcode':
        await this.addressEditPostcodeInput.click();
        break;
      case 'address-edit-city':
        await this.addressEditCityInput.click();
        break;
      case 'address-edit-save':
        await this.addressEditSaveButton.click();
        break;
      case 'customer-main-tab-contact':
        await this.customerMainTabContact.waitFor({ state: 'visible', timeout: 15000 });
        await this.page.waitForTimeout(300);
        await this.customerMainTabContact.click();
        break;
      case 'add-contact-trigger':
        await this.addContactTriggerButton.click();
        break;
      case 'contact-form-first-name':
        await this.contactFormFirstNameInput.click();
        break;
      case 'contact-form-last-name':
        await this.contactFormLastNameInput.click();
        break;
      case 'add-contact-cancel':
        await this.addContactCancelButton.click();
        break;
      case 'users':
        await this.usersButton.click();
        break;
      case 'Edit button in user actions':
        await this.userActionsEditButton.click();
        break;
      case 'edit-username-input':
        await this.editUsernameInput.click();
        break;
      case 'edit-user-save':
        await this.editUserSaveButton.click();
        break;
      default:
        throw new Error(`Element "${elementIdentifier}" not found in clickElement method.`);
    }
  }
  
  public async fillField(fieldIdentifier: string, value: string): Promise<void> {
    switch (fieldIdentifier) {
      case 'Username or email':
        await this.usernameOrEmailTextbox.fill(value);
        break;
      case 'Password':
        await this.passwordTextbox.fill(value);
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
        throw new Error(`Field "${fieldIdentifier}" not found in fillField method.`);
    }
  }
}