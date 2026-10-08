import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../../../support/world';
import { SelfHealDemoPage } from '../../../../../pages/ORANGE/UI/self-heal-demoPage/self-heal-demo.page';

type SelfHealWorld = ICustomWorld & { selfHealDemoPage?: SelfHealDemoPage };

Given('the self-heal demo page is ready for self-heal-demo', async function (this: SelfHealWorld) {
  this.selfHealDemoPage = new SelfHealDemoPage(this.page!);
  await this.selfHealDemoPage.ready();
});

When(
  'the user clicks "Save" using a stale locator for self-heal-demo',
  async function (this: SelfHealWorld) {
    await this.selfHealDemoPage!.clickSaveWithStaleLocator();
  }
);

Then(
  'the self-heal demo should show that Save was clicked for self-heal-demo',
  async function (this: SelfHealWorld) {
    await this.selfHealDemoPage!.assertSaveClicked();
  }
);
