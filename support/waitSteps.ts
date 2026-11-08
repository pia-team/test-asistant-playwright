import type { Locator, Page } from '@playwright/test';

/**
 * Explicit wait steps for generated WEB tests (same meaning as CoTester explore WAIT):
 *   await waitSeconds(this, 120)                         — "I wait 120 seconds"
 *   await waitForNewCard(this, { label: 'PM Task', contains: ['ACTIVAITONAUTOMATION', 'NEW'], timeoutMs: 300_000 })
 *                                                        — "I wait up to 5 minutes for a new "PM Task" card containing …"
 *   await thatCard(this).getByText('PM Task', { exact: true }).click()
 *                                                        — "I click "PM Task" in that card"
 * A card is "new" when it was not on the page at the first look, or its date (dd/MM/yyyy HH:mm[:ss]) is at/after
 * the scenario start (2 min clock-skew allowance). Older cards with the same texts are never picked.
 */

export const WAIT_MAX_MS = 10 * 60_000;
export const NEW_CARD_POLL_MS = 10_000;
export const CARD_DATE_SKEW_MS = 2 * 60_000;

/**
 * Cucumber step timeout for a wait step: the wait itself plus room for reloads/render (60 s), capped.
 * The 60 s slack covers the last {@link waitForCardsRendered} (15 s) and the `page.reload` that runs
 * before it on each poll; both happen after the wait budget and must finish inside the step timeout.
 * Invalid input (NaN, negative) uses the runner default of 120 s plus the same slack.
 */
export function waitStepTimeoutMs(waitMs: number): number {
  const slackMs = 60_000;
  if (typeof waitMs !== 'number' || !Number.isFinite(waitMs) || waitMs < 0) {
    return 120_000 + slackMs;
  }
  return Math.min(WAIT_MAX_MS + slackMs, Math.max(waitMs, 0) + slackMs);
}

type WaitWorld = { page?: Page };

export type FoundCard = { key: string; id: string | null; anchorText: string | null; text: string };

const scenarioStart = new WeakMap<object, number>();
const lastCards = new WeakMap<object, FoundCard>();

/** Called from the Before hook; the scenario start is the earliest moment a card of this run can exist. */
export function markScenarioStart(world: object, at = Date.now()): void {
  scenarioStart.set(world, at);
  lastCards.delete(world);
}

function pageOf(world: WaitWorld): Page {
  if (!world.page) throw new Error('No active page for the wait step');
  return world.page;
}

export async function waitSeconds(world: WaitWorld, seconds: number): Promise<void> {
  const ms = Math.round(Number(seconds) * 1000);
  if (!Number.isFinite(ms) || ms <= 0 || ms > WAIT_MAX_MS) {
    throw new Error(`Wait must be between 1 second and ${WAIT_MAX_MS / 60_000} minutes (got ${seconds}s)`);
  }
  await pageOf(world).waitForTimeout(ms);
}

export function parseCardDate(text: string): number | null {
  const m = String(text || '').match(/\b(\d{2})[/.](\d{2})[/.](\d{4})\s+(\d{2}):(\d{2})(?::(\d{2}))?\b/);
  if (!m) return null;
  const dt = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]), Number(m[4]), Number(m[5]), Number(m[6] || 0));
  return Number.isFinite(dt.getTime()) ? dt.getTime() : null;
}

