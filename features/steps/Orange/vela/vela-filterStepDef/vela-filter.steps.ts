import { Given, When, Then } from '@cucumber/cucumber';
import type { Page } from '@playwright/test';
import type { ICustomWorld } from '../../../../../support/world';
import {
  resolveStructuredLocator,
  fillFromValueRef,
  fillFromUiValue,
  matchSnapshotText,
  resolveSnapshotNavigateUrl,
  type StructuredLocator,
  type SnapshotValueRef,
  type SnapshotUiValue,
} from './vela-filter.resolve';

/** Deterministic UI lifecycle (K8.2) — provenance DETERMINISTIC; per-test resolve */
const ALLOWED_ORIGINS: string[] = ["fixture://","fixture://auth-spa-transition","fixture://snapshot-duplicate-fields","fixture://snapshot-select-categories","fixture://snapshot-duplicate-username","fixture://snapshot-login","fixture://snapshot-css-icon-link","fixture://snapshot-aria-combobox","fixture://login","fixture://auth-redirect-chain","https://stock-order-management-ui.dnextsmf-orangetest.com"];
const STORAGE_STATE_REF = null;
const PLAN: SnapshotPlanStep[] = [ {
  "action" : "navigate",
  "id" : "nav-b82b123d-965b-4f71-a48c-7ad99b16a6de",
  "url" : "env://BASE_LOGIN_URL"
}, {
  "action" : "click",
  "id" : "b82b123d-965b-4f71-a48c-7ad99b16a6de",
  "locator" : {
    "exact" : true,
    "normalizedName" : "sign in with keycloak",
    "strategy" : "testid",
    "testId" : "login-submit-button",
    "version" : 1
  }
}, {
  "action" : "fill",
  "id" : "f4e09c14-fcb9-4368-a75a-7d17bedba855",
  "locator" : {
    "css" : "#username",
    "exact" : true,
    "inputType" : "text",
    "label" : "Username or email",
    "normalizedName" : "username or email",
    "strategy" : "css",
    "version" : 1
  },
  "uiValue" : {
    "kind" : "literal",
    "text" : "admin"
  }
}, {
  "action" : "fill",
  "id" : "bedad030-c418-44bb-b1d3-d02ca15176e6",
  "locator" : {
    "exact" : true,
    "inputType" : "password",
    "label" : "Password",
    "name" : "Password",
    "normalizedName" : "password",
    "role" : "textbox",
    "strategy" : "role",
    "version" : 1
  },
  "uiValue" : {
    "kind" : "literal",
    "text" : "admin"
  }
}, {
  "action" : "click",
  "id" : "6f4fdf27-4f21-4e96-a769-dff997199206",
  "locator" : {
    "css" : "#kc-login",
    "exact" : true,
    "inputType" : "submit",
    "normalizedName" : "login",
    "strategy" : "css",
    "version" : 1
  }
}, {
  "action" : "click",
  "id" : "dfe42bb1-7e33-460a-80c6-a3531c7f1afc",
  "locator" : {
    "exact" : true,
    "hrefPath" : "/ui/stockOrderManagement/manage-resources",
    "normalizedName" : "manage resources",
    "strategy" : "testid",
    "testId" : "sidebar-nav-item-manage-resources",
    "version" : 1
  }
}, {
  "action" : "click",
  "id" : "8f9b9827-f57e-4b34-8589-160d07033081",
  "locator" : {
    "exact" : true,
    "normalizedName" : "all categories",
    "strategy" : "testid",
    "testId" : "resource-table-filter-category",
    "version" : 1
  }
}, {
  "action" : "selectOption",
  "id" : "6d42bf57-cb11-4d30-b4d0-ae0b6a502280",
  "locator" : {
    "exact" : true,
    "normalizedName" : "all categories",
    "strategy" : "testid",
    "testId" : "resource-table-filter-category",
    "version" : 1
  },
  "selection" : {
    "kind" : "ARIA_OPTION",
    "label" : "SIM",
    "optionLocator" : {
      "exact" : true,
      "name" : "SIM",
      "normalizedName" : "sim",
      "role" : "option",
      "strategy" : "role",
      "version" : 1
    }
  }
}, {
  "action" : "click",
  "id" : "120533fd-1291-4899-9258-f431e9a95e57",
  "locator" : {
    "exact" : true,
    "normalizedName" : "filter",
    "strategy" : "testid",
    "testId" : "resource-table-filter-apply",
    "version" : 1
  }
}, {
  "action" : "assertVisible",
  "id" : "579722ef-6465-437c-a28d-e4e60535ed52",
  "locator" : {
    "exact" : true,
    "normalizedName" : "msisdn",
    "placeholder" : "MSISDN",
    "strategy" : "testid",
    "testId" : "resource-table-filter-msisdn",
    "version" : 1
  }
} ];

