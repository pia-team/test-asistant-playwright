import { randomUUID } from 'crypto';
import type { Page, Locator } from '@playwright/test';
import { scrapePageDom, isLoginRoute } from './dom-scrape';
import { registerOverride } from './locator-registry';

export interface HealingContext {
  enabled: boolean;
  runJobId: string;
  featurePath: string;
  apiUrl: string;
  maxFeature: number;
  maxSuite: number;
  featureAttempts: number;
  suiteAttempts: number;
  currentStepKey: string;
  currentStepText: string;
  currentScenarioName: string;
  retriedSteps: Set<string>;
  events: HealingEventPayload[];
  flowId?: string;
  flowStepIndex?: number;
}

export interface HealingEventPayload {
  id: string;
  runJobId: string;
  featurePath: string;
  scenarioName: string;
  stepText: string;
  route: string;
  oldSelector: string;
  oldStrategy?: string;
  intentLabel?: string;
  newSelector?: string;
  newStrategy?: string;
  confidence: string;
  outcome: string;
  candidates?: Array<{ label: string; selector: string; strategy: string; quality: string; route: string }>;
  retryAttempted: boolean;
  retrySucceeded?: boolean;
  timestamp: string;
  flowId?: string;
  flowStepIndex?: number;
}

function parseOptionalInt(value: string | undefined): number | undefined {
  if (value == null || value.trim() === '') return undefined;
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function attachFlowMeta(event: HealingEventPayload, ctx: HealingContext): HealingEventPayload {
  if (ctx.flowId) {
    event.flowId = ctx.flowId;
  }
  if (ctx.flowStepIndex != null) {
    event.flowStepIndex = ctx.flowStepIndex;
  }
  return event;
}

export function createHealingContext(): HealingContext {
  const enabled = (process.env.COTESTER_SELF_HEAL_ENABLED ?? 'false').toLowerCase() === 'true';
  const suiteRemaining = parseInt(
    process.env.COTESTER_SUITE_HEAL_BUDGET_REMAINING
      ?? process.env.COTESTER_SELF_HEAL_MAX_SUITE
      ?? '20',
    10,
  );
  return {
    enabled,
    runJobId: process.env.COTESTER_RUN_JOB_ID ?? '',
    featurePath: process.env.COTESTER_FEATURE_PATH ?? '',
    apiUrl: (process.env.COTESTER_API_URL ?? 'http://localhost:8080').replace(/\/$/, ''),
    maxFeature: parseInt(process.env.COTESTER_SELF_HEAL_MAX_FEATURE ?? '3', 10),
    maxSuite: Number.isFinite(suiteRemaining) ? Math.max(0, suiteRemaining) : 20,
    featureAttempts: 0,
    suiteAttempts: 0,
    currentStepKey: '',
    currentStepText: '',
    currentScenarioName: '',
    retriedSteps: new Set<string>(),
    events: [],
    flowId: process.env.COTESTER_FLOW_ID || undefined,
    flowStepIndex: parseOptionalInt(process.env.COTESTER_FLOW_STEP_INDEX),
  };
}

export function isLocatorFailure(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  if (/expect\s*\(/i.test(message)) return false;
  return /locator.*not found|waiting for.*(?:failed|exceeded|timeout)|strict mode violation|Timeout.*exceeded/i.test(
    message,
  );
}

export function extractSelectorFromError(error: unknown): string | undefined {
  const message = error instanceof Error ? error.message : String(error);
  const quoted = message.match(/locator\(['"]([^'"]+)['"]\)/i);
  if (quoted) return quoted[1];
  const waiting = message.match(/waiting for locator\(['"]([^'"]+)['"]\)/i);
  if (waiting) return waiting[1];
  return undefined;
}

export function emitHealEvent(event: HealingEventPayload): void {
  console.log(`COTESTER_HEAL_EVENT:${JSON.stringify(event)}`);
}

/**
 * A click that did not change the page was retried once. Visible in the run report,
 * and it does not spend the self-heal budget.
 */
export function recordIneffectiveClick(
  ctx: HealingContext | undefined,
  selectorKey: string,
  route: string,
): void {
  const event: HealingEventPayload = {
    id: randomUUID(),
    runJobId: ctx?.runJobId || process.env.COTESTER_RUN_JOB_ID || '',
    featurePath: ctx?.featurePath || process.env.COTESTER_FEATURE_PATH || '',
    scenarioName: ctx?.currentScenarioName || '',
    stepText: ctx?.currentStepText || '',
    route: route || '/',
    oldSelector: selectorKey,
    confidence: 'HIGH',
    outcome: 'INEFFECTIVE_CLICK',
    retryAttempted: true,
    timestamp: new Date().toISOString(),
  };
  if (ctx) {
    attachFlowMeta(event, ctx);
    ctx.events.push(event);
  }
  emitHealEvent(event);
}

export async function attemptSelfHeal(
  ctx: HealingContext,
  page: Page,
  selectorKey: string,
  error: unknown,
): Promise<{ retry: boolean; newSelector?: string }> {
  if (!ctx.enabled) {
    return { retry: false };
  }
  if (ctx.retriedSteps.has(ctx.currentStepKey)) {
    return { retry: false };
  }
  if (ctx.featureAttempts >= ctx.maxFeature || ctx.suiteAttempts >= ctx.maxSuite) {
    emitSkipped(ctx, selectorKey, 'SKIPPED_BUDGET');
    return { retry: false };
  }

  const scraped = await scrapePageDom(page);
  if (isLoginRoute(scraped.route)) {
    return { retry: false };
  }

  const failedSelector = selectorKey || extractSelectorFromError(error) || '';
  if (!failedSelector) {
    return { retry: false };
  }

  // Local opener heal: attr / aria-labelledby / nearby label before calling the API.
  const intent = inferIntentLabel(failedSelector, ctx.currentStepText);
  const localOpener = await resolveSelectOpenerOnPage(page, intent);
  if (localOpener) {
    const newSelector = await selectorFromLocator(localOpener).catch(() => null);
    if (newSelector && newSelector !== failedSelector) {
      registerOverride(page.url(), ctx.currentStepKey, failedSelector, newSelector);
      ctx.retriedSteps.add(ctx.currentStepKey);
      ctx.featureAttempts += 1;
      ctx.suiteAttempts += 1;
      const event: HealingEventPayload = attachFlowMeta(
        {
          id: randomUUID(),
          runJobId: ctx.runJobId,
          featurePath: ctx.featurePath,
          scenarioName: ctx.currentScenarioName,
          stepText: ctx.currentStepText,
          route: scraped.route,
          oldSelector: failedSelector,
          newSelector,
          newStrategy: 'attr',
          intentLabel: intent,
          confidence: 'HIGH',
          outcome: 'RECOVERED',
          retryAttempted: true,
          retrySucceeded: true,
          timestamp: new Date().toISOString(),
        },
        ctx,
      );
      ctx.events.push(event);
      emitHealEvent(event);
      return { retry: true, newSelector };
    }
  }

  const runToken = process.env.COTESTER_SELF_HEAL_TOKEN || '';
  const matchResponse = await fetch(`${ctx.apiUrl}/api/self-heal/match`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(runToken ? { 'X-CoTester-Self-Heal-Token': runToken } : {}),
    },
    body: JSON.stringify({
      runJobId: ctx.runJobId,
      featurePath: ctx.featurePath,
      route: scraped.route,
      failedSelector,
      intentLabel: inferIntentLabel(failedSelector, ctx.currentStepText),
      scenarioName: ctx.currentScenarioName,
      stepText: ctx.currentStepText,
      elements: scraped.elements,
    }),
  });

  if (matchResponse.status === 429) {
    emitSkipped(ctx, selectorKey, 'SKIPPED_BUDGET');
    return { retry: false };
  }

  if (matchResponse.status === 503) {
    emitSkipped(ctx, selectorKey, 'SKIPPED_DISABLED');
    return { retry: false };
  }

  if (!matchResponse.ok) {
    return { retry: false };
  }

  ctx.featureAttempts += 1;
  ctx.suiteAttempts += 1;

  const match = (await matchResponse.json()) as {
    confidence: string;
    selected?: { label: string; selector: string; strategy: string; quality: string; route: string };
    candidates?: Array<{ label: string; selector: string; strategy: string; quality: string; route: string }>;
  };

  const eventBase: HealingEventPayload = {
    id: randomUUID(),
    runJobId: ctx.runJobId,
    featurePath: ctx.featurePath,
    scenarioName: ctx.currentScenarioName,
    stepText: ctx.currentStepText,
    route: scraped.route,
    oldSelector: failedSelector,
    confidence: match.confidence,
    outcome: match.confidence === 'HIGH' ? 'RECOVERED' : match.confidence,
    candidates: match.candidates,
    retryAttempted: match.confidence === 'HIGH',
    timestamp: new Date().toISOString(),
  };

  if (match.confidence !== 'HIGH' || !match.selected?.selector) {
    eventBase.outcome = match.confidence === 'AMBIGUOUS' ? 'AMBIGUOUS' : 'STILL_FAILED';
    eventBase.retryAttempted = false;
    attachFlowMeta(eventBase, ctx);
    ctx.events.push(eventBase);
    emitHealEvent(eventBase);
    return { retry: false };
  }

  registerOverride(page.url(), ctx.currentStepKey, failedSelector, match.selected.selector);
  ctx.retriedSteps.add(ctx.currentStepKey);
  eventBase.newSelector = match.selected.selector;
  eventBase.newStrategy = match.selected.strategy;
  eventBase.intentLabel = match.selected.label;
  attachFlowMeta(eventBase, ctx);
  ctx.events.push(eventBase);
  emitHealEvent(eventBase);
  return { retry: true, newSelector: match.selected.selector };
}

