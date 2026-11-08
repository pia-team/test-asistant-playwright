import type { Page, Locator } from '@playwright/test';
import type { HealingContext } from './self-heal';
import {
  climbToClickableAncestor,
  resolveCheckableOnPage,
  resolveScopedIconOnPage,
  withLocatorHeal,
} from './self-heal';
import { resolveSelector } from './locator-registry';
import { locatorFromSelector } from './self-heal';
import { clickExpectingChange, navigationClickMode } from './navigation-click';

const LOCATOR_ACTIONS = new Set([
  'click',
  'dblclick',
  'fill',
  'check',
  'uncheck',
  'selectOption',
  'press',
  'type',
  'waitFor',
  'hover',
  'tap',
  'focus',
  'blur',
  'setInputFiles',
]);

async function resolveTextClickTarget(
  locator: Locator,
  selectorKey: string,
  stepText = '',
): Promise<Locator> {
  const quoted = String(stepText || '').match(/"([^"]+)"/);
  const word = String(stepText || '').match(
    /\bthe\s+(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|last)\b/i,
  );
  const order: Record<string, number> = {
    first: 1, second: 2, third: 3, fourth: 4, fifth: 5,
    sixth: 6, seventh: 7, eighth: 8, ninth: 9, tenth: 10, last: -1,
  };
  if (quoted && word && typeof locator.page === 'function') {
    const ordinal = order[word[1].toLowerCase()];
    const all = locator.page().getByText(quoted[1], { exact: true });
    const count = await all.count().catch(() => 0);
    const index = ordinal === -1 ? count - 1 : ordinal - 1;
    if (index >= 0 && index < count) {
      const chosen = all.nth(index);
      const climbed = await climbToClickableAncestor(chosen);
      return climbed || chosen;
    }
  }
  if (!String(selectorKey || '').startsWith('text=')) return locator;
  const climbed = await climbToClickableAncestor(locator);
  return climbed || locator;
}

function inferCheckLabel(selectorKey: string, stepText: string): string {
  const roleName = selectorKey.match(/role=\w+\[name='([^']+)'\]/);
  if (roleName) return roleName[1];
  if (selectorKey.startsWith('text=')) return selectorKey.slice(5);
  const quoted = stepText.match(/"([^"]+)"/);
  return quoted ? quoted[1] : '';
}

/** Parse `the add icon in "Card"` / `"Card" içindeki artı ikonuna` from the current step. */
function inferScopedIcon(stepText: string): { anchor: string; identity: string } | null {
  const text = String(stepText || '');
  const en = text.match(
    /\b(?:click|clicks|tap|taps)\s+(?:the\s+)?(?:([\w-]+)|"([^"]{1,40})")\s+icon\b[^"]*?\bin\s+"([^"]{1,120})"/i,
  );
  if (en) {
    return { identity: (en[1] || en[2] || '').trim(), anchor: en[3].trim() };
  }
  const tr = text.match(
    /"([^"]{1,120})"\s+(?:içindeki|kartındaki)\s+(?:([\w-]+)|"([^"]{1,40})")\s+ikonuna/i,
  );
  if (tr) {
    return { identity: (tr[2] || tr[3] || '').trim(), anchor: tr[1].trim() };
  }
  return null;
}

/**
 * Material/CDK checkboxes keep the real <input> visually hidden (cdk-visually-hidden, 1px) under a <label>
 * that intercepts pointer events, so locator.check() retries until timeout. When the target is such a hidden
 * checkbox/radio, toggle it through its label and verify the state. Returns false when not applicable.
 */
async function checkThroughLabel(page: Page, target: Locator, wanted: boolean): Promise<boolean> {
  const info = await target
    .first()
    .evaluate((el) => {
      const input = el as HTMLInputElement;
      if (input.tagName !== 'INPUT' || !/^(checkbox|radio)$/i.test(input.type)) return null;
      const r = input.getBoundingClientRect();
      const hidden = r.width <= 2 || r.height <= 2 || /visually-hidden|sr-only/i.test(input.className);
      if (!hidden) return null;
      const label = (input.labels && input.labels[0]) || input.closest('label');
      if (!label) return null;
      return { id: input.id || '', checked: input.checked, viaFor: Boolean(input.labels && input.labels[0] && input.id) };
    }, undefined, { timeout: 5000 })
    .catch(() => null);
  if (!info) return false;
  if (info.checked === wanted) return true;
  const label = info.viaFor
    ? page.locator(`label[for="${info.id.replace(/"/g, '\\"')}"]`).first()
    : target.first().locator('xpath=ancestor::label[1]');
  await label.click();
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    const now = await target.first().evaluate((el) => (el as HTMLInputElement).checked).catch(() => null);
    if (now === wanted) return true;
    await page.waitForTimeout(100);
  }
  throw new Error(`Checkbox did not become ${wanted ? 'checked' : 'unchecked'} after clicking its label`);
}

