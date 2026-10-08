@customercreationandupdateflows-as-a-user-i-want-to-create-a-new
Feature: customercreationandupdateflows__as-a-user-i-want-to-create-a-new-custome

  Background:
    Given I have opened the Customer Management application
    And I sign in with valid credentials
    Then User is on the Customer360 page

  @customerCreationExistingOrganization
  Scenario: As a user I want to create a new Customer with existing Organization
    When User clicks select Search Type field on Customer360 search page
    And User selects Company Name option from dropdown on Customer360 search page
    And User fills the search bar as "OSINSKI AND SONS AUTOMATION" on Customer360 search page
    And User clicks Search Button on Customer360 search page
    And User selects opened name of searched name on Customer360 search page
    When User fetches the data of existing customer from Main page
    Given User opens Customer Create page on Home page
    And User enters specific number into the CUI field
    And User clicks search button on Create Customer page
    And User clicks the Create New Customer on Customer Dialog Page
    Then User should see the "General Information" tab is opened
    Then User should see "companyCui" element as "disabled" on General Information Page
    Then User should see "organizationName" element as "disabled" on General Information Page
    Then User should see "marketSegment" element as "disabled" on General Information Page
    Then User should see "treatmentSegment" element as "disabled" on General Information Page
    And User controls the data on the disabled area on general Information Page with fetched data from General Page
    And User enters random data to "customerId" field on General Information Page
    And User enters random data to "customerName" field on General Information Page
    And User clicks next Button on General Information page
    Then User should see the "Agent Information" tab is opened
    And User enters random data to "dealerCode" field on Agent Information Page
    And User enters random data to "name" field on Agent Information Page
    And User enters "allocatedEmail123@gmail.com" as "email" on Agent Information Page
    Then User should see "." and "@" and "allocatedEmail123@gmail.com" inside of email structure on Agent Information page
    And User enters "specialistEmail123@gmail.com" as "specialistEmail" on Agent Information Page
    Then User should see "." and "@" and "specialistEmail123@gmail.com" inside of email structure on Agent Information page
    And User clicks next Button on Agent Information page
    Then User should see the "Contact Information" tab is opened
    When User clicks "contactType" dropdown on Contact Information Page
    Then User should see the "Customer Contact" option on dropdown
    And User selects any option from dropdown on Contact Information Page
    When User clicks "contactRole" dropdown on Contact Information Page
    Then User verifies the contactRole values are correctly mapped
    And User selects any option from dropdown on Contact Information Page
    And User enters random data to name field on Contact Information Page
    And User enters random data to "surname" field on Contact Information Page
    And User clicks the country code dropdown on Contact Information Page
    And User selects "+40" option on Contact Information Page
    And User enters random mobile phone number on Contact Information Page
    And User enters random data to "Contact ID" field on Contact Information Page
    And User ensures the add sign is "false" clickable on Contact Information Page
    And User enters "customerContact123@gmail.com" on Contact Information Page
    Then User should see "." and "@" and "customerContact123@gmail.com" inside of email structure on Contact Information page
    When User clicks "contactType" dropdown on Contact Information Page for additional contact
    Then User should see the "Customer Contact" option on dropdown
    And User selects "Customer Contact" as an option from dropdown on Contact Information Page
    When User clicks "contactRole" dropdown on Contact Information Page for additional contact
    And User selects any option from dropdown on Contact Information Page
    And User enters random data to name field for additional contact on Contact Information Page
    And User enters random data to "surname" for additional contact on Contact Information Page
    And User enters random data to "Contact ID2" field on Contact Information Page
    And User enters random data to "phoneNumber" for additional contact on Contact Information Page
    And User enters random data to "email" for additional contact on Contact Information Page
    And User ensures the add sign is "true" clickable on Contact Information Page
    And User clicks Next button on Contact Information Page
    And User clicks the Shipping Address slider button on Address Information Page
    Then User should see the "Address Information" tab is opened
    Then User should see "contactType" element on Address Information Page
    Then User should see "street1" element on Address Information Page
    And User enters random input for "street1" on Customer Address Page
    Then User should see "street2" element on Address Information Page
    And User enters random input for "street2" on Customer Address Page
    Then User should see "postCode" element on Address Information Page
    And User enters random input for "postCode" on Customer Address Page
    Then User should see "city" element on Address Information Page
    And User enters "ALBA" as "city" on Address Information Page
    And User clicks the country dropdown on Address Information Page
    And User selects "ROMANIA" as an option from dropdown on Address Information Page
    And User clicks the county dropdown on Address Information Page
    And User selects "Alba" as an option from dropdown on Address Information Page
    Then User should see "serviceContactType" element on Address Information Page
    Then User should see "serviceStreet1" element on Address Information Page
    Then User should see "serviceStreet2" element on Address Information Page
    Then User should see "servicePostCode" element on Address Information Page
    Then User should see "serviceCity" element on Address Information Page
    Then User should see "select" element on Address Information Page
    And User clicks the Shipping Address slider button on Address Information Page
    And User clicks Next button on Address Information Page
    Then User should see the "Invoice Account" tab is opened
    And User enters random data to name field for Invoice Information Page
    And User enters random data to "billingAccount" field on Invoice Information Page
