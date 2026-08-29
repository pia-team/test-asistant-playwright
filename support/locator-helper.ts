import type { Page } from '@playwright/test';
import { resolveSelector } from './locator-registry';

/** Resolve a selector through the step-scoped override registry. */
export function resolveLocatorSelector(page: Page, stepKey: string, selector: string): string {
  return resolveSelector(page.url(), stepKey, selector);
}

/** Build a Playwright locator honoring runtime self-heal overrides. */
export function healingLocator(page: Page, stepKey: string, selector: string) {
  const resolved = resolveLocatorSelector(page, stepKey, selector);
  return page.locator(resolved);
}
