import { Page, Locator } from '@playwright/test';
import { getEnvConfig } from '../../../support/env';

export class Dcmv2New2Page {
  private readonly page: Page;
  
  // --- Locators ---
  private readonly usernameOrEmailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly signInButton: Locator;
  private readonly searchCustomerButton: Locator;
  private readonly searchValueInput: Locator;
  private readonly searchSubmitButton: Locator;
  private readonly searchResultsActionButton: Locator;
  private readonly customerAddressTab: Locator;
  private readonly addressEditTrigger: Locator;
  private readonly addressEditAddress1Input: Locator;
  private readonly addressEditPostcodeInput: Locator;
  private readonly addressEditCityInput: Locator;
  private readonly addressEditSaveButton: Locator;
  private readonly customerContactTab: Locator;
  private readonly addContactTrigger: Locator;
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
    this.usernameOrEmailInput = page.getByRole('textbox', { name: 'Username or email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    this.searchCustomerButton = page.getByTestId('search-customer');
    this.searchValueInput = page.getByTestId('search-value-input');
    this.searchSubmitButton = page.getByTestId('search-submit-button');
    this.searchResultsActionButton = page.getByTestId('search-results-table').getByRole('button').nth(1);
    this.customerAddressTab = page.getByTestId('customer-main-tab-address');
    this.addressEditTrigger = page.getByTestId('address-edit-trigger');
    this.addressEditAddress1Input = page.getByTestId('address-edit-address1');
    this.addressEditPostcodeInput = page.getByTestId('address-edit-postcode');
    this.addressEditCityInput = page.getByTestId('address-edit-city');
    this.addressEditSaveButton = page.getByTestId('address-edit-save');
    this.customerContactTab = page.getByTestId('customer-main-tab-contact');
    this.addContactTrigger = page.getByTestId('add-contact-trigger');
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
        await this.usernameOrEmailInput.fill(value);
        break;
      case 'Password':
        await this.passwordInput.fill(value);
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
      case 'second action button in search results': // Navigation Trigger
        await this.searchResultsActionButton.click();
        await this.page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
        await this.page.waitForTimeout(1000);
        break;
      case 'customer-main-tab-address': // Tab Element
        await this.customerAddressTab.waitFor({ state: 'visible', timeout: 15000 });
        await this.page.waitForTimeout(300);
        await this.customerAddressTab.click();
        break;
      case 'address-edit-trigger': // Modal/Form Trigger
        await this.addressEditTrigger.waitFor({ state: 'visible', timeout: 15000 });
        await this.page.waitForTimeout(300);
        await this.addressEditTrigger.click();
        await this.page.waitForTimeout(500);
        await this.page.waitForSelector('[role="dialog"], form', { state: 'visible', timeout: 5000 }).catch(() => {});
        break;
      case 'address-edit-save':
        await this.addressEditSaveButton.click();
        break;
      case 'customer-main-tab-contact': // Tab Element
        await this.customerContactTab.waitFor({ state: 'visible', timeout: 15000 });
        await this.page.waitForTimeout(300);
        await this.customerContactTab.click();
        break;
      case 'add-contact-trigger': // Modal/Form Trigger
        await this.addContactTrigger.waitFor({ state: 'visible', timeout: 15000 });
        await this.page.waitForTimeout(300);
        await this.addContactTrigger.click();
        await this.page.waitForTimeout(500);
        await this.page.waitForSelector('[role="dialog"], form', { state: 'visible', timeout: 5000 }).catch(() => {});
        break;
      case 'add-contact-cancel':
        await this.addContactCancelButton.click();
        break;
      case 'users':
        await this.usersTab.click();
        break;
      case 'Edit button in users-table-cell-2-actions': // Modal/Form Trigger
        await this.usersTableEditButton.waitFor({ state: 'visible', timeout: 15000 });
        await this.page.waitForTimeout(300);
        await this.usersTableEditButton.click();
        await this.page.waitForTimeout(500);
        await this.page.waitForSelector('[role="dialog"], form', { state: 'visible', timeout: 5000 }).catch(() => {});
        break;
      case 'edit-user-save':
        await this.editUserSaveButton.click();
        break;
      default:
        throw new Error(`Element with identifier "${elementIdentifier}" not found.`);
    }
  }
}