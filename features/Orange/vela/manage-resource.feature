@ui-deterministic @manage-resource
Feature: manage-resource

  Scenario: manage-resource
    Given the user navigates to "env://BASE_LOGIN_URL"
    When the user clicks "testid=login-submit-button"
    When the user fills "Username or email" with "{{runCredential:username}}"
    When the user fills "Password" with "{{runCredential:password}}"
    When the user clicks "css=#kc-login"
    When the user clicks "testid=sidebar-nav-item-manage-resources"
    When the user clicks "testid=resource-table-filter-category"
    When the user selects "SIM" in "testid=resource-table-filter-category"
    When the user clicks "testid=resource-table-filter-apply"
