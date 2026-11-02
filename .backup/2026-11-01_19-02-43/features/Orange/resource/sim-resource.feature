@sim-resource @smoke
Feature: sim-resource

  @sim-resource
  @smoke
  Scenario: sim-resource flow
    Given sign in with keycloak butonuna tıkla for sim-resource
    When username gir for sim-resource
    When password gir for sim-resource
    When sign in butonuna tıkla for sim-resource
    When manage resources butonuna tıkla for sim-resource
    When all categories butonuna tıkla for sim-resource
    When Dropdowndan SIM seç for sim-resource
    Then Filter butonuna tıkla for sim-resource
    Then I click "Filter" button for sim-resource