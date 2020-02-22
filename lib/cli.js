/**
 * CLI-related Tasks
 * 
 */

// Dependencies
const readline = require('readline');
const util = require('util');
const debug = util.debuglog('cli');
const events = require('events');
const os = require('os');
const v8 = require('v8');
const _data = require('./data');
const _logs = require('./logs');
const helpers = require('./helpers');
const { spawn } = require('child_process');

class _events extends events {};
const e = new _events();

// Instantiate the CLI module object
const cli = {};

// Input handlers
e.on('man', (str) => cli.responders.help());
e.on('help', (str) => cli.responders.help());
e.on('exit', (str) => cli.responders.exit());
e.on('stats', (str) => cli.responders.stats());
e.on('list users', (str) => cli.responders.listUsers());
e.on('more user info', (str) => cli.responders.moreUserInfo(str));
e.on('list checks', (str) => cli.responders.listChecks(str));
e.on('more check info', (str) => cli.responders.moreCheckInfo(str));
e.on('list logs', (str) => cli.responders.listLogs());
e.on('more log info', (str) => cli.responders.moreLogInfo(str));

// Responders
cli.responders = {};

cli.verticalSpace = (lines) => {
  lines = typeof lines === 'number' && lines > 0 ? lines : 1;
  for (let i = 0; i < lines; i++) {
    console.log('');
  }
};

cli.horizontalLine = () => {
  // Get the available screen size
  const width = process.stdout.columns;
  let line = '';
  for (let i = 0; i < width; i++) {
    line += '-';
  }
  console.log(line);
};

// Create centered text on the screen
cli.centered = (str) => {
  str = typeof str === 'string' && str.trim().length > 0 ? str.trim() : '';

  // Get the available screen size
  const width = process.stdout.columns;

  // Calculate the left padding there should be
  const leftPadding = Math.floor((width - str.length) / 2);

  // Put the left padded spaced before the string itself
  let line = '';
  for (let i = 0; i < leftPadding; i++) {
    line += ' ';
  }
  line += str;
  console.log(line);
};

// Help / man
cli.responders.help = () => {
  const commands = {
    'exit': 'Kill the CLI (and the rest of the application)',
    'man': 'Show this help page',  
    'help': 'Alias of the "man" command',
    'stats': 'Get statistics of the underlying operating system and resource utilization',
    'list users': 'Show a list of all the registered (undeleted) users in the system',
    'more user info --{userId}': 'Show details of a specific user',
    'list checks --up --down': 'Show a list of all the active checks in the system, including their state. "--up" and "--down" are optional',
    'more check info --{checkId}': 'Show details of a specified check',
    'list logs': 'Show a list of all the log files available to be read (compressed only)',
    'more log info --{fileName}': 'Show details of a specified log file',
  };

  // Show a header for the help page that is as wide as the screen
  cli.horizontalLine();
  cli.centered('CLI MANUAL');
  cli.horizontalLine();
  cli.verticalSpace(2);

  // Show each command with its description, in white and yellow
  for (let key in commands) {
    if (commands.hasOwnProperty(key)) {
      const value = commands[key];
      let line = `\x1b[33m${key}\x1b[0m`;
      const padding = 60 - line.length;
      for (let i = 0; i < padding; i++) {
        line += ' ';
      }
      line += value;
      console.log(line);
      cli.verticalSpace();
    }
  }

  cli.verticalSpace(1);

  // End with another horizontal line
  cli.horizontalLine();
};

// Exit
cli.responders.exit = () => process.exit(0);

// Stats
cli.responders.stats = () => {
  // Compile an object of stats
  const stats = {
    'Load Average': os.loadavg().join(' '),
    'CPU Count': os.cpus().length,
    'Free Memory': os.freemem(),
    'Current Malloced Memory': v8.getHeapStatistics().malloced_memory,
    'Peak Malloced Memory': v8.getHeapStatistics().peak_malloced_memory,
    'Allocated Head Used (%)': Math.round((v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size ) * 100),
    'Available Head Allocated (%)': Math.round((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit ) * 100),
    'Uptime': os.uptime() + ' seconds'
  };

  // Create a header for the stats
  cli.horizontalLine();
  cli.centered('SYSTEM STATISTICS');
  cli.horizontalLine();
  cli.verticalSpace(2);

  // Show each command with its description, in white and yellow
  for (let key in stats) {
    if (stats.hasOwnProperty(key)) {
      const value = stats[key];
      let line = `\x1b[33m${key}\x1b[0m`;
      const padding = 60 - line.length;
      for (let i = 0; i < padding; i++) {
        line += ' ';
      }
      line += value;
      console.log(line);
      cli.verticalSpace();
    }
  }

  cli.verticalSpace(1);

  // End with another horizontal line
  cli.horizontalLine();
}

