import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'fs';
import * as path from 'path';
import { chromium, type Browser, type Page } from 'playwright';
import {
  captureElementValue,
  getScenarioVar,
  requireScenarioVar,
  setScenarioVar,
  SAFE_VARIABLE,
  type ScenarioVarWorld,
} from '../support/scenarioVars';
import { startStaticServer, type StaticServerHandle } from './e2e/static-server';

const RUNNERS_ROOT = path.resolve(__dirname, '..', '..');
const TEMPLATE_COPY = path.join(
  RUNNERS_ROOT,
  'runner-templates/web/support/scenarioVars.ts',
);
const LOCAL_COPY = path.join(__dirname, '..', 'support', 'scenarioVars.ts');
const FIXTURE_DIR = path.join(__dirname, 'e2e', 'fixtures', 'resource-app');

describe('scenarioVars helpers', () => {
  it('keeps runner-templates/web copy identical', () => {
    assert.equal(
      fs.readFileSync(LOCAL_COPY, 'utf8'),
      fs.readFileSync(TEMPLATE_COPY, 'utf8'),
    );
  });

  it('set / get / require round-trip and validates names', () => {
    const world: ScenarioVarWorld = { scenarioVars: {} };
    setScenarioVar(world, 'resourceId', 'RES-1');
    assert.equal(getScenarioVar(world, 'resourceId'), 'RES-1');
    assert.equal(requireScenarioVar(world, 'resourceId'), 'RES-1');
    assert.equal(SAFE_VARIABLE.test('resourceId'), true);
    assert.equal(SAFE_VARIABLE.test('1bad'), false);
    assert.throws(() => setScenarioVar(world, '1bad', 'x'), /Invalid scenario variable name/);
    assert.throws(() => setScenarioVar(world, 'empty', ''), /empty string/);
  });

  it('requireScenarioVar fails clearly when missing', () => {
    const world: ScenarioVarWorld = { scenarioVars: {} };
    assert.throws(
      () => requireScenarioVar(world, 'resourceId'),
      /Scenario variable "resourceId" is not set/,
    );
  });

  it('isolates bags across worlds (parallel-safe API)', () => {
    const a: ScenarioVarWorld = { scenarioVars: {} };
    const b: ScenarioVarWorld = { scenarioVars: {} };
    setScenarioVar(a, 'resourceId', 'A');
    setScenarioVar(b, 'resourceId', 'B');
    assert.equal(requireScenarioVar(a, 'resourceId'), 'A');
    assert.equal(requireScenarioVar(b, 'resourceId'), 'B');
    a.scenarioVars = {};
    assert.throws(() => requireScenarioVar(a, 'resourceId'), /is not set/);
    assert.equal(requireScenarioVar(b, 'resourceId'), 'B');
  });
});

describe('scenarioVars capture (Chromium) @e2e-browser-smoke', () => {
  let server: StaticServerHandle | undefined;
  let browser: Browser | undefined;
  let page: Page | undefined;

  before(async () => {
    server = await startStaticServer(FIXTURE_DIR);
    browser = await chromium.launch({ headless: true });
    page = await browser.newPage();
    await page.goto(`${server.url}/index.html`);
  });

  after(async () => {
    await page?.close();
    await browser?.close();
    await server?.close();
  });

  it('captures TEXT into scenarioVars', async () => {
    const world: ScenarioVarWorld = { scenarioVars: {} };
    const value = await captureElementValue(
      world,
      page!.getByTestId('resource-id'),
      'TEXT',
      'resourceId',
    );
    assert.match(value, /^RES-\d+$/);
    assert.equal(requireScenarioVar(world, 'resourceId'), value);
  });

  it('captures VALUE from an input', async () => {
    const world: ScenarioVarWorld = { scenarioVars: {} };
    await page!.getByTestId('name-input').fill('Acme');
    const value = await captureElementValue(
      world,
      page!.getByTestId('name-input'),
      'VALUE',
      'resourceName',
    );
    assert.equal(value, 'Acme');
  });

  it('captures ATTRIBUTE', async () => {
    const world: ScenarioVarWorld = { scenarioVars: {} };
    const value = await captureElementValue(
      world,
      page!.getByTestId('resource-id'),
      'ATTRIBUTE',
      'resourceAttr',
      'data-resource-id',
    );
    assert.match(value, /^RES-\d+$/);
  });

  it('rejects empty capture, missing element, ambiguous locator, password', async () => {
    const world: ScenarioVarWorld = { scenarioVars: {} };
    await page!.getByTestId('name-input').fill('');
    await assert.rejects(
      () =>
        captureElementValue(world, page!.getByTestId('name-input'), 'VALUE', 'emptyVar'),
      /captured value is empty/,
    );
    await assert.rejects(
      () =>
        captureElementValue(
          world,
          page!.getByTestId('missing'),
          'TEXT',
          'gone',
          undefined,
          { timeout: 800 },
        ),
      /element not found/,
    );
    await assert.rejects(
      () =>
        captureElementValue(world, page!.getByTestId('dup'), 'TEXT', 'dupVar'),
      /ambiguous/,
    );
    await assert.rejects(
      () =>
        captureElementValue(world, page!.getByTestId('secret'), 'VALUE', 'pwd'),
      /password|credential/i,
    );
  });

  it('capture → reuse fill → filter shows matching resource (dynamic id)', async () => {
    const world: ScenarioVarWorld = { scenarioVars: {} };
    await page!.goto(`${server!.url}/index.html`);
    await page!.getByTestId('create-btn').click();
    const id = await captureElementValue(
      world,
      page!.getByTestId('resource-id'),
      'TEXT',
      'resourceId',
    );
    assert.match(id, /^RES-\d+$/);

    const stored = requireScenarioVar(world, 'resourceId');
    await page!.getByTestId('filter-input').fill(stored);
    await page!.getByTestId('apply-filter').click();

    const row = page!.getByTestId('result-row');
    await row.waitFor({ state: 'visible' });
    assert.equal((await row.innerText()).trim(), id);

    // Fresh world simulates new scenario reset
    const next: ScenarioVarWorld = { scenarioVars: {} };
    assert.throws(() => requireScenarioVar(next, 'resourceId'), /is not set/);
  });
});
