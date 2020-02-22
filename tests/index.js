/**
 * Test runner
 * 
 */

// Override the NODE_ENV variable
process.env.NODE_ENV = 'testing';

// Test runner application logic
_app = {};

// Container for the tests
_app.tests = {};

// Add unit tests a dependency
_app.tests.unit = require('./unit');
_app.tests.api = require('./api');

_app.countTests = () => {
  let counter = 0;
  for (let key in _app.tests) {
    if (_app.tests.hasOwnProperty(key)) {
      const subTests = _app.tests[key];
      for (let testName in subTests) {
        if (subTests.hasOwnProperty(testName)) {
          counter++;
        }
      }
    }
  }
  return counter;
};

_app.produceTestReport = (limit, successes, errors) => {
  console.log('');
  console.log('================= BEGIN TEST REPORT =================');
  console.log('');
  console.log('Total tests: ', limit);
  console.log('Pass: ', successes);
  console.log('Fail: ', errors.length);
  console.log('');

  // if there are error print them in details
  if (errors.length > 0) {
    console.log('================= BEGIN ERROR DETAILS =================');
    errors.forEach(error => {
      console.log('\x1b[31m%s\x1b[0m', error.name);
      console.log(error.error);
      console.log('');
    });
    console.log('================= END ERROR DETAILS =================');
  }

  console.log('');
  console.log('================= END TEST REPORT =================');
  process.exit(0);
};

_app.runTests = () => {
  const errors = [];
  let successes = 0;
  const limit = _app.countTests();
  let counter = 0;

  for (let key in _app.tests) {
    if (_app.tests.hasOwnProperty(key)) {
      const subTests = _app.tests[key];
      for (let testName in subTests) {
        if (subTests.hasOwnProperty(testName)) {
          (() => {
            let tempTestName = testName;
            let testValue = subTests[testName];
            // Call the test
            try {
              testValue(() => {
                // if it calls back then it succeeded. log it in green
                console.log('\x1b[32m%s\x1b[0m', tempTestName);
                counter++;
                successes++;
                if (counter === limit) {
                  _app.produceTestReport(limit, successes, errors);
                }
              });
            } catch (error) {
               // if it throws then it failed. capture and log in red
              errors.push({
                name: testName,
                error
              });
              console.log('\x1b[31m%s\x1b[0m', tempTestName);
              counter++;
              if (counter === limit) {
                _app.produceTestReport(limit, successes, errors);
              }
            }
          })();
        }
      }
    }
  }
};

// Run the tests
_app.runTests();
