@login-steps
Feature: login-steps

  @login-steps
  Scenario: login-steps flow
    Given I am on the login page for login-steps
    When I enter valid credentials for login-steps
    And I click the Sign In button for login-steps
    Then I should be redirected to the dashboard for login-steps