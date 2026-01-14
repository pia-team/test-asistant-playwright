import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../../support/world';
import { Dcmv2New3Page } from '../../../../pages/dcmv2/dcmv2_new3Page/dcmv2_new3.page';

let dcmv2New3Page: Dcmv2New3Page;

Given('I am on the {string} page', async function (this: ICustomWorld, pageName: string) {
  dcmv2New3Page = new Dcmv2New3Page(this.page!);
  const config = await dcmv2New3Page.getEnvironmentConfig();
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
  await dcmv2New3Page.navigateToUrl(url);
});

When('I enter {string} into the {string} field', async function (this: ICustomWorld, value: string, fieldName: string) {
  dcmv2New3Page = new Dcmv2New3Page(this.page!);
  await dcmv2New3Page.fillField(fieldName, value);
});

When('I click {string}', async function (this: ICustomWorld, elementName: string) {
  dcmv2New3Page = new Dcmv2New3Page(this.page!);
  await dcmv2New3Page.clickElement(elementName);
});