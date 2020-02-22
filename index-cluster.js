/**
 * Primary file for the API
 * 
 */

 // Dependencies
 const server = require('./lib/server');
 const workers = require('./lib/workers');
 const cli = require('./lib/cli');
 const cluster = require('cluster');
 const os = require('os');

 // Declare the app
 const app = {
  // Init function
  init: (callback) => {
    // If we are on the master thread, start the workers and cli
    if (cluster.isMaster) {
      // Start the workers
      workers.init();

      // Start the CLI, make sure it starts last
      setTimeout(() => {
        cli.init();
        callback();
      }, 500);

      // Fork the process
      for (let i = 0; i < os.cpus().length; i++) {
        cluster.fork();
      }
    } else {
      // If we are not on the master thread, start the http server
      server.init();
    }
  },
 };

  // Self invoking only if required directly
  if (require.main === module) app.init(() => {});
  
  module.exports = app;
