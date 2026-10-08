@arnavutluk_signin
Feature: Customer360 Login and Individual Selection

  @arnavutluk_signin
  Scenario: Customer360 Login and Individual Selection
    Given I am on the login page for arnavutluk_signin
    When I click the "Username or email" textbox for arnavutluk_signin
    And I enter "orbitant" into the "Username or email" textbox for arnavutluk_signin
    And I click the "Password" textbox for arnavutluk_signin
    And I enter "orbitant123" into the "Password" textbox for arnavutluk_signin
    And I click the "Sign In" button for arnavutluk_signin
    When I click the "Individual" heading for arnavutluk_signin