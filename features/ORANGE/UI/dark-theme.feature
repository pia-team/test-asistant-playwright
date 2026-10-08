@dark-theme @smoke
Feature: Dark theme toggle

  @dark-theme @smoke
  Scenario: User switches to Dark theme
    Given the user is on the login page for dark-theme
    When the user clicks the "Sign in with Keycloak" button for dark-theme
    And the user enters valid credentials for dark-theme
    And the user clicks the "Sign In" button for dark-theme
    Then the user should see "Welcome" for dark-theme
    When the user clicks the theme toggle button for dark-theme
    And the user clicks "Dark" for dark-theme