function emitSkipped(ctx: HealingContext, selectorKey: string, outcome: string): void {
  const event: HealingEventPayload = attachFlowMeta(
    {
      id: randomUUID(),
      runJobId: ctx.runJobId,
      featurePath: ctx.featurePath,
      scenarioName: ctx.currentScenarioName,
      stepText: ctx.currentStepText,
      route: '/',
      oldSelector: selectorKey,
      confidence: 'UNRESOLVED',
      outcome,
      retryAttempted: false,
      timestamp: new Date().toISOString(),
    },
    ctx,
  );
  ctx.events.push(event);
  emitHealEvent(event);
}

function inferIntentLabel(selector: string, stepText: string): string {
  const roleMatch = selector.match(/role=\w+\[name='([^']+)'\]/);
  if (roleMatch) return roleMatch[1];
  const idAttr = selector.match(/\[id=['"]([^'"]+)['"]\]/);
  if (idAttr) return idAttr[1];
  const hashId = selector.match(/^#([^\s\[\]>+~]+)/);
  if (hashId) return hashId[1].replace(/\\/g, '');
  // Prefer the list/field name in "select X from Y" over the option label.
  const fromField = stepText.match(/\b(?:from|in)\s+["']([^"']+)["']/i)
    || stepText.match(/\b(?:from|in)\s+([A-Za-z][\w\s-]{1,60})\s*$/i);
  if (fromField) return fromField[1].trim();
  const quoted = stepText.match(/"([^"]+)"/);
  if (quoted) return quoted[1];
  return selector;
}

