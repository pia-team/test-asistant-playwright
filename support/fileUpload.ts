import type { Locator, Page } from '@playwright/test';
import path from 'path';
import { testData } from './testData';

/**
 * Uploads a document using a Data Center binding key.
 */
export async function uploadDocument(
  page: Page,
  trigger: Locator,
  bindingKey: string,
): Promise<void> {
  const resolvedPath = await testData.getFile(bindingKey);
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    trigger.click({ force: true }),
  ]);
  await fileChooser.setFiles(resolvedPath);
  await page.waitForTimeout(4000);
}

/**
 * Uploads when the target is a real file input; falls back to filechooser on buttons.
 */
export async function uploadDocumentSmart(
  page: Page,
  trigger: Locator,
  bindingKey: string,
): Promise<void> {
  const resolvedPath = await testData.getFile(bindingKey);
  const tagName = await trigger.evaluate((el) => el.tagName.toLowerCase()).catch(() => '');
  const inputType = await trigger.evaluate((el) => (el as HTMLInputElement).type?.toLowerCase() ?? '').catch(() => '');

  if (tagName === 'input' && inputType === 'file') {
    await trigger.setInputFiles(resolvedPath);
    await page.waitForTimeout(4000);
    return;
  }

  await uploadDocument(page, trigger, bindingKey);
}

/**
 * @deprecated Use testData.getFile(bindingKey) via uploadDocument/uploadDocumentSmart.
 */
export function resolveDocumentPath(filePath: string): string {
  return path.resolve(process.cwd(), filePath.replace(/^\/+/, ''));
}
