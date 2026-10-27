import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../../../support/world';
import { Phase4aResourceLivePage } from '../../../../../pages/discoveryFixture/phase4a/phase4aResourceLivePage/phase4aResourceLive.page';
import { runtimeData } from '../../../../../support/runtimeData';
import { setScenarioVar, requireScenarioVar } from '../../../../../support/scenarioVars';

Given('the user is on the resources page for phase4aResourceLive', async function (this: ICustomWorld) {
  const page = new Phase4aResourceLivePage(this.page!);
  await page.navigateToResources();
});

When('the user clicks "Create resource" for phase4aResourceLive', async function (this: ICustomWorld) {
  const page = new Phase4aResourceLivePage(this.page!);
  await page.clickCreateResource();
});

When('the user enters a unique resource name for phase4aResourceLive', async function (this: ICustomWorld) {
  const resourceName = runtimeData.alphanumeric({ length: 10 });
  setScenarioVar(this, 'resourceName', resourceName);
  const page = new Phase4aResourceLivePage(this.page!);
  await page.enterResourceName(resourceName);
});

When('the user submits the new resource form for phase4aResourceLive', async function (this: ICustomWorld) {
  const page = new Phase4aResourceLivePage(this.page!);
  const response = await page.submitCreateForm();
  setScenarioVar(this, 'createResponseBody', JSON.stringify(await response.json()));
});

When('the user captures the created resource id from the create API response for phase4aResourceLive', async function (this: ICustomWorld) {
  const responseBody = requireScenarioVar(this, 'createResponseBody');
  const body = JSON.parse(responseBody);
  const resourceId = body?.id;
  if (resourceId == null) {
    throw new Error('Created resource id not found in POST /api/resources response JSON');
  }
  setScenarioVar(this, 'resourceId', String(resourceId));
});

When('the user returns to the resources page for phase4aResourceLive', async function (this: ICustomWorld) {
  const page = new Phase4aResourceLivePage(this.page!);
  await page.navigateToResources();
});

When('the user searches for the captured resource id for phase4aResourceLive', async function (this: ICustomWorld) {
  const resourceId = requireScenarioVar(this, 'resourceId');
  const page = new Phase4aResourceLivePage(this.page!);
  await page.searchByResourceId(resourceId);
});

Then('the search results show the same resource for phase4aResourceLive', async function (this: ICustomWorld) {
  const resourceName = requireScenarioVar(this, 'resourceName');
  const resourceId = requireScenarioVar(this, 'resourceId');
  const page = new Phase4aResourceLivePage(this.page!);
  await page.verifySearchResultContains(resourceName, resourceId);
});