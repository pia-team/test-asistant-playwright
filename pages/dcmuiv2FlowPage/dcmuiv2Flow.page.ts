import { Page, expect } from '@playwright/test';
import { getEnvConfig } from '../../support/env';

export class DCMUIV2FlowPage {
    private page: Page;
    private config = getEnvConfig();
    private baseDomain: string;

    constructor(page: Page) {
        this.page = page;
        // Extract domain from baseLoginUrl for URL assertions
        try {
            this.baseDomain = new URL(this.config.baseLoginUrl).hostname;
        } catch {
            this.baseDomain = this.config.baseLoginUrl;
        }
    }

    // --- Locators from HAR (prioritizing ID, then CSS, then ARIA/Text-based) ---

    // Keycloak Login page locators
    private get kcUsernameInput() {
        return this.page.locator('#username');
    }

    private get kcPasswordInput() {
        return this.page.locator('#password');
    }

    private get kcLoginButton() {
        return this.page.locator('#kc-login');
    }

    // Language selection locators
    private getLanguageOption(languageName: string) {
        // HAR shows selectors like ["aria/English"], ["text/English"], ["div:nth-of-type(2)"].
        // getByText is robust for matching visible text or aria-labels.
        return this.page.getByText(languageName, { exact: true });
    }

    // Customer navigation locator
    private get searchCustomerNavLink() {
        // HAR shows ["aria/Search Customer", "aria/[role=\"generic\"]"].
        // getByRole('link') with specific name is the best Playwright selector here.
        return this.page.getByRole('link', { name: 'Search Customer' });
    }

    // Customer search page locators
    private get searchInput() {
        // HAR shows ["aria/Enter search value"]. getByPlaceholder is a strong Playwright selector.
        return this.page.getByPlaceholder('Enter search value');
    }

    private get firstCustomerActionButton() {
        // HAR provides CSS selector: ["tr:nth-of-type(1) > td:nth-of-type(6) span"].
        // No ID or better ARIA found, so direct CSS locator is used as per priority.
        return this.page.locator('tr:nth-of-type(1) > td:nth-of-type(6) span');
    }

    // --- Actions derived from HAR steps ---

    async gotoLoginPage() {
        // CRITICAL: The HAR provides a highly specific, potentially dynamic Keycloak login URL.
        // In a real production scenario, you would typically use a stable baseLoginUrl from env.ts
        // or a dedicated SSO flow. For this exercise, we strictly adhere to the HAR's content.
        await this.page.goto("https://diam.pi.dev-gcu.com/realms/orbitant-realm/protocol/openid-connect/auth?client_id=orbitant-ui-client&scope=openid%20email%20profile&response_type=code&redirect_uri=https%3A%2F%2Fdcm-ui-v2.pi.dev-gcu.com%2Fapi%2Fauth%2Fcallback%2Fkeycloak&state=qn-Jtysg3-DRPcnpHlbNxPUofMY5fQXmMyc1D5r7tVE&code_challenge=Ayp1nJxgNygGqte_F-lqLdrayA2-tIKsn74AO_kQkB4&code_challenge_method=S256");
        await expect(this.kcLoginButton).toBeVisible({ timeout: 15000 }); // Assert we landed on the Keycloak login page, increased timeout for external navigation.
    }

    async performLogin() {
        // Fill credentials from config
        await this.kcUsernameInput.fill(this.config.username);
        await this.kcPasswordInput.fill(this.config.password);
        await this.kcLoginButton.click();
        // Wait for navigation to the main application after login
        await this.page.waitForURL(new RegExp(this.baseDomain), { timeout: 30000 });
    }

    async assertLoggedInToDCMUIV2() {
        // Wait for page to stabilize after login
        await this.page.waitForLoadState('networkidle', { timeout: 30000 });
        await expect(this.page).toHaveURL(new RegExp(this.baseDomain), { timeout: 15000 });
    }

    async selectLanguage(language: string) {
        // Try to find language option - may be in a dropdown or directly visible
        const languageOption = this.getLanguageOption(language);
        
        // Check if language option is visible, if not try to open a language dropdown
        if (!await languageOption.isVisible({ timeout: 3000 }).catch(() => false)) {
            // Try common language dropdown triggers
            const dropdownTriggers = [
                this.page.locator('[class*="language"]').first(),
                this.page.locator('[class*="locale"]').first(),
                this.page.locator('[aria-label*="language" i]').first(),
                this.page.getByRole('button', { name: /language|dil/i }).first(),
            ];
            
            for (const trigger of dropdownTriggers) {
                if (await trigger.isVisible({ timeout: 1000 }).catch(() => false)) {
                    await trigger.click();
                    await this.page.waitForTimeout(500);
                    break;
                }
            }
        }
        
        await languageOption.click({ timeout: 10000 });
        await this.page.waitForLoadState('domcontentloaded');
    }

    async navigateToCustomerSearch() {
        await this.searchCustomerNavLink.click();
        // Assume navigation to a URL containing 'customer' or a specific path after clicking the link.
        await this.page.waitForURL(/customer/, { timeout: 10000 });
        await expect(this.searchInput).toBeVisible(); // Assert we are on the search page by checking the input field.
    }

    async searchCustomer(searchTerm: string) {
        await this.searchInput.fill(searchTerm);
        await this.searchInput.press('Enter'); // HAR shows keyDown and keyUp 'Enter'.
        await this.page.waitForLoadState('domcontentloaded'); // Wait for search results to load.
    }

    async assertCustomerSearchResults(searchTerm: string) {
        // Verify that at least one element containing the search term is visible within the search results.
        const customerRowLocator = this.page.locator(`text=${searchTerm}`).first();
        await expect(customerRowLocator).toBeVisible();
    }

    async interactWithFirstCustomer() {
        await this.firstCustomerActionButton.click();
        // Wait for navigation or a modal to open, indicative of interaction completion.
        await this.page.waitForLoadState('domcontentloaded');
    }

    async assertOnCustomerDetailsPage() {
        // Placeholder assertion: Assuming a specific heading or text exists on the customer details page.
        // Update this locator to be specific to your application's customer details page.
        await expect(this.page.locator('text=Customer Details').first()).toBeVisible();
    }
}