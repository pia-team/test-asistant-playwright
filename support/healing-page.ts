import type { Page, Locator } from '@playwright/test';
import type { HealingContext } from './self-heal';
import { withLocatorHeal } from './self-heal';
import { resolveSelector } from './locator-registry';
import { locatorFromSelector } from './self-heal';

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

function wrapLocator(ctx: HealingContext, page: Page, locator: Locator, selectorKey: string): Locator {
  return new Proxy(locator, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      if (typeof prop === 'string' && LOCATOR_ACTIONS.has(prop) && typeof value === 'function') {
        return (...args: unknown[]) =>
          withLocatorHeal(ctx, page, selectorKey, (loc) => (loc as any)[prop](...args), () => target);
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
      const value = Reflect.get(target, prop, receiver);
      return typeof value === 'function' ? value.bind(target) : value;
    },
  }) as Page;
}
