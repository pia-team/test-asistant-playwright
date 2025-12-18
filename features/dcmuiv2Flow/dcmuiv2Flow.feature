@DCMUIV2
Feature: DCM UI V2 Customer Management and Language Selection
  As a user of DCM UI V2, I want to manage customers and change language settings.

  Scenario: Perform login, change application language, search for a customer, and interact
    Given I navigate to the DCM UI V2 login page
    When I log in to the DCM UI V2 application
    Then I should be successfully logged into DCM UI V2
    When I change the application language to "العربية"
    And I change the application language to "Deutsch"
    And I change the application language to "English"
    And I navigate to the customer search page
    When I search for customer "ofyet"
    Then I should see customer "ofyet" in the search results
    When I interact with the first customer in the results
    Then I should be on the customer details page