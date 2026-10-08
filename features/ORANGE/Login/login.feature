@login @smoke
Feature: Login welcome message

  @login @smoke
  Scenario: User sees Welcome after login
    Given the user is on the login page for login
    When the user clicks the "Sign in with Keycloak" button for login
    And the user enters valid credentials for login
    And the user clicks the "Sign In" button for login
    Then the user should see "Welcome" for login