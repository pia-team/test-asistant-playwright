@dcmui2
Feature: DCM UI Address Management

  Scenario: Edit a billing address for a searched customer
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
    And I click "Address"
    And I click "DEFAULT_BILLING_ADDRESS ASD"
    And I click "Edit"
    And I click "Address Line 2"
    And I enter "DWDWDw" into the "Address Line 2" field
    And I click "Country"
    And I click "TURKEY"
    And I click "Save"
