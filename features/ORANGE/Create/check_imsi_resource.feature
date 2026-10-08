@check_imsi_resource @smoke
Feature: Check IMSI Resource

  @check_imsi_resource @smoke
  Scenario: User filters Inventory Pools by Resource Id
    Given the user is on the login page for check_imsi_resource
    When the user clicks the "Sign in with Keycloak" button for check_imsi_resource
    And the user enters valid credentials for check_imsi_resource
    And the user clicks the "Sign In" button for check_imsi_resource
    And the user clicks the element with test id "sidebar-nav-item-inventory-pools" for check_imsi_resource
    And the user clicks the element with test id "inventory-pools-pooled-mode-resource-id" for check_imsi_resource
    And the user enters "resourceId" into the element with test id "inventory-pools-filter-pooledResourceId" for check_imsi_resource
    And the user clicks the element with test id "inventory-pools-filter-apply" for check_imsi_resource
