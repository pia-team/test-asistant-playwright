@ui-deterministic @vela-resource-2
Feature: UI senaryosu

  Scenario: UI senaryosu
    Given the user navigates to "env://BASE_LOGIN_URL"
    When the user clicks "testid=login-submit-button"
    When the user fills "Username or email" with "{{runCredential:username}}"
    When the user fills "Password" with "{{runCredential:password}}"
    When the user clicks "css=#kc-login"
    When the user clicks "testid=sidebar-nav-item-manage-resources"
