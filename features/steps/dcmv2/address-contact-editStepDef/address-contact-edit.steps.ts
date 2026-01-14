import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../../support/world';
import { AddressContactEditPage } from '../../../../pages/dcmv2/address-contact-editPage/address-contact-edit.page';

let addressContactEditPage: AddressContactEditPage;

Given('I am on the {string} page', async function (this: ICustomWorld, pageName: string) {
  addressContactEditPage = new AddressContactEditPage(this.page!);
  const config = await addressContactEditPage.getEnvironmentConfig();
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
  await addressContactEditPage.navigateToUrl(url);
});

When('I click {string}', async function (this: ICustomWorld, elementName: string) {
  addressContactEditPage = new AddressContactEditPage(this.page!);
  await addressContactEditPage.clickElement(elementName);
});

When('I enter {string} into the {string} field', async function (this: ICustomWorld, value: string, fieldName: string) {
  addressContactEditPage = new AddressContactEditPage(this.page!);
  await addressContactEditPage.fillField(fieldName, value);
});