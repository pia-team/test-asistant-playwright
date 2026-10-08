Feature: Retry experiment

  Scenario: fails once then passes
    Given attempt counter is reset
    When I fail on first attempt
    Then the step should pass
