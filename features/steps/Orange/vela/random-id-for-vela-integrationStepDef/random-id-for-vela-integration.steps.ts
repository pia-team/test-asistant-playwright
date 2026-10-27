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
} from './random-id-for-vela-integration.resolve';

/** Deterministic UI lifecycle (K8.2) — provenance DETERMINISTIC; per-test resolve */
const ALLOWED_ORIGINS: string[] = ["fixture://","fixture://snapshot-select-categories","fixture://snapshot-duplicate-username","fixture://snapshot-login","fixture://snapshot-css-icon-link","fixture://snapshot-aria-combobox","fixture://login","fixture://auth-redirect-chain","fixture://auth-spa-transition","fixture://snapshot-duplicate-fields","https://stock-order-management-ui.dnextsmf-orangetest.com"];
const STORAGE_STATE_REF = null;
const PLAN: SnapshotPlanStep[] = [ {
  "action" : "navigate",
  "id" : "nav-47230748-48c1-4880-8f0d-4237553ebdc3",
  "url" : "env://BASE_LOGIN_URL"
}, {
  "action" : "click",
  "id" : "47230748-48c1-4880-8f0d-4237553ebdc3",
  "locator" : {
    "exact" : true,
    "normalizedName" : "sign in with keycloak",
    "strategy" : "testid",
    "testId" : "login-submit-button",
    "version" : 1
  }
}, {
  "action" : "fill",
  "id" : "86b7e971-fb39-4750-86c3-825517e16e30",
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
    "field" : "username",
    "kind" : "runCredentialRef"
  },
  "valueEnvKey" : "COTESTER_WEB_USERNAME"
}, {
  "action" : "fill",
  "id" : "5619f695-03f0-41ed-848f-2ea5388dbfd3",
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
    "field" : "password",
    "kind" : "runCredentialRef"
  },
  "valueEnvKey" : "COTESTER_WEB_PASSWORD"
}, {
  "action" : "click",
  "id" : "09adc5ff-879e-4cc0-979e-e30c96670671",
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
  "id" : "8e322be2-a30c-40e8-bf16-c573c398e91b",
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
  "id" : "af5cecd9-7e68-4c1c-84a0-996ad7f74c6c",
  "locator" : {
    "contextLabel" : "Search by filters / Search by IDs",
    "exact" : true,
    "normalizedName" : "search by ids",
    "strategy" : "testid",
    "testId" : "resource-table-filter-mode-by-ids",
    "version" : 1
  }
}, {
  "action" : "fill",
  "id" : "8cb085ab-a564-402a-b124-d0744533e24f",
  "locator" : {
    "exact" : true,
    "normalizedName" : "resource id",
    "placeholder" : "Resource Id",
    "strategy" : "testid",
    "testId" : "resource-table-filter-resourceId",
    "version" : 1
  },
  "uiValue" : {
    "generatorKind" : "uuid",
    "kind" : "runtimeGeneratorRef",
    "name" : "generated"
  },
  "valueEnvKey" : "COTESTER_SNAPSHOT_RTGEN_generated"
}, {
  "action" : "click",
  "id" : "8371081f-dc41-457a-9969-425d31e9a85e",
  "locator" : {
    "exact" : true,
    "normalizedName" : "filter",
    "strategy" : "testid",
    "testId" : "resource-table-filter-apply",
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

When('the user fills "Username or email" with "\\{\\{runCredential:username\\}\\}"', async function (this: ICustomWorld) {
  const page = this.page!;
  await executeSnapshotStep(page, PLAN[2], runtime);
});

When('the user fills "Password" with "\\{\\{runCredential:password\\}\\}"', async function (this: ICustomWorld) {
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

When('the user clicks "testid=resource-table-filter-mode-by-ids"', async function (this: ICustomWorld) {
  const page = this.page!;
  await executeSnapshotStep(page, PLAN[6], runtime);
});

When('the user fills "testid=resource-table-filter-resourceId" with "\\{\\{runtime:uuid\\}\\}"', async function (this: ICustomWorld) {
  const page = this.page!;
  await executeSnapshotStep(page, PLAN[7], runtime);
});

When('the user clicks "testid=resource-table-filter-apply"', async function (this: ICustomWorld) {
  const page = this.page!;
  await executeSnapshotStep(page, PLAN[8], runtime);
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
