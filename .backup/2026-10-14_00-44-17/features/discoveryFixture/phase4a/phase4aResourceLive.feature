@phase4aResourceLive
Feature: Resource create capture and search

  Scenario: Create a resource, capture its id, search and verify
    Given the user is on the resources page for phase4aResourceLive
    When the user enters a unique resource name for phase4aResourceLive
    When the user submits the resource form and captures the created resource id from the API response for phase4aResourceLive
    When the user searches for the captured resource id for phase4aResourceLive
    Then the search results show the same resource for phase4aResourceLive