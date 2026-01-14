import { Page, Locator } from '@playwright/test';
import { getEnvConfig } from '../../../support/env';

export class Dcmv1Page {
  private readonly page: Page;
  
  // --- Locators ---
  private readonly usernameOrEmailField: Locator;
  private readonly passwordField: Locator;
  private readonly signInButton: Locator;
  private readonly closeButton: Locator;
  private readonly typeTextField: Locator;
  private readonly searchButton: Locator;
  private readonly customerOption: Locator;
  private readonly customerInfoActionsButton: Locator;
  private readonly editCustomerInfoMenuItem: Locator;
  private readonly faxNumberField: Locator;
  private readonly communicationMethodDropdown: Locator;
  private readonly emailAndSmsOption: Locator;
  private readonly fixPhoneNumberField: Locator;
  private readonly saveCustomerInfoButton: Locator;
  private readonly addressTab: Locator;
  private readonly defaultBillingAddressRowMenu: Locator;
  private readonly editAddressMenuItem: Locator;
  private readonly addressLine1Field: Locator;
  private readonly addressLine2Field: Locator;
  private readonly postCodeField: Locator;
  private readonly countryDropdown: Locator;
  private readonly romaniaOption: Locator;
  private readonly cityField: Locator;
  private readonly saveAddressButton: Locator;
  private readonly userMenuButton: Locator;
  private readonly logoutMenuItem: Locator;

  constructor(page: Page) {
    this.page = page;
    // --- Initialize Locators ---
    this.usernameOrEmailField = page.getByRole('textbox', { name: 'Username or email' });
    this.passwordField = page.getByRole('textbox', { name: 'Password' });
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    this.closeButton = page.getByRole('button').filter({ hasText: 'close' });
    this.typeTextField = page.getByRole('combobox', { name: 'Type text..' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.customerOption = page.getByRole('option', { name: 'OFYETIM KEREMP PIDEV 2006/06/' });
    this.customerInfoActionsButton = page.locator('app-customer-info').getByRole('button');
    this.editCustomerInfoMenuItem = page.getByRole('menuitem', { name: 'Edit' });
    this.faxNumberField = page.getByRole('textbox', { name: 'Fax Number' });
    this.communicationMethodDropdown = page.getByRole('combobox', { name: 'Communication Method' }).locator('div').first();
    this.emailAndSmsOption = page.getByRole('option', { name: 'Email & SMS' });
    this.fixPhoneNumberField = page.getByRole('textbox', { name: 'Fix Phone Number' });
    this.saveCustomerInfoButton = page.getByRole('button', { name: 'Save' });
    this.addressTab = page.getByRole('tab', { name: 'Address' });
    this.defaultBillingAddressRowMenu = page.getByRole('row', { name: 'DEFAULT_BILLING_ADDRESS' }).getByRole('button');
    this.editAddressMenuItem = page.getByRole('menuitem', { name: 'Edit' });
    this.addressLine1Field = page.getByRole('textbox', { name: 'Address Line 1' });
    this.addressLine2Field = page.getByRole('textbox', { name: 'Address Line 2' });
    this.postCodeField = page.getByRole('textbox', { name: 'Post Code' });
    this.countryDropdown = page.getByRole('combobox', { name: 'Country' }).locator('div').first();
    this.romaniaOption = page.getByText('ROMANIA');
    this.cityField = page.getByRole('textbox', { name: 'City' });
    this.saveAddressButton = page.getByRole('button', { name: 'Save' });
    this.userMenuButton = page.getByRole('button', { name: 'nora' });
    this.logoutMenuItem = page.getByRole('menuitem', { name: 'Logout' });
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
      case 'Type text..':
        await this.typeTextField.fill(value);
        break;
      case 'Fax Number':
        await this.faxNumberField.fill(value);
        break;
      case 'Fix Phone Number':
        await this.fixPhoneNumberField.fill(value);
        break;
      case 'Address Line 1':
        await this.addressLine1Field.fill(value);
        break;
      case 'Address Line 2':
        await this.addressLine2Field.fill(value);
        break;
      case 'Post Code':
        await this.postCodeField.fill(value);
        break;
      case 'City':
        await this.cityField.fill(value);
        break;
      default:
        throw new Error(`Field "${fieldIdentifier}" is not defined in the Page Object.`);
    }
  }

  public async clickElement(elementIdentifier: string): Promise<void> {
    switch (elementIdentifier) {
      case 'Sign In':
        await this.signInButton.click();
        break;
      case 'close':
        await this.closeButton.click();
        break;
      case 'Search':
        await this.searchButton.click();
        break;
      case 'OFYETIM KEREMP PIDEV 2006/06/':
        await this.customerOption.click();
        break;
      case 'customer info actions button':
        await this.customerInfoActionsButton.waitFor({ state: 'visible', timeout: 10000 });
        await this.customerInfoActionsButton.click();
        await this.page.waitForTimeout(500);
        await this.page.waitForSelector('[role="menu"], [role="menuitem"]', { state: 'visible', timeout: 5000 }).catch(() => {});
        break;
      case 'Edit customer info':
        await this.editCustomerInfoMenuItem.waitFor({ state: 'visible', timeout: 15000 });
        await this.page.waitForTimeout(300);
        await this.editCustomerInfoMenuItem.click();
        break;
      case 'Communication Method':
        await this.communicationMethodDropdown.click();
        break;
      case 'Email & SMS':
        await this.emailAndSmsOption.click();
        break;
      case 'Save customer info':
        await this.saveCustomerInfoButton.click();
        break;
      case 'Address':
        await this.addressTab.waitFor({ state: 'visible', timeout: 15000 });
        await this.page.waitForTimeout(300);
        await this.addressTab.click();
        break;
      case 'DEFAULT_BILLING_ADDRESS':
        await this.defaultBillingAddressRowMenu.waitFor({ state: 'visible', timeout: 10000 });
        await this.defaultBillingAddressRowMenu.click();
        await this.page.waitForTimeout(500);
        await this.page.waitForSelector('[role="menu"], [role="menuitem"]', { state: 'visible', timeout: 5000 }).catch(() => {});
        break;
      case 'Edit address':
        await this.editAddressMenuItem.waitFor({ state: 'visible', timeout: 15000 });
        await this.page.waitForTimeout(300);
        await this.editAddressMenuItem.click();
        break;
      case 'Country':
        await this.countryDropdown.click();
        break;
      case 'ROMANIA':
        await this.romaniaOption.click();
        break;
      case 'Save address':
        await this.saveAddressButton.click();
        break;
      case 'nora':
        await this.userMenuButton.waitFor({ state: 'visible', timeout: 10000 });
        await this.userMenuButton.click();
        await this.page.waitForTimeout(500);
        await this.page.waitForSelector('[role="menu"], [role="menuitem"]', { state: 'visible', timeout: 5000 }).catch(() => {});
        break;
      case 'Logout':
        await this.logoutMenuItem.waitFor({ state: 'visible', timeout: 15000 });
        await this.page.waitForTimeout(300);
        await this.logoutMenuItem.click();
        break;
      default:
        throw new Error(`Element "${elementIdentifier}" is not defined in the Page Object.`);
    }
  }
}