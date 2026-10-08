@create-imsi-2 @smoke
Feature: Create IMSI resource

  @create-imsi-2 @smoke
  Scenario: Successfully create IMSI resources
    Given the user is on the login page for create-imsi-2
    When the user clicks the "Sign in with Keycloak" button for create-imsi-2
    And the user enters valid credentials for create-imsi-2
    And the user clicks the "Sign In" button for create-imsi-2
    And the user clicks the element with test id "sidebar-nav-item-create-order" for create-imsi-2
    And the user checks the element with test id "order-create-action-create" for create-imsi-2
    And the user checks the element with test id "order-create-category-IMSI" for create-imsi-2
    And the user clicks the element with test id "order-create-next-button" for create-imsi-2
    And the user enters "10000" into the element with test id "prepare-file-itemcount-0" for create-imsi-2
    And the user enters a unique value matching the pattern "543############" into the element with test id "prepare-file-imsiStart-0" for create-imsi-2
    And the user clicks the element with test id "prepare-file-submit" for create-imsi-2
    Then the user should see "Resource pool created" for create-imsi-2