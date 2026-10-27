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
  const page = new Phase4aResourceLivePage(this.page!);
  const resourceName = runtimeData.alphanumeric({ length: 12 });
  setScenarioVar(this, 'resourceName', resourceName);
  await page.enterResourceName(resourceName);
});

When(
  'the user submits the resource form and captures the created resource id from the API response for phase4aResourceLive',
  async function (this: ICustomWorld) {
    const page = new Phase4aResourceLivePage(this.page!);
    const resourceId = await page.submitCreateAndCaptureId();
    setScenarioVar(this, 'resourceId', resourceId);
  }
);

When('the user searches for the captured resource id for phase4aResourceLive', async function (this: ICustomWorld) {
  const page = new Phase4aResourceLivePage(this.page!);
  const resourceId = requireScenarioVar(this, 'resourceId');
  await page.navigateToResources();
  await page.enterSearchResourceId(resourceId);
  await page.clickSearch();
});

Then('the search results show the same resource for phase4aResourceLive', async function (this: ICustomWorld) {
  const page = new Phase4aResourceLivePage(this.page!);
  const resourceId = requireScenarioVar(this, 'resourceId');
  const resourceName = requireScenarioVar(this, 'resourceName');
  await page.expectSearchResultContainsResource(resourceId, resourceName);
});