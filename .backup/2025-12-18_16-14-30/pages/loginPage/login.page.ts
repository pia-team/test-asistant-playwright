import { Page, expect } from '@playwright/test';
import { getEnvConfig } from '../../support/env';

export class LoginPage {
    private page: Page;
    private config = getEnvConfig();

    constructor(page: Page) {
        this.page = page;
    }

    // IMPORTANT: Locators MUST be defined as getters using ID selectors from recording JSON
    // Extract #id selectors from the recording's selectors arrays - they are most reliable
    private get usernameInput() {
        // From recording JSON selectors for username: ["aria/UserName", "#userName", "xpath///*[@id=\"userName\"]"]
        return this.page.locator('#userName');
    }

    private get passwordInput() {
        // From recording JSON selectors for password: ["aria/Password", "#password", "xpath///*[@id=\"password\"]"]
        return this.page.locator('#password');
    }

    private get loginButton() {
        // From recording JSON selectors for login button: ["aria/Login[role=\"button\"]", "#login", "xpath///*[@id=\"login\"]"]
        return this.page.locator('#login');
    }

    // Assuming an element that indicates successful login after navigation to /profile
    private get loggedInIndicator() {
        // This selector is an assumption based on common post-login states on demoqa.com
        // It might be an element displaying the username, or a logout button, etc.
        // For demoqa.com, after login, it often navigates to /profile and shows the username.
        return this.page.locator('#userName-value'); 
    }

    async goto() {
        await this.page.goto(this.config.baseLoginUrl);
    }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async assertLoggedIn() {
        await this.page.waitForLoadState('domcontentloaded');
        // The demoqa.com login redirects to /profile on successful login.
        await expect(this.page).toHaveURL(/profile/); 
        await expect(this.loggedInIndicator).toBeVisible();
    }
}