export function locatorFromSelector(page: Page, selector: string): Locator {
  const roleMatch = selector.match(/^role=(\w+)\[name='([^']+)'\]$/);
  if (roleMatch) {
    return page.getByRole(roleMatch[1] as 'button', { name: roleMatch[2] });
  }
  if (selector.startsWith('text=')) {
    return page.getByText(selector.slice(5), { exact: true });
  }
  return page.locator(selector);
}

function cssAttrEquals(attr: string, value: string): string {
  const v = String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return `[${attr}="${v}"]`;
}

function normAttrToken(value: string): string {
  return String(value || '')
    .toLowerCase()
    .replace(/[*：:]+/g, '')
    .replace(/[\s_-]+/g, '')
    .trim();
}

async function uniqueVisible(locator: Locator): Promise<Locator | null> {
  const total = await locator.count().catch(() => 0);
  const vis: Locator[] = [];
  for (let i = 0; i < Math.min(total, 24); i += 1) {
    const nth = locator.nth(i);
    if (await nth.isVisible({ timeout: 300 }).catch(() => false)) vis.push(nth);
  }
  return vis.length === 1 ? vis[0] : null;
}

/**
 * SELECT opener heal: id/name/placeholder → aria-labelledby → nearby label (≤3 ancestors).
 * Never uses nth or a random option.
 */
