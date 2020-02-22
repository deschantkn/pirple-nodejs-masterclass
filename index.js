/**
 * Primary file for the API
 * 
 */

 // Dependencies
 const server = require('./lib/server');
 const workers = require('./lib/workers');
 const cli = require('./lib/cli');

 // Declare the app
 const app = {
  // Init function
  init: (callback) => {
    // Start the server
    server.init();

    // Start the workers
    workers.init();

    // Start the CLI, make sure it starts last
    setTimeout(() => {
      cli.init();
      callback();
    }, 500);
  },
 };

  // Self invoking only if required directly
  if (require.main === module) app.init(() => {});
  
  module.exports = app;
