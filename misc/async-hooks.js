/**
 * Async hooks example
 * 
 */

//  Dependencies
const async_hooks = require('async_hooks');
const fs = require('fs');

// Target execution context
const targetExecutionContext = false;

const whatTimeIsIt = (cb) => {
  setInterval(() => {
    fs.writeSync(1, 'current execution context ' + async_hooks.executionAsyncId() + '\n');
    cb(Date.now());
  }, 1000);
};

whatTimeIsIt((time) => {
  fs.writeSync(1, 'Time is ' + time + '\n');
});

const hooks = {
  init(asyncId, type, triggerAsyncId, resource) {
    fs.writeSync(1, 'Hook init ' + asyncId + '\n');
  },
  before(asyncId) {
    fs.writeSync(1, 'Hook before ' + asyncId + '\n');
  },
  after(asyncId) {
    fs.writeSync(1, 'Hook after ' + asyncId + '\n');
  },
  destroy(asyncId) {
    fs.writeSync(1, 'Hook destroy ' + asyncId + '\n');
  },
  promiseResolve(asyncId) {
    fs.writeSync(1, 'Hook promiseResolve ' + asyncId + '\n');
  },
};

const asyncHook = async_hooks.createHook(hooks);
asyncHook.enable();