/**
 * Scoped icon heal: find icon identity inside a card/row that contains the anchor text.
 * Does not heal when the anchor text itself is missing (wrong product selected).
 */
export async function resolveScopedIconOnPage(
  page: Page,
  anchorText: string,
  identityWord: string,
): Promise<Locator | null> {
  const anchor = String(anchorText || '').replace(/\s+/g, ' ').trim();
  const word = String(identityWord || '').trim();
  if (!anchor || !word || !page) return null;
  const cards = page.locator('div, li, tr, [role="row"], [role="listitem"], [role="article"]')
    .filter({ has: page.getByText(anchor, { exact: true }) });
  const n = await cards.count().catch(() => 0);
  if (n !== 1) return null;
  const root = cards.first();
  const candidates = root.locator(
    'button, [role="button"], svg, [data-testid*="Icon" i], [class*="-icon"], [class*="icon-"]',
  );
  const total = await candidates.count().catch(() => 0);
  const want = word.toLowerCase().replace(/icon$/i, '');
  for (let i = 0; i < Math.min(total, 40); i += 1) {
    const el = candidates.nth(i);
    if (!(await el.isVisible({ timeout: 80 }).catch(() => false))) continue;
    const bag = await el.evaluate((node) => {
      const out: string[] = [];
      const push = (v: string | null | undefined) => {
        if (v) out.push(String(v));
      };
      push(node.getAttribute('aria-label'));
      push(node.getAttribute('data-testid'));
      push(node.className?.toString?.() || '');
      for (const svg of Array.from(node.querySelectorAll?.('svg[data-testid], [data-testid]') || [])) {
        push(svg.getAttribute('data-testid'));
      }
      push((node.textContent || '').trim());
      return out;
    }).catch(() => [] as string[]);
    if (bag.some((t) => t.toLowerCase().replace(/icon$/i, '').includes(want))) return el;
  }
  return null;
}

