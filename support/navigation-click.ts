import type { Locator, Page } from '@playwright/test';
import { recordIneffectiveClick, type HealingContext } from './self-heal';

export type ChangeExpect = 'url' | 'dom' | 'any';

type ReadyPage = {
  url?: () => string;
  waitForLoadState?: (
    state: 'load' | 'domcontentloaded' | 'networkidle',
    options?: { timeout?: number },
  ) => Promise<unknown>;
  waitForTimeout?: (ms: number) => Promise<unknown>;
  evaluate?: <T>(fn: () => T) => Promise<T>;
};

const LOGIN_CLICK = /login-submit-button|kc-login|sign[\s-]?in|\blog[\s-]?in\b|\blogin\b|giriş/i;
const SIDEBAR_CLICK = /sidebar-nav-/i;

export function pageReadyTimeoutMs(): number {
  const raw = Number(process.env.COTESTER_PAGE_READY_TIMEOUT_MS);
  if (!Number.isFinite(raw)) return 5000;
  return Math.min(30_000, Math.max(1000, Math.trunc(raw)));
}

export function configuredStepDelayMs(): number {
  const raw = Number(process.env.COTESTER_STEP_DELAY_MS);
  if (!Number.isFinite(raw) || raw <= 0) return 0;
  return Math.min(10_000, Math.trunc(raw));
}

export function waitForPageReadyAfterStepEnabled(): boolean {
  const raw = (process.env.COTESTER_WAIT_PAGE_READY_AFTER_STEP ?? 'on').trim().toLowerCase();
  return raw !== 'off' && raw !== 'false' && raw !== '0';
}

/** Login submit and sidebar nav clicks should prove the page actually moved. */
export function navigationClickMode(selectorKey: string | undefined | null): ChangeExpect | null {
  const key = selectorKey || '';
  if (SIDEBAR_CLICK.test(key)) return 'url';
  if (LOGIN_CLICK.test(key)) return 'any';
  return null;
}

export async function domFingerprint(page: ReadyPage | undefined): Promise<string> {
  if (!page?.evaluate) return '';
  try {
    return await page.evaluate(() => {
      const root = document.querySelector('main') || document.body;
      const text = (root && (root as HTMLElement).innerText) || '';
      const count = root ? root.querySelectorAll('*').length : 0;
      return `${document.title}|${count}|${text.length}`;
    });
  } catch {
    return '';
  }
}

export function pageChanged(
  beforeUrl: string,
  beforeDom: string,
  afterUrl: string,
  afterDom: string,
  expect: ChangeExpect,
): boolean {
  const urlChanged = beforeUrl !== afterUrl;
  const domChanged = beforeDom !== afterDom;
  if (expect === 'url') return urlChanged;
  if (expect === 'dom') return domChanged;
  return urlChanged || domChanged;
}

/**
 * Wait for load, then a bounded networkidle. A networkidle timeout is not a failure:
 * some apps keep polling.
 */
export async function waitForPageReady(
  page: ReadyPage | undefined,
  timeoutMs: number = pageReadyTimeoutMs(),
): Promise<void> {
  if (!page?.waitForLoadState) return;
  await page.waitForLoadState('load', { timeout: timeoutMs });
  try {
    await page.waitForLoadState('networkidle', { timeout: timeoutMs });
  } catch {
    console.log(`Page networkidle wait timed out after ${timeoutMs}ms; continuing`);
  }
}

export async function clickExpectingChange(
  page: Page,
  locator: Locator,
  options?: {
    expect?: ChangeExpect;
    timeoutMs?: number;
    label?: string;
    healing?: HealingContext;
  },
): Promise<void> {
  const expect: ChangeExpect = options?.expect ?? 'any';
  const timeoutMs = options?.timeoutMs ?? pageReadyTimeoutMs();
  const label = (options?.label || '').trim() || (await locatorLabel(locator));
  const moved = await clickAndAwaitChange(page, locator, expect, timeoutMs);
  if (!moved) {
    const stillThere = await locator.isVisible().catch(() => false);
    const enabled = stillThere && (await locator.isEnabled().catch(() => false));
    if (enabled) {
      recordIneffectiveClick(options?.healing, label, page.url());
      const retried = await clickAndAwaitChange(page, locator, expect, timeoutMs);
      if (retried) {
        await waitForPageReady(page, timeoutMs);
        return;
      }
    }
    throw new Error(`"${label}" tıklandı ama sayfa değişmedi (URL: ${page.url()})`);
  }
  await waitForPageReady(page, timeoutMs);
}

async function clickAndAwaitChange(
  page: Page,
  locator: Locator,
  expect: ChangeExpect,
  timeoutMs: number,
): Promise<boolean> {
  const beforeUrl = page.url();
  const beforeDom = await domFingerprint(page);
  await locator.click();
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const afterUrl = page.url();
    const afterDom = await domFingerprint(page);
    if (pageChanged(beforeUrl, beforeDom, afterUrl, afterDom, expect)) {
      return true;
    }
    await page.waitForTimeout(50);
  }
  return false;
}

async function locatorLabel(locator: Locator): Promise<string> {
  try {
    const text = (await locator.innerText({ timeout: 500 })).trim();
    if (text) return text.slice(0, 80);
  } catch {
    // The locator text is only a label for the error.
  }
  return 'hedef';
}

/**
 * After a successful step that is not the last one: optional page-ready wait when the
 * page moved, then the configured step delay. Returns the delay that was applied.
 */
export async function applyPostStepWait(input: {
  passed: boolean;
  isLastStep: boolean;
  changed: boolean;
  page?: ReadyPage;
}): Promise<number> {
  if (!input.passed || input.isLastStep || !input.page) return 0;
  if (input.changed && waitForPageReadyAfterStepEnabled()) {
    await waitForPageReady(input.page);
  }
  const delay = configuredStepDelayMs();
  if (delay > 0 && input.page.waitForTimeout) {
    await input.page.waitForTimeout(delay);
  }
  return delay;
}