function wrapLocator(ctx: HealingContext, page: Page, locator: Locator, selectorKey: string): Locator {
  return new Proxy(locator, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      if (typeof prop === 'string' && LOCATOR_ACTIONS.has(prop) && typeof value === 'function') {
        const navMode = prop === 'click' ? navigationClickMode(selectorKey) : null;
        return (...args: unknown[]) =>
          withLocatorHeal(
            ctx,
            page,
            selectorKey,
            async (loc) => {
              let actionTarget = loc;
              if (prop === 'click' || prop === 'dblclick' || prop === 'tap') {
                const scoped = inferScopedIcon(ctx.currentStepText || '');
                if (scoped) {
                  const healed = await resolveScopedIconOnPage(page, scoped.anchor, scoped.identity);
                  actionTarget = healed || (await resolveTextClickTarget(loc, selectorKey, ctx.currentStepText || ''));
                } else {
                  actionTarget = await resolveTextClickTarget(loc, selectorKey, ctx.currentStepText || '');
                }
              } else if (prop === 'check' || prop === 'uncheck') {
                const label = inferCheckLabel(selectorKey, ctx.currentStepText || '');
                if (label) {
                  const healed = await resolveCheckableOnPage(page, label);
                  if (healed) actionTarget = healed;
                }
              }
              if (prop === 'check' || prop === 'uncheck') {
                const viaLabel = await checkThroughLabel(page, actionTarget, prop === 'check');
                if (viaLabel) return undefined;
              }
              return navMode
                ? clickExpectingChange(page, actionTarget, {
                    expect: navMode,
                    label: selectorKey,
                    healing: ctx,
                  })
                : (actionTarget as any)[prop](...args);
            },
            () => target,
          );
      }
      return value;
    },
  });
}

function wrapLocatorFactory<A extends unknown[]>(
  ctx: HealingContext,
  page: Page,
  factory: (...args: A) => Locator,
  selectorKey: (...args: A) => string,
) {
  return (...args: A) => {
    const key = selectorKey(...args);
    const resolved = resolveSelector(page.url(), ctx.currentStepKey, key);
    const loc =
      resolved !== key
        ? locatorFromSelector(page, resolved)
        : factory(...args);
    return wrapLocator(ctx, page, loc, key);
  };
}

export function wrapPageForSelfHeal(page: Page, ctx: HealingContext): Page {
  if (!ctx.enabled) return page;

  return new Proxy(page, {
    get(target, prop, receiver) {
      if (prop === 'locator') {
        return wrapLocatorFactory(
          ctx,
          target,
          (selector: string, options?: unknown) => target.locator(selector, options as any),
          (selector: string) => String(selector),
        );
      }
      if (prop === 'getByRole') {
        return wrapLocatorFactory(
          ctx,
          target,
          (role: string, options?: { name?: string | RegExp }) => target.getByRole(role as any, options),
          (role: string, options?: { name?: string | RegExp }) => {
            const name = options?.name != null ? String(options.name) : '';
            return `role=${role}[name='${name}']`;
          },
        );
      }
      if (prop === 'getByLabel') {
        return wrapLocatorFactory(
          ctx,
          target,
          (text: string | RegExp, options?: unknown) => target.getByLabel(text, options as any),
          (text: string | RegExp) => `label=${String(text)}`,
        );
      }
      if (prop === 'getByText') {
        return wrapLocatorFactory(
          ctx,
          target,
          (text: string | RegExp, options?: unknown) => target.getByText(text, options as any),
          (text: string | RegExp) => `text=${String(text)}`,
        );
      }
      if (prop === 'getByPlaceholder') {
        return wrapLocatorFactory(
          ctx,
          target,
          (text: string | RegExp, options?: unknown) => target.getByPlaceholder(text, options as any),
          (text: string | RegExp) => `placeholder=${String(text)}`,
        );
      }
      if (prop === 'getByTestId') {
        return wrapLocatorFactory(
          ctx,
          target,
          (testId: string | RegExp) => target.getByTestId(testId),
          (testId: string | RegExp) => String(testId),
        );
      }
      const value = Reflect.get(target, prop, receiver);
      return typeof value === 'function' ? value.bind(target) : value;
    },
  }) as Page;
}