export async function resolveSelectOpenerOnPage(
  page: Page,
  hint: string,
): Promise<Locator | null> {
  const name = String(hint || '').replace(/\s+/g, ' ').trim();
  if (!name || !page) return null;
  const wantNorm = normAttrToken(name);
  for (const attr of ['id', 'name', 'placeholder', 'aria-label', 'title', 'data-placeholder'] as const) {
    const hit = await uniqueVisible(page.locator(cssAttrEquals(attr, name)));
    if (hit) return hit;
  }
  try {
    const candidates = page.locator(
      '[id], [name], [placeholder], [aria-label], [title], [data-placeholder],'
        + ' [role="combobox"], [aria-haspopup], button, select, input',
    );
    const n = await candidates.count().catch(() => 0);
    const matches: Locator[] = [];
    for (let i = 0; i < Math.min(n, 200); i += 1) {
      const el = candidates.nth(i);
      if (!(await el.isVisible({ timeout: 200 }).catch(() => false))) continue;
      const bag = await el.evaluate((node) => [
        node.id || '',
        node.getAttribute('name') || '',
        node.getAttribute('placeholder') || '',
        node.getAttribute('aria-label') || '',
        node.getAttribute('title') || '',
        node.getAttribute('data-placeholder') || '',
      ]).catch(() => [] as string[]);
      if (bag.some((t) => t && normAttrToken(t) === wantNorm)) matches.push(el);
    }
    if (matches.length === 1) return matches[0];
  } catch {
    /* ignore */
  }
  try {
    const withLabelledBy = page.locator('[aria-labelledby]');
    const n = await withLabelledBy.count().catch(() => 0);
    const hits: Locator[] = [];
    for (let i = 0; i < Math.min(n, 80); i += 1) {
      const el = withLabelledBy.nth(i);
      if (!(await el.isVisible({ timeout: 200 }).catch(() => false))) continue;
      const ok = await el.evaluate((node, want) => {
        const norm = (s: string) => String(s || '').replace(/\s+/g, ' ').trim().toLowerCase()
          .replace(/[*：:]+/g, '').replace(/[\s_-]+/g, '');
        const ids = String(node.getAttribute('aria-labelledby') || '').split(/\s+/).filter(Boolean);
        const text = ids.map((id) => {
          const ref = node.ownerDocument.getElementById(id);
          return ref ? String(ref.textContent || '') : '';
        }).join(' ');
        return norm(text) === norm(want) || norm(text).includes(norm(want));
      }, name).catch(() => false);
      if (ok) hits.push(el);
    }
    if (hits.length === 1) return hits[0];
  } catch {
    /* ignore */
  }
  try {
    const near = await page.evaluate((label) => {
      const norm = (s: string) => String(s || '').replace(/\s+/g, ' ').trim()
        .replace(/[*：:]+$/g, '').toLowerCase();
      const want = norm(label);
      const isOpener = (el: Element | null) => {
        if (!el) return false;
        const tag = String(el.tagName || '').toLowerCase();
        const role = String(el.getAttribute('role') || '').toLowerCase();
        const popup = String(el.getAttribute('aria-haspopup') || '').toLowerCase();
        const expanded = el.getAttribute('aria-expanded');
        if (role === 'combobox' || role === 'listbox') return true;
        if (popup && popup !== 'false') return true;
        if (tag === 'select') return true;
        if (tag === 'button' || role === 'button') {
          return Boolean((popup && popup !== 'false') || expanded != null || role === 'combobox');
        }
        if (tag === 'input' && (el as HTMLInputElement).readOnly) return true;
        try {
          if (getComputedStyle(el).cursor === 'pointer' && (tag === 'div' || tag === 'span')) {
            const parent = el.parentElement;
            if (!parent || getComputedStyle(parent).cursor !== 'pointer') return true;
          }
        } catch { /* ignore */ }
        return false;
      };
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
      let node = walker.nextNode() as Element | null;
      while (node) {
        const own = Array.from(node.childNodes)
          .filter((c) => c.nodeType === 3)
          .map((c) => String(c.textContent || ''))
          .join('');
        const t = norm(own || (node.children.length === 0 ? String(node.textContent || '') : ''));
        if (t === want) {
          let anc: Element | null = node;
          for (let up = 0; up <= 3; up += 1) {
            if (!anc || anc === document.body) break;
            const openers = Array.from(anc.querySelectorAll(
              '[role="combobox"], [aria-haspopup], button, select, input[readonly], div, span',
            )).filter(isOpener);
            if (isOpener(node) && !openers.includes(node)) openers.unshift(node);
            const unique = [...new Set(openers)];
            if (unique.length === 1) {
              const el = unique[0];
              return { id: el.id || null };
            }
            anc = anc.parentElement;
          }
        }
        node = walker.nextNode() as Element | null;
      }
      return null;
    }, name);
    if (near?.id) {
      const hit = await uniqueVisible(page.locator(cssAttrEquals('id', near.id)));
      if (hit) return hit;
    }
  } catch {
    /* ignore */
  }
  return null;
}

async function selectorFromLocator(locator: Locator): Promise<string | null> {
  const id = await locator.getAttribute('id').catch(() => null);
  if (id) return cssAttrEquals('id', id);
  const testId = await locator.getAttribute('data-testid').catch(() => null);
  if (testId) return `[data-testid="${testId.replace(/"/g, '\\"')}"]`;
  const name = await locator.getAttribute('name').catch(() => null);
  if (name) return cssAttrEquals('name', name);
  return null;
}

const CHECKABLE_ROLES = [
  'checkbox',
  'radio',
  'switch',
  'menuitemcheckbox',
  'menuitemradio',
] as const;

/**
 * CHECK heal: role+name → label → named container inner checkable → nearest sibling checkable.
 */
