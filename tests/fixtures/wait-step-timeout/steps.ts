import { When } from '@cucumber/cucumber';
import { waitSeconds } from '../../../support/waitSteps';
import type { TimeoutProbeWorld } from './support';

When('I pause three seconds with an explicit timeout', { timeout: 5000 }, async function (this: TimeoutProbeWorld) {
  await waitSeconds(this, 3);
});

When('I pause three seconds on the default timeout', async function (this: TimeoutProbeWorld) {
  await waitSeconds(this, 3);
});
