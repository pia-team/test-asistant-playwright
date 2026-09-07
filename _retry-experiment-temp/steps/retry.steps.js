const { Given, When, Then, setWorldConstructor, World } = require('@cucumber/cucumber');

let attempts = 0;

class RetryWorld extends World {}
setWorldConstructor(RetryWorld);

Given('attempt counter is reset', function () {
  // no-op: counter carries across retries within the same scenario
});

When('I fail on first attempt', function () {
  attempts += 1;
  if (attempts === 1) {
    throw new Error('intentional failure attempt 1');
  }
});

Then('the step should pass', function () {
  // pass
});
