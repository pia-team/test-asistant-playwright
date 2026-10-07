import { Given, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from './world';
import { flowContext } from './flowContext';

Given('I store {string} as {string} in flow context', async function (this: ICustomWorld, value: string, key: string) {
  flowContext.set(key, value);
  this.scenarioVars[key] = value;
});

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
