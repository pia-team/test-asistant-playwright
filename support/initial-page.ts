import type { Page } from '@playwright/test';
import { getEnvUrls } from './env';
import { pageReadyTimeoutMs, waitForPageReady } from './navigation-click';

/**
 * WEB initial-page contract (generation + runner).
 *
 * - BASE_LOGIN_URL: login / SSO start (MCP inspect default).
 * - WEB_BASE_URL: in-app start without a login step.
 * Hooks open a blank browser; they do not navigate. First UI action must land on
 * a real page via this helper, an explicit Gherkin navigate, or page.goto.
 * Never invent a URL when none is configured.
 */
export type InitialPageTarget = 'BASE_LOGIN_URL' | 'WEB_BASE_URL';

export const START_TARGET_NOT_CONFIGURED =
  'START_TARGET_NOT_CONFIGURED: env start URL not provided for this run';

/** Minimal page surface so unit tests do not need a real Playwright Page. */
export type NavigablePage = {
  url(): string;
  isClosed(): boolean;
  goto(
    url: string,
    options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit'; timeout?: number },
  ): Promise<unknown>;
  waitForLoadState?: (
    state: 'load' | 'domcontentloaded' | 'networkidle',
    options?: { timeout?: number },
  ) => Promise<unknown>;
};

const LOGIN_HINT =
  /sign[\s-]?in|\blog[\s-]?in\b|\blogin\b|keycloak|\bsso\b|username|password|kc-login|login-submit|giriş|oturum\s*aç|şifre|sifre|kullanıcı\s*ad/i;

function pickHttpEnv(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = (process.env[key] || '').trim();
    if (value && /^https?:\/\//i.test(value)) {
      return value;
    }
  }
  return undefined;
}

function tryGetEnvBaseLoginUrl(): string | undefined {
  try {
    const url = getEnvUrls()?.baseLoginUrl?.trim();
    if (url && /^https?:\/\//i.test(url)) {
      return url;
    }
  } catch {
    // Missing project env is reported as START_TARGET_NOT_CONFIGURED by the caller.
  }
  return undefined;
}

export function isBlankDocumentUrl(url: string | undefined | null): boolean {
  const trimmed = (url || '').trim().toLowerCase();
  if (!trimmed) {
    return true;
  }
  return (
    trimmed === 'about:blank' ||
    trimmed === 'about:srcdoc' ||
    trimmed.startsWith('about:blank?') ||
    trimmed === 'chrome://new-tab-page/' ||
    trimmed === 'chrome://newtab/' ||
    trimmed === 'edge://newtab/'
  );
}

export function isExplicitNavigateStep(stepText: string | undefined | null): boolean {
  const text = stepText || '';
  if (/\bnavigates?\s+to\b/i.test(text) || /\bnavigate\s+to\b/i.test(text)) {
    return true;
  }
  if (/env:\/\/(?:WEB_BASE_URL|BASE_LOGIN_URL|BASE_URL)\b/i.test(text)) {
    return true;
  }
  if (/env:\\\/\\\/(?:WEB_BASE_URL|BASE_LOGIN_URL|BASE_URL)\b/i.test(text)) {
    return true;
  }
  return /\bpage\.goto\s*\(/i.test(text);
}

export function inferInitialPageTarget(source: string | undefined | null): InitialPageTarget {
  return LOGIN_HINT.test(source || '') ? 'BASE_LOGIN_URL' : 'WEB_BASE_URL';
}

/**
 * Same env:// marker order as Snapshot compile:
 * WEB_BASE_URL prefers COTESTER_WEB_BASE_URL; BASE_LOGIN_URL prefers BASE_LOGIN_URL.
 * COTESTER_SNAPSHOT_START_URL (job inject) wins when present. File config is last resort.
 */
export function resolveInitialPageUrl(target: InitialPageTarget = 'BASE_LOGIN_URL'): string {
  const fromEnv =
    target === 'WEB_BASE_URL'
      ? pickHttpEnv('COTESTER_SNAPSHOT_START_URL', 'COTESTER_WEB_BASE_URL', 'BASE_LOGIN_URL')
      : pickHttpEnv('COTESTER_SNAPSHOT_START_URL', 'BASE_LOGIN_URL', 'COTESTER_WEB_BASE_URL');
  const resolved = fromEnv || tryGetEnvBaseLoginUrl();
  if (!resolved) {
    throw new Error(START_TARGET_NOT_CONFIGURED);
  }
  return resolved;
}

export async function ensureInitialPage(
  page: NavigablePage | Page | undefined,
  target: InitialPageTarget = 'BASE_LOGIN_URL',
): Promise<void> {
  if (!page || page.isClosed()) {
    throw new Error('INITIAL_PAGE_UNAVAILABLE: browser page is not available for initial navigation');
  }
  if (!isBlankDocumentUrl(page.url())) {
    return;
  }
  const url = resolveInitialPageUrl(target);
  await page.goto(url, { waitUntil: 'load', timeout: pageReadyTimeoutMs() });
  await waitForPageReady(page);
}

/** First-step runner guard: skip explicit navigate; infer login vs app from step/scenario text. */
export async function ensureInitialPageForFirstStep(
  page: NavigablePage | Page | undefined,
  stepText: string,
  scenarioText: string,
): Promise<void> {
  if (!page || page.isClosed()) {
    return;
  }
  if (!isBlankDocumentUrl(page.url())) {
    return;
  }
  if (isExplicitNavigateStep(stepText)) {
    return;
  }
  await ensureInitialPage(page, inferInitialPageTarget(`${scenarioText}\n${stepText}`));
}
