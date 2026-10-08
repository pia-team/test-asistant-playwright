import { Page, Locator } from '@playwright/test';

export class CustomerOrderPage {
  readonly page: Page;
  readonly salesAgentNameInput: Locator;
  readonly externalOrderIdInput: Locator;
  readonly crmCaseIdInput: Locator;
  readonly salesAgentChannelInput: Locator;
  readonly continueButton: Locator;
  readonly cancelOrderButton: Locator;
  readonly cancellationReasonInput: Locator;
  readonly createCancelOrderButton: Locator;
  readonly packageChangeOption: Locator;
  readonly productChangeOption: Locator;
  readonly threeDotsIcon: Locator;

  constructor(page: Page) {
    this.page = page;
    this.salesAgentNameInput = page.getByRole('textbox', { name: /sales agent name/i });
    this.externalOrderIdInput = page.getByRole('textbox', { name: /external order id/i });
    this.crmCaseIdInput = page.getByRole('textbox', { name: /crm case id/i });
    this.salesAgentChannelInput = page.getByRole('textbox', { name: /sales agent channel/i });
    this.continueButton = page.getByRole('button', { name: /continue/i });
    this.cancelOrderButton = page.getByRole('button', { name: /cancel order/i });
    this.cancellationReasonInput = page.getByRole('textbox', { name: /cancellation reason/i });
    this.createCancelOrderButton = page.getByRole('button', { name: /create cancel order/i });
    this.packageChangeOption = page.getByRole('menuitem', { name: /package change/i });
    this.productChangeOption = page.getByRole('menuitem', { name: /product change/i });
    this.threeDotsIcon = page.getByRole('button', { name: /more_vert|three dots/i });
  }

  async fillOrderForm(data: {
    salesAgentName?: string;
    externalOrderId?: string;
    crmCaseId?: string;
    salesAgentChannel?: string;
  }): Promise<void> {
    if (data.salesAgentName) await this.salesAgentNameInput.fill(data.salesAgentName);
    if (data.externalOrderId) await this.externalOrderIdInput.fill(data.externalOrderId);
    if (data.crmCaseId) await this.crmCaseIdInput.fill(data.crmCaseId);
    if (data.salesAgentChannel) await this.salesAgentChannelInput.fill(data.salesAgentChannel);
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }

  async clickThreeDots(): Promise<void> {
    await this.threeDotsIcon.click();
  }

  async clickPackageChange(): Promise<void> {
    await this.packageChangeOption.click();
  }

  async clickProductChange(): Promise<void> {
    await this.productChangeOption.click();
  }

  async cancelOrder(reason: string): Promise<void> {
    await this.cancelOrderButton.click();
    await this.cancellationReasonInput.fill(reason);
    await this.createCancelOrderButton.click();
  }
}