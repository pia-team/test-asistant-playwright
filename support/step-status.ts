import { Status } from '@cucumber/cucumber';
import type { TestStepResultStatus } from '@cucumber/messages';
import type { StepEventKind } from './step-event';

/**
 * Map Cucumber AfterStep status to a step-event kind.
 * Compare only enum members — string literals cause TS2367 after narrowing.
 */
export function stepEventFromCucumberStatus(status: TestStepResultStatus): {
  event: StepEventKind;
  reason?: string;
} {
  if (status === Status.PASSED) {
    return { event: 'PASS' };
  }
  if (status === Status.SKIPPED) {
    return { event: 'SKIP' };
  }
  if (status === Status.UNDEFINED) {
    return { event: 'FAIL', reason: 'undefined' };
  }
  if (status === Status.AMBIGUOUS) {
    return { event: 'FAIL', reason: 'ambiguous' };
  }
  return { event: 'FAIL' };
}
