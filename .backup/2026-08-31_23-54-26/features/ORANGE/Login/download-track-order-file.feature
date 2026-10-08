@download-track-order-file
Feature: Download track order file

  @download-track-order-file
  Scenario: Download track order file
    Given the user is on the login page for download-track-order-file
    When the user clicks the "Login" button for download-track-order-file
    And the user clicks the "Username or email" textbox for download-track-order-file
    And the user enters the username into the "Username or email" textbox for download-track-order-file
    And the user clicks the "Password" textbox for download-track-order-file
    And the user enters the password into the "Password" textbox for download-track-order-file
    And the user clicks the "Sign In" button for download-track-order-file
    And the user clicks the "Track Orders" sidebar item for download-track-order-file
    And the user clicks the "#84960402-c2bd-4f21-8bf1-" order link for download-track-order-file
    Then the user clicks the "Download" button for download-track-order-file