/**
 * Unit Tests
 * 
 */

// Dependencies
const helpers = require('../lib/helpers');
const logs = require('../lib/logs');
const exampleDebugging = require('../lib/exampleDebugging');
const assert = require('assert');

// Holder for tests
const unit = {};

// Assert that the get a number function returns a number
unit['helpers.getANumber should return a number'] = (done) => {
  const val = helpers.getANumber();
  assert.equal(typeof val, 'number');
  done();
};

// Assert that the get a number function returns 1
unit['helpers.getANumber should return 1'] = (done) => {
  const val = helpers.getANumber();
  assert.equal(val, 1);
  done();
};

// Assert that the get a number function returns 2
unit['helpers.getANumber should return 2'] = (done) => {
  const val = helpers.getANumber();
  assert.equal(val, 2);
  done();
};

// Logs.list should callback an array and a false error
unit['logs.list should callback a false error and an array of names'] = (done) => {
  logs.list('true', (err, logFileNames) => {
    assert.equal(err, false);
    assert.ok(logFileNames instanceof Array);
    assert.ok(logFileNames.length > 0);
    done();
  });
}; 

// Logs.truncate should not trow if the log id doesn't exist
unit['logs.truncate should not throw if the log id does not exist. It should callback an error instead'] = (done) => {
  assert.doesNotThrow(() => {
    logs.truncate('does not exits', (err) => {
      assert.ok(err);
      done();
    });
  }, TypeError);
};

unit['exampleDebugging.init should not throw when called'] = (done) => {
  assert.doesNotThrow(() => {
    exampleDebugging.init();
    done();
  }, TypeError);
};

module.exports = unit;
