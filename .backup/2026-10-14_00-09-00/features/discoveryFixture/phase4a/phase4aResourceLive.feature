@phase4aResourceLive
Feature: Resource create capture and search

  Scenario: Create a resource, capture its id, search and verify
    Given the user is on the resources page
    When the user creates a new resource with a unique name
    And the user captures the created resource id from the create API response
    And the user searches for the captured resource id
    Then the search results show the same resource