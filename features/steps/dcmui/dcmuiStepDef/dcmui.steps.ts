import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../../support/world';
import { DcmuiPage } from '../../../../pages/dcmui/dcmuiPage/dcmui.page';

let dcmuiPage: DcmuiPage;

Given('I am on the {string} page', async function (this: ICustomWorld, pageName: string) {
  dcmuiPage = new DcmuiPage(this.page!);
  const config = await dcmuiPage.getEnvironmentConfig();
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
  await dcmuiPage.navigateToUrl(url);
});

When('I click {string}', async function (this: ICustomWorld, elementName: string) {
  dcmuiPage = new DcmuiPage(this.page!);
  await dcmuiPage.clickElement(elementName);
});

When('I enter {string} into the {string} field', async function (this: ICustomWorld, value: string, fieldName: string) {
  dcmuiPage = new DcmuiPage(this.page!);
  await dcmuiPage.fillField(fieldName, value);
});

When('I select {string} from the {string} dropdown', async function (this: ICustomWorld, option: string, dropdownName: string) {
  dcmuiPage = new DcmuiPage(this.page!);
  await dcmuiPage.selectOption(dropdownName, option);
});