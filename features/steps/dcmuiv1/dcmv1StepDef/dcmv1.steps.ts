import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../../support/world';
import { Dcmv1Page } from '../../../../pages/dcmuiv1/dcmv1Page/dcmv1.page';

let dcmv1Page: Dcmv1Page;

Given('I am on the {string} page', async function (this: ICustomWorld, pageName: string) {
  dcmv1Page = new Dcmv1Page(this.page!);
  const config = await dcmv1Page.getEnvironmentConfig();
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
  await dcmv1Page.navigateToUrl(url);
});

When('I enter {string} into the {string} field', async function (this: ICustomWorld, value: string, fieldName: string) {
  dcmv1Page = new Dcmv1Page(this.page!);
  await dcmv1Page.fillField(fieldName, value);
});

When('I click {string}', async function (this: ICustomWorld, elementName: string) {
  dcmv1Page = new Dcmv1Page(this.page!);
  await dcmv1Page.clickElement(elementName);
});

When('I click the actions button for row {string}', async function (this: ICustomWorld, rowName: string) {
  dcmv1Page = new Dcmv1Page(this.page!);
  await dcmv1Page.clickElement(rowName);
});