import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../../../support/world';
import { ManageResourcePage } from '../../../../../pages/Orange/resource-mcp/manage-resourcePage/manage-resource.page';
import { runtimeData } from '../../../../../support/runtimeData';
import { captureElementValue, requireScenarioVar } from '../../../../../support/scenarioVars';

Given('1.sign in with keycloak butonuna tıkla for manage-resource', async function (this: ICustomWorld) {
  const page = new ManageResourcePage(this.page!);
  await page.clickSignInKeycloakButton();
});

When('2.username gir for manage-resource', async function (this: ICustomWorld) {
  const page = new ManageResourcePage(this.page!);
  const username = runtimeData.faker('username');
  this.scenarioVars = this.scenarioVars ?? {};
  this.scenarioVars['username'] = username;
  await page.enterUsername(username);
});

When('3.password gir for manage-resource', async function (this: ICustomWorld) {
  const page = new ManageResourcePage(this.page!);
  const password = runtimeData.faker('username'); // using faker for placeholder password
  this.scenarioVars = this.scenarioVars ?? {};
  this.scenarioVars['password'] = password;
  await page.enterPassword(password);
});

When('4.sign in butonuna tıkla for manage-resource', async function (this: ICustomWorld) {
  const page = new ManageResourcePage(this.page!);
  await page.clickSignInButton();
});

When('5.sidebardan manage resources butonuna tıkla for manage-resource', async function (this: ICustomWorld) {
  const page = new ManageResourcePage(this.page!);
  await page.clickManageResourcesSidebarButton();
});

When('6.açılan ekranda filter butonuna bas for manage-resource', async function (this: ICustomWorld) {
  const page = new ManageResourcePage(this.page!);
  await page.clickFilterButton();
  // Capture the ID of the first row after the table loads.
  await captureElementValue(this, page.getFirstRowIdLocator(), 'TEXT', 'resourceId');
});

When('7.search by ids butonuna tıkla for manage-resource', async function (this: ICustomWorld) {
  const page = new ManageResourcePage(this.page!);
  await page.clickSearchByIdsButton();
});

Then('8.resource id gir for manage-resource', async function (this: ICustomWorld) {
  const page = new ManageResourcePage(this.page!);
  const resourceId = requireScenarioVar(this, 'resourceId');
  await page.enterResourceId(resourceId);
});