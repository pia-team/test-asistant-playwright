@ui-deterministic @random-id-for-vela-integration @smoke
Feature: random-id-for-vela-integration

  Scenario: random-id-for-vela-integration
    Given the user navigates to "env://BASE_LOGIN_URL"
    When the user clicks "testid=login-submit-button"
    When the user fills "Username or email" with "{{runCredential:username}}"
    When the user fills "Password" with "{{runCredential:password}}"
    When the user clicks "css=#kc-login"
    When the user clicks "testid=sidebar-nav-item-manage-resources"
    When the user clicks "testid=resource-table-filter-mode-by-ids"
    When the user fills "testid=resource-table-filter-resourceId" with "{{runtime:uuid}}"
    When the user clicks "testid=resource-table-filter-apply"
