@upload
Feature: Customer 360 Partner Creation

  @smoke @regression
  Scenario: Create partner with document upload for upload
    Given I am on the login page for upload
    When I enter valid credentials for upload
    And I click the "Sign In" button for upload
    And I click the "Create Partner" link for upload
    And I click the "organizationSearch" textbox for upload
    And I fill the "organizationSearch" textbox with "ANGULAr" for upload
    And I click the "search" button for upload
    And I select the "ANGULARYIRMI ORGANIZATION" option for upload
    And I click the "next-button" for upload
    And I click the "add-document-button" for upload
    And I upload the "FORM" document to the "add-document-button" file input for upload