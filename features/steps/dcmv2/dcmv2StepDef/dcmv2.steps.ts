import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../../support/world';
import { Dcmv2Page } from '../../../../pages/dcmv2/dcmv2Page/dcmv2.page';

let dcmv2Page: Dcmv2Page;

Given('I am on the {string} page', async function (this: ICustomWorld, pageName: string) {
  dcmv2Page = new Dcmv2Page(this.page!);
  const config = await dcmv2Page.getEnvironmentConfig();
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
  await dcmv2Page.navigateToUrl(url);
});

When('I click {string}', async function (this: ICustomWorld, elementName: string) {
  dcmv2Page = new Dcmv2Page(this.page!);
  await dcmv2Page.clickElement(elementName);
});

When('I enter {string} into the {string} field', async function (this: ICustomWorld, value: string, fieldName: string) {
  dcmv2Page = new Dcmv2Page(this.page!);
  await dcmv2Page.fillField(fieldName, value);
});