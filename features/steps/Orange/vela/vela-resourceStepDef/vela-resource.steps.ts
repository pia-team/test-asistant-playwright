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
} from './vela-resource.resolve';

/** Deterministic UI lifecycle (K8.2) — provenance DETERMINISTIC; per-test resolve */
const ALLOWED_ORIGINS: string[] = ["fixture://","fixture://auth-spa-transition","fixture://login","fixture://snapshot-duplicate-username","fixture://snapshot-css-icon-link","fixture://snapshot-duplicate-fields","fixture://snapshot-login","fixture://auth-redirect-chain","https://stock-order-management-ui.dnextsmf-orangetest.com"];
const STORAGE_STATE_REF = null;
const PLAN: SnapshotPlanStep[] = [ {
  "action" : "navigate",
  "id" : "nav-78b4d1b6-a710-4c62-8956-2c2f341743db",
  "url" : "env://BASE_LOGIN_URL"
}, {
  "action" : "click",
  "id" : "78b4d1b6-a710-4c62-8956-2c2f341743db",
  "locator" : {
    "exact" : true,
    "normalizedName" : "sign in with keycloak",
    "strategy" : "testid",
    "testId" : "login-submit-button",
    "version" : 1
  }
}, {
  "action" : "fill",
  "id" : "1420dcc4-59a9-4b35-b519-b4275f4cb7c0",
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
  "id" : "ab25f7f7-ea34-4041-9162-61039c83e41d",
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
  "id" : "3b686348-63fc-4c18-8138-9de55eb8a45a",
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
  "id" : "68f97972-e238-479c-9edc-5d3c3ce3f576",
  "locator" : {
    "exact" : true,
    "hrefPath" : "/ui/stockOrderManagement/manage-resources",
    "normalizedName" : "manage resources",
    "strategy" : "testid",
    "testId" : "sidebar-nav-item-manage-resources",
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
      const opt = step.value ?? '';
      await loc.selectOption(opt, { timeout });
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
