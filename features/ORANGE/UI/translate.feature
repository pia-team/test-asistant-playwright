@smoke @translate
Feature: Language switch to Turkish

  @translate @smoke
  Scenario: User switches language to Turkish
    Given the user is on the login page for translate
    When the user clicks the "Sign in with Keycloak" button for translate
    And the user enters valid credentials for translate
    And the user clicks the "Sign In" button for translate
    Then the user should see "Welcome" for translate
    When the user clicks "English" for translate
    And the user selects "Türkçe" for translate
    Then the user should see "Hoş Geldiniz" for translate