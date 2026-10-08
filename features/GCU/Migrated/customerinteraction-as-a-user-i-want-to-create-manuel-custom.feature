@customerinteraction-as-a-user-i-want-to-create-manuel-custom
Feature: customerinteraction__as-a-user-i-want-to-create-manuel-custom

  Background:
    Given I have opened the Customer Management application
    And I sign in with valid credentials
    And I search for customer by Customer Id "N70452867K"

  @VFROMANIA-3862
  Scenario: As a user I want to create manuel customer interaction
    When User clicks the "Customer Interaction" tab on Customer360 Page
    Then User should see the "Customer Interaction" tab is opened on Customer360 Page
    When User clicks the add button on Customer Account Page
    And User enters random data to "reason" field on Customer Interaction Page
    When User clicks "channel" dropdown on Customer Interaction Page
    Then User should see the "Call Center" option on dropdown
    And User selects any option from dropdown on Customer Interaction Page
    When User clicks "direction" dropdown on Customer Interaction Page
    Then User should see the "inbound" option on dropdown
    Then User should see the "outbound" option on dropdown
    And User selects any option from dropdown on Customer Interaction Page
    When User clicks "status" dropdown on Customer Interaction Page
    Then User should see the "opened" option on dropdown
    Then User should see the "inProgress" option on dropdown
    Then User should see the "closed" option on dropdown
    And User selects any option from dropdown on Customer Interaction Page
    And User enters random data to "description" field on Customer Interaction Page
    And User enters random data to "text" field on Customer Interaction Page
    And User collects the new address data on Customer Interaction Page
    And User clicks the save button on Customer Interaction Page
    Then User should see the "Interaction created successfully!" success message
    Then User should see the customer address data are "create"d on Customer Interaction Page
