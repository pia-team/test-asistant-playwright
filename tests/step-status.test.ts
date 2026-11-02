import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { Status } from '@cucumber/cucumber';
import { stepEventFromCucumberStatus } from '../support/step-status';

describe('WEB cucumber status mapping', () => {
  it('uses enum members only (no string-literal overlap)', () => {
    assert.equal(stepEventFromCucumberStatus(Status.PASSED).event, 'PASS');
    assert.equal(stepEventFromCucumberStatus(Status.SKIPPED).event, 'SKIP');
    assert.equal(stepEventFromCucumberStatus(Status.UNDEFINED).event, 'FAIL');
    assert.equal(stepEventFromCucumberStatus(Status.UNDEFINED).reason, 'undefined');
    assert.equal(stepEventFromCucumberStatus(Status.AMBIGUOUS).event, 'FAIL');
    assert.equal(stepEventFromCucumberStatus(Status.FAILED).event, 'FAIL');
  });
});
