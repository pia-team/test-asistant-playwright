import { Page, expect } from '@playwright/test';

export class CustomerSearchPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Locators for customer search functionality

    // Selector from recording: "aria/Search Customer"
    private get searchCustomerLink() {
        return this.page.getByRole('link', { name: 'Search Customer' });
    }

    // Selector from recording: "aria/Enter search value"
    private get searchInput() {
        return this.page.getByRole('textbox', { name: 'Enter search value' });
    }

    // Selector from recording: "tr:nth-of-type(1) > td:nth-of-type(6) span"
    private get firstCustomerResultAction() {
        return this.page.locator('tr:nth-of-type(1) > td:nth-of-type(6) span');
    }

    // A more generic locator for asserting search results visually
    private get customerTable() {
        return this.page.locator('table');
    }

    async navigateToCustomerSearch() {
        await this.searchCustomerLink.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async searchForCustomer(customerName: string) {
        await this.searchInput.fill(customerName);
        await this.searchInput.press('Enter');
        await this.page.waitForLoadState('domcontentloaded');
    }

    async assertSearchResults(customerName: string) {
        // Assert that the customer table is visible and contains the search name
        await expect(this.customerTable).toBeVisible();
        await expect(this.customerTable).toContainText(customerName);
    }

    async clickFirstCustomerResult() {
        await this.firstCustomerResultAction.click();
        await this.page.waitForLoadState('domcontentloaded');
    }
}