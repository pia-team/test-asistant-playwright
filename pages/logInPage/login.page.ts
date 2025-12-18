import { Page, expect } from '@playwright/test';
import { getEnvConfig } from '../../support/env';

export class LoginPage {
    private page: Page;
    private config = getEnvConfig();
    private baseDomain: string;

    constructor(page: Page) {
        this.page = page;
        try {
            this.baseDomain = new URL(this.config.baseLoginUrl).hostname;
        } catch {
            this.baseDomain = this.config.baseLoginUrl;
        }
    }

    // ========== LOCATORS (MUST be getters) ==========
    private get usernameInput() {
        return this.page.locator('#userName');
    }

    private get passwordInput() {
        return this.page.locator('#password');
    }

    private get loginButton() {
        return this.page.locator('#login');
    }

    // This element is typically visible after a successful login on demoqa.com
    private get profileSectionHeader() {
        return this.page.getByText('Profile');
    }

    // ========== NAVIGATION ==========
    async gotoLoginPage() {
        await this.page.goto(this.config.baseLoginUrl);
        await this.page.waitForLoadState('domcontentloaded');
    }

    // ========== ACTIONS ==========
    async login() {
        await this.usernameInput.fill(this.config.username);
        await this.passwordInput.fill(this.config.password);
        await this.loginButton.click();
        await this.page.waitForLoadState('networkidle', { timeout: 30000 });
    }

    async clickElement(locator: any) {
        await locator.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async fillInput(locator: any, value: string) {
        await locator.fill(value);
    }

    // ========== ASSERTIONS (Web-First) ==========
    async assertLoggedIn() {
        // Wait for page to stabilize
        await this.page.waitForLoadState('networkidle', { timeout: 30000 });
        // Assert URL contains profile (demoqa.com redirects to /profile after login)
        await expect(this.page).toHaveURL(/profile/, { timeout: 15000 });
    }

    async assertElementVisible(locator: any) {
        await expect(locator).toBeVisible({ timeout: 10000 });
    }

    async assertTextVisible(text: string) {
        await expect(this.page.getByText(text)).toBeVisible({ timeout: 10000 });
    }
}