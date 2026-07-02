@create
Feature: Create Individual Customer

  @create
  Scenario: Successful login and create individual customer
    Given I am on the login page for create
    When I enter valid credentials for create
    And I click Sign In for create
    Then I click Create Individual Customer for create
    And I click identification number for create
    And I enter an 8 digit random id for create
    Then I should see the 8 digit id populated in the field for create