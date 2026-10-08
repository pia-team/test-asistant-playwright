@form-upload
Feature: Add Attachment

  @smoke @regression
  Scenario: User adds an attachment for form-upload
    Given the user is on the login page for form-upload
    When the user enters valid credentials for form-upload
    And the user clicks the "Sign In" button for form-upload
    And the user clicks the "+" icon for form-upload
    And the user clicks the "Add" button in the "Attachment Information" section for form-upload
    And the user uploads the "form" document to the "Attachment" file input for form-upload
    Then the file should be uploaded successfully for form-upload