@phase4aResourceLive
Feature: Resource create capture and search

  Scenario: Create a resource, capture its id, search and verify
    Given the user is on the resources page for phase4aResourceLive
    When the user clicks "Create resource" for phase4aResourceLive
    And the user enters a unique resource name for phase4aResourceLive
    And the user submits the new resource form for phase4aResourceLive
    And the user captures the created resource id from the create API response for phase4aResourceLive
    And the user returns to the resources page for phase4aResourceLive
    And the user searches for the captured resource id for phase4aResourceLive
    Then the search results show the same resource for phase4aResourceLive