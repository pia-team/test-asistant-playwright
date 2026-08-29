import type { Page } from '@playwright/test';

export interface ScrapedElement {
  label: string;
  selector: string;
  strategy: string;
  quality: string;
}

export interface DomScrapeResult {
  elements: ScrapedElement[];
  labels: string[];
  route: string;
}

const MAX_LABELS = 120;
const MAX_ROUTES = 40;

export function normalizeRoutePath(urlOrPath: string): string {
  try {
    const u = urlOrPath.startsWith('http') ? new URL(urlOrPath) : new URL(urlOrPath, 'http://local');
    let path = u.pathname || '/';
    path = path.replace(/\/[0-9a-f]{8}-[0-9a-f-]{27,}/gi, '/:id');
    path = path.replace(/\/\d+(?=\/|$)/g, '/:id');
    if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
    return path || '/';
  } catch {
    return '/';
  }
}

export async function scrapePageDom(page: Page): Promise<DomScrapeResult> {
  const route = normalizeRoutePath(page.url());
  const scraped = await page.evaluate(
    ({ maxLabels, maxRoutes }) => {
      const elements: Array<{ label: string; selector: string; strategy: string; quality: string }> = [];
      const labels: string[] = [];
      const seenLabels = new Set<string>();

      const qualityRank: Record<string, string> = {
        testid: 'HIGH',
        role: 'HIGH',
        label: 'HIGH',
        id: 'MEDIUM',
        name: 'MEDIUM',
        placeholder: 'MEDIUM',
        aria: 'MEDIUM',
        css: 'LOW',
      };

      const pushElement = (label: string, selector: string, strategy: string, quality: string) => {
        if (!label || !selector) return;
        const t = String(label).replace(/\s+/g, ' ').trim();
        if (!t || t.length > 80) return;
        const key = t.toLowerCase();
        if (seenLabels.has(key)) return;
        seenLabels.add(key);
        labels.push(t);
        elements.push({ label: t, selector, strategy, quality });
      };

      const bestSelectorFor = (el: Element) => {
        const testId = el.getAttribute('data-testid') || el.getAttribute('data-test-id');
        if (testId) {
          return { selector: `[data-testid='${testId}']`, strategy: 'testid', quality: qualityRank.testid };
        }
        const role = el.getAttribute('role');
        const aria = el.getAttribute('aria-label');
        const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
        if (role && (aria || text) && text.length <= 60) {
          const name = (aria || text).replace(/'/g, "\\'");
          return { selector: `role=${role}[name='${name}']`, strategy: 'role', quality: qualityRank.role };
        }
        if (el.tagName === 'BUTTON' && text && text.length <= 60) {
          return {
            selector: `role=button[name='${text.replace(/'/g, "\\'")}']`,
            strategy: 'role',
            quality: qualityRank.role,
          };
        }
        if (el.tagName === 'A' && text && text.length <= 60) {
          return {
            selector: `role=link[name='${text.replace(/'/g, "\\'")}']`,
            strategy: 'role',
            quality: qualityRank.role,
          };
        }
        if (el.id && !/^[0-9]/.test(el.id) && !el.id.includes(':')) {
          return { selector: `#${CSS.escape ? CSS.escape(el.id) : el.id}`, strategy: 'id', quality: qualityRank.id };
        }
        const nameAttr = el.getAttribute('name');
        if (nameAttr) {
          return { selector: `[name='${nameAttr}']`, strategy: 'name', quality: qualityRank.name };
        }
        const placeholder = el.getAttribute('placeholder');
        if (placeholder) {
          return {
            selector: `[placeholder='${placeholder.replace(/'/g, "\\'")}']`,
            strategy: 'placeholder',
            quality: qualityRank.placeholder,
          };
        }
        if (aria) {
          return {
            selector: `[aria-label='${aria.replace(/'/g, "\\'")}']`,
            strategy: 'aria',
            quality: qualityRank.aria,
          };
        }
        return null;
      };

      const interactive = document.querySelectorAll(
        'button, a[href], [role="button"], input:not([type="hidden"]), select, textarea, [role="link"], [role="menuitem"], label',
      );
      for (const el of interactive) {
        if (elements.length >= maxLabels) break;
        const aria = el.getAttribute('aria-label');
        const text = (aria || el.textContent || el.getAttribute('placeholder') || el.getAttribute('name') || '').trim();
        const best = bestSelectorFor(el);
        if (best) {
          pushElement(text || best.selector, best.selector, best.strategy, best.quality);
        } else if (text) {
          pushElement(text, `text=${text.replace(/'/g, "\\'")}`, 'label', 'MEDIUM');
        }
      }

      return { elements: elements.slice(0, maxLabels), labels: labels.slice(0, maxLabels), maxRoutes };
    },
    { maxLabels: MAX_LABELS, maxRoutes: MAX_ROUTES },
  );

  return {
    elements: scraped.elements,
    labels: scraped.labels,
    route,
  };
}

export function isLoginRoute(route: string): boolean {
  const r = route.toLowerCase();
  return r.includes('/login') || r.includes('/auth') || r.includes('/sso') || r.includes('/realms/');
}
