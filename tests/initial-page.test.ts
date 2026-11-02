import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import {
  ensureInitialPage,
  ensureInitialPageForFirstStep,
  inferInitialPageTarget,
  isBlankDocumentUrl,
  isExplicitNavigateStep,
  resolveInitialPageUrl,
  START_TARGET_NOT_CONFIGURED,
  type NavigablePage,
} from '../support/initial-page';
import { resetEnvConfigLogCache, setScenarioProjectKey } from '../support/env';

function mockPage(startUrl: string): NavigablePage & { gotos: string[] } {
  let current = startUrl;
  const gotos: string[] = [];
  return {
    gotos,
    url: () => current,
    isClosed: () => false,
    goto: async (url: string) => {
      gotos.push(url);
      current = url;
      return undefined;
    },
  };
}

describe('WEB initial page contract', () => {
  const prev: Record<string, string | undefined> = {};
  const envKeys = [
    'TEST_ENV',
    'COTESTER_SNAPSHOT_START_URL',
    'COTESTER_WEB_BASE_URL',
    'BASE_LOGIN_URL',
    'ENV_STRICT_PROJECT_CONFIG',
  ];

  before(() => {
    for (const key of envKeys) {
      prev[key] = process.env[key];
    }
    setScenarioProjectKey('InitialNavProbe');
    resetEnvConfigLogCache();
  });

  after(() => {
    for (const [key, value] of Object.entries(prev)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    setScenarioProjectKey(undefined);
    resetEnvConfigLogCache();
  });

  it('1. login-button start infers BASE_LOGIN_URL and navigates from about:blank', async () => {
    process.env.BASE_LOGIN_URL = 'https://login.example/';
    process.env.COTESTER_WEB_BASE_URL = 'https://app.example/home';
    delete process.env.COTESTER_SNAPSHOT_START_URL;
    assert.equal(
      inferInitialPageTarget('sign in with keycloak butonuna tıkla for sim-create'),
      'BASE_LOGIN_URL',
    );
    const page = mockPage('about:blank');
    await ensureInitialPageForFirstStep(
      page,
      'sign in with keycloak butonuna tıkla for sim-create',
      'sim-create',
    );
    assert.deepEqual(page.gotos, ['https://login.example/']);
  });

  it('2. explicit navigate step does not goto a second time', async () => {
    process.env.BASE_LOGIN_URL = 'https://login.example/';
    process.env.COTESTER_WEB_BASE_URL = 'https://app.example/home';
    delete process.env.COTESTER_SNAPSHOT_START_URL;
    assert.equal(
      isExplicitNavigateStep('the user navigates to "env://BASE_LOGIN_URL"'),
      true,
    );
    const page = mockPage('about:blank');
    await ensureInitialPageForFirstStep(
      page,
      'the user navigates to "env://BASE_LOGIN_URL"',
      'sim-create-2',
    );
    assert.deepEqual(page.gotos, []);
  });

  it('3. app scenario without login uses WEB_BASE_URL', async () => {
    process.env.BASE_LOGIN_URL = 'https://login.example/';
    process.env.COTESTER_WEB_BASE_URL = 'https://app.example/home';
    delete process.env.COTESTER_SNAPSHOT_START_URL;
    assert.equal(inferInitialPageTarget('When create resources butonuna tıkla'), 'WEB_BASE_URL');
    assert.equal(resolveInitialPageUrl('WEB_BASE_URL'), 'https://app.example/home');
    const page = mockPage('about:blank');
    await ensureInitialPage(page, 'WEB_BASE_URL');
    assert.deepEqual(page.gotos, ['https://app.example/home']);
  });

  it('4. unknown start URL throws START_TARGET_NOT_CONFIGURED', () => {
    delete process.env.COTESTER_SNAPSHOT_START_URL;
    delete process.env.COTESTER_WEB_BASE_URL;
    delete process.env.BASE_LOGIN_URL;
    process.env.TEST_ENV = 'dev';
    process.env.ENV_STRICT_PROJECT_CONFIG = 'true';
    setScenarioProjectKey('NoSuchProjectForInitialNav');
    resetEnvConfigLogCache();
    assert.throws(() => resolveInitialPageUrl('BASE_LOGIN_URL'), (err: unknown) => {
      assert.ok(err instanceof Error);
      assert.match(err.message, /START_TARGET_NOT_CONFIGURED/);
      assert.equal(err.message.startsWith(START_TARGET_NOT_CONFIGURED.split(':')[0]), true);
      return true;
    });
  });

  it('5. sim-create-2 navigate wording is explicit; already-open page is left alone', async () => {
    assert.equal(
      isExplicitNavigateStep('Given the user navigates to "env://BASE_LOGIN_URL"'),
      true,
    );
    process.env.BASE_LOGIN_URL = 'https://login.example/';
    const page = mockPage('https://login.example/');
    await ensureInitialPage(page, 'BASE_LOGIN_URL');
    assert.deepEqual(page.gotos, []);
    assert.equal(isBlankDocumentUrl('about:blank'), true);
    assert.equal(isBlankDocumentUrl('https://login.example/'), false);
  });
});
