/**
 * GENERATION-shaped REAL_BROWSER proof: code shaped like expected AI output
 * (page object + captureElementValue + requireScenarioVar) against the resource fixture.
 * This is NOT live LLM generation (FULL_UI_ACCEPTANCE).
 */
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import * as path from 'path';
import { chromium, type Browser, type Page, type Locator } from 'playwright';
import {
  captureElementValue,
  requireScenarioVar,
  setScenarioVar,
  type ScenarioVarWorld,
} from '../support/scenarioVars';
import { startStaticServer, type StaticServerHandle } from './e2e/static-server';

const FIXTURE_DIR = path.join(__dirname, 'e2e', 'fixtures', 'resource-app');

/** Mirrors a generated page object using record locators (getByTestId fidelity). */
class CaptureResourcePage {
  constructor(private readonly page: Page) {}
  get createBtn(): Locator {
    return this.page.getByTestId('create-btn');
  }
  get resourceId(): Locator {
    return this.page.getByTestId('resource-id');
  }
  get filterInput(): Locator {
    return this.page.getByTestId('filter-input');
  }
  get applyFilter(): Locator {
    return this.page.getByTestId('apply-filter');
  }
  get resultRow(): Locator {
    return this.page.getByTestId('result-row');
  }
  get nameInput(): Locator {
    return this.page.getByTestId('name-input');
  }
  async clickCreate(): Promise<void> {
    await this.createBtn.click();
  }
  async fillFilter(value: string): Promise<void> {
    await this.filterInput.fill(value);
  }
  async apply(): Promise<void> {
    await this.applyFilter.click();
  }
}

describe('scenarioVars generation-shaped Chromium flow', () => {
  let server: StaticServerHandle | undefined;
  let browser: Browser | undefined;
  let page: Page | undefined;

  before(async () => {
    server = await startStaticServer(FIXTURE_DIR);
    browser = await chromium.launch({ headless: true });
    page = await browser.newPage();
  });

  after(async () => {
    await page?.close();
    await browser?.close();
    await server?.close();
  });

  it('create → TEXT capture resourceId → reuse in filter (dynamic id, no hardcode)', async () => {
    const world: ScenarioVarWorld = { scenarioVars: {} };
    const po = new CaptureResourcePage(page!);
    await page!.goto(`${server!.url}/index.html`);

    // Gherkin intent: When the user creates a new resource
    await po.clickCreate();

    // And the user stores the Resource ID shown on the page as "resourceId"
    const captured = await captureElementValue(world, po.resourceId, 'TEXT', 'resourceId');
    assert.match(captured, /^RES-\d+$/);
    assert.notEqual(captured, 'RES-HARDCODED');

    // And the user enters the stored resourceId into the Resource ID filter (twice = reuse)
    const first = requireScenarioVar(world, 'resourceId');
    await po.fillFilter(first);
    const second = requireScenarioVar(world, 'resourceId');
    assert.equal(second, first);
    await po.fillFilter(second);

    // And the user applies the filter / Then created resource displayed
    await po.apply();
    await po.resultRow.waitFor({ state: 'visible' });
    assert.equal((await po.resultRow.innerText()).trim(), captured);
  });

  it('supports multiple variables and VALUE + ATTRIBUTE captures', async () => {
    const world: ScenarioVarWorld = { scenarioVars: {} };
    const po = new CaptureResourcePage(page!);
    await page!.goto(`${server!.url}/index.html`);
    await po.clickCreate();

    await captureElementValue(world, po.resourceId, 'TEXT', 'resourceId');
    await po.nameInput.fill('Acme-Dyn');
    await captureElementValue(world, po.nameInput, 'VALUE', 'resourceName');
    await captureElementValue(
      world,
      po.resourceId,
      'ATTRIBUTE',
      'resourceAttr',
      'data-resource-id',
    );

    assert.equal(requireScenarioVar(world, 'resourceName'), 'Acme-Dyn');
    assert.equal(
      requireScenarioVar(world, 'resourceAttr'),
      requireScenarioVar(world, 'resourceId'),
    );

    // generate→store still works alongside capture
    setScenarioVar(world, 'noteTag', 'TAG-' + Date.now());
    assert.match(requireScenarioVar(world, 'noteTag'), /^TAG-\d+$/);
  });
});
