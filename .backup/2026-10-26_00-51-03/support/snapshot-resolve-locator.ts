import fs from 'fs';
import path from 'path';
import type { Locator, Page } from '@playwright/test';

export type StructuredLocator = {
  version: number;
  strategy: 'role' | 'label' | 'placeholder' | 'text' | 'testid' | 'css';
  role?: string;
  name?: string;
  text?: string;
  label?: string;
  placeholder?: string;
  testId?: string;
  css?: string;
  exact?: boolean;
  nth?: number;
  frameSelector?: string;
  pageHint?: string;
  /** Locale-independent native file control */
  semanticKind?: string;
  /** Path-only link constraint e.g. /contact_us — never a full origin URL */
  hrefPath?: string;
  normalizedName?: string;
  contextLabel?: string;
  inputType?: string;
};

export type SnapshotValueRef = {
  type: 'credential' | 'environment' | 'runtime';
  ref: string;
};

/** K3 typed value — mirrors Java UiValue kinds (no resolved secrets in sources). */
export type SnapshotUiValue = {
  kind: string;
  text?: string;
  credentialId?: string;
  field?: string;
  name?: string;
  environmentId?: string;
  bindingKey?: string;
  resourceId?: string;
  column?: string;
  rowMode?: string;
  rowIndex?: number;
  sheet?: string;
  variableName?: string;
  generatorKind?: string;
  stepId?: string;
};

const FIXTURE_URLS = new Set(['fixture://snapshot-login', 'fixture://login']);

/** Same rules as Java SnapshotTargetPolicy — fixture or allowlisted http(s). */
export function resolveSnapshotNavigateUrl(url: string, allowedOrigins: string[] = ['fixture://']): string {
  if (!url || !url.trim()) {
    throw new Error('VALIDATION_MISSING_FIELD: navigate url required');
  }
  const trimmed = url.trim();
  if (FIXTURE_URLS.has(trimmed)) {
    const file = path.join(process.cwd(), 'fixtures', 'snapshot', 'login.html');
    if (!fs.existsSync(file)) {
      throw new Error('WORKER_UNAVAILABLE: fixture HTML missing at fixtures/snapshot/login.html');
    }
    return 'file://' + file;
  }
  // K1: env://WEB_BASE_URL | env://BASE_LOGIN_URL — resolved URL injected at run (never baked in).
  if (/^env:\/\/(WEB_BASE_URL|BASE_LOGIN_URL)$/i.test(trimmed)) {
    const resolved = process.env.COTESTER_SNAPSHOT_START_URL;
    if (!resolved || !/^https?:\/\//i.test(resolved)) {
      throw new Error('START_TARGET_NOT_CONFIGURED: env start URL not provided for this run');
    }
    return resolveSnapshotNavigateUrl(resolved, allowedOrigins);
  }
  if (!/^https?:\/\//i.test(trimmed)) {
    throw new Error('ORIGIN_DENIED: Snapshot allows fixture://, env:// markers, or http(s) only');
  }
  let origin: string;
  try {
    origin = new URL(trimmed).origin;
  } catch {
    throw new Error('ORIGIN_DENIED: Invalid navigate URL');
  }
  const norm = origin.replace(/\/$/, '');
  let ok = false;
  for (const raw of allowedOrigins || []) {
    if (!raw || raw.startsWith('fixture://')) continue;
    try {
      const candidate = new URL(raw.endsWith('/') ? raw : raw + '/').origin.replace(/\/$/, '');
      if (candidate.toLowerCase() === norm.toLowerCase()) { ok = true; break; }
    } catch { /* ignore */ }
  }
  if (!ok) {
    throw new Error('ORIGIN_DENIED: Navigate origin not on project allowlist');
  }
  return trimmed;
}

/**
 * Unique resolve — never silent first() on duplicates.
 * count===0 → LOCATOR_NOT_FOUND; count>1 without nth → AMBIGUOUS_LOCATOR.
 */
