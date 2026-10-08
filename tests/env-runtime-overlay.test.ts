import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'fs';
import * as path from 'path';
import { getEnvConfig, resetEnvConfigLogCache } from '../support/env';

const PROJECT_ROOT = path.resolve(__dirname, '..');
const PROBE = 'StabilizationProbe';
const probeFile = path.join(PROJECT_ROOT, 'config', 'projects', `${PROBE}.dev.json`);

describe('WEB env runtime overlay (FAZ 3)', () => {
  const prev: Record<string, string | undefined> = {};

  before(() => {
    for (const k of [
      'TEST_ENV',
      'COTESTER_WEB_BASE_URL',
      'COTESTER_WEB_USERNAME',
      'COTESTER_WEB_PASSWORD',
      'UI_USERNAME',
      'UI_PASSWORD',
      'BASE_LOGIN_URL',
      'UI_CREDENTIAL_PROFILE',
    ]) {
      prev[k] = process.env[k];
    }
    fs.mkdirSync(path.dirname(probeFile), { recursive: true });
    fs.writeFileSync(
      probeFile,
      JSON.stringify({
        baseLoginUrl: 'https://file-url.example/login',
        username: 'file-user',
        password: '',
      }),
    );
    process.env.TEST_ENV = 'dev';
    delete process.env.UI_CREDENTIAL_PROFILE;
    resetEnvConfigLogCache();
  });

  after(() => {
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

  it('prefers COTESTER_WEB_* over empty-password shared JSON', () => {
    process.env.COTESTER_WEB_BASE_URL = 'https://runtime-url.example';
    process.env.COTESTER_WEB_USERNAME = 'runtime-user';
    process.env.COTESTER_WEB_PASSWORD = 'runtime-pass-dummy';
    resetEnvConfigLogCache();
    const cfg = getEnvConfig(PROBE);
    assert.equal(cfg.baseLoginUrl, 'https://runtime-url.example');
    assert.equal(cfg.username, 'runtime-user');
    assert.equal(cfg.password, 'runtime-pass-dummy');
  });
});
