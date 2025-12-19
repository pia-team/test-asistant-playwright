import { Page, expect } from '@playwright/test';
import { getEnvConfig } from '../../support/env';

export class Dcmuiv2Page {
    private page: Page;
    private config = getEnvConfig();
    private baseDomain: string;

    constructor(page: Page) {
        this.page = page;
        try {
            this.baseDomain = new URL("https://dcm-ui-v2.pi.dev-gcu.com/").hostname; // This is the post-login URL for assertions
        } catch {
            this.baseDomain = "dcm-ui-v2.pi.dev-gcu.com"; // Fallback
        }
    }

    // ========== LOCATORS (MUST be getters) ==========
    private get usernameInput() {
        // Assuming standard Keycloak login form fields
        return this.page.locator('#username');
    }

    private get passwordInput() {
        // Assuming standard Keycloak login form fields
        return this.page.locator('#password');
    }

    private get loginButton() {
        return this.page.locator('#kc-login');
    }

    private get welcomeMessage() {
        return this.page.getByText('Welcome');
    }

    private get searchCustomerLink() {
        return this.page.getByRole('link', { name: 'Search Customer' });
    }

    private get searchInput() {
        return this.page.getByPlaceholder('Enter search value');
    }

    private get firstCustomerActionButton() {
        return this.page.locator('tr:nth-of-type(1) > td:nth-of-type(6) span');
    }

    // Generic locator for language options, as per recording
    languageOption(languageName: string) {
        return this.page.getByText(languageName);
    }

    // ========== NAVIGATION ==========
    async gotoLoginPage() {
        await this.page.goto(this.config.baseLoginUrl);
        await this.page.waitForLoadState('domcontentloaded');
    }

    // ========== ACTIONS ==========
    async login() {
        // Assuming the login page has username and password inputs, as per common Keycloak setup and template
        await this.usernameInput.fill(this.config.username);
        await this.passwordInput.fill(this.config.password);
        await this.loginButton.click();
        await this.page.waitForLoadState('networkidle', { timeout: 30000 });
    }

    async clickSearchCustomerLink() {
        await this.searchCustomerLink.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async searchForCustomer(customerName: string) {
        await this.searchInput.fill(customerName);
        // Pressing Enter will be handled in step definitions for generality
    }

    async clickFirstCustomerActionButton() {
        await this.firstCustomerActionButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async selectLanguage(language: string) {
        await this.languageOption(language).click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    // ========== ASSERTIONS (Web-First) ==========
    async assertLoggedIn() {
        // Assert URL after successful login points to the application's domain
        await expect(this.page).toHaveURL(new RegExp(this.baseDomain), { timeout: 15000 });
    }

    async assertElementVisible(locator: any) {
        await expect(locator).toBeVisible({ timeout: 10000 });
    }

    async assertTextVisible(text: string) {
        await expect(this.page.getByText(text)).toBeVisible({ timeout: 10000 });
    }

    async assertSearchResultsContain(customerName: string) {
        // Assumes search results are displayed in a table and a row contains the customer name
        await expect(this.page.getByRole('row', { name: new RegExp(customerName, 'i') })).toBeVisible({ timeout: 10000 });
    }

    async assertCustomerDetailsPageVisible(customerName: string) {
        // Assumes after clicking action button, a page with customer details and a heading containing their name is visible
        await expect(this.page.getByRole('heading', { name: new RegExp(customerName, 'i') })).toBeVisible({ timeout: 10000 });
    }
}