@self-heal-demo
Feature: Self-heal demo for locator recovery

  @self-heal-demo
  Scenario: Stale Save locator recovers via runtime self-heal
    Given the self-heal demo page is ready for self-heal-demo
    When the user clicks "Save" using a stale locator for self-heal-demo
    Then the self-heal demo should show that Save was clicked for self-heal-demo
