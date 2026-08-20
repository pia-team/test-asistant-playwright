import type { Locator, Page } from '@playwright/test';
import path from 'path';

/**
 * Resolves a project-relative document path (e.g. "/docs/example.pdf") to an absolute path.
 */
export function resolveDocumentPath(filePath: string): string {
  return path.resolve(process.cwd(), filePath.replace(/^\/+/, ''));
}

/**
 * Uploads a document via the browser file chooser (buttons, labels, non-input triggers).
 * Use this instead of locator.setInputFiles() on elements that are not <input type="file">.
 */
export async function uploadDocument(
  page: Page,
  trigger: Locator,
  filePath: string,
): Promise<void> {
  const resolvedPath = resolveDocumentPath(filePath);
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
  filePath: string,
): Promise<void> {
  const resolvedPath = resolveDocumentPath(filePath);
  const tagName = await trigger.evaluate((el) => el.tagName.toLowerCase()).catch(() => '');
  const inputType = await trigger.evaluate((el) => (el as HTMLInputElement).type?.toLowerCase() ?? '').catch(() => '');

  if (tagName === 'input' && inputType === 'file') {
    await trigger.setInputFiles(resolvedPath);
    await page.waitForTimeout(4000);
    return;
  }

  await uploadDocument(page, trigger, filePath);
}
