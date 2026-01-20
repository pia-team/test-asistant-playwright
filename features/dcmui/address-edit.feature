@dcm-address-edit @regression @smoke
Feature: DCM Address Management

  Scenario: Edit a customer's billing address
    Given I am on the "login" page
    When I click "Username or email"
    And I enter "nora" into the "Username or email" field
    And I click "Password"
    And I enter "1234" into the "Password" field
    And I click "Sign In"
    And I click "Type text.."
    And I enter "ANGULARYIRMı" into the "Type text.." field
    And I click "Search"
    And I click "ANGULARYIRMI INDIVIDUAL 2007/"
    And I click the "Address" tab
    And I click the action button in the "DEFAULT_BILLING_ADDRESS ASD" row
    And I click "Edit"
    And I click "Address Line 2"
    And I enter "DWDWDw" into the "Address Line 2" field
    And I click the "Country" dropdown
    And I click "TURKEY"
    And I click "Save"