export async function scanCards(page: Page, label: string, contains: string[]): Promise<FoundCard[]> {
  return page.evaluate(({ label, needles }) => {
    const norm = (s: string) => String(s || '').replace(/\s+/g, ' ').trim();
    const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const tests = needles.map((n) => new RegExp(`(^|[^\\p{L}\\p{N}])${esc(norm(n))}([^\\p{L}\\p{N}]|$)`, 'iu'));
    const want = norm(label).toLowerCase();
    const visible = (el: Element) => {
      const r = el.getBoundingClientRect();
      const st = getComputedStyle(el);
      return st.display !== 'none' && st.visibility !== 'hidden' && (r.width > 0 || r.height > 0);
    };
    const cardOf = (el: Element): Element | null => {
      const hard = el.closest('li, tr, [role="listitem"], [role="row"], article, mat-card, [data-card], .card');
      if (hard && hard !== document.body) return hard;
      let cur = el.parentElement;
      while (cur && cur !== document.body) {
        const p: Element | null = cur.parentElement;
        const tag = cur.tagName;
        if (p && [...p.children].filter((c) => c.tagName === tag).length >= 2) return cur;
        cur = p as HTMLElement | null;
      }
      return null;
    };
    const uuid = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
    const seen = new Set<Element>();
    const out: { key: string; id: string | null; anchorText: string | null; text: string }[] = [];
    for (const el of Array.from(document.querySelectorAll('body *'))) {
      if (norm(el.textContent || '').toLowerCase() !== want || !visible(el)) continue;
      const card = cardOf(el);
      if (!card || seen.has(card)) continue;
      seen.add(card);
      const parts: string[] = [];
      const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const v = norm(n.nodeValue || '');
        if (v) parts.push(v);
      }
      const text = parts.join(' ');
      if (!tests.every((re) => re.test(text))) continue;
      const anchorText = parts.find((l) => uuid.test(l) && /task/i.test(l)) || parts.find((l) => uuid.test(l)) || null;
      const key = card.id || card.getAttribute('data-id') || card.getAttribute('data-key') || anchorText || text.slice(0, 160);
      out.push({ key, id: card.id || null, anchorText, text: text.slice(0, 400) });
    }
    return out;
  }, { label, needles: contains });
}

export function pickNewCards(cards: FoundCard[], baseline: string[], startedAt: number): FoundCard[] {
  const base = new Set(baseline);
  return cards
    .map((c) => ({ c, dated: parseCardDate(c.text) }))
    .filter(({ c, dated }) => !base.has(c.key) || (dated != null && startedAt > 0 && dated >= startedAt - CARD_DATE_SKEW_MS))
    .sort((a, b) => (b.dated || 0) - (a.dated || 0))
    .map(({ c }) => c);
}

export type NewCardOptions = { label: string; contains: string[]; timeoutMs: number; pollMs?: number };

export async function waitForNewCard(world: WaitWorld, opts: NewCardOptions): Promise<FoundCard> {
  const page = pageOf(world);
  const timeoutMs = Math.min(WAIT_MAX_MS, Math.max(1000, opts.timeoutMs));
  const pollMs = Math.max(500, opts.pollMs ?? NEW_CARD_POLL_MS);
  const startedAt = scenarioStart.get(world as object) ?? Date.now();
  const begin = Date.now();
  let baseline: string[] | null = null;
  await waitForCardsRendered(page, opts.label);
  for (;;) {
    const cards = await scanCards(page, opts.label, opts.contains).catch(() => [] as FoundCard[]);
    if (!baseline) baseline = cards.map((c) => c.key);
    const fresh = pickNewCards(cards, baseline, startedAt);
    if (fresh.length) {
      lastCards.set(world as object, fresh[0]);
      return fresh[0];
    }
    if (Date.now() - begin >= timeoutMs) {
      const needles = opts.contains.map((n) => `"${n}"`).join(' and ');
      throw new Error(`No new "${opts.label}" card containing ${needles} appeared within ${Math.round(timeoutMs / 1000)}s`);
    }
    await page.waitForTimeout(Math.min(pollMs, timeoutMs - (Date.now() - begin)));
    await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => undefined);
    await waitForCardsRendered(page, opts.label);
  }
}

/** SPAs render the list after the reload (splash screen, XHR); never scan a half-loaded page. */
export async function waitForCardsRendered(page: Page, label: string, capMs = 15_000, stepMs = 500): Promise<number> {
  const end = Date.now() + capMs;
  for (;;) {
    const n = (await scanCards(page, label, []).catch(() => [] as FoundCard[])).length;
    if (n > 0 || Date.now() >= end) return n;
    await page.waitForTimeout(stepMs);
  }
}

/** The card found by the last waitForNewCard in this scenario. */
export function thatCard(world: WaitWorld): Locator {
  const card = lastCards.get(world as object);
  if (!card) throw new Error('"in that card" needs an earlier "wait for a new … card" step that found a card');
  const page = pageOf(world);
  if (card.id) return page.locator(`[id="${card.id.replace(/"/g, '\\"')}"]`);
  if (card.anchorText) {
    return page.locator('li, tr, [role="listitem"], [role="row"], article, mat-card, [data-card], .card')
      .filter({ hasText: card.anchorText }).last();
  }
  throw new Error('The found card has no stable id or anchor text');
}
