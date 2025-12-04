Feature: Login Functionality

  @ui @smoke @BLOCKER @validLogin @wip
  Scenario: Login Positive
    When User goes to url "https://dpc-ui.pi.dev-gcu.com/ui/productCatalogManagement/catalog"
    When User should see the text as "Login" on the Login page
    When User should see the text as "Sign in to your account" on the Login page
    When User should see the text as "Connect with Vodafone Account" on the Login page
    When User should see the text as "Or sign in with" on the Login page
    When User should see the text as "PIA Team Azure AD" on the Login page
    When User should see the text as "Google" on the Login page
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
    When User enters user name as "admin' --"
    And User clicks singIn Btn
    Then User should see the message "Invalid username or password." on Sign In page
    And User enters password as "admin' #"
    And User clicks singIn Btn
    Then User should see the message "Invalid username or password." on Sign In page
    When User enters user name as "') or '1'='1--"
    And User enters password as "') or ('1'='1--"
    And User clicks singIn Btn
    Then User should see the message "Invalid username or password." on Sign In page
    When User goes to url "https://dpc-ui.pi.dev-gcu.com/ui/productCatalogManagement/catalog"
      # Given User is on the landing page
     When User enters user name as "nora"
     And User enters password as "123"
     And User clicks singIn Btn
     Then User should see url contains "productCatalogManagement/catalog"
     Then User should see that the "nora nora" is seen on home page


 