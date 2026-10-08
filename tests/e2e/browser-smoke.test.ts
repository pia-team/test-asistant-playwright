import './playwright-browsers';
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'fs';
import * as path from 'path';
import { chromium, type Browser } from 'playwright';
import { getEnvConfig, resolveEnvConfig, resetEnvConfigLogCache } from '../../support/env';
import { startStaticServer, type StaticServerHandle } from './static-server';

const PROJECT_ROOT = path.resolve(__dirname, '../..');
const FIXTURE_DIR = path.join(__dirname, 'fixtures', 'login-app');
const PROBE = 'E2EBrowserSmoke';
const probeFile = path.join(PROJECT_ROOT, 'config', 'projects', `${PROBE}.dev.json`);

const E2E_USER = 'e2e-user';
const E2E_PASS = 'e2e-secret-pass';

function captureConsoleLog(run: () => void): string[] {
  const lines: string[] = [];
  const original = console.log;
  console.log = (...args: unknown[]) => {
    lines.push(args.map(String).join(' '));
    original.apply(console, args);
  };
  try {
    run();
  } finally {
    console.log = original;
  }
  return lines;
}

describe('WEB browser E2E smoke @e2e-browser-smoke', () => {
  const prev: Record<string, string | undefined> = {};
  let server: StaticServerHandle | undefined;
  let sharedBrowser: Browser | undefined;

  before(async () => {
    for (const k of [
      'TEST_ENV',
      'COTESTER_WEB_BASE_URL',
      'COTESTER_WEB_USERNAME',
      'COTESTER_WEB_PASSWORD',
      'UI_USERNAME',
      'UI_PASSWORD',
      'BASE_LOGIN_URL',
      'UI_CREDENTIAL_PROFILE',
      'HEADLESS',
    ]) {
      prev[k] = process.env[k];
    }

    server = await startStaticServer(FIXTURE_DIR);
    fs.mkdirSync(path.dirname(probeFile), { recursive: true });
    fs.writeFileSync(
      probeFile,
      JSON.stringify({
        baseLoginUrl: 'https://file-placeholder.example/login',
        username: 'file-user',
        password: '',
      }),
    );

    process.env.TEST_ENV = 'dev';
    process.env.HEADLESS = 'true';
    process.env.COTESTER_WEB_BASE_URL = `${server.url}/index.html`;
    process.env.COTESTER_WEB_USERNAME = E2E_USER;
    process.env.COTESTER_WEB_PASSWORD = E2E_PASS;
    delete process.env.UI_CREDENTIAL_PROFILE;
    resetEnvConfigLogCache();

    sharedBrowser = await chromium.launch({ headless: true });
  });

  after(async () => {
    await sharedBrowser?.close();
    sharedBrowser = undefined;
    if (server) {
      await server.close();
      server = undefined;
    }
    for (const [k, v] of Object.entries(prev)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
    try {
      fs.unlinkSync(probeFile);
    } catch {
      /* ignore */
    }
    resetEnvConfigLogCache();
  });

  it('applies runtime WEB URL and credential overlay from env', () => {
    resetEnvConfigLogCache();
    const cfg = getEnvConfig(PROBE);
    assert.equal(cfg.baseLoginUrl, `${server!.url}/index.html`);
    assert.equal(cfg.username, E2E_USER);
    assert.equal(cfg.password, E2E_PASS);
  });

  it('masks password in env resolution logs', () => {
    resetEnvConfigLogCache();
    const lines = captureConsoleLog(() => {
      resolveEnvConfig(PROBE);
    });
    const joined = lines.join('\n');
    assert.ok(!joined.includes(E2E_PASS), 'plain password must not appear in logs');
    assert.match(joined, /password:\s*\S+\*\*\*/, 'expected maskSecret-style password in logs');
  });

  it('logs in with resolved credentials and reaches dashboard', async () => {
    const cfg = getEnvConfig(PROBE);
    const page = await sharedBrowser!.newPage();
    try {
      await page.goto(cfg.baseLoginUrl, { waitUntil: 'domcontentloaded' });
      await page.getByTestId('username').fill(cfg.username);
      await page.getByTestId('password').fill(cfg.password);
      await page.getByTestId('login-submit').click();
      await page.waitForURL(/dashboard\.html/, { timeout: 10_000 });
      await page.getByTestId('dashboard-heading').waitFor({ state: 'visible' });
      const welcome = await page.getByTestId('welcome-user').textContent();
      assert.equal(welcome?.trim(), E2E_USER);
    } finally {
      await page.close();
    }
  });

  it('shows login error for wrong password', async () => {
    const cfg = getEnvConfig(PROBE);
    const page = await sharedBrowser!.newPage();
    try {
      await page.goto(cfg.baseLoginUrl, { waitUntil: 'domcontentloaded' });
      await page.getByTestId('username').fill(cfg.username);
      await page.getByTestId('password').fill('wrong-password-value');
      await page.getByTestId('login-submit').click();
      await page.getByTestId('login-error').waitFor({ state: 'visible', timeout: 5_000 });
      assert.match(page.url(), /index\.html/);
    } finally {
      await page.close();
    }
  });
});
