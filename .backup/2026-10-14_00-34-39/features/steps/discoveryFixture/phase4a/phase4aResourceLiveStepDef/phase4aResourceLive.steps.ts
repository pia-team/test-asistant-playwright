import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../../../support/world';
import { Phase4aResourceLivePage } from '../../../../../pages/discoveryFixture/phase4a/phase4aResourceLivePage/phase4aResourceLive.page';
import { runtimeData } from '../../../../../support/runtimeData';
import { setScenarioVar, requireScenarioVar } from '../../../../../support/scenarioVars';

Given('the user is on the resources page for phase4aResourceLive', async function (this: ICustomWorld) {
  const page = new Phase4aResourceLivePage(this.page!);
  await page.gotoResources();
});

When('the user creates a new resource with a unique name for phase4aResourceLive', async function (this: ICustomWorld) {
  const page = new Phase4aResourceLivePage(this.page!);

  await page.openCreateResource();

  const resourceName = runtimeData.alphanumeric({ length: 12, charset: 'alphanumeric' });
  setScenarioVar(this, 'resourceName', resourceName);

  await page.enterResourceName(resourceName);

  const responsePromise = page.waitForCreateResponse();
  await page.clickCreateSubmit();

  const response = await responsePromise;
  setScenarioVar(this, 'createResourceResponseBody', await response.text());
});

When('the user captures the created resource id from the create API response for phase4aResourceLive', async function (this: ICustomWorld) {
  const responseBodyText = requireScenarioVar(this, 'createResourceResponseBody') as string;

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(responseBodyText) as Record<string, unknown>;
  } catch {
    throw new Error('Create resource response body is not valid JSON');
  }

  const id = body.id ?? body.resourceId;
  if (id === undefined || id === null) {
    throw new Error('Create resource response did not contain "id" or "resourceId"');
  }

  setScenarioVar(this, 'resourceId', String(id));
});

When('the user searches for the captured resource id for phase4aResourceLive', async function (this: ICustomWorld) {
  const page = new Phase4aResourceLivePage(this.page!);
  const resourceId = requireScenarioVar(this, 'resourceId') as string;

  await page.gotoResourcesSearch();
  await page.enterResourceId(resourceId);
  await page.submitSearch();
});

Then('the search results show the same resource for phase4aResourceLive', async function (this: ICustomWorld) {
  const page = new Phase4aResourceLivePage(this.page!);
  const resourceId = requireScenarioVar(this, 'resourceId') as string;

  await page.verifySearchResultContainsResourceId(resourceId);
});