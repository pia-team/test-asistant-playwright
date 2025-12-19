@login
Feature: User Login
  As a user
  I want to log in to the application
  So that I can access my account

  Scenario: Successful Login
    Given I am on the login page
    When I log in with valid credentials
    Then I should be successfully logged in
    And I should see "Profile"