@deneme-as-a-user-i-want-to-complete-cloud-backu
Feature: deneme__as-a-user-i-want-to-complete-cloud-backu

  Background:
    Given I have opened the Customer Management application
    And I sign in with credentials "nora" and "1234"
    And I am on the Customer360 page
    And I search for customer by Customer Id "P59563294V"
    And I select the searched customer

  @DENEMMEEEE
  Scenario: As a user I want to complete Cloud Backup Activation with addons
    When I click the "Account" tab on Customer360 Page
    Then I should see the "Account" tab is opened on Customer360 Page
    When I switch to Backoffice on new window
    And I log out from the system
    Then I should see the "Sign in to your account" header on Sign In page
    When I sign in with credentials "pmuser" and "1234"
    And I should see the name of "BERNHARDHARVEYKFH AUTOMATION" progressed customer on BackOffice page
    And I click the name of "BERNHARDHARVEYKFH AUTOMATION" customer on BackOffice page
    And I click the three dots on opened page on Backoffice page
    And I click the ClaimEdit button on opened segment on BackOffice page
    Then I should see the "PM Task" header on BackOffice page
    When I fill the "licenceCost" input on BackOfficePage
    And I fill the "inputPo" input on BackOfficePage
    And I fill the "project" input on BackOfficePage
    And I fill the "pmNotes" input on BackOfficePage
    And I select document category for PM User on BackOfficePage
    Then I should see the "Acceptance" option on dropdown
    Then I should see the "Billing of Materials" option on dropdown
    Then I should see the "Work Order" option on dropdown
    And I select "Acceptance" as an option from dropdown on opened page
    And I upload a document "1mb.exe" with binding key "invalid-exe-file" on PM User BackOffice Page
    Then I should see the "This file type is not allowed to be uploaded!" success message
    And I upload a document "video.mp4" with binding key "invalid-mp4-file" on PM User BackOffice Page
    Then I should see the "This file type is not allowed to be uploaded!" success message
    And I upload a document "dummy.pdf" with binding key "acceptance-pdf-file" on PM User BackOffice Page
    Then I should see the document is added on PM User BackOffice Page
    Then I should see the "Acceptance" for "documentCategory" on BackOffice Page
    Then I should see the "dummy.pdf" for "name" on BackOffice Page
    Then I should see the "2025" for "uploadedTime" on BackOffice Page
    Then I should see the "pmuser" for "uploadedBy" on BackOffice Page
    And I select document category for PM User on BackOfficePage
    And I select "Work Order" as an option from dropdown on opened page
    And I upload a document "little-prince.jpg" with binding key "workorder-jpg-file" on PM User BackOffice Page
    Then I should see the document is added on PM User BackOffice Page
    Then I should see the "Work Order" for "documentCategory" on BackOffice Page
    Then I should see the "little-prince" for "name" on BackOffice Page
    Then I should see the "2025" for "uploadedTime" on BackOffice Page
    Then I should see the "pmuser" for "uploadedBy" on BackOffice Page
    When I click the document delete button for "dummy.pdf" on BackOffice Page
    Then I should see the "dummy.pdf" document deleted on BackOffice Page
    Then I verify the "little-prince" document can be viewed on BackOffice Page
    And I click the Complete Task button on the right button of the on BackOffice page
    Then I should see "Task Completed" message on BackOffice page
    When I log out from the system
    Then I should see the "Sign in to your account" header on Sign In page
    When I sign in with credentials "mc.dc" and "mc.dc123"
    And I wait for task creation for "TREMBLAYUYT AUTOMATION" customer on Vbu McDc Team
    And I click the name of "TREMBLAYUYT AUTOMATION" customer on BackOffice page
    And I click the three dots on opened page on Backoffice page
    And I click the ClaimEdit button on opened segment on BackOffice page
    Then I should see the "Services Configuration Task" header on BackOffice page
    Then I should see the service characteristics for "Vodafone Managed Cloud Backup" product for "Vodafone Managed Cloud Backup" as correctly on BackOffice page
    Then I should see the service characteristics for "LicentaVeeam Backup" product for "Vodafone Managed Cloud Backup" as correctly on BackOffice page
    Then I should see the service characteristics for "Servicii profesionale" product for "Vodafone Managed Cloud Backup" as correctly on BackOffice page
    And I click the Complete Task button on the right button of the on BackOffice page
    Then I should see the "Please enter required fields" warning message
    And I select "Implementation Done" checkbox on BackOfficePage
    And I select "Testing Done" checkbox on BackOfficePage
    And I select "Acceptance Signed" checkbox on BackOfficePage
    And I click the Complete Task button on the right button of the on BackOffice page
    Then I should see "Task Completed" message on BackOffice page
    When I log out from the system
    Then I should see the "Sign in to your account" header on Sign In page
    And I return to Customer Management after task completion on BackOffice page
    And I have opened the Customer Management application
    And I sign in with credentials "nora" and "1234"
    And I am on the Customer360 page
    And I search for customer by Customer Id "P59563294V"
    And I select the searched customer
    And I click the "Order" tab on Customer360 Page
    And I wait for order completion on Customer Order Page
    Then I should see "COMPLETED" for "Order Status" field on Customer Order Page
    And I click the "Product" tab on Customer360 Page
    Then I should see "ACTIVE" for "Product Status" field on Customer Product Page
    Then I should see "ACTIVE" for "Product Status" field for inner products on Customer Product Page
