@saaspackagechange3785-as-a-user-i-want-to-cancel-package-chang
Feature: saaspackagechange3785__as-a-user-i-want-to-cancel-package-chang

  Background:
    Given I have opened the Customer Management application
    And I sign in with credentials "nora" and "1234"
    And I am on the Customer360 page
    And I search for customer by Customer Id "P70793609L"
    And I select the searched customer

  @PackageChangeFails @VFROMANIA-3785
  Scenario: As a user I want to cancel Package Change for check VFROMANIA-3785
    When I get Authorization for API
    And I click the "Product" tab on Customer360 Page
    Then I should see "ACTIVE" for "Product Status" field on Customer Product Page
    When I click the "VODAFONE HINTS BASIC" product to open details on Customer Product Page
    And I click the three dots icon on Customer Product Page
    And I click the "Package Change" option on three dot list on Customer Product Page
    And I fill the "externalOrderId" field on Customer Order Page
    And I fill the "crmCaseId" field on Customer Order Page
    And I fill the "salesAgentChannel" field on Customer Order Page
    And I click the continue button after fill form on Customer Order Page
    Then I should see the DSales Catalog page is opened
    When I select "Vodafone Hints Power" product on Catalog page
    Then I should see the "Vodafone Hints Power" offering on Product Offering page
    Then I should see the "Vodafone Hints" as service type on Product Offering page
    Then I should see the "Vodafone Hints Power" product on Product Offering page
    Then I should see the "Optiune Hints extra user" product on Product Offering page
    And I click the "Keep" for Package Change
    When I click "Invoicing Frequency" dropdown for "Vodafone Hints Power" product
    Then I should see the options on dropdown on Product Offering page
      | Monthly  |
      | Yearly   |
      | One Time |
    And I select "Monthly" option from dropdown on Product Offering Page
    And I select suitable price for selected Invoicing Frequency for "Vodafone Hints Power" product
    Then I should see the "Vodafone Hints Power" product added to the cart
    And I pick the product details of the product
      | Product Name : Vodafone Hints Power |
      | Services SLA: input                 |
      | Implementation Partner: input       |
      | Invoicing Frequency : selectbox     |
      | Numar Utilizatori: input            |
      | Numar Credite: input                |
      | Profile Name: input                 |
    Then I should see the total price is calculated correctly
    Then I pick the left panel data for "Vodafone Hints Power" product to Package Change
    Then I pick the left panel data for "Pachet lunar suplimentar 1000 credite" product to Package Change
    Then I pick the left panel data for "Optiune Hints extra user" product to Package Change
    And I create a json file for collected data to Package Change for customer
    And I click the Add To Cart button to Product Change
    Then I should see the Shopping Cart page is opened
    Then I should see the "Vodafone Hints Power" as new Package for Package Change
    Then I should see the "Vodafone Hints Basic" as to be removed for Package Change
    Then I should see the "Pachet lunar suplimentar 1000 credite" as to be kept for Package Change
    Then I should see the "Optiune Hints extra user" as to be kept for Package Change
    When I click the checkout button on Shopping Cart Page
    Then I should see "successfully submitted" message for Shopping Cart
    When I click the go back Customer360 button after checkout
    And I click the "Order" tab on Customer360 Page
    Then I should see "INPROGRESS" for "Order Status" field on Customer Order Page
    Then I should see "PACKAGE CHANGE" for "Order Type" field on Customer Order Page
    And I click the "Shopping Cart" tab on Customer360 Page
    Then I should see "COMPLETED" for "Status" field on Customer Shopping Cart Page
    And I click the "Order" tab on Customer360 Page
    Then I should see "INPROGRESS" for "Order Status" field on Customer Order Page
    When I open the latest created order on Customer Order Page
    And I click the Cancel Order button on Customer Order Page
    And I fill the cancellation reason on Customer Order Page
    And I click the Create Cancel Order button on Customer Order Page
    And I wait for order cancellation on Customer Order Page
    Then I should see "CANCELLED" for "Order Status" field on Customer Order Page
    And I click the "Product" tab on Customer360 Page
    Then I should see "ACTIVE" for "Product Status" field on Customer Product Page
    Then I should see "WAITING FOR PM" for "Status Reason" field on Customer Product Page
    Then I should see "ACTIVE" for "Product Status" field for inner products on Customer Product Page
