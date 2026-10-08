@chargingactivation3102-as-a-user-i-want-to-complete-activation
Feature: chargingactivation3102__as-a-user-i-want-to-complete-activation

  Background:
    Given I have opened the Customer Management application
    And I sign in with credentials "nora" and "1234"
    And I am on the Customer360 page
    And I search for customer by Customer Id "C85891386G"
    And I select the searched customer

  @PreActivationVFROMANIA-3102
  Scenario: As a user I want to complete Activation for Charging Proration check VFROMANIA-3102
    When I click the "Account" tab on Customer360 Page
    Then I should see the "Account" tab is opened on Customer360 Page
    When I click any New Order button on Account Page
    And I fill the "salesAgentName" field on Customer Order Page
    And I fill the "externalOrderId" field on Customer Order Page
    And I fill the "crmCaseId" field on Customer Order Page
    And I fill the "salesAgentChannel" field on Customer Order Page
    And I click the continue button after fill form on Customer Order Page
    Then I should see the DSales Catalog page is opened
    When I select "Saas" main category on Catalog page
    And I select "Vodafone Hints" sub category on Catalog page
    And I click search button on Catalog page
    Then I should see the products are listed on Catalog page
    When I select "Vodafone Hints Basic" product on Catalog page
    Then I should see the "Vodafone Hints Basic" offering on Product Offering page
    Then I should see the "Vodafone Hints" as service type on Product Offering page
    Then I should see the "Vodafone Hints Basic" product on Product Offering page
    Then I should see the "Optiune Hints extra user" product on Product Offering page
    When I click "Invoicing Frequency" dropdown for "Vodafone Hints Basic" product
    Then I should see the options on dropdown on Product Offering page
      | Monthly  |
      | Yearly   |
      | One Time |
    And I select "Monthly" option from dropdown on Product Offering Page
    And I select suitable price for selected Invoicing Frequency for "Vodafone Hints Basic" product
    And I click the cart icon to add "Vodafone Hints Basic" product
    Then I should see the "Vodafone Hints Basic" product added to the cart
    And I pick the product details of the product
      | Product Name : Vodafone Hints Basic |
      | Services SLA: input                 |
      | Implementation Partner: input       |
      | Invoicing Frequency : selectbox     |
      | Numar Utilizatori: input            |
      | Numar Credite: input                |
      | Profile Name: input                 |
    When I click add icon for "Pachet lunar suplimentar 1000 credite" addon product to view on Product Offering page
    When I click "Invoicing Frequency" dropdown for "Pachet lunar suplimentar 1000 credite" product
    Then I should see the options on dropdown on Product Offering page
      | Monthly  |
      | Yearly   |
      | One Time |
    And I select "Monthly" option from dropdown on Product Offering Page
    And I select suitable price for selected Invoicing Frequency for "Pachet lunar suplimentar 1000 credite" product
    And I increment the quantity of "Pachet lunar suplimentar 1000 credite" product as "1" times
    And I decide to add "Pachet lunar suplimentar 1000 credite" addon product "true"
    Then I should see the "Pachet lunar suplimentar 1000 credite" addon added quantity times to the cart
    And I pick the product details of the product
      | Product Name : Pachet lunar suplimentar 1000 credite |
      | Implementation Partner: input                        |
      | Invoicing Frequency : selectbox                      |
      | Internal Procedure: input                            |
      | General Procedure: input                             |
      | Numar Utilizatori: input                             |
      | Numar Credite: input                                 |
      | Customer App Integration: input                      |
    And I create a json file for collected data for "Vodafone Hints Basic" offer
    Then I should see the total price is calculated correctly
    Then I pick the left panel data for "Vodafone Hints Basic" product
    Then I pick the left panel data for "Pachet lunar suplimentar 1000 credite" product
    Then I should see the entered data is equal to left panel data
    When I click the Add To Cart button on Product Offering page
    Then I should see the Shopping Cart page is opened
    When I click the checkout button on Shopping Cart Page
    Then I should see "successfully submitted" message for Shopping Cart
    When I click the go back Customer360 button after checkout
    And I click the "Order" tab on Customer360 Page
    Then I should see "INPROGRESS" for "Order Status" field on Customer Order Page
    And I click the "Shopping Cart" tab on Customer360 Page
    Then I should see "COMPLETED" for "Status" field on Customer Shopping Cart Page
    When I switch to Backoffice on new window
    And I log out from the system
    Then I should see the "Sign in to your account" header on Sign In page
    When I sign in with credentials "pmuser" and "1234"
