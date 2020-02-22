/**
 * Worker related tasks
 * 
 */

 // Dependencies
const path = require('path');
const fs = require('fs');
const _data = require('./data');
const https = require('https');
const http = require('http');
const helpers = require('./helpers');
const url = require('url');
const _logs = require('./logs');
const util = require('util');
const debug = util.debuglog('workers');

// Instantiate the workder object
const workers = {};

// Lookup all the checks, get their data, send to a validator
workers.gatherAllChecks = () => {
  // Get all the checks
  _data.list('checks', (err, checks) => {
    if (!err && checks && checks.length > 0) {
      checks.forEach((check) => {
        // Read in the check data
        _data.read('checks', check, (err, originalCheckData) => {
          if (!err && originalCheckData) {
            // Pass it to the  check validator
            workers.validateCheckData(originalCheckData);
          } else {
            debug('Error reading one of the check\' data');
          }
        });
      });
    } else {
      debug('Error could not find any checks to process');
    }
  });
};

// Sanity-check the check data
workers.validateCheckData = (originalCheckData) => {
  originalCheckData = typeof originalCheckData === 'object' && originalCheckData !== null ? originalCheckData : {};
  originalCheckData.id = typeof originalCheckData.id === 'string' && originalCheckData.id.trim().length === 20 ? originalCheckData.id : false;
  originalCheckData.url = typeof originalCheckData.url === 'string' && originalCheckData.url.trim().length > 0 ? originalCheckData.url.trim() : false;
  originalCheckData.userPhone = typeof originalCheckData.userPhone === 'string' && originalCheckData.userPhone.trim().length === 10 ? originalCheckData.userPhone.trim() : false;
  originalCheckData.method = typeof originalCheckData.method === 'string' && ['post', 'get', 'put', 'delete'].includes(originalCheckData.method) ? originalCheckData.method : false;
  originalCheckData.protocol = typeof originalCheckData.protocol === 'string' && ['http', 'https'].includes(originalCheckData.protocol) ? originalCheckData.protocol : false;
  originalCheckData.successCodes = typeof originalCheckData.successCodes === 'object' && originalCheckData.successCodes instanceof Array && originalCheckData.successCodes.length > 0 ? originalCheckData.successCodes : false;
  originalCheckData.timeoutSeconds = typeof originalCheckData.timeoutSeconds === 'number' && originalCheckData.timeoutSeconds % 1 === 0 && originalCheckData.timeoutSeconds >= 1 && originalCheckData.timeoutSeconds <= 5 ? originalCheckData.timeoutSeconds : false;

  // Set the keys that may not be set (if the workers have nerver seen this check before)
  originalCheckData.state = typeof originalCheckData.state === 'string' && ['up', 'down'].includes(originalCheckData.state) ? originalCheckData.state : 'down';
  originalCheckData.lastChecked = typeof originalCheckData.lastChecked === 'number' && originalCheckData.lastChecked > 0 ? originalCheckData.lastChecked : false;

  // If all the checks pass, pass the data along to the next step in the process
  if (originalCheckData.id &&
    originalCheckData.url &&
    originalCheckData.userPhone &&
    originalCheckData.method &&
    originalCheckData.protocol && 
    originalCheckData.successCodes &&
    originalCheckData.timeoutSeconds) {
      workers.performCheck(originalCheckData);
    } else {
      debug('Error one of the checks is not properly formatted. Skipping.');
      debug(JSON.stringify(originalCheckData, null, 2));
    }
};

// Perform the check, send the originalCheckData and the outcome of the check process to the next step
workers.performCheck = (originalCheckData) => {
  // Prepare the initial check outcome
  const checkOutcome = {
    error: false,
    responseCode: false
  };

  // Mark that outcome has not been sent yet
  let outcomeSent = false;

  // Parse the hostname and the path out of the original check data
  const parsedUrl = url.parse(`${originalCheckData.protocol}://${originalCheckData.url}`, true);
  const hostname = parsedUrl.hostname;
  const path = parsedUrl.path;

  // Construct the request
  const requestDetails = {
    protocol: `${originalCheckData.protocol}:`,
    hostname,
    method: originalCheckData.method.toUpperCase(),
    path,
    timeout: originalCheckData.timeoutSeconds * 1000
  };

  // Instantiate the request object using either http or https
  const _moduleToUse = originalCheckData.protocol == 'http' ? http : https;
  const req = _moduleToUse.request(requestDetails, (res) => {
    // Grab the status
    const status = res.statusCode;

    // Update the check outcome and pass data along
    checkOutcome.responseCode = status;
    if (!outcomeSent) workers.processCheckOutcome(originalCheckData, checkOutcome);
    outcomeSent = true;
  });

  // Bind to the error event so it doesn't get thrown
  req.on('error', (e) => {
    // Update the check outcome and pass data along
    checkOutcome.error = {
      error: true,
      value: e
    };

    if (!outcomeSent) workers.processCheckOutcome(originalCheckData, checkOutcome);
  });

  // Bind to the timeout event
  req.on('timeout', (e) => {
    // Update the check outcome and pass data along
    checkOutcome.error = {
      error: true,
      value: 'timeout'
    };

    if (!outcomeSent) workers.processCheckOutcome(originalCheckData, checkOutcome);
  });

  // End the request
  req.end();
};

