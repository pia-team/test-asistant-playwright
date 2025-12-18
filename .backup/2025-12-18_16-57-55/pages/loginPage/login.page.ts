import { Page, expect } from '@playwright/test';
import { getEnvConfig } from '../../support/env';

export class LoginPage {
    private page: Page;
    private config = getEnvConfig();

    constructor(page: Page) {
        this.page = page;
    }

    // IMPORTANT: Locators MUST be defined as getters.
    // NOTE: The recording did not include explicit steps for filling username/password.
    // Assuming standard Keycloak IDs for username and password inputs.
    private get usernameInput() {
        return this.page.locator('#username'); 
    }

    private get passwordInput() {
        return this.page.locator('#password');
    }

    // Selector from recording: "#kc-login"
    private get signInButton() {
        return this.page.locator('#kc-login');
    }

    async gotoLoginPage() {
        // Use baseLoginUrl from config as the initial navigation target
        await this.page.goto(this.config.baseLoginUrl);
    }

    async login() {
        // Fill username and password using config values (assumed fields)
        await this.usernameInput.fill(this.config.username);
        await this.passwordInput.fill(this.config.password);
        await this.signInButton.click();
    }

    async assertLoggedIn() {
        await this.page.waitForLoadState('domcontentloaded');
        // Extract domain from baseLoginUrl for URL assertion as per framework rules.
        // NOTE: The recording shows a redirect from 'diam.pi.dev-gcu.com' (SSO)
        // to 'dcm-ui-v2.pi.dev-gcu.com' (application).
        // For this assertion to pass, config.baseLoginUrl's domain should match
        // the application's domain (e.g., "dcm-ui-v2.pi.dev-gcu.com") or 
        // the test environment should be configured to handle the redirect.
        // Following the strict framework rule, the domain from baseLoginUrl is used.
        const baseDomain = new URL(this.config.baseLoginUrl).hostname;
        await expect(this.page).toHaveURL(new RegExp(baseDomain));
    }
}