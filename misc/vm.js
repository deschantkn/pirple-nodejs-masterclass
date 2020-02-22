/**
 * Example VM
 * Running some arbitrary commands
 *
 */

// Dependencies
const vm = require('vm');

const context = {
  foo: 25
};

const script = new vm.Script(`
  foo = foo * 2;
  const bar = foo + 1;
  const fizz = 52;
`);

// Run the script
script.runInNewContext(context);
console.log(context);
