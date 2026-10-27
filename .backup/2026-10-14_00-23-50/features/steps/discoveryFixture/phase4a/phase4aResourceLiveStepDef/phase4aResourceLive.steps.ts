import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../../../support/world';
import { Phase4aResourceLivePage } from '../../../../../pages/discoveryFixture/phase4a/phase4aResourceLivePage/phase4aResourceLive.page';
import { runtimeData } from '../../../../../support/runtimeData';
import { setScenarioVar, requireScenarioVar } from '../../../../../support/scenarioVars';

Given('the user is on the resources page for phase4aResourceLive', async function (this: ICustomWorld) {
  const page = new Phase4aResourceLivePage(this.page!);
  await page.openResourcesPage();
});

When('the user creates a new resource with a unique name for phase4aResourceLive', async function (this: ICustomWorld) {
  const resourceName = runtimeData.alphanumeric({ length: 12 });
  setScenarioVar(this, 'resourceName', resourceName);

  const page = new Phase4aResourceLivePage(this.page!);
  await page.startCreateResource();
  await page.enterResourceName(resourceName);
});

When('the user captures the created resource id from the create API response for phase4aResourceLive', async function (this: ICustomWorld) {
  const page = new Phase4aResourceLivePage(this.page!);
  const resourceId = await page.submitCreateAndCaptureId();
  setScenarioVar(this, 'resourceId', resourceId);
});

When('the user searches for the captured resource id for phase4aResourceLive', async function (this: ICustomWorld) {
  const resourceId = requireScenarioVar(this, 'resourceId') as string;

  const page = new Phase4aResourceLivePage(this.page!);
  await page.navigateToResourcesPage();
  await page.searchByResourceId(resourceId);
});

Then('the search results show the same resource for phase4aResourceLive', async function (this: ICustomWorld) {
  const resourceName = requireScenarioVar(this, 'resourceName') as string;

  const page = new Phase4aResourceLivePage(this.page!);
  await page.verifySearchResult(resourceName);
});