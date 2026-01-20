import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../../support/world';
import { AddressEditPage } from '../../../../pages/dcmui/address-editPage/address-edit.page';

let addressEditPage: AddressEditPage;

Given('I am on the {string} page', async function (this: ICustomWorld, pageName: string) {
  addressEditPage = new AddressEditPage(this.page!);
  const config = await addressEditPage.getEnvironmentConfig();
  let url: string;
  switch (pageName) {
    case 'login':
      url = config.baseLoginUrl;
      break;
    default:
      if (pageName.startsWith('http://') || pageName.startsWith('https://')) {
        url = pageName;
      } else {
        throw new Error(`Unknown page: ${pageName}. Use "login" for login page or provide full URL.`);
      }
  }
  await addressEditPage.navigateToUrl(url);
});

When('I click {string}', async function (this: ICustomWorld, elementName: string) {
  addressEditPage = new AddressEditPage(this.page!);
  await addressEditPage.clickElement(elementName);
});

When('I enter {string} into the {string} field', async function (this: ICustomWorld, value: string, fieldName: string) {
  addressEditPage = new AddressEditPage(this.page!);
  await addressEditPage.fillField(fieldName, value);
});

When('I click the {string} tab', async function (this: ICustomWorld, tabName: string) {
  addressEditPage = new AddressEditPage(this.page!);
  await addressEditPage.clickElement(tabName);
});

When('I click the action button in the {string} row', async function (this: ICustomWorld, rowName: string) {
  addressEditPage = new AddressEditPage(this.page!);
  await addressEditPage.clickElement(rowName);
});

When('I click the {string} dropdown', async function (this: ICustomWorld, dropdownName: string) {
    addressEditPage = new AddressEditPage(this.page!);
    await addressEditPage.clickElement(dropdownName);
});