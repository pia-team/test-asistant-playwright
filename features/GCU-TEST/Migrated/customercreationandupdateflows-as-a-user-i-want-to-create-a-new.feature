@customercreationandupdateflows-as-a-user-i-want-to-create-a-new
Feature: customercreationandupdateflows__as-a-user-i-want-to-create-a-new-custome

  Background:
    Given I have opened the Customer Management application
    And I enter a value "nora" in the Username or email field on Sign In page
    And I enter a value "1234" in the Password field on Sign In page
    And I click the Sign in button on Sign In page
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
    Then User should see "companyCui" element as "disabled" on "app-corporate-customer-general" Page
    Then User should see "organizationName" element as "disabled" on "app-corporate-customer-general" Page
    Then User should see "marketSegment" element as "disabled" on "app-corporate-customer-general" Page
    Then User should see "treatmentSegment" element as "disabled" on "app-corporate-customer-general" Page
    And User controls the data on the disabled area on general Information Page with fetched data from General Page
    And User wants to enter random data to "customerId" for Customer on opened page
    And User wants to enter random data to "customerName" for Customer on opened page
    And User clicks next Button on General Information page

    Then User should see the "Agent Information" tab is opened
    And User wants to enter random data to "dealerCode" for Customer on opened page
    And User wants to enter random data to "name" for Customer on opened page
    And User wants to enter "allocatedEmail123@gmail.com" as "email" on opened page
    Then User should see "." and "@" and "allocatedEmail123@gmail.com" inside of email structure on Agent Information page
    And User wants to enter "specialistEmail123@gmail.com" as "specialistEmail" on opened page
    Then User should see "." and "@" and "specialistEmail123@gmail.com" inside of email structure on Agent Information page
    And User clicks next Button on Agent Information page

    Then User should see the "Contact Information" tab is opened
    When User clicks "contactType" dropdown on opened page
    Then User should see the "Customer Contact" option on dropdown
    And User selects any option from dropdown on opened page
    When User clicks "contactRole" dropdown on opened page
    Then User verifies the contactRole values are correctly mapped
    And User selects any option from dropdown on opened page
    And User wants to enter random data to name field for contact information page
    And User wants to enter random data to "surname" for Customer on opened page
    And User clicks the country code dropdown
    And User selects "+40" option on Contact Information page
    And User enters random mobile phone number on Contact Information page
    And User wants to enter random data to "Contact ID" for Customer on opened page
    And User ensures the add sign is "false" clickable
    And User wants to enter "customerContact123@gmail.com" on contact page
    Then User should see "." and "@" and "customerContact123@gmail.com" inside of email structure on Agent Information page
    When User clicks "contactType" dropdown on opened page for additional contact
    Then User should see the "Customer Contact" option on dropdown
    And User selects "Customer Contact" as an option from dropdown on opened page
    When User clicks "contactRole" dropdown on opened page for additional contact
    And User selects any option from dropdown on opened page
    And User wants to enter random data to name field for additional contact information page
    And User wants to enter random data to "surname" for additional contact
    And User wants to enter random data to "Contact ID2" for Customer on opened page
    And User wants to enter random data to "phoneNumber" for additional contact
    And User wants to enter random data to "email" for additional contact
    And User ensures the add sign is "true" clickable
    And User clicks Next button on Contact Information Page

    And User clicks the Shipping Address slider button
    Then User should see the "Address Information" tab is opened
    Then User should see "contactType" element on Address Information Page
    Then User should see "street1" element on Address Information Page
    And User enters random input for "street1" on Customer Address Page
    Then User should see "street2" element on Address Information Page
    And User enters random input for "street2" on Customer Address Page
    Then User should see "postCode" element on Address Information Page
    And User enters random input for "postCode" on Customer Address Page
    Then User should see "city" element on Address Information Page
    And User wants to enter "ALBA" as "city" on Address Information Page
    And User clicks the country dropdown
    And User selects "ROMANIA" as an option from dropdown on opened page
    And User clicks the county dropdown
    And User selects "Alba" as an option from dropdown on opened page

    Then User should see "serviceContactType" element on Address Information Page
    Then User should see "serviceStreet1" element on Address Information Page
    Then User should see "serviceStreet2" element on Address Information Page
    Then User should see "servicePostCode" element on Address Information Page
    Then User should see "serviceCity" element on Address Information Page
    Then User should see "select" element on Address Information Page
    Then User should see "select" element on Address Information Page
    And User clicks the Shipping Address slider button
    And User clicks Next button on Address Information Page

    Then User should see the "Invoice Account" tab is opened
    And User wants to enter random data to name field for Invoice information page
    And User wants to enter random data to "billingAccount" for Customer on opened page
