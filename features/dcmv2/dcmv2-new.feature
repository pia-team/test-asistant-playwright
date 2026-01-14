@dcmv2 @test
Feature: DCM V2 Customer and User Management

  Scenario: Edit customer address, contact, and user details after searching
    Given I am on the "login" page
    When I enter "nora" into the "Username or email" field
    And I enter "1234" into the "Password" field
    And I click "Sign In"
    And I click "search-customer"
    And I enter "ofyeti" into the "search-value-input" field
    And I click "search-submit-button"
    And I click "second action button in search results"
    And I click "customer-main-tab-address"
    And I click "address-edit-trigger"
    And I enter "street street ASDAS yeniiiiii 4444" into the "address-edit-address1" field
    And I enter "2342345656" into the "address-edit-postcode" field
    And I enter "ızmir" into the "address-edit-city" field
    And I click "address-edit-save"
    And I click "customer-main-tab-contact"
    And I click "add-contact-trigger"
    And I enter "hakan" into the "contact-form-first-name" field
    And I enter "yeni" into the "contact-form-last-name" field
    And I click "add-contact-cancel"
    And I click "users"
    And I click "Edit button in users table"
    And I enter "DANACI DANACI1" into the "edit-username-input" field
    And I click "edit-user-save"