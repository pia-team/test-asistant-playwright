@manage-resource @smoke
Feature: manage-resource
  @manage-resource @smoke
  Scenario: manage-resource flow
    Given 1.sign in with keycloak butonuna tıkla for manage-resource
    When 2.username gir for manage-resource
    When 3.password gir for manage-resource
    When 4.sign in butonuna tıkla for manage-resource
    When 5.sidebardan manage resources butonuna tıkla for manage-resource
    When 6.açılan ekranda filter butonuna bas for manage-resource
    When 7.search by ids butonuna tıkla for manage-resource
    Then 8.resource id gir for manage-resource
    Then 8.resource id gir for manage-resource