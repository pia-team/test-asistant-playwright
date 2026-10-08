@chargingactivationcsv-as-a-user-i-want-to-complete-cloud-backu
Feature: chargingactivationcsv__as-a-user-i-want-to-complete-cloud-backu

  Background:
    Given I have opened the Customer Management application
    And I sign in with credentials "nora" and "1234"
    And I am on the Customer360 page
    And I search for customer by Customer Id "H14540437R"
    And I select the searched customer

  @PreVFROMANIA-1540 @VFROMANIA-3821
  Scenario: As a user I want to complete Cloud Backup Activation for Charging CSV check
    When I click the "Account" tab on Customer360 Page
    Then I should see the "Account" tab is opened on Customer360 Page
    When I click any New Order button on Account Page
    And I fill the "salesAgentName" field on Customer Order Page
    And I fill the "externalOrderId" field on Customer Order Page
    And I fill the "crmCaseId" field on Customer Order Page
    And I fill the "salesAgentChannel" field on Customer Order Page
    And I click the continue button after fill form on Customer Order Page
    Then I should see the DSales Catalog page is opened
    When I select "Cloud" main category on Catalog page
    And I select "Cloud Backup" sub category on Catalog page
    And I click search button on Catalog page
    Then I should see the products are listed on Catalog page
    When I select "Vodafone Managed Cloud Backup" product on Catalog page
    Then I should see the "Vodafone Managed Cloud Backup" offering on Product Offering page
    Then I should see the "LicentaVeeam Backup" as service type on Product Offering page
    Then I should see the "Vodafone Managed Cloud Backup" product on Product Offering page
    Then I should see the "Servicii profesionale" product on Product Offering page
    Then I should see the plan charge price selected automatically for "Vodafone Managed Cloud Backup" product
    Then I should see the "Vodafone Managed Cloud Backup" product added to the cart
    Then I should see the "Vodafone" on "Implementation Partner" for "Vodafone Managed Cloud Backup" product
    Then I should see the "Implementation Partner" is non-configurable for "Vodafone Managed Cloud Backup" product
    Then I should see the "100" on "Storage Size-GB" for "Vodafone Managed Cloud Backup" product
    Then I should see the "50" on "Connectivity Bandwidth-Mbps" for "Vodafone Managed Cloud Backup" product
    Then I should see the "99,98" on "Services SLA" for "Vodafone Managed Cloud Backup" product
    When I click "Connectivity Type" dropdown for "Vodafone Managed Cloud Backup" product
    Then I should see the options on dropdown on Product Offering page
      | Internet Shared  |
      | Internet Dedicat |
      | VPN Dedicat      |
    When I select any option from dropdown on Product Offering Page
    When I click "Invoicing Frequency" dropdown for "Vodafone Managed Cloud Backup" product
    Then I should see the options on dropdown on Product Offering page
      | Monthly   |
      | Quarterly |
      | Yearly    |
    When I select any option from dropdown on Product Offering Page
    And I click the edit button for "Storage Size-GB" for "Vodafone Managed Cloud Backup" product
    And I fill the "Storage Size-GB" new characteristic with random value for "Vodafone Managed Cloud Backup" product
    And I click the Ok button on new characteristic value model
    And I pick the product details of the product
      | Product Name : Vodafone Managed Cloud Backup |
      | Invoicing Frequency : selectbox              |
      | Implementation Partner: input                |
      | Storage Size-GB : input                      |
      | Connectivity Type : selectbox                |
      | Connectivity Bandwidth-Mbps : input          |
      | Services SLA: input                          |
    Then I should see the "Vodafone" on "Implementation Partner" for "LicentaVeeam Backup" product
    When I fill the "License Quantity" field with random value for "LicentaVeeam Backup" product
    When I click "License Type" dropdown for "LicentaVeeam Backup" product
    Then I should see the options on dropdown on Product Offering page
      | Veeam pt Server       |
      | Veeam pt Desktop      |
      | Veeam pt Server pt VM |
    When I select any option from dropdown on Product Offering Page
    When I click "Invoicing Frequency" dropdown for "LicentaVeeam Backup" product
    Then I should see the options on dropdown on Product Offering page
      | Monthly   |
      | Quarterly |
      | Yearly    |
      | One Time  |
    And I select "Yearly" option from dropdown on Product Offering Page
    When I click "Licente Option" dropdown for "LicentaVeeam Backup" product
    Then I should see the options on dropdown on Product Offering page
      | Licente Veeam Backup Agent for Workstation     |
      | Licente Veeam Backup Agent for physical server |
      | Licente Veeam Backup Agent - Virtual Machine   |
      | Licente Veeam Backup Dedicated                 |
      | LicentaVeeam Backup pentru managed VPS         |
    When I select any option from dropdown on Product Offering Page
    And I select suitable price for selected Invoicing Frequency for LicentaVeeam Backup product
    And I click the cart icon to add "LicentaVeeam Backup" product
    Then I should see the "LicentaVeeam Backup" product added to the cart
    And I pick the product details of the product
      | Product Name : LicentaVeeam Backup |
      | Invoicing Frequency : selectbox    |
      | Services SLA: input                |
      | Implementation Partner: input      |
      | License Type: selectbox            |
      | License Quantity: input            |
    And I create a json file for collected data for "Vodafone Managed Cloud Backup" offer
    Then I pick the left panel data for "Vodafone Managed Cloud Backup" product
    Then I pick the left panel data for "LicentaVeeam Backup" product
    Then I should see the total price is calculated correctly
    Then I should see the entered data is equal to left panel data
    When I click the Add To Cart button on Product Offering page
    Then I should see the Shopping Cart page is opened
    When I click the checkout button on Shopping Cart Page
    Then I should see "successfully submitted" message for Shopping Cart
