@manage-resources
Feature: Manage Resources table

  @manage-resources @smoke
  Scenario: User sees Resource Id column after filtering
    Given the user is on the login page for manage-resources
    When the user clicks the "Sign in with Keycloak" button for manage-resources
    And the user enters valid credentials for manage-resources
    And the user clicks the "Sign In" button for manage-resources
    And the user clicks "Manage Resources" for manage-resources
    And the user clicks the "Filter" button for manage-resources
    Then the user should see "Resource Id" in the table for manage-resources