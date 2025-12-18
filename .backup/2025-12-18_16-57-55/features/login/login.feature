@login
Feature: User Login
  As a user I want to log in to the application
  So that I can access secure features

  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I log in with valid credentials
    Then I should be successfully logged in