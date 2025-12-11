import { Page, expect } from '@playwright/test';
import { getEnvConfig } from '../../support/env';



export class ControlExistingCustomerPage {
  private page: Page;
  private config = getEnvConfig();



constructor(page: Page) {
    this.page = page;
  }

async enterUsername(username: string) {
    await this.page.getByRole('textbox', { name: 'Username or email' }).click();
    await this.page.getByRole('textbox', { name: 'Username or email' }).fill(`${username}`);
  }

  async enterPassword(password: string) {
    await this.page.getByRole('textbox', { name: 'Password' }).click();
    await this.page.getByRole('textbox', { name: 'Password' }).fill(`${password}`);
  }


async clikingTypeOfsearchingDrop(){
  await this.page.waitForURL("https://dcm-ui.pi.dev-gcu.com/customer360")
    await this.page.getByText('person_pin_circle Customer').click();
}

async selectingTheTypeOfsearcing(type: string) {
    await this.page.getByText(`${type}`, { exact: true }).click();
}

async clickingİnputField(){
await this.page.getByRole('combobox', { name: 'Type text..' }).click();
}

async enteringValueIntoFiel(value: string) {
    await this.page.getByRole('combobox', { name: 'Type text..' }).fill(`${value}`);
}

async clickingsearchingIcon(){
await this.page.getByRole('button', { name: 'Search' }).click();
}

async selectingOptionFromFilter(){
  await this.page.locator('#F89269692').getByText('OFYETIM PIDEV').click();  
}
 async clickingLogoutDropdown(){
  await this.page.getByRole('button', { name: 'nora' }).click();
 }

 async clickingLogoutOption(){
 await this.page.getByRole('menuitem', { name: 'Logout' }).click();
 }







}