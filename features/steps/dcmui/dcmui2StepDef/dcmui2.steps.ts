import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../../support/world';
import { Dcmui2Page } from '../../../../pages/dcmui/dcmui2Page/dcmui2.page';

let dcmui2Page: Dcmui2Page;

Given('I am on the {string} page', async function (this: ICustomWorld, pageName: string) {
  dcmui2Page = new Dcmui2Page(this.page!);
  const config = await dcmui2Page.getEnvironmentConfig();
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
  await dcmui2Page.navigateToUrl(url);
});

When('I click {string}', async function (this: ICustomWorld, elementName: string) {
  dcmui2Page = new Dcmui2Page(this.page!);
  await dcmui2Page.clickElement(elementName);
});

When('I enter {string} into the {string} field', async function (this: ICustomWorld, value: string, fieldName: string) {
  dcmui2Page = new Dcmui2Page(this.page!);
  await dcmui2Page.fillField(fieldName, value);
});