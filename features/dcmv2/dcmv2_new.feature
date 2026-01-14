@dcmuiv2 @regression @smoke
Feature: DCMV2 Customer and User Management

  Scenario: Search for a customer, edit address, and update user details
    Given I am on the "login" page
    When I click "Username or email"
    When I enter "nora" into the "Username or email" field
    When I click "Password"
    When I enter "1234" into the "Password" field
    When I click "Sign In"
    When I click "search-customer"
    When I click "search-value-input"
    When I enter "ofyeti" into the "search-value-input" field
    When I click "search-submit-button"
    When I click "the second action button in the search results table"
    When I click "customer-main-tab-address"
    When I click "address-edit-trigger"
    When I click "address-edit-address1"
    When I enter "street street ASDAS  yeniiiiii 4444" into the "address-edit-address1" field
    When I click "address-edit-postcode"
    When I enter "2342345656" into the "address-edit-postcode" field
    When I click "address-edit-city"
    When I enter "ızmir" into the "address-edit-city" field
    When I click "address-edit-save"
    When I click "customer-main-tab-contact"
    When I click "add-contact-trigger"
    When I click "contact-form-first-name"
    When I enter "hakan" into the "contact-form-first-name" field
    When I click "contact-form-last-name"
    When I enter "yeni" into the "contact-form-last-name" field
    When I click "add-contact-cancel"
    When I click "users"
    When I click "Edit button in user actions"
    When I click "edit-username-input"
    When I enter "DANACI  DANACI1" into the "edit-username-input" field
    When I click "edit-user-save"