function normalizeMatchKey(raw: string | undefined | null): string {
  if (!raw) return '';
  return raw
    .replace(/\u00a0/g, ' ')
    .replace(/[\uE000-\uF8FF\uF000-\uFFFF]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function pathOnly(href: string | null | undefined): string {
  if (!href) return '';
  const t = href.trim();
  if (!t || t.startsWith('#') || t.startsWith('javascript:') || t.startsWith('mailto:')) return '';
  try {
    let path = '';
    if (t.startsWith('/')) {
      const q = t.indexOf('?');
      path = q < 0 ? t : t.slice(0, q);
    } else {
      path = new URL(t, 'http://local.invalid').pathname || '';
    }
    if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
    return path;
  } catch {
    return '';
  }
}

/** Exact pathname only — never endsWith / substring. */
function hrefMatches(expected: string | undefined, actualHref: string): boolean {
  if (!expected) return true;
  let want = expected.trim();
  if (!want.startsWith('/')) want = '/' + want;
  if (want.length > 1 && want.endsWith('/')) want = want.slice(0, -1);
  const actual = pathOnly(actualHref);
  return !!actual && actual === want;
}

async function accessibleNameOf(loc: Locator): Promise<string> {
  try {
    return String(await loc.evaluate((el: Element) => {
      const collapse = (s: string) => (s || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
      const aria = collapse(el.getAttribute('aria-label') || '');
      if (aria) return aria;
      const decodeContent = (c: string) => {
        if (!c || c === 'none' || c === 'normal') return '';
        let s = String(c).replace(/^['"]|['"]$/g, '');
        s = s.replace(/\\u([0-9a-fA-F]{4})/g, (_: string, h: string) =>
          String.fromCharCode(parseInt(h, 16)));
        return s;
      };
      let out = '';
      const visit = (node: Node) => {
        if (node.nodeType === 3) { out += node.textContent || ''; return; }
        if (node.nodeType !== 1) return;
        const e = node as Element;
        if ((e.getAttribute('aria-hidden') || '').toLowerCase() === 'true') return;
        try { out += decodeContent(getComputedStyle(e, '::before').content); } catch { /* */ }
        e.childNodes.forEach((c) => visit(c));
        try { out += decodeContent(getComputedStyle(e, '::after').content); } catch { /* */ }
      };
      visit(el);
      const tree = collapse(out);
      if (tree) return tree;
      return collapse((el as HTMLElement).innerText || el.textContent || '');
    }));
  } catch {
    return '';
  }
}

async function hrefOf(loc: Locator): Promise<string> {
  try {
    return String(await loc.evaluate((el: Element) => el.getAttribute('href') || ''));
  } catch {
    return '';
  }
}

export async function resolveStructuredLocator(
  page: Page,
  locator: StructuredLocator,
): Promise<Locator> {
  if (locator.frameSelector || locator.pageHint) {
    throw new Error('UNSUPPORTED_LOCATOR_CONTEXT');
  }
  if (locator.semanticKind && locator.semanticKind.toLowerCase() === 'fileinput') {
    return resolveFileInput(page, locator);
  }
  if (locator.strategy === 'role') {
    return resolveRole(page, locator);
  }
  const exact = locator.exact !== false;
  let base: Locator;
  switch (locator.strategy) {
    case 'role':
      base = page.getByRole(locator.role as any, {
        name: locator.name,
        exact,
      });
      break;
    case 'label':
      base = page.getByLabel(locator.label!, { exact });
      break;
    case 'placeholder':
      base = page.getByPlaceholder(locator.placeholder!, { exact });
      break;
    case 'text':
      base = page.getByText(locator.text!, { exact });
      break;
    case 'testid':
      base = page.getByTestId(locator.testId!);
      break;
    case 'css':
      base = page.locator(locator.css!);
      break;
    default:
      throw new Error('UNSUPPORTED_LOCATOR_STRATEGY');
  }
  if (locator.nth != null) {
    const count = await base.count();
    if (locator.nth < 0 || locator.nth >= count) {
      throw new Error('LOCATOR_NOT_FOUND');
    }
    return base.nth(locator.nth);
  }
  const count = await base.count();
  if (count === 1) {
    return base;
  }
  if (count > 1) {
    throw new Error('AMBIGUOUS_LOCATOR');
  }
  throw new Error('LOCATOR_NOT_FOUND');
}

async function resolveRole(page: Page, locator: StructuredLocator): Promise<Locator> {
  const all = page.getByRole(locator.role as any);
  const count = await all.count();
  if (locator.hrefPath) {
    const hrefHits: number[] = [];
    for (let i = 0; i < count; i++) {
      if (hrefMatches(locator.hrefPath, await hrefOf(all.nth(i)))) hrefHits.push(i);
    }
    if (hrefHits.length === 1) return all.nth(hrefHits[0]);
    if (hrefHits.length > 1) {
      const want = normalizeMatchKey(locator.normalizedName || locator.name || locator.label || '');
      const narrowed: number[] = [];
      for (const i of hrefHits) {
        if (!want || normalizeMatchKey(await accessibleNameOf(all.nth(i))) === want) narrowed.push(i);
      }
      if (narrowed.length === 1) return all.nth(narrowed[0]);
      if (narrowed.length > 1) throw new Error('AMBIGUOUS_LOCATOR');
      throw new Error('LOCATOR_NOT_FOUND');
    }
  }
  if (locator.name) {
    const exact = page.getByRole(locator.role as any, { name: locator.name, exact: true });
    const exactCount = await exact.count();
    if (exactCount === 1) return exact;
    if (exactCount > 1) throw new Error('AMBIGUOUS_LOCATOR');
  }
  return resolveRoleNormalized(page, locator);
}

async function resolveFileInput(page: Page, locator: StructuredLocator): Promise<Locator> {
  const files = page.locator("input[type='file']");
  const count = await files.count();
  if (locator.nth != null) {
    if (locator.nth < 0 || locator.nth >= count) {
      throw new Error('LOCATOR_NOT_FOUND');
    }
    return files.nth(locator.nth);
  }
  if (count === 0) {
    throw new Error('LOCATOR_NOT_FOUND');
  }
  if (count === 1) {
    return files.nth(0);
  }
  if (locator.testId) {
    const byTest = page.getByTestId(locator.testId);
    const c = await byTest.count();
    if (c === 1) return byTest;
    if (c > 1) throw new Error('AMBIGUOUS_LOCATOR');
  }
  if (locator.name) {
    const want = normalizeMatchKey(locator.name);
    const hits: number[] = [];
    for (let i = 0; i < count; i++) {
      const n = normalizeMatchKey(await accessibleNameOf(files.nth(i)));
      if (n === want) hits.push(i);
    }
    if (hits.length === 1) return files.nth(hits[0]);
    if (hits.length > 1) throw new Error('AMBIGUOUS_LOCATOR');
  }
  throw new Error('AMBIGUOUS_LOCATOR');
}

async function resolveRoleNormalized(page: Page, locator: StructuredLocator): Promise<Locator> {
  const all = page.getByRole(locator.role as any);
  const count = await all.count();
  const want = normalizeMatchKey(locator.normalizedName || locator.name || locator.label || '');
  if (!want) {
    if (count === 1) return all.nth(0);
    if (count > 1) throw new Error('AMBIGUOUS_LOCATOR');
    throw new Error('LOCATOR_NOT_FOUND');
  }
  const hits: number[] = [];
  for (let i = 0; i < count; i++) {
    const el = all.nth(i);
    const n = normalizeMatchKey(await accessibleNameOf(el));
    if (n !== want) continue;
    hits.push(i);
  }
  if (hits.length === 0) throw new Error('LOCATOR_NOT_FOUND');
  if (hits.length > 1) throw new Error('AMBIGUOUS_LOCATOR');
  return all.nth(hits[0]);
}

/** Resolve fill value at runtime only — never bake secrets into sources. */
export async function fillFromValueRef(
  locator: Locator,
  valueRef: SnapshotValueRef,
  runtime: Record<string, string>,
): Promise<void> {
  let value = '';
  if (valueRef.type === 'credential') {
    const envKey = 'COTESTER_SNAPSHOT_CRED_' + valueRef.ref.replace(/[^A-Za-z0-9]/g, '_');
    value = process.env[envKey] ?? '';
  } else if (valueRef.type === 'environment') {
    // Legacy: K3 prefers CoTester env vars via COTESTER_SNAPSHOT_ENVVAR_* job channel.
    const scoped = 'COTESTER_SNAPSHOT_ENVVAR_' + valueRef.ref.replace(/[^A-Za-z0-9]/g, '_');
    value = process.env[scoped] ?? process.env[valueRef.ref] ?? '';
  } else if (valueRef.type === 'runtime') {
    value = runtime[valueRef.ref] ?? '';
  }
  await locator.fill(value);
}

/** K3: resolve UiValue via job-scoped env keys / extract bag — never log the value. */
export async function fillFromUiValue(
  locator: Locator,
  uiValue: SnapshotUiValue,
  runtime: Record<string, string>,
  options?: { timeout?: number; valueEnvKey?: string },
): Promise<void> {
  const value = resolveUiValue(uiValue, runtime, options?.valueEnvKey);
  await locator.fill(value, { timeout: options?.timeout });
}

export function resolveUiValue(
  uiValue: SnapshotUiValue,
  runtime: Record<string, string>,
  valueEnvKey?: string,
): string {
  const kind = uiValue?.kind || '';
  if (kind === 'literal') {
    return uiValue.text ?? '';
  }
  if (kind === 'extractedValueRef') {
    const name = uiValue.name || '';
    if (!(name in runtime)) {
      throw new Error('EXTRACTED_VALUE_NOT_AVAILABLE');
    }
    return runtime[name] ?? '';
  }
  if (valueEnvKey) {
    return process.env[valueEnvKey] ?? '';
  }
  if (kind === 'credentialRef') {
    const raw = (uiValue.credentialId || '') + '#' + (uiValue.field || 'password');
    const envKey = 'COTESTER_SNAPSHOT_CRED_' + raw.replace(/[^A-Za-z0-9]/g, '_');
    return process.env[envKey] ?? '';
  }
  if (kind === 'environmentVariableRef') {
    const envKey =
      'COTESTER_SNAPSHOT_ENVVAR_' + (uiValue.name || '').replace(/[^A-Za-z0-9]/g, '_');
    return process.env[envKey] ?? '';
  }
  if (kind === 'runtimeGeneratorRef') {
    const name = uiValue.name || 'gen';
    const envKey = 'COTESTER_SNAPSHOT_RTGEN_' + name.replace(/[^A-Za-z0-9]/g, '_');
    return process.env[envKey] ?? '';
  }
  if (kind === 'datasetRef') {
    return '';
  }
  throw new Error('UNSUPPORTED_ACTION: uiValue.kind=' + kind);
}

export function matchSnapshotText(
  actual: string,
  expected: string,
  match: 'equals' | 'contains' = 'equals',
  caseSensitive = true,
  trim = true,
): boolean {
  let a = actual ?? '';
  let e = expected ?? '';
  if (trim) {
    a = a.trim();
    e = e.trim();
  }
  if (!caseSensitive) {
    a = a.toLowerCase();
    e = e.toLowerCase();
  }
  return match === 'contains' ? a.includes(e) : a === e;
}

/** Projection string aligned with Java LocatorSelectorDerivation (role form). */
export function deriveSelector(locator: StructuredLocator): string {
  if (locator.frameSelector || locator.pageHint) {
    throw new Error('UNSUPPORTED_LOCATOR_CONTEXT');
  }
  let base: string;
  switch (locator.strategy) {
    case 'role':
      base = locator.name
        ? `role=${locator.role}[name='${(locator.name || '').replace(/'/g, "\\'")}']`
        : `role=${locator.role}`;
      break;
    case 'label':
      base = `label=${locator.label}`;
      break;
    case 'placeholder':
      base = `placeholder=${locator.placeholder}`;
      break;
    case 'text':
      base = `text=${locator.text}`;
      break;
    case 'testid':
      base = `[data-testid='${(locator.testId || '').replace(/'/g, "\\'")}']`;
      break;
    case 'css':
      base = locator.css!;
      break;
    default:
      throw new Error('UNSUPPORTED_LOCATOR_STRATEGY');
  }
  if (locator.nth != null) {
    return `${base} >> nth=${locator.nth}`;
  }
  return base;
}
