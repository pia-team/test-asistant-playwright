import { Before, After, Status, AfterStep,BeforeStep } from '@cucumber/cucumber';
import type { ICustomWorld } from './world';
import { CustomWorld } from './world';
import * as fs from 'fs/promises';
import * as path from 'path';
import chalk from "chalk";
import { setDefaultTimeout } from '@cucumber/cucumber';
import { randomUUID } from 'crypto';

setDefaultTimeout(60 * 1000);

// Screenshots directory
const SCREENSHOTS_DIR = 'reports/screenshots';

// Ensure screenshots directory exists
async function ensureScreenshotsDir() {
  try {
    await fs.mkdir(SCREENSHOTS_DIR, { recursive: true });
  } catch (e) {
    // Ignore if already exists
  }
}

Before(async function (this: CustomWorld) {
  await ensureScreenshotsDir();
  await this.openBrowser();
});

BeforeStep(function ({ pickleStep }) {
    console.log(chalk.yellow(`➡ STEP START: ${pickleStep.text}`));
});

AfterStep(function ({ result, pickleStep }) {
    if (result.status === 'PASSED') {
        console.log(chalk.green(`✓ STEP PASS: ${pickleStep.text}`));
    } else {
        console.log(chalk.red(`✗ STEP FAIL: ${pickleStep.text}`));
    }
});

AfterStep(async function (this: ICustomWorld, step) {
  const takeForAllSteps = true;

  if (this.page && takeForAllSteps) {
    const buffer = await this.page.screenshot({ fullPage: true });
    
    // Save screenshot to file
    const filename = `${randomUUID()}.png`;
    const filepath = path.join(SCREENSHOTS_DIR, filename);
    await fs.writeFile(filepath, buffer);
    console.log(chalk.cyan(`📸 Screenshot kaydedildi: ${filepath}`));

    // ✔ Allure için DOĞRU attachment
    await this.attach(buffer, 'image/png');
  }
});

After(async function (this: ICustomWorld, scenario) {
  const status = scenario.result?.status;

  const videoPathPromise = this.page?.video()?.path();

  if (this.page) {
    const png = await this.page.screenshot({ fullPage: true });

    // ✔ Allure + HTML raporu için doğru kullanım
    await this.attach(png, 'image/png');
  }

  await this.closeBrowser();

  if (status !== Status.FAILED || !videoPathPromise) return;

  const videoPath = await videoPathPromise;

  let videoBuffer: Buffer | null = null;

  for (let i = 0; i < 10; i++) {
    try {
      videoBuffer = await fs.readFile(videoPath);
      break;
    } catch (e: any) {
      if (e.code !== 'ENOENT') throw e;
      await new Promise(r => setTimeout(r, 200));
    }
  }

  // ✔ Allure için video attach
  if (videoBuffer) {
    await this.attach(videoBuffer, 'video/webm');
  } else {
    await this.attach(`Video not found: ${videoPath}`, 'text/plain');
  }
});
