@ui-deterministic @vela-login-3 @smoke
Feature: UI senaryosu

  Scenario: UI senaryosu
    Given the user navigates to "env://WEB_BASE_URL"
    When the user clicks "testid=login-submit-button"
    When the user fills "Username or email" with "admin"
    When the user fills "Password" with "admin"
    When the user clicks "css=#kc-login"
