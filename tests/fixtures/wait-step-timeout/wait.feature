Feature: Wait step cucumber timeout

  Scenario: explicit step timeout covers a 3 second wait
    When I pause three seconds with an explicit timeout

  Scenario: default timeout still stops a long step
    When I pause three seconds on the default timeout
