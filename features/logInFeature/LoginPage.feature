Feature: Login Functionality

  @ui @smoke @BLOCKER @validLogin @wip
  Scenario: Login Positive
    When User goes to url "https://dpc-ui.pi.dev-gcu.com/ui/productCatalogManagement/catalog"
    When User should see the text as "Login" on the Login page
    When User should see the text as "Sign in to your account" on the Login page
    When User enters user name as "nora"
    And User enters password as "1234"
    And User clicks singIn Btn
    Then User should see url contains "productCatalogManagement/catalog"
    Then User should see that the "nora nora" is seen on home page
    When User  logs out from the main page to the Log in page.
    When User should see the text as "Sign in to your account" on the Login page

  @ui @smoke @BLOCKER @validLogin @wip
  Scenario: Login negative
    Given User is on the landing page
     # Then User enters the credentials
    And User clicks singIn Btn
    Then User should see the message "Invalid username or password." on Sign In page
    

     


 