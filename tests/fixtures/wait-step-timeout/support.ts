import { After, Before, setDefaultTimeout, setWorldConstructor, World, type IWorldOptions } from '@cucumber/cucumber';
import { chromium, type Browser, type Page } from 'playwright';

function parsePositiveInt(envKey: string, fallbackMs: number): number {
  const raw = process.env[envKey];
  if (raw == null || raw.trim() === '') {
    return fallbackMs;
  }
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallbackMs;
}

// Same knob as support/hooks.ts. The step option below must beat this default.
setDefaultTimeout(parsePositiveInt('COTESTER_STEP_TIMEOUT_MS', 120 * 1000));

export class TimeoutProbeWorld extends World {
  browser?: Browser;
  page?: Page;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(TimeoutProbeWorld);

Before({ timeout: 30_000 }, async function (this: TimeoutProbeWorld) {
  this.browser = await chromium.launch();
  const context = await this.browser.newContext();
  this.page = await context.newPage();
});

After({ timeout: 15_000 }, async function (this: TimeoutProbeWorld) {
  await this.browser?.close();
});
