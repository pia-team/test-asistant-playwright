import type { Locator, Page } from '@playwright/test';

/**
 * Per-scenario variable helpers for UI tests.
 * Values live only on Cucumber World `scenarioVars` (reset in Before) — no process cache.
 */

export type CaptureMode = 'TEXT' | 'VALUE' | 'ATTRIBUTE';

export type ScenarioVarWorld = {
  scenarioVars?: Record<string, string>;
};

/** Same identifier rules as the API runner (`SAFE_VARIABLE`). */
export const SAFE_VARIABLE = /^[A-Za-z_][A-Za-z0-9_]*$/;

const CREDENTIAL_HINT =
  /password|passwd|secret|token|api[_-]?key|authorization|bearer/i;

export type SetScenarioVarOptions = {
  /** When true, allow replacing an existing value (default: refuse different overwrite). */
  allowOverwrite?: boolean;
};

function assertSafeName(name: string): void {
  if (!name || !SAFE_VARIABLE.test(name)) {
    throw new Error(
      `Invalid scenario variable name "${name}". Use letters, digits, underscore; start with a letter or underscore.`,
    );
  }
}

function ensureBag(world: ScenarioVarWorld): Record<string, string> {
  if (!world.scenarioVars) {
    world.scenarioVars = {};
  }
  return world.scenarioVars;
}

/**
 * Mask a value for logs / Allure. Never use for assertions or fill.
 * Credential-like names are fully redacted; other values show length only.
 */
export function redactScenarioVarForLog(name: string, value: string): string {
  if (CREDENTIAL_HINT.test(name)) {
    return `[redacted:${name}]`;
  }
  const len = value != null ? String(value).length : 0;
  return `[var:${name}:len=${len}]`;
}

export function setScenarioVar(
  world: ScenarioVarWorld,
  name: string,
  value: string,
  options?: SetScenarioVarOptions,
): void {
  assertSafeName(name);
  if (value === undefined || value === null) {
    throw new Error(`Cannot set scenario variable "${name}" to null/undefined`);
  }
  const text = String(value);
  if (text === '') {
    throw new Error(`Cannot set scenario variable "${name}" to an empty string`);
  }
  const bag = ensureBag(world);
  const existing = bag[name];
  if (existing !== undefined && existing !== text && !options?.allowOverwrite) {
    throw new Error(
      `Scenario variable "${name}" is already set; refusing overwrite (use allowOverwrite only when intentional)`,
    );
  }
  bag[name] = text;
}

export function getScenarioVar(world: ScenarioVarWorld, name: string): string | undefined {
  assertSafeName(name);
  const value = world.scenarioVars?.[name];
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  return value;
}

/**
 * Read a previously stored scenario variable or fail with a clear message.
 * Example: Scenario variable "resourceId" is not set
 */
export function requireScenarioVar(world: ScenarioVarWorld, name: string): string {
  assertSafeName(name);
  const value = getScenarioVar(world, name);
  if (value === undefined) {
    throw new Error(`Scenario variable "${name}" is not set`);
  }
  return value;
}

async function assertNotCredentialField(locator: Locator): Promise<void> {
  const type = (await locator.getAttribute('type')) || '';
  if (type.toLowerCase() === 'password') {
    throw new Error('Refusing to capture a password field into scenarioVars');
  }
  const nameAttr = (await locator.getAttribute('name')) || '';
  const idAttr = (await locator.getAttribute('id')) || '';
  const autocomplete = (await locator.getAttribute('autocomplete')) || '';
  const aria = (await locator.getAttribute('aria-label')) || '';
  const joined = `${nameAttr} ${idAttr} ${autocomplete} ${aria}`;
  if (CREDENTIAL_HINT.test(joined)) {
    throw new Error(
      'Refusing to capture a credential-like field into scenarioVars (name/id/autocomplete hints at a secret)',
    );
  }
}

export type CaptureElementOptions = {
  /** Playwright wait timeout in ms (default 10_000). */
  timeout?: number;
  allowOverwrite?: boolean;
};

