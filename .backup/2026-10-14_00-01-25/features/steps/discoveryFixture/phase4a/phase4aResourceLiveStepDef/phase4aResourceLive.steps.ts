import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../../../support/world';
import { Phase4aResourceLivePage } from '../../../../../pages/discoveryFixture/phase4a/phase4aResourceLivePage/phase4aResourceLive.page';
import { runtimeData } from '../../../../../support/runtimeData';
import { setScenarioVar, requireScenarioVar } from '../../../../../support/scenarioVars';

Given('the user is on the resources page for phase4aResourceLive', async function (this: ICustomWorld) {
  const page = new Phase4aResourceLivePage(this.page!);
  await page.navigateToResourcesPage();
});

When('the user creates a new resource with a unique name for phase4aResourceLive', async function (this: ICustomWorld) {
  const page = new Phase4aResourceLivePage(this.page!);
  const resourceName = `Resource-${runtimeData.alphanumeric({ length: 8 })}`;
  setScenarioVar(this, 'resourceName', resourceName);
  await page.clickCreateResource();
  await page.enterResourceName(resourceName);
  const resourceId = await page.submitCreateAndCaptureId();
  setScenarioVar(this, 'resourceId', resourceId);
});

When('the user captures the created resource id from the create API response for phase4aResourceLive', async function (this: ICustomWorld) {
  // The resource id was already captured from the POST /api/resources response during creation.
  requireScenarioVar(this, 'resourceId');
});

When('the user searches for the captured resource id for phase4aResourceLive', async function (this: ICustomWorld) {
  const page = new Phase4aResourceLivePage(this.page!);
  const resourceId = requireScenarioVar(this, 'resourceId');
  await page.searchResourceById(resourceId);
});

Then('the search results show the same resource for phase4aResourceLive', async function (this: ICustomWorld) {
  const page = new Phase4aResourceLivePage(this.page!);
  const resourceId = requireScenarioVar(this, 'resourceId');
  const resourceName = requireScenarioVar(this, 'resourceName');
  await page.assertResourceVisible(resourceId, resourceName);
});