/**
 * Primary file for the API
 * 
 */

 // Dependencies
 const server = require('./lib/server');
 const workers = require('./lib/workers');
 const cli = require('./lib/cli');
 const exampleDebugProblem = require('./lib/exampleDebugging');

 // Declare the app
 const app = {
  // Init function
  init: () => {
    // Start the server
    debugger;
    server.init();
    debugger;

    // Start the workers
    workers.init();
    debugger;

    // Start the CLI, make sure it starts last
    setTimeout(() => {
      cli.init();
      debugger;
    }, 500);
    debugger;
  
    const foo = 1;
    console.log('1 to foo');
    debugger;

    foo++;
    console.log('Increment foo');
    debugger;

    foo = foo * foo;
    console.log('multiply foo');
    debugger;

    foo = foo.toString();
    console.log('foo to string');
    debugger;

    // Call init script that will throw
    exampleDebugProblem.init();
    console.log('called the library');
    debugger;
  },
 };

  // Execute
  app.init();

  module.exports = app;