/**
 * Read TEXT / VALUE / ATTRIBUTE from a Playwright locator into `world.scenarioVars[variableName]`.
 * Uses Playwright auto-wait (visible). Ambiguous (count > 1) or missing locators fail clearly.
 * Does not log or attach the captured value.
 */
export async function captureElementValue(
  world: ScenarioVarWorld,
  locator: Locator,
  captureMode: CaptureMode,
  variableName: string,
  attributeName?: string,
  options?: CaptureElementOptions,
): Promise<string> {
  assertSafeName(variableName);
  const mode = String(captureMode || '').toUpperCase() as CaptureMode;
  if (mode !== 'TEXT' && mode !== 'VALUE' && mode !== 'ATTRIBUTE') {
    throw new Error(
      `Unsupported capture mode "${captureMode}". Use TEXT, VALUE, or ATTRIBUTE.`,
    );
  }
  if (mode === 'ATTRIBUTE') {
    if (!attributeName || !attributeName.trim()) {
      throw new Error('ATTRIBUTE capture requires a non-empty attributeName');
    }
  }

  const timeout = options?.timeout ?? 10_000;
  try {
    await locator.first().waitFor({ state: 'visible', timeout });
  } catch {
    throw new Error(`Cannot capture "${variableName}": element not found`);
  }
  const count = await locator.count();
  if (count === 0) {
    throw new Error(`Cannot capture "${variableName}": element not found`);
  }
  if (count > 1) {
    throw new Error(
      `Cannot capture "${variableName}": locator matches ${count} elements (ambiguous)`,
    );
  }

  await assertNotCredentialField(locator);

  let raw: string | null = null;
  if (mode === 'TEXT') {
    raw = await locator.innerText();
  } else if (mode === 'VALUE') {
    raw = await locator.inputValue();
  } else {
    raw = await locator.getAttribute(attributeName!.trim());
    if (raw === null) {
      throw new Error(
        `Cannot capture "${variableName}": attribute "${attributeName!.trim()}" is missing`,
      );
    }
  }

  const value = (raw ?? '').replace(/\s+/g, ' ').trim();
  if (!value) {
    throw new Error(`Cannot capture "${variableName}": captured value is empty`);
  }

  setScenarioVar(world, variableName, value, {
    allowOverwrite: options?.allowOverwrite,
  });
  return value;
}

/**
 * Capture a query parameter from the current page URL into scenarioVars.
 * Fails when the param is missing or empty — never invents a value.
 */
export async function captureUrlQueryParam(
  world: ScenarioVarWorld,
  page: Page,
  paramName: string,
  variableName: string,
  options?: SetScenarioVarOptions,
): Promise<string> {
  assertSafeName(variableName);
  if (!paramName || !paramName.trim()) {
    throw new Error('URL query param name is required');
  }
  const url = page.url();
  let value: string | null = null;
  try {
    value = new URL(url).searchParams.get(paramName.trim());
  } catch {
    throw new Error(`Cannot capture "${variableName}": current URL is not parseable`);
  }
  const text = (value ?? '').trim();
  if (!text) {
    throw new Error(
      `Cannot capture "${variableName}": query parameter "${paramName.trim()}" is missing or empty`,
    );
  }
  setScenarioVar(world, variableName, text, options);
  return text;
}

/**
 * Assert that a locator's TEXT equals a previously captured scenario variable.
 * Does not log the raw value.
 */
export async function assertLocatorTextEqualsScenarioVar(
  world: ScenarioVarWorld,
  locator: Locator,
  variableName: string,
  options?: CaptureElementOptions,
): Promise<void> {
  const expected = requireScenarioVar(world, variableName);
  const timeout = options?.timeout ?? 10_000;
  await locator.first().waitFor({ state: 'visible', timeout });
  const actual = ((await locator.innerText()) ?? '').replace(/\s+/g, ' ').trim();
  if (actual !== expected) {
    throw new Error(
      `Expected element text to equal scenario variable "${variableName}" ` +
        `(${redactScenarioVarForLog(variableName, expected)}) but got length=${actual.length}`,
    );
  }
}
