import type { Locator } from '@playwright/test';

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

export function setScenarioVar(world: ScenarioVarWorld, name: string, value: string): void {
  assertSafeName(name);
  if (value === undefined || value === null) {
    throw new Error(`Cannot set scenario variable "${name}" to null/undefined`);
  }
  const text = String(value);
  if (text === '') {
    throw new Error(`Cannot set scenario variable "${name}" to an empty string`);
  }
  ensureBag(world)[name] = text;
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

  setScenarioVar(world, variableName, value);
  return value;
}