type SnapshotPlanStep = {
  id: string;
  action: string;
  url?: string;
  locator?: StructuredLocator;
  value?: string | null;
  valueRef?: SnapshotValueRef;
  uiValue?: SnapshotUiValue;
  valueEnvKey?: string;
  selection?: { kind: string; label?: string; value?: string; index?: number; optionLocator?: StructuredLocator };
  fileAssetRef?: string;
  fileEnvKey?: string;
  saveAs?: string;
  timeoutMs?: number;
  assertions?: Array<{
    kind: string;
    locator?: StructuredLocator;
    expected?: string | null;
    match?: string;
    caseSensitive?: boolean;
    trim?: boolean;
  }>;
};

const runtime: Record<string, string> = {};

Given('the user navigates to "env:\\/\\/BASE_LOGIN_URL"', async function (this: ICustomWorld) {
  const page = this.page!;
  await executeSnapshotStep(page, PLAN[0], runtime);
});

When('the user clicks "testid=login-submit-button"', async function (this: ICustomWorld) {
  const page = this.page!;
  await executeSnapshotStep(page, PLAN[1], runtime);
});

When('the user fills "Username or email" with "admin"', async function (this: ICustomWorld) {
  const page = this.page!;
  await executeSnapshotStep(page, PLAN[2], runtime);
});

When('the user fills "Password" with "admin"', async function (this: ICustomWorld) {
  const page = this.page!;
  await executeSnapshotStep(page, PLAN[3], runtime);
});

When('the user clicks "css=#kc-login"', async function (this: ICustomWorld) {
  const page = this.page!;
  await executeSnapshotStep(page, PLAN[4], runtime);
});

When('the user clicks "testid=sidebar-nav-item-manage-resources"', async function (this: ICustomWorld) {
  const page = this.page!;
  await executeSnapshotStep(page, PLAN[5], runtime);
});

When('the user clicks "testid=resource-table-filter-category"', async function (this: ICustomWorld) {
  const page = this.page!;
  await executeSnapshotStep(page, PLAN[6], runtime);
});

When('the user selects "SIM" in "testid=resource-table-filter-category"', async function (this: ICustomWorld) {
  const page = this.page!;
  await executeSnapshotStep(page, PLAN[7], runtime);
});

When('the user clicks "testid=resource-table-filter-apply"', async function (this: ICustomWorld) {
  const page = this.page!;
  await executeSnapshotStep(page, PLAN[8], runtime);
});

Then('the element "testid=resource-table-filter-msisdn" should be visible', async function (this: ICustomWorld) {
  const page = this.page!;
  await executeSnapshotStep(page, PLAN[9], runtime);
});

