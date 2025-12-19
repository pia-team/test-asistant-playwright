@customerSearch
Feature: Customer Search
  As a logged-in user, I want to search for customers and interact with results
  So that I can manage customer information

  Scenario: Perform customer search after successful login
    Given I am on the application login page
    When I complete the login process
    Then I should be successfully logged in to the application
    When I navigate to the customer search section
    And I search for customer "ofyet"
    Then I should see search results containing "ofyet"
    And I select the first customer record from the results