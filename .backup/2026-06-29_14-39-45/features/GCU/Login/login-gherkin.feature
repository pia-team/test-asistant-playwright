@login-gherkin @smoke
Feature: Login

  @login-gherkin @smoke
  Scenario: Successful login
    Given I am on the login page for login-gherkin
    When I enter valid credentials for login-gherkin
    And I click Sign In for login-gherkin
    Then I should be redirected to the dashboard for login-gherkin