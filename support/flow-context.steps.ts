import { Given, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from './world';
import { flowContext } from './flowContext';
import { testData } from './testData';

Given('I store {string} as {string} in flow context', async function (this: ICustomWorld, value: string, key: string) {
  flowContext.set(key, value);
  this.scenarioVars[key] = value;
});

async function loadDatasetCell(
  world: ICustomWorld,
  varName: string,
  bindingKey: string,
  column: string,
  rowIndex: number,
  sheet?: string,
) {
  const value = await testData.getCell(bindingKey, column, {
    rowIndex,
    sheet: sheet || undefined,
  });
  world.scenarioVars[varName] = value;
}

Given(
  'the scenario variable {string} is loaded from Data Center dataset {string} column {string} as first row',
  async function (this: ICustomWorld, varName: string, bindingKey: string, column: string) {
    await loadDatasetCell(this, varName, bindingKey, column, 0);
  },
);

Given(
  'the scenario variable {string} is loaded from Data Center dataset {string} column {string} as row {int}',
  async function (
    this: ICustomWorld,
    varName: string,
    bindingKey: string,
    column: string,
    rowNumber: number,
  ) {
    if (!Number.isInteger(rowNumber) || rowNumber < 1) {
      throw new Error(`Dataset row number must be a positive integer (got ${rowNumber})`);
    }
    await loadDatasetCell(this, varName, bindingKey, column, rowNumber - 1);
  },
);

Given(
  'the scenario variable {string} is loaded from Data Center dataset {string} column {string} sheet {string} as first row',
  async function (
    this: ICustomWorld,
    varName: string,
    bindingKey: string,
    column: string,
    sheet: string,
  ) {
    await loadDatasetCell(this, varName, bindingKey, column, 0, sheet);
  },
);

Given(
  'the scenario variable {string} is loaded from Data Center dataset {string} column {string} sheet {string} as row {int}',
  async function (
    this: ICustomWorld,
    varName: string,
    bindingKey: string,
    column: string,
    sheet: string,
    rowNumber: number,
  ) {
    if (!Number.isInteger(rowNumber) || rowNumber < 1) {
      throw new Error(`Dataset row number must be a positive integer (got ${rowNumber})`);
    }
    await loadDatasetCell(this, varName, bindingKey, column, rowNumber - 1, sheet);
  },
);

Given(
  'I store variable {string} as {string} in flow context',
  async function (this: ICustomWorld, varName: string, key: string) {
    const value = this.scenarioVars[varName];
    if (value === undefined || value === null) {
      throw new Error(`Scenario variable "${varName}" is not set`);
    }
    flowContext.set(key, String(value));
    this.scenarioVars[key] = String(value);
  },
);

Given(
  'I read {string} from flow context into {string}',
  async function (this: ICustomWorld, key: string, varName: string) {
    const value = flowContext.get(key);
    if (value === undefined) {
      throw new Error(`Flow context does not contain key "${key}"`);
    }
    this.scenarioVars[varName] = value;
  },
);

Then('flow context contains {string}', async function (key: string) {
  if (flowContext.get(key) === undefined) {
    throw new Error(`Flow context does not contain key "${key}"`);
  }
});
