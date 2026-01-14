import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../../support/world';
import { Dcmv2New4Page } from '../../../../pages/dcmv2/dcmv2_new4Page/dcmv2_new4.page';

let dcmv2New4Page: Dcmv2New4Page;

Given('I am on the {string} page', async function (this: ICustomWorld, pageName: string) {
  dcmv2New4Page = new Dcmv2New4Page(this.page!);
  const config = await dcmv2New4Page.getEnvironmentConfig();
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
  await dcmv2New4Page.navigateToUrl(url);
});

When('I enter {string} into the {string} field', async function (this: ICustomWorld, value: string, fieldName: string) {
  dcmv2New4Page = new Dcmv2New4Page(this.page!);
  await dcmv2New4Page.fillField(fieldName, value);
});

When('I click {string}', async function (this: ICustomWorld, elementName: string) {
  dcmv2New4Page = new Dcmv2New4Page(this.page!);
  await dcmv2New4Page.clickElement(elementName);
});