// List users
cli.responders.listUsers = () => {
  _data.list('users', (err, userIds) => {
    if (!err && userIds && userIds.length > 0) {
      cli.verticalSpace();
      userIds.forEach((userId) => {
        _data.read('users', userId, (err, userData) => {
          if (!err && userData) {
            let line = `Name: ${userData.firstName} ${userData.lastName} Phone: ${userData.phone} Checks: `;
            const noOfChecks = typeof userData.checks === 'object' && userData.checks instanceof Array && userData.checks.length > 0 ? userData.checks.length : 0;
            line += noOfChecks;
            console.log(line);
            cli.verticalSpace();
          }
        });
      });
    }
  });
}

// More user info
cli.responders.moreUserInfo = (str) => {
  // Get the ID from the string
  const arr = str.split('--');
  const userId = typeof arr[1] === 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
  if (userId) {
    // Lookup the user
    _data.read('users', userId, (err, userData) => {
      if (!err && userData) {
        // Remove the hashed password
        delete userData.hashedPassword;

        // Print JSON with text highlighted
        cli.verticalSpace();
        console.dir(userData, { colors: true });
        cli.verticalSpace();
      }
    });
  }
};

// List checks
cli.responders.listChecks = (str) => {
  _data.list('checks', (err, checkIds) => {
    if (!err && checkIds && checkIds.length > 0) {
      cli.verticalSpace();
      checkIds.forEach((checkId) => {
        _data.read('checks', checkId, (err, checkData) => {
          let includeCheck = false;
          const lowerString = str.toLowerCase();

          const state = typeof checkData.state === 'string' ? checkData.state : 'down';
          const stateOrUnknown = typeof checkData.state === 'string' ? checkData.state : 'unknown';

          if (lowerString.includes(`--${state}`) || (!lowerString.includes('--up') && !lowerString.includes('--down'))) {
            let line = `ID: ${checkData.id} ${checkData.method.toUpperCase()} ${checkData.protocol}://${checkData.url} ${stateOrUnknown}`;
            console.log(line);
            cli.verticalSpace();
          }
        });
      });
    }
  });
};

// More check info
cli.responders.moreCheckInfo = (str) => {
  // Get the ID from the string
  const arr = str.split('--');
  const checkId = typeof arr[1] === 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
  if (checkId) {
    // Lookup the user
    _data.read('checks', checkId, (err, checkData) => {
      if (!err && checkData) {
        // Print JSON with text highlighted
        cli.verticalSpace();
        console.dir(checkData, { colors: true });
        cli.verticalSpace();
      }
    });
  }
};

// List logs
cli.responders.listLogs = (str) => {
  const ls = spawn('ls', ['./.logs/']);
  ls.stdout.on('data', (dataObj) => {
    const dataStr = dataObj.toString();
    const logFilesNames = dataStr.split('\n');
    cli.verticalSpace();
    logFilesNames.forEach(logFileName => {
      console.log(logFileName);
      if (logFileName.includes('-')) {
        console.log(logFileName.trim().split('.')[0]);
        cli.verticalSpace();
      }
    });
  });
};

// More log info
cli.responders.moreLogInfo = (str) => {
  // Get the logFileName from the string
  const arr = str.split('--');
  const logFileName = typeof arr[1] === 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
  if (logFileName) {
    cli.verticalSpace();
    // Decompress the log file
    _logs.decompress(logFileName, (err, strData) => {
      if (!err && strData) {
        // Split into lines
        let arr = strData.split('\n');
        arr.forEach((jsonString) => {
          const logObject = helpers.parseJsonToObj(jsonString);
          if (logObject && JSON.stringify(logObject) !== '{}') {
            console.dir(logObject, { colors: true });
            cli.verticalSpace();
          }
        });
      }
    });
  }
};

// Input processor
cli.processInput = (str) => {
  str = typeof str === 'string' && str.trim().length > 0 ? str.trim() : false;
  
  // Only process if user actually wrote something
  if (str) {
    // Mapping unique strings to allowed questions
    const uniqueInputs = [
      'man',
      'help',
      'exit',
      'stats',
      'list users',
      'more user info',
      'list checks',
      'more check info',
      'list logs',
      'more log info'
    ];

    // Go through the possible inputs and emit an event when a match is found
    let matchFound = false;
    let counter = 0;
    uniqueInputs.some((input) => {
      if (str.toLowerCase().includes(input)) {
        matchFound = true;

        // Emit an event matching the unique input, and include the full string given
        e.emit(input, str);
        return true;
      }
    });

    // If no match is found tell the user to try again
    if (!matchFound) console.log('Sorry, try again');
  }
};

cli.init = () => {
  // Send the start message to the console in dark blue
  console.log('\x1b[34m%s\x1b[0m', 'The CLI is running');

  // Start the interface
  const _interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: ''
  });

  // Create an initial prompt
  _interface.prompt();

  // Handle each line of input seperately
  _interface.on('line', (str) => cli.processInput(str));

  // Re-initialize the prompt afterwards
  _interface.prompt(true);

  // If the user stops th cli, kill the associate process
  _interface.on('close', () => process.exit(0));
};

// Export the module
module.exports = cli;
