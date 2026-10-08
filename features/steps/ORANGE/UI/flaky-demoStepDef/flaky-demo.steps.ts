import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../../../support/world';
import { FlakyDemoPage } from '../../../../../pages/ORANGE/UI/flaky-demoPage/flaky-demo.page';

type FlakyWorld = ICustomWorld & { flakyDemoPage?: FlakyDemoPage };

Given('the flaky demo page is ready for flaky-demo', async function (this: FlakyWorld) {
  this.flakyDemoPage = new FlakyDemoPage(this.page!);
  await this.flakyDemoPage.ready();
});

When('the user runs the flaky coin flip for flaky-demo', async function (this: FlakyWorld) {
  await this.flakyDemoPage!.flipCoin();
});

Then(
  'the flaky demo assertion should pass about half the time for flaky-demo',
  async function (this: FlakyWorld) {
    await this.flakyDemoPage!.assertPassAboutHalfTheTime();
  }
);
