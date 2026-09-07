import { Given, When, Then, setWorldConstructor, World, Before, After } from '@cucumber/cucumber';

let attempts = 0;

class RetryWorld extends World {}
setWorldConstructor(RetryWorld);

Before(function () { attempts = 0; });
After(function () {});

Given('attempt counter is reset', function () {
  attempts = 0;
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
