import { Page, Locator, expect } from '@playwright/test';

export class CustomerInteractionPage {
  readonly page: Page;
  readonly reasonField: Locator;
  readonly channelDropdown: Locator;
  readonly directionDropdown: Locator;
  readonly statusDropdown: Locator;
  readonly descriptionField: Locator;
  readonly textField: Locator;
  readonly saveButton: Locator;
  readonly successMessage: Locator;
  readonly callCenterOption: Locator;
  readonly inboundOption: Locator;
  readonly outboundOption: Locator;
  readonly openedOption: Locator;
  readonly inProgressOption: Locator;
  readonly closedOption: Locator;
  readonly directionDisabledField: Locator;
  readonly textDisabledField: Locator;
  readonly addNoteButton: Locator;
  readonly noteField: Locator;
  readonly addressDataContainer: Locator;
  readonly editButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.reasonField = page.getByLabel(/reason/i);
    this.channelDropdown = page.getByRole('combobox', { name: /channel/i });
    this.directionDropdown = page.getByRole('combobox', { name: /direction/i });
    this.statusDropdown = page.getByRole('combobox', { name: /status/i });
    this.descriptionField = page.getByLabel(/description/i);
    this.textField = page.getByLabel(/text/i);
    this.saveButton = page.getByRole('button', { name: /save/i });
    this.successMessage = page.getByText('Interaction created successfully!', { exact: false });
    this.callCenterOption = page.getByRole('option', { name: /call center/i });
    this.inboundOption = page.getByRole('option', { name: /inbound/i });
    this.outboundOption = page.getByRole('option', { name: /outbound/i });
    this.openedOption = page.getByRole('option', { name: /opened/i });
    this.inProgressOption = page.getByRole('option', { name: /inprogress|in progress/i });
    this.closedOption = page.getByRole('option', { name: /closed/i });
    this.directionDisabledField = page.locator('mat-form-field').filter({ hasText: /direction/i }).getByRole('combobox', { disabled: true });
    this.textDisabledField = page.locator('mat-form-field').filter({ hasText: /text/i }).getByRole('textbox', { disabled: true });
    this.addNoteButton = page.getByRole('button', { name: /add.*note/i });
    this.noteField = page.getByRole('textbox', { name: /note/i });
    this.addressDataContainer = page.locator('.address-data');
    this.editButton = page.getByRole('button', { name: /edit/i });
  }

  async clickEditButton(): Promise<void> {
    await this.editButton.click();
  }

  async enterReason(reason: string) {
    await this.reasonField.fill(reason);
  }

  async enterRandomReason() {
    const randomReason = `Reason_${Date.now()}`;
    await this.enterReason(randomReason);
  }

  async clickChannelDropdown() {
    await this.channelDropdown.click();
  }

  async verifyCallCenterOption() {
    await expect(this.callCenterOption).toBeVisible();
  }

  async selectAnyDropdownOption(dropdown: Locator) {
    await dropdown.click();
    const options = this.page.getByRole('option');
    await options.first().click();
  }

  async clickDirectionDropdown() {
    await this.directionDropdown.click();
  }

  async verifyInboundOption() {
    await expect(this.inboundOption).toBeVisible();
  }

  async verifyOutboundOption() {
    await expect(this.outboundOption).toBeVisible();
  }

  async clickStatusDropdown() {
    await this.statusDropdown.click();
  }

  async verifyOpenedOption() {
    await expect(this.openedOption).toBeVisible();
  }

  async verifyInProgressOption() {
    await expect(this.inProgressOption).toBeVisible();
  }

  async verifyClosedOption() {
    await expect(this.closedOption).toBeVisible();
  }

  async enterDescription(description: string) {
    await this.descriptionField.fill(description);
  }

  async enterRandomDescription() {
    const randomDesc = `Description_${Date.now()}`;
    await this.enterDescription(randomDesc);
  }

  async enterText(text: string) {
    await this.textField.fill(text);
  }

  async enterRandomText() {
    const randomText = `Text_${Date.now()}`;
    await this.enterText(randomText);
  }

  async collectAddressData() {
    const addressData = await this.addressDataContainer.allTextContents();
    return addressData;
  }

  async clickSave() {
    await this.saveButton.click();
  }

  async verifySuccessMessage() {
    await expect(this.successMessage).toBeVisible();
  }

  async verifyAddressDataCreated() {
    await expect(this.addressDataContainer).toContainText('create');
  }

  async verifyAddressDataUpdated() {
    await expect(this.addressDataContainer).toContainText('update');
  }

  async verifyDirectionDisabled() {
    await expect(this.directionDisabledField).toBeDisabled();
  }

  async verifyTextDisabled() {
    await expect(this.textDisabledField).toBeDisabled();
  }

  async addExtraNote() {
    await this.addNoteButton.click();
  }

  async enterNote(note: string) {
    await this.noteField.fill(note);
  }

  async enterSecondNote(note: string) {
    const noteFields = this.page.getByRole('textbox', { name: /note/i });
    await noteFields.nth(1).fill(note);
  }
}