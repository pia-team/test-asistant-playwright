import { Page, Locator } from '@playwright/test';

export class BackOfficePage {
  readonly page: Page;
  readonly customerName: Locator;
  readonly threeDotsButton: Locator;
  readonly claimEditButton: Locator;
  readonly licenceCostInput: Locator;
  readonly inputPoInput: Locator;
  readonly projectInput: Locator;
  readonly pmNotesInput: Locator;
  readonly documentCategoryDropdown: Locator;
  readonly fileUploadInput: Locator;
  readonly completeTaskButton: Locator;
  readonly taskCompletedMessage: Locator;
  readonly implementationDoneCheckbox: Locator;
  readonly testingDoneCheckbox: Locator;
  readonly acceptanceSignedCheckbox: Locator;
  readonly documentTable: Locator;
  readonly deleteDocumentButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.customerName = page.getByRole('link', { name: /automation/i });
    this.threeDotsButton = page.getByRole('button', { name: /more_vert|three dots/i });
    this.claimEditButton = page.getByRole('button', { name: /claimedit/i });
    this.licenceCostInput = page.getByRole('textbox', { name: /licence cost/i });
    this.inputPoInput = page.getByRole('textbox', { name: /po/i });
    this.projectInput = page.getByRole('textbox', { name: /project/i });
    this.pmNotesInput = page.getByRole('textbox', { name: /pm notes/i });
    this.documentCategoryDropdown = page.getByRole('combobox', { name: /document category|doc-type/i });
    this.fileUploadInput = page.locator('input[type="file"]');
    this.completeTaskButton = page.getByRole('button', { name: /complete task/i });
    this.taskCompletedMessage = page.getByText(/task completed/i);
    this.implementationDoneCheckbox = page.getByRole('checkbox', { name: /implementation done/i });
    this.testingDoneCheckbox = page.getByRole('checkbox', { name: /testing done/i });
    this.acceptanceSignedCheckbox = page.getByRole('checkbox', { name: /acceptance signed/i });
    this.documentTable = page.getByRole('table', { name: /attachments/i });
    this.deleteDocumentButton = page.getByRole('button', { name: /delete/i });
  }

  async clickCustomer(customerName: string): Promise<void> {
    const customer = this.page.getByRole('link', { name: new RegExp(customerName, 'i') });
    await customer.click();
  }

  async clickThreeDots(): Promise<void> {
    await this.threeDotsButton.click();
  }

  async clickClaimEdit(): Promise<void> {
    await this.claimEditButton.click();
  }

  async fillPMTaskForm(data: {
    licenceCost?: string;
    inputPo?: string;
    project?: string;
    pmNotes?: string;
  }): Promise<void> {
    if (data.licenceCost) await this.licenceCostInput.fill(data.licenceCost);
    if (data.inputPo) await this.inputPoInput.fill(data.inputPo);
    if (data.project) await this.projectInput.fill(data.project);
    if (data.pmNotes) await this.pmNotesInput.fill(data.pmNotes);
  }

  async selectDocumentCategory(category: string): Promise<void> {
    await this.documentCategoryDropdown.click();
    const option = this.page.getByRole('option', { name: new RegExp(category, 'i') });
    await option.click();
  }

  async uploadDocument(bindingKey: string): Promise<void> {
    // File upload handled via step definition with uploadDocument helper
    await this.fileUploadInput.click();
  }

  async clickCompleteTask(): Promise<void> {
    await this.completeTaskButton.click();
  }

  async isTaskCompletedVisible(): Promise<boolean> {
    return await this.taskCompletedMessage.isVisible();
  }

  async selectCheckboxes(): Promise<void> {
    await this.implementationDoneCheckbox.check();
    await this.testingDoneCheckbox.check();
    await this.acceptanceSignedCheckbox.check();
  }

  async deleteDocument(documentName: string): Promise<void> {
    const deleteBtn = this.documentTable.getByRole('row', { name: new RegExp(documentName, 'i') }).getByRole('button', { name: /delete/i });
    await deleteBtn.click();
    const confirmBtn = this.page.getByRole('button', { name: /yes/i });
    await confirmBtn.click();
  }
}