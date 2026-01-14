@dcmv1
Feature: DCMv1 Customer and Address Management
  As a user, I want to manage customer information and addresses to keep records up-to-date.

  Scenario: Edit customer information and address details for a specific customer
    Given I am on the "login" page
    When I enter "nora" into the "Username or email" field
    And I enter "1234" into the "Password" field
    And I click "Sign In"
    And I am on the "https://dcm-ui.pi.dev-gcu.com/customer360/F89269692" page
    And I click "close"
    And I enter "OFYETi" into the "Type text.." field
    And I click "Search"
    And I click "OFYETIM KEREMP PIDEV 2006/06/"
    And I click "customer info actions button"
    And I click "Edit customer info"
    And I enter "1234565252" into the "Fax Number" field
    And I click "Communication Method"
    And I click "Email & SMS"
    And I enter "23123123123" into the "Fix Phone Number" field
    And I click "Save customer info"
    And I click "Address"
    And I click the actions button for row "DEFAULT_BILLING_ADDRESS"
    And I click "Edit address"
    And I enter "11121222" into the "Address Line 1" field
    And I enter "85685663636" into the "Address Line 2" field
    And I enter "2332" into the "Post Code" field
    And I click "Country"
    And I click "ROMANIA"
    And I enter "BUKREs" into the "City" field
    And I click "Save address"
    And I click "nora"
    And I click "Logout"