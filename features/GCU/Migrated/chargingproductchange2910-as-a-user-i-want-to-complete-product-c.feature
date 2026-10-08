@chargingproductchange2910-as-a-user-i-want-to-complete-product-c
Feature: chargingproductchange2910__as-a-user-i-want-to-complete-product-cha

  Background:
    Given I have opened the Customer Management application
    And I sign in with credentials "nora" and "1234"
    And I am on the Customer360 page
    And I search for customer by Customer Id "Y07453970T"
    And I select the searched customer

  @PreVFROMANIA-2910
  Scenario: As a user I want to complete Product Change for Charging Proration check VFROMANIA-2910
    And I click the "Product" tab on Customer360 Page
    Then I should see "ACTIVE" for "Product Status" field on Customer Product Page
    When I click the "VODAFONE EASY SALES PERFORMER" product to open details on Customer Product Page
    And I click the three dots icon on Customer Product Page
    And I click the "Order" tab on Customer360 Page
    And I click the "Product" tab on Customer360 Page
    Then I should see "ACTIVE" for "Product Status" field on Customer Product Page
    When I click the "VODAFONE EASY SALES PERFORMER" product to open details on Customer Product Page
    And I click the three dots icon on Customer Product Page
    And I click the "Product Change" option on three dot list on Customer Product Page
    And I fill the "externalOrderId" field on Customer Order Page
    And I fill the "crmCaseId" field on Customer Order Page
    And I fill the "salesAgentChannel" field on Customer Order Page
    And I click the continue button after fill form on Customer Order Page
    Then I should see the DSales Catalog page is opened
    Then I should see the "Vodafone Easy Sales Performer" offering on Product Package Change page
    Then I should see the "Vodafone Easy Sales" as service type on Product Offering page
    Then I should see the "License" product on Product Offering page
    Then I should see the "SLA Premium" product on Product Offering page
    Then I should see the "Servicii Business Suport Premium" product on Product Offering page
    Then I should see the "Servicii profesionale" product on Product Offering page
    When I click add icon for "SLA Premium" addon product to view on Product Offering page
    When I click "Invoicing Frequency" dropdown for "SLA Premium" product
    Then I should see the options on dropdown on Product Offering page
      | Monthly   |
      | Quarterly |
      | Yearly    |
      | One Time  |
    And I select "One Time" option from dropdown on Product Offering Page
    And I select suitable price for selected Invoicing Frequency for "SLA Premium" product
    And I increment the quantity of "SLA Premium" product as "1" times
    And I decide to add "SLA Premium" addon product "true"
    Then I should see the "SLA Premium" addon added quantity times to the cart
    And I pick the product details of the product
      | Product Name : SLA Premium      |
      | SLA: input                      |
      | Invoicing Frequency : selectbox |
    And I pick the left panel data for "Vodafone Easy Sales Performer" product to Product Change
    And I create a json file for collected data to Product Change for customer
    And I click the Add To Cart button to Product Change
    Then I should see the Shopping Cart page is opened
    Then I should see the "Vodafone Easy Sales Performer" as to be kept for Package Change
    Then I should see the "SLA Premium" as new Addon for Product Change
    When I click the checkout button on Shopping Cart Page
    Then I should see "successfully submitted" message for Shopping Cart
    When I click the go back Customer360 button after checkout
    And I click the "Order" tab on Customer360 Page
    Then I should see "INPROGRESS" for "Order Status" field on Customer Order Page
    Then I should see "PRODUCT CHANGE" for "Order Type" field on Customer Order Page
    And I click the "Shopping Cart" tab on Customer360 Page
    Then I should see "COMPLETED" for "Status" field on Customer Shopping Cart Page
    When I switch to Backoffice on new window
    And I log out from the system
    Then I should see the "Sign in to your account" header on Sign In page
    When I sign in with credentials "pmuser" and "1234"
    And I should see the name of "NITZSCHEFNK AUTOMATION" progressed customer on BackOffice page
    And I click the name of "NITZSCHEFNK AUTOMATION" customer on BackOffice page
    And I click the three dots on opened page on Backoffice page
    And I click the ClaimEdit button on opened segment on BackOffice page
    Then I should see the "PM Task" header on BackOffice page
    Then I should see the "Vodafone Easy Sales Performer" as to be kept on BackOfficePage
    Then I should see the "SLA Premium" as new Addon on BackOfficePage
    When I fill the "licenceCost" input on BackOfficePage
    And I fill the "inputPo" input on BackOfficePage
    And I fill the "project" input on BackOfficePage
    And I fill the "pmNotes" input on BackOfficePage
    And I click the Complete Task button on the right button of the on BackOffice page
    Then I should see "Task Completed" message on BackOffice page
    When I log out from the system
    Then I should see the "Sign in to your account" header on Sign In page
    When I sign in with credentials "easysales" and "1234"
    And I wait for task creation for "NITZSCHEFNK AUTOMATION" customer on Vbu McDc Team
    And I click the name of "NITZSCHEFNK AUTOMATION" customer on BackOffice page
    And I click the three dots on opened page on Backoffice page
    And I click the ClaimEdit button on opened segment on BackOffice page
    Then I should see the "Services Configuration Task" header on BackOffice page
    And I select "Implementation Done" checkbox on BackOfficePage
    And I select "Testing Done" checkbox on BackOfficePage
    And I select "Acceptance Signed" checkbox on BackOfficePage
    And I click the Complete Task button on the right button of the on BackOffice page
    Then I should see "Task Completed" message on BackOffice page
