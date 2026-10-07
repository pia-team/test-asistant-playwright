@10720260_login @regression
Feature: Login

  @regression @10720260_login
  Scenario: Successful login
    Given I am on the login page for 10720260_login
    When I enter valid credentials for 10720260_login
    And I click Sign In for 10720260_login
    Then I should see a page for 10720260_login