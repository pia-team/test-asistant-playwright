import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../../../support/world';
import { Phase4aResourceLivePage } from '../../../../../pages/discoveryFixture/phase4a/phase4aResourceLivePage/phase4aResourceLive.page';
import { runtimeData } from '../../../../../support/runtimeData';
import { requireScenarioVar, setScenarioVar } from '../../../../../support/scenarioVars';

Given('the user is on the resources page for phase4aResourceLive', async function (this: ICustomWorld) {
  const page = new Phase4aResourceLivePage(this.page!);
  await page.navigateToResources();
});

When('the user clicks "Create resource" for phase4aResourceLive', async function (this: ICustomWorld) {
  const page = new Phase4aResourceLivePage(this.page!);
  await page.clickCreateResource();
});

When('the user enters a unique resource name for phase4aResourceLive', async function (this: ICustomWorld) {
  const resourceName = runtimeData.alphanumeric({ length: 12 });
  setScenarioVar(this, 'resourceName', resourceName);
  const page = new Phase4aResourceLivePage(this.page!);
  await page.enterResourceName(resourceName);
});

When('the user clicks "Create" for phase4aResourceLive', async function (this: ICustomWorld) {
  const page = new Phase4aResourceLivePage(this.page!);
  const resourceId = await page.clickCreateAndCaptureId();
  setScenarioVar(this, 'resourceId', resourceId);
});

When('the user captures the created resource id from the create API response for phase4aResourceLive', async function (this: ICustomWorld) {
  const resourceId = requireScenarioVar(this, 'resourceId');
  setScenarioVar(this, 'resourceId', resourceId);
});

When('the user navigates to the resources page for phase4aResourceLive', async function (this: ICustomWorld) {
  const page = new Phase4aResourceLivePage(this.page!);
  await page.navigateToResources();
});

When('the user enters the captured resource id into the search field for phase4aResourceLive', async function (this: ICustomWorld) {
  const resourceId = requireScenarioVar(this, 'resourceId');
  const page = new Phase4aResourceLivePage(this.page!);
  await page.enterSearchResourceId(resourceId);
});

When('the user clicks "Search" for phase4aResourceLive', async function (this: ICustomWorld) {
  const page = new Phase4aResourceLivePage(this.page!);
  await page.clickSearch();
});

Then('the search results show the same resource for phase4aResourceLive', async function (this: ICustomWorld) {
  const resourceId = requireScenarioVar(this, 'resourceId');
  const resourceName = requireScenarioVar(this, 'resourceName');
  const page = new Phase4aResourceLivePage(this.page!);
  await page.verifySearchResult(resourceId, resourceName);
});