async function executeSnapshotStep(
  page: Page,
  step: SnapshotPlanStep,
  runtime: Record<string, string>,
): Promise<void> {
  const timeout = step.timeoutMs ?? 30_000;
  const resolveOpts = { timeoutMs: timeout };
  switch (step.action) {
    case 'navigate':
      await page.goto(resolveSnapshotNavigateUrl(step.url!, ALLOWED_ORIGINS), { waitUntil: 'domcontentloaded', timeout });
      break;
    case 'click': {
      const clickLoc = await resolveStructuredLocator(page, step.locator!, resolveOpts);
      await clickLoc.click({ timeout });
      // SSO / route changes often follow clicks — settle before the next step resolves.
      await page.waitForLoadState('domcontentloaded', { timeout }).catch(() => {});
      break;
    }
    case 'fill': {
      const loc = await resolveStructuredLocator(page, step.locator!, resolveOpts);
      if (step.uiValue || step.valueEnvKey) {
        await fillFromUiValue(loc, step.uiValue || { kind: 'literal', text: '' }, runtime, {
          timeout,
          valueEnvKey: step.valueEnvKey,
        });
      } else if (step.valueRef) {
        await fillFromValueRef(loc, step.valueRef, runtime);
      } else {
        await loc.fill(step.value ?? '', { timeout });
      }
      break;
    }
    case 'selectOption': {
      const loc = await resolveStructuredLocator(page, step.locator!, resolveOpts);
      const sel = step.selection;
      if (sel && sel.kind === 'ARIA_OPTION') {
        const tag = await loc.evaluate((el: Element) => el.tagName).catch(() => '');
        if (String(tag).toUpperCase() === 'SELECT' && sel.label) {
          await loc.selectOption({ label: sel.label }, { timeout });
          break;
        }
        const resolveAriaOpt = async () => {
          if (sel.label) {
            for (const role of ['option', 'menuitem', 'menuitemradio', 'treeitem'] as const) {
              const exact = page.getByRole(role, { name: sel.label, exact: true });
              if (await exact.count() === 1) return exact;
              const fuzzy = page.getByRole(role, { name: sel.label });
              if (await fuzzy.count() === 1) return fuzzy;
            }
          }
          if (sel.optionLocator) {
            return resolveStructuredLocator(page, sel.optionLocator, resolveOpts);
          }
          return null;
        };
        let optLoc = await resolveAriaOpt();
        if (!optLoc || (await optLoc.count()) === 0) {
          const expanded = await loc.getAttribute('aria-expanded').catch(() => null);
          if (expanded !== 'true') {
            await loc.click({ timeout }).catch(() => {});
          }
          for (let i = 0; i < 12; i++) {
            optLoc = await resolveAriaOpt();
            if (optLoc && (await optLoc.count()) >= 1) break;
            await page.waitForTimeout(250);
          }
        }
        if (!optLoc) throw new Error('OPTION_NOT_FOUND');
        const n = await optLoc.count();
        if (n === 0) throw new Error('OPTION_NOT_FOUND');
        if (n > 1) throw new Error('AMBIGUOUS_OPTION');
        await optLoc.click({ timeout });
        break;
      }
      if (sel && sel.value) {
        await loc.selectOption({ value: sel.value }, { timeout });
      } else if (sel && sel.label) {
        await loc.selectOption({ label: sel.label }, { timeout });
      } else {
        const opt = step.value ?? '';
        await loc.selectOption(opt, { timeout });
      }
      break;
    }
    case 'check':
      await (await resolveStructuredLocator(page, step.locator!, resolveOpts)).check({ timeout });
      break;
    case 'uncheck':
      await (await resolveStructuredLocator(page, step.locator!, resolveOpts)).uncheck({ timeout });
      break;
    case 'assertVisible':
      await (await resolveStructuredLocator(page, step.locator!, resolveOpts)).waitFor({ state: 'visible', timeout });
      break;
    case 'assertText': {
      const loc = await resolveStructuredLocator(page, step.locator!, resolveOpts);
      const text = (await loc.innerText()).trim();
      if (!matchSnapshotText(text, step.value ?? '', 'equals', true, true)) {
        throw new Error('ASSERTION_FAILED: assertText expected ' + JSON.stringify(step.value));
      }
      break;
    }
    case 'assertUrl': {
      const actual = page.url();
      if (!matchSnapshotText(actual, step.value ?? '', 'equals', true, true)) {
        throw new Error('ASSERTION_FAILED: assertUrl expected ' + JSON.stringify(step.value));
      }
      break;
    }
    case 'assertTitle': {
      const actual = await page.title();
      if (!matchSnapshotText(actual, step.value ?? '', 'equals', true, true)) {
        throw new Error('ASSERTION_FAILED: assertTitle expected ' + JSON.stringify(step.value));
      }
      break;
    }
    case 'extract': {
      const loc = await resolveStructuredLocator(page, step.locator!, resolveOpts);
      runtime[step.saveAs!] = (await loc.innerText()).trim();
      break;
    }
    case 'snapshot':
      await page.locator('body').waitFor({ state: 'attached', timeout });
      break;
    case 'uploadFile': {
      const loc = await resolveStructuredLocator(page, step.locator!, resolveOpts);
      const envKey = step.fileEnvKey as string | undefined;
      const filePath = envKey ? process.env[envKey] : undefined;
      if (!filePath) {
        throw new Error('VALUE_SOURCE_NOT_FOUND: upload file not materialized');
      }
      // Path is job-scoped temp — never log
      await loc.setInputFiles(filePath, { timeout });
      break;
    }
    default:
      throw new Error('UNSUPPORTED_ACTION: ' + step.action);
  }
  if (step.assertions) {
    for (const assertion of step.assertions) {
      await runAssertion(page, assertion, timeout);
    }
  }
}

async function runAssertion(
  page: Page,
  assertion: NonNullable<SnapshotPlanStep['assertions']>[number],
  timeout: number,
): Promise<void> {
  const resolveOpts = { timeoutMs: timeout };
  switch (assertion.kind) {
    case 'assertVisible':
      await (await resolveStructuredLocator(page, assertion.locator!, resolveOpts)).waitFor({ state: 'visible', timeout });
      break;
    case 'assertText': {
      const loc = await resolveStructuredLocator(page, assertion.locator!, resolveOpts);
      const text = await loc.innerText();
      if (!matchSnapshotText(
        text,
        assertion.expected ?? '',
        (assertion.match as 'equals' | 'contains') ?? 'equals',
        assertion.caseSensitive !== false,
        assertion.trim !== false,
      )) {
        throw new Error('ASSERTION_FAILED: nested assertText');
      }
      break;
    }
    case 'assertUrl': {
      if (!matchSnapshotText(
        page.url(),
        assertion.expected ?? '',
        (assertion.match as 'equals' | 'contains') ?? 'equals',
        assertion.caseSensitive !== false,
        assertion.trim !== false,
      )) {
        throw new Error('ASSERTION_FAILED: nested assertUrl');
      }
      break;
    }
    case 'assertTitle': {
      if (!matchSnapshotText(
        await page.title(),
        assertion.expected ?? '',
        (assertion.match as 'equals' | 'contains') ?? 'equals',
        assertion.caseSensitive !== false,
        assertion.trim !== false,
      )) {
        throw new Error('ASSERTION_FAILED: nested assertTitle');
      }
      break;
    }
    default:
      throw new Error('UNSUPPORTED_ACTION: assertion ' + assertion.kind);
  }
}
