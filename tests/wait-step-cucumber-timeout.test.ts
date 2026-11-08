import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import path from 'node:path';

describe('wait step cucumber timeout', () => {
  it('a 3s waitSeconds survives a 2s default when the step sets timeout 5000', async () => {
    const cwd = path.resolve(__dirname, '..');
    const env: NodeJS.ProcessEnv = { ...process.env, COTESTER_STEP_TIMEOUT_MS: '2000' };
    delete env.PLAYWRIGHT_BROWSERS_PATH;
    const child = spawn(
      'npx',
      ['cucumber-js', '--config', 'tests/fixtures/wait-step-timeout/cucumber.cjs'],
      { cwd, env, stdio: ['ignore', 'pipe', 'pipe'] },
    );
    let out = '';
    child.stdout?.on('data', (chunk) => { out += String(chunk); });
    child.stderr?.on('data', (chunk) => { out += String(chunk); });
    const code: number | null = await new Promise((resolve, reject) => {
      child.on('error', reject);
      child.on('close', resolve);
    });
    assert.notEqual(code, 0, out);
    assert.match(out, /2 scenarios? \(1 failed, 1 passed\)/);
    assert.match(out, /function timed out, ensure the promise resolves within 2000 milliseconds/);
    assert.doesNotMatch(out, /within 5000 milliseconds/);
  });
});