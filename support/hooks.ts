import { Before, After, Status, AfterStep, BeforeStep } from '@cucumber/cucumber';
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

Before(async function (this: CustomWorld, scenario) {
  await ensureScreenshotsDir();
  
  // CRITICAL: Extract and store feature name for multi-feature parallel execution
  // This allows us to include feature context in every step log
  const featureUri = scenario.pickle?.uri || '';
  const featureName = featureUri.includes('/') 
    ? featureUri.substring(featureUri.lastIndexOf('/') + 1).replace('.feature', '')
    : featureUri.includes('\\')
    ? featureUri.substring(featureUri.lastIndexOf('\\') + 1).replace('.feature', '')
    : featureUri.replace('.feature', '');
  
  // Store feature name in world for use in step hooks
  (this as any).currentFeatureName = featureName;
  
  if (featureName) {
    console.log(chalk.magenta(`🎯 FEATURE START: ${featureName}`));
    console.log(chalk.magenta(`📁 Feature File: ${featureUri}`));
  }
  
  await this.openBrowser();
});

// CRITICAL: Include feature name in EVERY step log for parallel execution support
BeforeStep(function (this: ICustomWorld, { pickleStep }) {
  const featureName = (this as any).currentFeatureName || 'unknown';
  // Format: ➡ STEP START [feature-name]: step text
  console.error(chalk.yellow(`➡ STEP START [${featureName}]: ${pickleStep.text}`));
});

AfterStep(function (this: ICustomWorld, { result, pickleStep }) {
  const featureName = (this as any).currentFeatureName || 'unknown';
  // Format: ✓ STEP PASS [feature-name]: step text  OR  ✗ STEP FAIL [feature-name]: step text
  if (result.status === 'PASSED') {
    console.error(chalk.green(`✓ STEP PASS [${featureName}]: ${pickleStep.text}`));
  } else {
    console.error(chalk.red(`✗ STEP FAIL [${featureName}]: ${pickleStep.text}`));
  }
});

AfterStep(async function (this: ICustomWorld, step) {
  const takeForAllSteps = true;
  const featureName = (this as any).currentFeatureName || 'unknown';

  if (this.page && takeForAllSteps) {
    const buffer = await this.page.screenshot({ fullPage: true });

    // Save screenshot to file
    const filename = `${randomUUID()}.png`;
    const filepath = path.join(SCREENSHOTS_DIR, filename);
    await fs.writeFile(filepath, buffer);
    // Include feature name in screenshot log for parallel execution
    console.log(chalk.cyan(`📸 Screenshot [${featureName}]: ${filepath}`));

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
