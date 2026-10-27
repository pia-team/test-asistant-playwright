@phase4aResourceLive
Feature: Resource create capture and search

  @phase4aResourceLive
  Scenario: Create a resource, capture its id, search and verify
    Given the user is on the resources page for phase4aResourceLive
    When the user creates a new resource with a unique name for phase4aResourceLive
    And the user captures the created resource id from the create API response for phase4aResourceLive
    And the user searches for the captured resource id for phase4aResourceLive
    Then the search results show the same resource for phase4aResourceLive