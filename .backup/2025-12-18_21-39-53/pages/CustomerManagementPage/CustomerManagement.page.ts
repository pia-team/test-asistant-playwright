import { Page, expect } from '@playwright/test';
import { getEnvConfig } from '../../support/env';

export class CustomerManagementPage {
    private page: Page;
    private config = getEnvConfig();
    private baseDomain: string;

    constructor(page: Page) {
        this.page = page;
        try {
            // Assuming baseLoginUrl points to the application's base URL, which then redirects to SSO.
            // For example, if config.baseLoginUrl is "https://dcm-ui-v2.pi.dev-gcu.com/",
            // then baseDomain will be "dcm-ui-v2.pi.dev-gcu.com".
            this.baseDomain = new URL(this.config.baseLoginUrl).hostname;
        } catch {
            this.baseDomain = this.config.baseLoginUrl;
        }
    }

    // ========== LOCATORS (MUST be getters) ==========
    // Assuming standard login fields for completeness, even if recorder skipped filling them.
    private get usernameInput() {
        return this.page.locator('#username'); 
    }

    private get passwordInput() {
        return this.page.locator('#password');
    }

    private get loginButton() {
        return this.page.locator('#kc-login'); // From recording
    }

    private get searchCustomerLink() {
        return this.page.getByRole('link', { name: 'Search Customer' }); // From recording (aria/Search Customer)
    }

    private get searchInputField() {
        return this.page.getByLabel('Enter search value'); // From recording (aria/Enter search value)
    }

    private get firstSearchResultActionIcon() {
        return this.page.locator('tr:nth-of-type(1) > td:nth-of-type(6) span'); // From recording (CSS selector)
    }

    // Language options (using getByText for direct text matches)
    private get englishLanguageOption() {
        return this.page.getByText('English');
    }

    private get arabicLanguageOption() {
        return this.page.getByText('Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©');
    }

    private get germanLanguageOption() {
        return this.page.getByText('Deutsch');
    }

    // Placeholder for a generic welcome message after login
    private get welcomeMessage() {
        return this.page.getByText('Welcome');
    }

    // Placeholder for Customer Details page header/title
    private get customerDetailsHeader() {
        return this.page.getByText('Customer Details', { exact: true });
    }

    // ========== NAVIGATION ==========
    async gotoLoginPage() {
        await this.page.goto(this.config.baseLoginUrl);
        await this.page.waitForLoadState('domcontentloaded');
    }

    // ========== ACTIONS ==========
    async login() {
        // These steps are included to ensure a complete login flow, even if the recording skipped filling them.
        // It's assumed the config will contain valid credentials and the fields exist on the login page.
        await this.usernameInput.fill(this.config.username);
        await this.passwordInput.fill(this.config.password);
        await this.loginButton.click();
        await this.page.waitForLoadState('networkidle', { timeout: 30000 });
    }

    async navigateToSearchCustomer() {
        await this.searchCustomerLink.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async searchCustomer(value: string) {
        await this.searchInputField.fill(value);
        await this.searchInputField.press('Enter');
        await this.page.waitForLoadState('networkidle', { timeout: 30000 }); // Wait for search results to load
    }

    async clickFirstResultAction() {
        await this.firstSearchResultActionIcon.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async selectLanguage(language: string) {
        await this.page.getByText(language, { exact: true }).click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    // ========== ASSERTIONS (Web-First) ==========
    async assertLoggedIn() {
        // Assumes config.baseLoginUrl is the application's base URL (e.g., https://dcm-ui-v2.pi.dev-gcu.com/)
        // and that after login, the user is redirected back to this domain.
        await expect(this.page).toHaveURL(new RegExp(this.baseDomain), { timeout: 15000 });
        await expect(this.welcomeMessage).toBeVisible({ timeout: 10000 }); // Assert a common post-login element
    }

    async assertElementVisible(locator: any) {
        await expect(locator).toBeVisible({ timeout: 10000 });
    }

    async assertTextVisible(text: string) {
        await expect(this.page.getByText(text, { exact: false })).toBeVisible({ timeout: 10000 });
    }

    async assertSearchResultVisible(searchText: string) {
        // Assuming the search result contains the searched text in a visible element
        await expect(this.page.getByText(searchText, { exact: false })).toBeVisible({ timeout: 10000 });
    }

    async assertCustomerDetailsPageVisible() {
        await expect(this.customerDetailsHeader).toBeVisible({ timeout: 10000 });
    }
}