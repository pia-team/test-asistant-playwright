import { When } from '@cucumber/cucumber';
import type { ICustomWorld } from './world';
import { testData } from './testData';

When(
  'I save the document download as {string} in Data Center',
  async function (this: ICustomWorld, bindingKey: string) {
    if (!this.page) {
      throw new Error('Browser page is not available');
    }
    const download = await this.page.waitForEvent('download', { timeout: 60_000 });
    const result = await testData.saveDownload(bindingKey, download);
    this.scenarioVars[bindingKey] = result.resourceRef;
  },
);

When(
  'I save the downloaded file as {string} for the test flow',
  async function (this: ICustomWorld, bindingKey: string) {
    if (!this.page) {
      throw new Error('Browser page is not available');
    }
    const download = await this.page.waitForEvent('download', { timeout: 60_000 });
    const result = await testData.saveDownload(bindingKey, download);
    this.scenarioVars[bindingKey] = result.resourceRef;
  },
);
