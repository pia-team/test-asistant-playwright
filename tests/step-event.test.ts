import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  buildExecutionUnitKey,
  buildScenarioKey,
  isPlaywrightTraceEnabled,
} from '../support/step-event';

describe('WEB step-event identity', () => {
  it('separates outline lines and dataset rows', () => {
    const a = buildScenarioKey({
      featurePath: 'f.feature',
      scenarioName: 'Login',
      pickleId: 'p1',
      outlineLine: 10,
      rowIndex: 0,
    });
    const b = buildScenarioKey({
      featurePath: 'f.feature',
      scenarioName: 'Login',
      pickleId: 'p1',
      outlineLine: 10,
      rowIndex: 1,
    });
    assert.notEqual(a, b);
  });

  it('retry attempts get distinct execution units', () => {
    const scen = buildScenarioKey({
      featurePath: 'f.feature',
      scenarioName: 'Login',
      pickleId: 'p1',
    });
    const u1 = buildExecutionUnitKey({
      featurePath: 'f.feature',
      scenarioKey: scen,
      attempt: 1,
    });
    const u2 = buildExecutionUnitKey({
      featurePath: 'f.feature',
      scenarioKey: scen,
      attempt: 2,
    });
    assert.notEqual(u1, u2);
  });
});

describe('WEB Playwright trace opt-in', () => {
  it('defaults to disabled', () => {
    delete process.env.COTESTER_TRACE_MODE;
    delete process.env.PLAYWRIGHT_TRACE;
    assert.equal(isPlaywrightTraceEnabled(), false);
  });

  it('enables only for explicit on/true/1', () => {
    process.env.COTESTER_TRACE_MODE = 'on';
    assert.equal(isPlaywrightTraceEnabled(), true);
    process.env.COTESTER_TRACE_MODE = 'off';
    assert.equal(isPlaywrightTraceEnabled(), false);
    delete process.env.COTESTER_TRACE_MODE;
  });
});