// Process the check outcome, update the check data as needed, trigger an alert if need
// Special logic for accomodating a check that has never been tested (don't alert)
workers.processCheckOutcome = (originalCheckData, checkOutcome) => {
  // Decide if the check is considered up or down
  const state = !checkOutcome.error && checkOutcome.responseCode && originalCheckData.successCodes.includes(checkOutcome.responseCode) ? 'up' : 'down';

  // Decide if an alert is warranted
  const alertWarranted = originalCheckData.lastChecked && originalCheckData.state !== state ? true : false;

  // Log the outcome
  const timeOfCheck = Date.now();
  workers.log(originalCheckData, checkOutcome, state, alertWarranted, timeOfCheck);

  // Update the check data
  const newCheckData = { ...originalCheckData };
  newCheckData.state = state;
  newCheckData.lastChecked = timeOfCheck;

  // Save the update
  _data.update('checks', newCheckData.id, newCheckData, (err) => {
    if (!err) {
      // Send the new check data to the next phase in the process if needed
      if (alertWarranted) {
        workers.alertUserToStatusChange(newCheckData)
      } else {
        debug('Check outcome has not changed, no alert needed');
      }
    } else {
      debug('Error trying to save updates to one of the checks');
    }
  });
};

// Alert the user as to a change in their check status
workers.alertUserToStatusChange = (newCheckData) => {
  const { method, protocol, url, state, userPhone } = newCheckData;
  const msg = `Alert: Your check for ${method.toUpperCase()} - ${protocol}://${url} is currently ${state}`;
  helpers.sendTwilioSms(userPhone, msg, (err) => {
    if (!err) {
      debug('Success: User was alerted', msg);
    } else {
      debug('Error: Could not send state change sms');
    }
  });
};

workers.log = (originalCheckData, checkOutcome, state, alertWarranted, timeOfCheck) => {
  // Form the log data
  const logData = {
    check: originalCheckData,
    outcome: checkOutcome,
    state,
    alert: alertWarranted,
    time: timeOfCheck
  };

  // Convert to string
  const logString = JSON.stringify(logData);

  // Determine log file name
  const logFileName = originalCheckData.id;

  // Append the log string to the file we want to write to
  _logs.append(logFileName, logString, (err) => {
    if (!err) {
      debug('Logging to file succeeded');
    } else {
      debug('Logging to file failed');
    }
  });
};

// Timer to execute the worker process once per minute
workers.loop = () => setInterval(() => {
  workers.gatherAllChecks();
}, 1000 * 60);

// Rotate (comrpess) the log files
workers.rotateLogs = () => {
  // List all the non compressed log files
  _logs.list(false, (err, logs) => {
    if (!err && logs && logs.length) {
      logs.forEach((logName) => {
        // Compress the data to a different file
        const logId = logName.replace('.log', '');
        const newFileId = `${logId}-${Date.now()}`;
        _logs.compress(logId, newFileId, (err) => {
          if (!err) {
            // Tuncate the log
            _logs.truncate(logId, (err) => {
              if (!err) {
                debug('Success truncating log file');
              } else {
                debug('Error truncating log file');
              }
            });
          } else {
            debug('Error compressing one of the log file', err);
          }
        });
      });
    } else {
      debug('Error could not find any logs to rotate');
    }
  });
};

// Time to execute log rotation procress once per day
workers.logRotationLoop = () => setInterval(() => {
  workers.rotateLogs();
}, 1000 * 60 * 60 * 24);

// Init script
workers.init = () => {
  // Send to console in yellow
  console.log('\x1b[33m%s\x1b[0m', 'Background workers are running');

  // Execute all the checks immediately
  workers.gatherAllChecks();

  // Call the loop so the checks will execute later on
  workers.loop();

  // Compress all logs immediately
  workers.rotateLogs();

  // Call the compress loop so logs will compressed later on
  workers.logRotationLoop();
};

// Export the module
module.exports = workers;
