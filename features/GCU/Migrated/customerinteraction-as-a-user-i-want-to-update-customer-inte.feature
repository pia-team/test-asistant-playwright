@customerinteraction-as-a-user-i-want-to-update-customer-inte
Feature: customerinteraction__as-a-user-i-want-to-update-customer-inte

  Background:
    Given I have opened the Customer Management application
    And I sign in with valid credentials
    And I search for customer by Customer Id "N70452867K"

  @VFROMANIA-3863
  Scenario: As a user I want to update customer interaction
    When User clicks the "Customer Interaction" tab on Customer360 Page
    Then User should see the "Customer Interaction" tab is opened on Customer360 Page
    When User clicks the edit button on Customer Interaction Page
    Then User should see "direction" element as "disabled" on Customer Interaction Page
    And User enters random data to "reason" field on Customer Interaction Page
    And User enters random data to "description" field on Customer Interaction Page
    And User adds extra note for interaction on Customer Interaction Page
    And User enters "Setup completed" to the second note field on Customer Interaction Page
    Then User should see "text" element as "disabled" on Customer Interaction Page
    And User collects the new address data on Customer Interaction Page
    And User clicks the save button on Customer Interaction Page
    Then User should see the "Interaction created successfully!" success message
    Then User should see the customer address data are "update"d on Customer Interaction Page
