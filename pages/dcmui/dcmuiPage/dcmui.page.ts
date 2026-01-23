import { Page, Locator } from '@playwright/test';
import { getEnvConfig } from '../../../support/env';

export class DcmuiPage {
  private readonly page: Page;
  
  // --- Locators ---
  private readonly usernameOrEmailTextbox: Locator;
  private readonly passwordTextbox: Locator;
  private readonly signInButton: Locator;
  private readonly typeTextCombobox: Locator;
  private readonly searchButton: Locator;
  private readonly angularyirmiOption: Locator;
  private readonly addressTab: Locator;
  private readonly defaultBillingAddressRowButton: Locator;
  private readonly editMenuitem: Locator;
  private readonly addressLine2Textbox: Locator;
  private readonly countryCombobox: Locator;
  private readonly turkeyOption: Locator;
  private readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // --- Initialize Locators ---
    this.usernameOrEmailTextbox = page.getByRole('textbox', { name: 'Username or email' });
    this.passwordTextbox = page.getByRole('textbox', { name: 'Password' });
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    this.typeTextCombobox = page.getByRole('combobox', { name: 'Type text..' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.angularyirmiOption = page.getByRole('option', { name: 'ANGULARYIRMI INDIVIDUAL 2007/' });
    this.addressTab = page.getByRole('tab', { name: 'Address' });
    this.defaultBillingAddressRowButton = page.getByRole('row', { name: 'DEFAULT_BILLING_ADDRESS ASD' }).getByRole('button');
    this.editMenuitem = page.getByRole('menuitem', { name: 'Edit' });
    this.addressLine2Textbox = page.getByRole('textbox', { name: 'Address Line 2' });
    this.countryCombobox = page.getByRole('combobox', { name: 'Country' }).locator('div').first();
    this.turkeyOption = page.getByRole('option', { name: 'TURKEY' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
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
        await this.page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
        await this.page.waitForTimeout(500);
        break;
      case 'Type text..':
        await this.typeTextCombobox.click();
        break;
      case 'Search':
        await this.searchButton.click();
        break;
      case 'ANGULARYIRMI INDIVIDUAL 2007/':
        await this.angularyirmiOption.click();
        await this.page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
        await this.page.waitForTimeout(500);
        break;
      case 'Address':
        await this.addressTab.waitFor({ state: 'visible', timeout: 8000 });
        await this.page.waitForTimeout(150);
        await this.addressTab.click();
        break;
      case 'DEFAULT_BILLING_ADDRESS ASD': // Menu Trigger
        await this.defaultBillingAddressRowButton.waitFor({ state: 'visible', timeout: 5000 });
        await this.defaultBillingAddressRowButton.click();
        await this.page.waitForTimeout(200);
        await this.page.waitForSelector('[role="menu"], [role="menuitem"], mat-menu, .mat-menu-panel', { state: 'visible', timeout: 3000 }).catch(() => {});
        break;
      case 'Edit': // Menu Item & Modal Trigger
        await this.editMenuitem.waitFor({ state: 'visible', timeout: 8000 });
        await this.page.waitForTimeout(150);
        await this.editMenuitem.click();
        await this.page.waitForTimeout(200);
        await this.page.waitForSelector('[role="dialog"], [role="form"], mat-dialog, .mat-dialog-container, form', { state: 'visible', timeout: 3000 }).catch(() => {});
        break;
      case 'Address Line 2':
        await this.addressLine2Textbox.click();
        break;
      case 'Country':
        await this.countryCombobox.click();
        break;
      case 'TURKEY':
        await this.turkeyOption.click();
        break;
      case 'Save':
        await this.saveButton.click();
        break;
      default:
        throw new Error(`Element "${elementIdentifier}" not found.`);
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
      case 'Type text..':
        await this.typeTextCombobox.fill(value);
        break;
      case 'Address Line 2': // Field appears after 'Edit' click
        await this.addressLine2Textbox.waitFor({ state: 'visible', timeout: 8000 });
        await this.page.waitForTimeout(150);
        await this.addressLine2Textbox.fill(value);
        break;
      default:
        throw new Error(`Field "${fieldIdentifier}" not found.`);
    }
  }

  public async selectOption(dropdownIdentifier: string, option: string): Promise<void> {
    // This is a placeholder for selectOption. The input uses clicks on options instead.
    // If you had a <select> element, you would implement it here.
    throw new Error(`selectOption not implemented for "${dropdownIdentifier}". Use clickElement for custom dropdowns.`);
  }
}