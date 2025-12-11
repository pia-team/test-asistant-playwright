Feature: Controling The Existing Customer



  @ui @smoke @BLOCKER @validLogin @wip @try

  Scenario: Customer checking

     Given User is on the landing page

    # When User goes to url "https://dcm-ui.pi.dev-gcu.com/customer360"

    # When User enters username as "nora"

    # And User enters password  "1234"

    When User enters user name as "nora"

    And User enters password as "1234"

    And User clicks singIn Btn

    And User clicks the searching type dropdown

    And User select the "Customer Name" option from dropdown

    And User enters the name as "OFYETIM PIDEV" intoinput field
    
     And User  slicks the search icon

    And User clicks the option from the list

    And User cliks the logout dropdown button

    And User logs out from main page
