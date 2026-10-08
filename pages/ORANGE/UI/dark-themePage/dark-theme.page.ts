import { Page, Locator } from '@playwright/test';

export class DarkThemePage {
  private readonly page: Page;
  private readonly keycloakEntryButton: Locator;
  private readonly welcomeText: Locator;
  private readonly themeToggleButton: Locator;
  private readonly darkOption: Locator;

  constructor(page: Page) {
    this.page = page;
    this.keycloakEntryButton = page.getByRole('button', { name: 'Sign in with Keycloak' });
    this.welcomeText = page.getByText('Welcome');
    this.themeToggleButton = page.getByRole('button', { name: /theme/i });
    this.darkOption = page.getByText('Dark', { exact: true });
  }

  async clickKeycloakEntry(): Promise<void> {
    await this.keycloakEntryButton.click();
  }

  async waitForWelcome(): Promise<void> {
    await this.welcomeText.waitFor({ state: 'visible' });
  }

  async clickThemeToggle(): Promise<void> {
    await this.themeToggleButton.click();
  }

  async clickDarkOption(): Promise<void> {
    await this.darkOption.click();
  }
}