export async function resolveCheckableOnPage(
  page: Page,
  name: string,
): Promise<Locator | null> {
  const label = String(name || '').replace(/\s+/g, ' ').trim();
  if (!label) return null;
  for (const role of CHECKABLE_ROLES) {
    for (const exact of [true, false]) {
      const loc = page.getByRole(role, { name: label, exact });
      const n = await loc.count().catch(() => 0);
      if (n === 1) return loc;
      if (!exact && n !== 1) continue;
    }
  }
  try {
    const byLabel = page.getByLabel(label, { exact: true });
    if ((await byLabel.count().catch(() => 0)) === 1) {
      const ok = await byLabel
        .evaluate((el) => {
          const type = String((el as HTMLInputElement).type || '').toLowerCase();
          const role = String(el.getAttribute('role') || '').toLowerCase();
          return type === 'checkbox' || type === 'radio' || role === 'checkbox' || role === 'radio';
        })
        .catch(() => false);
      if (ok) return byLabel;
    }
  } catch {
    /* ignore */
  }
  for (const role of ['button', 'link', 'row', 'listitem', 'treeitem'] as const) {
    const container = page.getByRole(role, { name: label, exact: true });
    if ((await container.count().catch(() => 0)) !== 1) continue;
    for (const inner of CHECKABLE_ROLES) {
      const box = container.getByRole(inner);
      if ((await box.count().catch(() => 0)) === 1) return box;
    }
  }
  return null;
}

/**
 * When getByText hits a non-interactive leaf, climb ≤4 levels to a JS-clickable ancestor
 * (never body/main). Used by runtime heal for text-fallback clicks.
 */
export async function climbToClickableAncestor(locator: Locator): Promise<Locator | null> {
  if (!locator || typeof locator.evaluate !== 'function') return null;
  const info = await locator
    .evaluate((el) => {
      const signal = (node: Element) => {
        try {
          if (node.getAttribute('onclick') || typeof (node as HTMLElement).onclick === 'function') {
            return true;
          }
        } catch {
          /* ignore */
        }
        try {
          const ti = node.getAttribute('tabindex');
          if (ti != null && ti !== '' && Number(ti) >= 0) return true;
        } catch {
          /* ignore */
        }
        try {
          const style = getComputedStyle(node);
          if (String(style.pointerEvents || '') === 'none') return false;
          if (String(style.cursor || '') === 'pointer') {
            const parent = node.parentElement;
            if (!parent) return true;
            if (String(getComputedStyle(parent).cursor || '') !== 'pointer') return true;
            const tag = String(node.tagName || '').toLowerCase();
            const role = String(node.getAttribute('role') || '').toLowerCase();
            if (
              tag === 'li' ||
              tag === 'tr' ||
              tag === 'td' ||
              role === 'row' ||
              role === 'gridcell' ||
              role === 'treeitem'
            ) {
              return true;
            }
          }
        } catch {
          /* ignore */
        }
        return false;
      };
      let cur: Element | null = el as Element;
      for (let depth = 0; depth <= 4; depth += 1) {
        if (!cur || cur.nodeType !== 1) return null;
        const tag = String(cur.tagName || '').toLowerCase();
        if (tag === 'body' || tag === 'main' || tag === 'html') return null;
        if (signal(cur)) return { depth };
        cur = cur.parentElement;
      }
      return null;
    })
    .catch(() => null);
  if (!info || typeof info !== 'object' || !('depth' in info)) return null;
  const depth = Number((info as { depth: number }).depth) || 0;
  if (depth <= 0) return locator;
  let target = locator;
  for (let i = 0; i < depth; i += 1) {
    target = target.locator('xpath=..');
  }
  return target;
}

export async function withLocatorHeal<T>(
  ctx: HealingContext,
  page: Page,
  selectorKey: string,
  action: (locator: Locator) => Promise<T>,
  buildLocator: () => Locator,
): Promise<T> {
  try {
    return await action(buildLocator());
  } catch (error) {
    if (!isLocatorFailure(error)) throw error;
    const healed = await attemptSelfHeal(ctx, page, selectorKey, error);
    if (!healed.retry) throw error;
    const retryLocator = healed.newSelector ? locatorFromSelector(page, healed.newSelector) : buildLocator();
    try {
      const result = await action(retryLocator);
      const last = ctx.events[ctx.events.length - 1];
      if (last) {
        last.retrySucceeded = true;
        last.outcome = 'RECOVERED';
        emitHealEvent(last);
      }
      return result;
    } catch (retryError) {
      const last = ctx.events[ctx.events.length - 1];
      if (last) {
        last.retrySucceeded = false;
        last.outcome = 'STILL_FAILED';
        emitHealEvent(last);
      }
      throw retryError;
    }
  }
}
