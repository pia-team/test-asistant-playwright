@chargingactivation3102-as-a-user-i-want-to-complete-activation
Feature: chargingactivation3102__as-a-user-i-want-to-complete-activation

  Background:
    Given I have opened the Customer Management application
    And I enter a value "nora" in the Username or email field on Sign In page
    And I enter a value "1234" in the Password field on Sign In page
    And I click the Sign in button on Sign In page
    And User is on the Customer360 page
    And User clicks select Search Type field on Customer360 search page
    And User selects Customer Id option from dropdown on Customer360 search page
    And User fills the search bar as "C85891386G" on Customer360 search page
    And User clicks Search Button on Customer360 search page
    And User selects opened name of searched name on Customer360 search page

  Scenario: As a user I want to complete Activation for Charging Proration check VFROMANIA-3102
    When User clicks the "Account" tab on Customer360 Page
    Then User should see the "Account" tab is opened on Customer360 Page
    When User clicks any New Order button on Account Page
    And User fills the "salesAgentName" field on Customer Order Page
    And User fills the "externalOrderId" field on Customer Order Page
    And User fills the "crmCaseId" field on Customer Order Page
    And User fills the "salesAgentChannel" field on Customer Order Page
    And User clicks the continue button after fill form on Customer Order Page
    Then User should see the DSales Catalog page is opened
    When User selects "Saas" main category on Catalog page
    And User selects "Vodafone Hints" sub category on Catalog page
    And User clicks search button on Catalog page
    Then User should see the products are listed on Catalog page
    When User selects "Vodafone Hints Basic" product on Catalog page
    Then User should see the "Vodafone Hints Basic" offering on Product Offering page
    Then User should see the "Vodafone Hints" as service type on Product Offering page
    Then User should see the "Vodafone Hints Basic" product on Product Offering page
    Then User should see the "Optiune Hints extra user" product on Product Offering page
    When User clicks "Invoicing Frequency" dropdown for "Vodafone Hints Basic" product
    Then User should see the the options on dropdown on Product Offering page
      | Monthly  |
      | Yearly   |
      | One Time |
    And User selects "Monthly" option from dropdown on Product Offering Page
    And User selects suitable price for selected Invoicing Frequency for "Vodafone Hints Basic" product
    And User clicks the cart icon to add "Vodafone Hints Basic" product
    Then User should see the "Vodafone Hints Basic" product added to the cart
    And User picks the product details of the product
      | Product Name : Vodafone Hints Basic |
      | Services SLA: input                 |
      | Implementation Partner: input       |
      | Invoicing Frequency : selectbox     |
      | Numar Utilizatori: input            |
      | Numar Credite: input                |
      | Profile Name: input                 |
    When User clicks add icon for "Pachet lunar suplimentar 1000 credite" addon product to view on Product Offering page
    When User clicks "Invoicing Frequency" dropdown for "Pachet lunar suplimentar 1000 credite" product
    Then User should see the the options on dropdown on Product Offering page
      | Monthly  |
      | Yearly   |
      | One Time |
    And User selects "Monthly" option from dropdown on Product Offering Page
    And User selects suitable price for selected Invoicing Frequency for "Pachet lunar suplimentar 1000 credite" product
    And User increments the quantity of "Pachet lunar suplimentar 1000 credite" product as "1" times
    And User decides to add "Pachet lunar suplimentar 1000 credite" addon product "true"
    Then User should see the "Pachet lunar suplimentar 1000 credite" addon added quantity times to the cart
    And User picks the product details of the product
      | Product Name : Pachet lunar suplimentar 1000 credite |
      | Implementation Partner: input                        |
      | Invoicing Frequency : selectbox                      |
      | Internal Procedure: input                            |
      | General Procedure: input                             |
      | Numar Utilizatori: input                             |
      | Numar Credite: input                                 |
      | Customer App Integration: input                      |
    And User creates a json file for collected data for "Vodafone Hints Basic" offer
    Then User should see the total price is calculated correctly
    Then User picks the left panel data for "Vodafone Hints Basic" product
    Then User picks the left panel data for "Pachet lunar suplimentar 1000 credite" product
    Then User should see the entered data is equal to left panel data
    When User clicks the Add To Cart button on Product Offering page
    Then User should see the Shopping Cart page is opened
    When User clicks the checkout button on Shopping Cart Page
    Then User should see "successfully submitted" message for Shopping Cart
    When User clicks the go back Customer360 button after checkout
    And User clicks the "Order" tab on Customer360 Page
    Then User should see "INPROGRESS" for "Order Status" field on Customer Order Page
    And User clicks the "Shopping Cart" tab on Customer360 Page
    Then User should see "COMPLETED" for "Status" field on Customer Shopping Cart Page
    When User switches Backoffice on new window
    And I have log out into the system on the home page
    Then I should be seeing that the "Sign in to your account" header on Sign In page
    When I enter a value "pmuser" in the Username or email field on Sign In page
    And I enter a value "1234" in the Password field on Sign In page
    And I click the Sign in button on Sign In page
