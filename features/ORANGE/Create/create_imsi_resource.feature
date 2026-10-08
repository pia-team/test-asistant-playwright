@create_imsi_resource @smoke
Feature: Create IMSI resource

  @create_imsi_resource @smoke
  Scenario: Successfully create IMSI resources
    Given the user is on the login page for create_imsi_resource
    When the user clicks the "Sign in with Keycloak" button for create_imsi_resource
    And the user enters valid credentials for create_imsi_resource
    And the user clicks the "Sign In" button for create_imsi_resource
    And the user clicks the element with test id "sidebar-nav-item-create-order" for create_imsi_resource
    And the user checks the element with test id "order-create-action-create" for create_imsi_resource
    And the user checks the element with test id "order-create-category-IMSI" for create_imsi_resource
    And the user clicks the element with test id "order-create-next-button" for create_imsi_resource
    And the user enters "10000" into the element with test id "prepare-file-itemcount-0" for create_imsi_resource
    And the user enters a unique value matching the pattern "543############" into the element with test id "prepare-file-imsiStart-0" for create_imsi_resource
    And the user clicks the element with test id "prepare-file-submit" for create_imsi_resource
    Then the user should see "Resource pool created" for create_imsi_resource
