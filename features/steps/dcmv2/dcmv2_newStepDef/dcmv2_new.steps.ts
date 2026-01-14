import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../../support/world';
import { Dcmv2NewPage } from '../../../../pages/dcmv2/dcmv2_newPage/dcmv2_new.page';

let dcmv2NewPage: Dcmv2NewPage;

Given('I am on the {string} page', async function (this: ICustomWorld, pageName: string) {
  dcmv2NewPage = new Dcmv2NewPage(this.page!);
  const config = await dcmv2NewPage.getEnvironmentConfig();
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
  await dcmv2NewPage.navigateToUrl(url);
});

When('I click {string}', async function (this: ICustomWorld, elementName: string) {
  dcmv2NewPage = new Dcmv2NewPage(this.page!);
  await dcmv2NewPage.clickElement(elementName);
});

When('I enter {string} into the {string} field', async function (this: ICustomWorld, value: string, fieldName: string) {
  dcmv2NewPage = new Dcmv2NewPage(this.page!);
  await dcmv2NewPage.fillField(fieldName, value);
});