const overrides = new Map<string, string>();

export function overrideKey(pageUrl: string, stepKey: string, oldSelector: string): string {
  return `${pageUrl}::${stepKey}::${oldSelector}`;
}

export function registerOverride(pageUrl: string, stepKey: string, oldSelector: string, newSelector: string): void {
  overrides.set(overrideKey(pageUrl, stepKey, oldSelector), newSelector);
}

export function resolveOverride(pageUrl: string, stepKey: string, oldSelector: string): string | undefined {
  return overrides.get(overrideKey(pageUrl, stepKey, oldSelector));
}

export function clearLocatorOverrides(): void {
  overrides.clear();
}

export function resolveSelector(pageUrl: string, stepKey: string, selector: string): string {
  return resolveOverride(pageUrl, stepKey, selector) ?? selector;
}
