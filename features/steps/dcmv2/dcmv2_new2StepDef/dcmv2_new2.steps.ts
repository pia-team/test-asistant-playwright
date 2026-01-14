import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../../support/world';
import { Dcmv2New2Page } from '../../../../pages/dcmv2/dcmv2_new2Page/dcmv2_new2.page';

let dcmv2New2Page: Dcmv2New2Page;

Given('I am on the {string} page', async function (this: ICustomWorld, pageName: string) {
  dcmv2New2Page = new Dcmv2New2Page(this.page!);
  const config = await dcmv2New2Page.getEnvironmentConfig();
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
  await dcmv2New2Page.navigateToUrl(url);
});

When('I enter {string} into the {string} field', async function (this: ICustomWorld, value: string, fieldName: string) {
  dcmv2New2Page = new Dcmv2New2Page(this.page!);
  await dcmv2New2Page.fillField(fieldName, value);
});

When('I click {string}', async function (this: ICustomWorld, elementName: string) {
  dcmv2New2Page = new Dcmv2New2Page(this.page!);
  await dcmv2New2Page.clickElement(elementName);
});