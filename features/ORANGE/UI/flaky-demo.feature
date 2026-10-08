@flaky-demo
Feature: Flaky demo for Test Health

  @flaky-demo
  Scenario: Intentionally unstable scenario for flaky detection
    Given the flaky demo page is ready for flaky-demo
    When the user runs the flaky coin flip for flaky-demo
    Then the flaky demo assertion should pass about half the time for flaky-demo
