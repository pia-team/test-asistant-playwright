@signin-positive-scenario-as-a-user-i-want-to-si
Feature: signin__positive-scenario-as-a-user-i-want-to-si

  Background:
    Given I have opened the Customer Management application

  Scenario: (Positive Scenario) As a user ,I want to sign in to the page by using valid credentials.
    When User should see the text as "Login" on the Login page
    And User should see the text as "Sign in to your account" over credentials
    And User should see the text as "Or sign in with" under Sign in button
    And User should see the text as "Google" under Or Sign with text
    And User should see the text as "Connect with Vodafone Account" under Google text
    When I enter a value "nora" in the Username or email field on Sign In page
    And I enter a value "1234" in the Password field on Sign In page
    And I click the Sign in button on Sign In page
    Then I should be seeing that the "nora" is shown on opened home page
    When I have log out into the system on the home page
    Then I should be seeing that the "Sign in to your account" header on Sign In page
    And I click the Sign in button on Sign In page
    Then I should be seeing the message "Invalid username or password." on Sign In page
    When I enter a value "afad" in the Username or email field on Sign In page
    And I click the Sign in button on Sign In page
    Then I should be seeing the message "Invalid username or password." on Sign In page
    And I enter a value "asdfa" in the Password field on Sign In page
    And I click the Sign in button on Sign In page
    Then I should be seeing the message "Invalid username or password." on Sign In page
    When I enter a value "afad" in the Username or email field on Sign In page
    And I enter a value "asdfa" in the Password field on Sign In page
    Then I should be seeing the message "Invalid username or password." on Sign In page
