import { Page, expect } from '@playwright/test';
import { getEnvConfig } from '../../support/env';



export class LoginPage {
  private page: Page;
  private config = getEnvConfig();

  private usernameInput = '#username';
  private passwordInput = '#password';
  private signInBtn = '#kc-login';
  private profileSignDropdownArrowBtnOnPage = "//mat-icon[normalize-space()='keyboard_arrow_down']";
  private logoutBtnInDropdownOnHomePage = "//span[normalize-space()='Log Out']";
  private invalidUsernameOrPasswordWarningOnSignInPage = "#input-error";


  constructor(page: Page) {
    this.page = page;
  }


  async gotoUrl() {

    console.log("****************************")
    console.log(this.config)
    console.log("***********************")
    await this.page.goto(this.config.baseLoginUrl, { waitUntil: 'domcontentloaded' });
    //await this.page.pause();

  }
  async staticWait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async login1(username?: string, password?: string) {
    await this.page.fill(this.usernameInput, username || this.config.username);
    await this.page.fill(this.passwordInput, password || this.config.password);
    await this.page.click(this.signInBtn);

  }

  async enterUsername(username?: string, password?: string) {
    await this.page.fill(this.usernameInput, username || this.config.username);
  }

  async enterPassword(username?: string, password?: string) {
    await this.page.fill(this.passwordInput, password || this.config.password);
  }

  async clickSignIn() {
    await this.page.click(this.signInBtn);
  }

  async assertUrlContains(value: string) {
    await this.page.waitForURL(`**/${value}**`);
    expect(this.page!.url()).toContain(value);
    await this.page?.waitForTimeout(1000);
  }

  async getHeaderByText(text: string): Promise<void> {
    const xpathOfText = this.page.locator(`//*[normalize-space(text()) = "${text}"]`);
    await xpathOfText.waitFor({ state: 'visible' })
    const headerText = (await xpathOfText.textContent())?.trim() || '';
    console.log(`Name of Text is : ${headerText}`);
    await expect(xpathOfText).toHaveText(text);
  }

  async controlOfUserName(nameOfCustomer: string): Promise<void> {
    const textOfName = this.page.locator(`//span[contains(@class,'username') and contains(@class,'capatilize') and normalize-space(text())='${nameOfCustomer}']`);
    expect(textOfName).toBeVisible;
    const text = (await textOfName.textContent())?.trim() || '';
    console.log(`Name of user is: ${text}`);
  }


  async logoutFunction(): Promise<void> {
    console.log("User is attempting to log out...");
    expect(this.page.locator(this.profileSignDropdownArrowBtnOnPage)).toBeVisible;
    await this.page.click(this.profileSignDropdownArrowBtnOnPage);
    expect(this.page.locator(this.logoutBtnInDropdownOnHomePage)).toBeVisible;
    await this.page.click(this.logoutBtnInDropdownOnHomePage);

    // Fix: Wait for navigation to complete before verifying login page elements
    await this.page.waitForLoadState('domcontentloaded');

    console.log("✅ User successfully logged out.")
  }

  async warningMessageAssertionOnSignIn(expectedMessage: string): Promise<void> {
    console.log('Verifying warning message on Sign In page...');
    await expect(this.page.locator(this.invalidUsernameOrPasswordWarningOnSignInPage)).toBeVisible({ timeout: 15000 });
    await expect(this.page.locator(this.invalidUsernameOrPasswordWarningOnSignInPage)).toHaveText(expectedMessage);
    const el = this.page.locator(this.invalidUsernameOrPasswordWarningOnSignInPage);
    const actualMessage = (await el.textContent())?.trim() || '';
    console.log(`Actual warning message: ${actualMessage}`);
    expect(actualMessage).toBe(expectedMessage);
  }

}





