/**
 * Request handlers
 *
 */

// Dependencies
const _data = require('../lib/data');
const helpers = require('./helpers');
const config = require('./config');
const _url = require('url');
const dns = require('dns');
const { performance, PerformanceObserver } = require('perf_hooks');
const util = require('util');
const debug = util.debuglog('performance');

 // Log out all the measurements
 const obs = new PerformanceObserver((items, observer) => {
  items.getEntries().forEach(item => debug('\x1b[33m%s\x1b[0m', `${item.name}: ${item.duration}`));
});
obs.observe({ entryTypes: ['measure'] });

// Define the handlers
const handlers = {
  /**
   * HTML Handlers
   *
   */
  index: (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
      // Prepare data for interpolation
      var templateData = {
        'head.title': 'Uptime Monitoring - Made Simple',
        'head.description':
          "We offer free, simple uptime monitoring for HTTP/HTTPS sites all kinds. When your site goes down, we'll send you a text to let you know",
        'body.class': 'index'
      };
      // Read in a template as a string
      helpers.getTemplate('index', templateData, (err, str) => {
        if (!err && str) {
          // Add the universal header and footer
          helpers.addUniversalTemplates(str, templateData, (err, str) => {
            if (!err && str) {
              // Return that page as HTML
              callback(200, str, 'html');
            } else {
              callback(500, undefined, 'html');
            }
          });
        } else {
          callback(500, undefined, 'html');
        }
      });
    } else {
      callback(405, undefined, 'html');
    }
  },

  accountCreate: (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
      // Prepare data for interpolation
      const templateData = {
        'head.title': 'Create an Account',
        'head.description': 'Signup is easy and only takes a few seconds.',
        'body.class': 'accountCreate'
      };

      // Read in a template as a string
      helpers.getTemplate('accountCreate', templateData, (err, str) => {
        if (!err && str) {
          // Add the universal header and footer
          helpers.addUniversalTemplates(str, templateData, (err, str) => {
            if (!err && str) {
              // Return that page as HTML
              callback(200, str, 'html');
            } else {
              callback(500, undefined, 'html');
            }
          });
        } else {
          callback(500, undefined, 'html');
        }
      });
    } else {
      callback(405, undefined, 'html');
    }
  },

  // Create New Session
  sessionCreate: (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method === 'get') {
      // Prepare data for interpolation
      const templateData = {
        'head.title': 'Login to your account.',
        'head.description':
          'Please enter your phone number and password to access your account.',
        'body.class': 'sessionCreate'
      };

      // Read in a template as a string
      helpers.getTemplate('sessionCreate', templateData, (err, str) => {
        if (!err && str) {
          // Add the universal header and footer
          helpers.addUniversalTemplates(str, templateData, (err, str) => {
            if (!err && str) {
              // Return that page as HTML
              callback(200, str, 'html');
            } else {
              callback(500, undefined, 'html');
            }
          });
        } else {
          callback(500, undefined, 'html');
        }
      });
    } else {
      callback(405, undefined, 'html');
    }
  },

  // Session has been deleted
  sessionDeleted: (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method === 'get') {
      // Prepare data for interpolation
      var templateData = {
        'head.title': 'Logged Out',
        'head.description': 'You have been logged out of your account.',
        'body.class': 'sessionDeleted'
      };
      // Read in a template as a string
      helpers.getTemplate('sessionDeleted', templateData, (err, str) => {
        if (!err && str) {
          // Add the universal header and footer
          helpers.addUniversalTemplates(str, templateData, (err, str) => {
            if (!err && str) {
              // Return that page as HTML
              callback(200, str, 'html');
            } else {
              callback(500, undefined, 'html');
            }
          });
        } else {
          callback(500, undefined, 'html');
        }
      });
    } else {
      callback(405, undefined, 'html');
    }
  },

  // Account has been deleted
  accountDeleted: (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
      // Prepare data for interpolation
      var templateData = {
        'head.title': 'Account Deleted',
        'head.description': 'Your account has been deleted.',
        'body.class': 'accountDeleted'
      };
      // Read in a template as a string
      helpers.getTemplate('accountDeleted', templateData, (err, str) => {
        if (!err && str) {
          // Add the universal header and footer
          helpers.addUniversalTemplates(str, templateData, (err, str) => {
            if (!err && str) {
              // Return that page as HTML
              callback(200, str, 'html');
            } else {
              callback(500, undefined, 'html');
            }
          });
        } else {
          callback(500, undefined, 'html');
        }
      });
    } else {
      callback(405, undefined, 'html');
    }
  },

  // Create a new check
  checksCreate: (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
      // Prepare data for interpolation
      var templateData = {
        'head.title': 'Create a New Check',
        'body.class': 'checksCreate'
      };
      // Read in a template as a string
      helpers.getTemplate('checksCreate', templateData, (err, str) => {
        if (!err && str) {
          // Add the universal header and footer
          helpers.addUniversalTemplates(str, templateData, (err, str) => {
            if (!err && str) {
              // Return that page as HTML
              callback(200, str, 'html');
            } else {
              callback(500, undefined, 'html');
            }
          });
        } else {
          callback(500, undefined, 'html');
        }
      });
    } else {
      callback(405, undefined, 'html');
    }
  },

  // Edit Your Account
  accountEdit: (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
      // Prepare data for interpolation
      var templateData = {
        'head.title': 'Account Settings',
        'body.class': 'accountEdit'
      };
      // Read in a template as a string
      helpers.getTemplate('accountEdit', templateData, (err, str) => {
        if (!err && str) {
          // Add the universal header and footer
          helpers.addUniversalTemplates(str, templateData, (err, str) => {
            if (!err && str) {
              // Return that page as HTML
              callback(200, str, 'html');
            } else {
              callback(500, undefined, 'html');
            }
          });
        } else {
          callback(500, undefined, 'html');
        }
      });
    } else {
      callback(405, undefined, 'html');
    }
  },

  // Dashboard (view all checks)
  checksList: (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
      // Prepare data for interpolation
      var templateData = {
        'head.title': 'Dashboard',
        'body.class': 'checksList'
      };
      // Read in a template as a string
      helpers.getTemplate('checksList', templateData, (err, str) => {
        if (!err && str) {
          // Add the universal header and footer
          helpers.addUniversalTemplates(str, templateData, (err, str) => {
            if (!err && str) {
              // Return that page as HTML
              callback(200, str, 'html');
            } else {
              callback(500, undefined, 'html');
            }
          });
        } else {
          callback(500, undefined, 'html');
        }
      });
    } else {
      callback(405, undefined, 'html');
    }
  },

  // Edit a Check
  checksEdit: (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
      // Prepare data for interpolation
      var templateData = {
        'head.title': 'Check Details',
        'body.class': 'checksEdit'
      };
      // Read in a template as a string
      helpers.getTemplate('checksEdit', templateData, (err, str) => {
        if (!err && str) {
          // Add the universal header and footer
          helpers.addUniversalTemplates(str, templateData, (err, str) => {
            if (!err && str) {
              // Return that page as HTML
              callback(200, str, 'html');
            } else {
              callback(500, undefined, 'html');
            }
          });
        } else {
          callback(500, undefined, 'html');
        }
      });
    } else {
      callback(405, undefined, 'html');
    }
  },

  favicon: (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
      // Read in the favicon's data
      helpers.getStaticAsset('favicon.ico', (err, data) => {
        if (!err && data) {
          // Callback the data
          callback(200, data, 'favicon');
        } else {
          callback(500);
        }
      });
    } else {
      callback(405);
    }
  },

  // Public assets
  public: (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
      // Get the filename being requested
      const trimmedAssetName = data.trimmedPath.replace('public/', '').trim();

      if (trimmedAssetName.length > 0) {
        // Read in the asset's data
        helpers.getStaticAsset(trimmedAssetName, (err, data) => {
          if (!err && data) {
            // Determine the content type (default to plain text)
            let contentType = 'plain';

            if (trimmedAssetName.indexOf('.css') > -1) contentType = 'css';

            if (trimmedAssetName.indexOf('.png') > -1) contentType = 'png';

            if (trimmedAssetName.indexOf('.jpg') > -1) contentType = 'jpg';

            if (trimmedAssetName.indexOf('.ico') > -1) contentType = 'favicon';

            // Callback the data
            callback(200, data, contentType);
          } else {
            callback(404);
          }
        });
      } else {
        callback(404);
      }
    } else {
      callback(405);
    }
  },

  /**
   * JSON API Handlers
   *
   */

  // Example error
  exampleError: (data, callback) => {
    const error = new Error('This is an example error');
    throw error;
  },

  // Users
  users: (data, callback) => {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.includes(data.method)) {
      handlers._users[data.method](data, callback);
    } else {
      callback(405);
    }
  },

  // Container for the users submethods
  _users: {
    /**
     * Required data: firstName, lastName, phone, password, tosAgreement
     * Optional data: none
     *
     */
    post: (data, callback) => {
      const { payload } = data;
      // Check that all required fields are provided
      const firstName =
        typeof payload.firstName === 'string' &&
        payload.firstName.trim().length > 0
          ? payload.firstName.trim()
          : false;
      const lastName =
        typeof payload.lastName === 'string' &&
        payload.lastName.trim().length > 0
          ? payload.lastName.trim()
          : false;
      const phone =
        typeof payload.phone === 'string' && payload.phone.trim().length === 10
          ? payload.phone.trim()
          : false;
      const password =
        typeof payload.password === 'string' &&
        payload.password.trim().length > 0
          ? payload.password.trim()
          : false;
      const tosAgreement =
        typeof payload.tosAgreement === 'boolean' &&
        payload.tosAgreement === true
          ? true
          : false;

      if (firstName && lastName && phone && password && tosAgreement) {
        // Make sure that the user doesn't already exist
        _data.read('users', phone, (err, data) => {
          if (err) {
            // Hash the password
            const hashedPassword = helpers.hash(password);

            // Create the user object
            if (hashedPassword) {
              const userObj = {
                firstName,
                lastName,
                phone,
                hashedPassword,
                tosAgreement: true
              };

              // Store the user
              _data.create('users', phone, userObj, err => {
                if (!err) {
                  callback(200);
                } else {
                  console.log(err);
                  callback(500, { error: 'Could not create the new user' });
                }
              });
            } else {
              callback(500, { error: "Could not hash the user's password" });
            }
          } else {
            // User alread exists
            callback(400, {
              error: 'A user with that phone number already exists'
            });
          }
        });
      } else {
        callback(400, { error: 'Missing required fields' });
      }
    },

    /**
     * Required data: phone
     * Optional data: none
     *
     */
    get: (data, callback) => {
      const { queryStringObject, headers } = data;
      // Check that the phone number is valid
      const phone =
        typeof queryStringObject.phone === 'string' &&
        queryStringObject.phone.trim().length === 10
          ? queryStringObject.phone.trim()
          : false;
      if (phone) {
        // Get the token from the headers
        const token = typeof headers.token === 'string' ? headers.token : false;

        //Verify that the given token is valid for the phone number
        handlers._tokens.verifyToken(token, phone, tokenIsValid => {
          if (tokenIsValid) {
            // Lookup the user
            _data.read('users', phone, (err, data) => {
              if (!err && data) {
                // Remove the hashed password from the user object before returning
                delete data.hashedPassword;
                callback(200, data);
              } else {
                callback(404);
              }
            });
          } else {
            callback(403, { error: 'Missing or invalid token in header' });
          }
        });
      } else {
        callback(400, { error: 'Missing required field' });
      }
    },

    /**
     * Required data: phone
     * Optional data: firstName, lastName, phone, password (at least one must be specified)
     *
     */
    put: (data, callback) => {
      const { payload, headers } = data;

      // Check for the required field
      const phone =
        typeof payload.phone === 'string' && payload.phone.trim().length === 10
          ? payload.phone.trim()
          : false;

      // Check for the optional field
      const firstName =
        typeof payload.firstName === 'string' &&
        payload.firstName.trim().length > 0
          ? payload.firstName.trim()
          : false;
      const lastName =
        typeof payload.lastName === 'string' &&
        payload.lastName.trim().length > 0
          ? payload.lastName.trim()
          : false;
      const password =
        typeof payload.password === 'string' &&
        payload.password.trim().length > 0
          ? payload.password.trim()
          : false;

      // Error if the phone is invalid
      if (phone) {
        // Error if nothing is sent to update
        if (firstName || lastName || password) {
          // Get the token from the headers
          const token =
            typeof headers.token === 'string' ? headers.token : false;

          //Verify that the given token is valid for the phone number
          handlers._tokens.verifyToken(token, phone, tokenIsValid => {
            if (tokenIsValid) {
              // Lookup the user
              _data.read('users', phone, (err, userData) => {
                if (!err && userData) {
                  // Update the necessary fields
                  if (firstName) {
                    userData.firstName = firstName;
                  }
                  if (lastName) {
                    userData.lastName = lastName;
                  }
                  if (password) {
                    userData.hashedPassword = helpers.hash(password);
                  }
                  // Store the new updates
                  _data.update('users', phone, userData, err => {
                    if (!err) {
                      callback(200);
                    } else {
                      console.log(err);
                      callback(500, { error: 'Could not update the user' });
                    }
                  });
                } else {
                  callback(400, { error: 'The specified user does not exist' });
                }
              });
            } else {
              callback(403, { error: 'Missing or invalid token in header' });
            }
          });
        } else {
          callback(400, { error: 'Missing field(s) to update' });
        }
      } else {
        callback(400, { error: 'Missing required field' });
      }
    },

    /**
     * Users - delete
     * Required field: phone
     * Optional data: none
     */
    delete: (data, callback) => {
      // Check that the phone number is valid
      const { queryStringObject, headers } = data;
      // Check that the phone number is valid
      const phone =
        typeof queryStringObject.phone === 'string' &&
        queryStringObject.phone.trim().length === 10
          ? queryStringObject.phone.trim()
          : false;

      if (phone) {
        // Get the token from the headers
        const token = typeof headers.token === 'string' ? headers.token : false;

        //Verify that the given token is valid for the phone number
        handlers._tokens.verifyToken(token, phone, tokenIsValid => {
          if (tokenIsValid) {
            // Lookup the user
            _data.read('users', phone, (err, userData) => {
              if (!err && userData) {
                _data.delete('users', phone, err => {
                  if (!err) {
                    // Delete each of the checks associated with the user
                    const userChecks =
                      typeof userData.checks === 'object' &&
                      userData.checks instanceof Array
                        ? userData.checks
                        : [];
                    const checksToDelete = userChecks.length;
                    if (checksToDelete > 0) {
                      let checksDeleted = 0;
                      let deletionErrors = false;
                      // Loop throgh the checks
                      userChecks.forEach(checkId => {
                        // Delete the check
                        _data.delete('checks', checkId, err => {
                          if (err) {
                            deletionErrors = true;
                          } else {
                            checksDeleted += 1;
                            if (checksDeleted === checksToDelete) {
                              if (!deletionErrors) {
                                callback(200);
                              } else {
                                callback(500, {
                                  error:
                                    "Deletion errors occurred. All the users' checks may not have been deleted"
                                });
                              }
                            }
                          }
                        });
                      });
                    } else {
                      callback(200);
                    }
                  } else {
                    callback(500, {
                      error: 'Cound not delete the specified user'
                    });
                  }
                });
              } else {
                callback(400, { error: 'Could not find the specified user' });
              }
            });
          } else {
            callback(403, { error: 'Missing or invalid token in header' });
          }
        });
      } else {
        callback(400, { error: 'Missing required field' });
      }
    }
  },

  // Tokens
  tokens: (data, callback) => {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.includes(data.method)) {
      handlers._tokens[data.method](data, callback);
    } else {
      callback(405);
    }
  },

  // Container for all the tokens submethods
  _tokens: {
    /**
     * Required data: phone, password
     * Optional data: none
     */
    post: (data, callback) => {
      performance.mark('entered function');
      const { payload } = data;
      const phone =
        typeof payload.phone === 'string' && payload.phone.trim().length === 10
          ? payload.phone.trim()
          : false;
      const password =
        typeof payload.password === 'string' &&
        payload.password.trim().length > 0
          ? payload.password.trim()
          : false;
      performance.mark('inputs validated');
      if (phone && password) {
        // Lookup user with matching phone number
        performance.mark('beginning user lookup');
        _data.read('users', phone, (err, userData) => {
          performance.mark('user lookup complete');
          if (!err && userData) {
            // Has the sent password and compare to the password stored in the user object
            performance.mark('beginning password hashing');
            const hashedPassword = helpers.hash(password);
            performance.mark('password hashing complete');
            if (hashedPassword === userData.hashedPassword) {
              // Create a new token with a random name. Set expiration date 1 hour in the future
              performance.mark('creating token data');
              const tokenId = helpers.createRandomString(20);
              const expires = Date.now() + 1000 * 60 * 60;
              const tokenObj = {
                phone,
                expires,
                id: tokenId
              };

              // Store the token
              performance.mark('beginning token storage');
              _data.create('tokens', tokenId, tokenObj, err => {
                performance.mark('storing token complete');

                // Gather all measurements
                performance.measure('Beginning to end', 'entered function', 'storing token complete');
                performance.measure('Validating user inputs', 'entered function', 'inputs validated');
                performance.measure('User look up', 'beginning user lookup', 'user lookup complete');
                performance.measure('Password Hashing', 'beginning password hashing', 'password hashing complete');
                performance.measure('Token data creation', 'creating token data', 'beginning token storage');
                performance.measure('Token data storing', 'beginning token storage', 'storing token complete');

                if (!err) {
                  callback(200, tokenObj);
                } else {
                  callback(500, { error: 'Could not create the new token' });
                }
              });
            } else {
              callback(400, {
                error: 'Password does not match the stored password'
              });
            }
          } else {
            callback(400, { error: 'Could not find the specified user' });
          }
        });
      } else {
        callback(400, { error: 'Missing required fields' });
      }
    },

    /**
     * Required data: id
     * Optional data: none
     */
    get: (data, callback) => {
      const { queryStringObject } = data;
      // Check that the phone number is valid
      const id =
        typeof queryStringObject.id === 'string' &&
        queryStringObject.id.trim().length === 20
          ? queryStringObject.id.trim()
          : false;
      if (id) {
        // Lookup token
        _data.read('tokens', id, (err, tokenData) => {
          if (!err && tokenData) {
            callback(200, tokenData);
          } else {
            callback(404);
          }
        });
      } else {
        callback(400, { error: 'Missing or invalid required fields' });
      }
    },

    /**
     * Required data: id, extend
     * Optional: none
     *
     */
    put: (data, callback) => {
      const { payload } = data;
      const id =
        typeof payload.id === 'string' && payload.id.trim().length === 20
          ? payload.id.trim()
          : false;
      const extend =
        typeof payload.extend === 'boolean' && payload.extend === true
          ? true
          : false;

      if (id && extend) {
        // Lookup the token
        _data.read('tokens', id, (err, tokenData) => {
          if (!err && tokenData) {
            // Check to make sure the token isn't already expired
            if (tokenData.expires > Date.now()) {
              // Set expiration an hour from now
              tokenData.expires = Date.now() + 1000 * 60 * 60;

              // Store the new update
              _data.update('tokens', id, tokenData, err => {
                if (!err) {
                  callback(200);
                } else {
                  callback(500, {
                    error: "Could not update the token's expiration"
                  });
                }
              });
            } else {
              callback(400, {
                error: 'The token has already expired and cannot be extended'
              });
            }
          } else {
            callback(400, { error: 'Token does not exists' });
          }
        });
      } else {
        callback(400, { error: 'Missing or invalid required fields' });
      }
    },

    /**
     * Required data: id
     * Optional data: none
     *
     */
    delete: (data, callback) => {
      const { queryStringObject } = data;
      // Check that the id is valid
      const id =
        typeof queryStringObject.id === 'string' &&
        queryStringObject.id.trim().length === 20
          ? queryStringObject.id.trim()
          : false;
      if (id) {
        // Lookup the token
        _data.read('tokens', id, (err, data) => {
          if (!err && data) {
            _data.delete('tokens', id, err => {
              if (!err) {
                callback(200);
              } else {
                callback(500, {
                  error: 'Cound not delete the specified token'
                });
              }
            });
          } else {
            callback(400, { error: 'Could not find the specified token' });
          }
        });
      } else {
        callback(400, { error: 'Missing or invalid required field' });
      }
    },

    /**
     * Verify if a given token id is currently valid for a given user
     *
     */
    verifyToken: (id, phone, callback) => {
      // Lookup the token
      _data.read('tokens', id, (err, tokenData) => {
        if (!err && tokenData) {
          // Check that the token is for the given user and has no expired
          if (tokenData.phone === phone && tokenData.expires > Date.now()) {
            callback(true);
          } else {
            callback(false);
          }
        } else {
          callback(false);
        }
      });
    }
  },

  // Checks
  checks: (data, callback) => {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.includes(data.method)) {
      handlers._checks[data.method](data, callback);
    } else {
      callback(405);
    }
  },

  // Container for all the checks submethods
  _checks: {
    /**
     * Checks - post
     * Required data: protocol, url, method, successCodes, timeoutSeconds
     * Optional data: none
     */
    post: (data, callback) => {
      const { payload, headers } = data;
      // Validate inputs
      const protocol =
        typeof payload.protocol === 'string' &&
        ['http', 'https'].includes(payload.protocol)
          ? payload.protocol
          : false;
      const url =
        typeof payload.url === 'string' && payload.url.trim().length > 0
          ? payload.url.trim()
          : false;
      const method =
        typeof payload.method === 'string' &&
        ['post', 'get', 'put', 'delete'].includes(payload.method)
          ? payload.method
          : false;
      const successCodes =
        typeof payload.successCodes === 'object' &&
        payload.successCodes instanceof Array &&
        payload.successCodes.length > 0
          ? payload.successCodes
          : false;
      const timeoutSeconds =
        typeof payload.timeoutSeconds === 'number' &&
        payload.timeoutSeconds % 1 === 0 &&
        payload.timeoutSeconds >= 1 &&
        payload.timeoutSeconds <= 5
          ? payload.timeoutSeconds
          : false;

      if (protocol && url && method && successCodes && timeoutSeconds) {
        // Get token from the headers
        const token = typeof headers.token === 'string' ? headers.token : false;

        // Lookup the user by reading the token
        _data.read('tokens', token, (err, tokenData) => {
          if (!err && tokenData) {
            const userPhone = tokenData.phone;

            // Lookup the user data
            _data.read('users', userPhone, (err, userData) => {
              if (!err && userData) {
                const userChecks =
                  typeof userData.checks === 'object' &&
                  userData.checks instanceof Array
                    ? userData.checks
                    : [];
                // Verify user submitted the right number of checks
                if (userChecks.length < config.maxChecks) {
                  // Create a random check id
                  const checkId = helpers.createRandomString(20);

                  // Verify that the URL has DNS entries and therefore can resolve
                  const parsedUrl = _url.parse(`${protocol}://${url}`, true);
                  const hostName = typeof parsedUrl.hostname === 'string' && parsedUrl.hostname.length > 0 ? parsedUrl.hostname : false;
                  dns.resolve(hostName, (err, dnsRecords) => {
                    if (!err && dnsRecords) {
                      // Create the check object, and include the user's phone
                      const checkObj = {
                        id: checkId,
                        userPhone,
                        protocol,
                        url,
                        method,
                        successCodes,
                        timeoutSeconds
                      };

                      // Save the object
                      _data.create('checks', checkId, checkObj, err => {
                        if (!err) {
                          // Add the checkId to the users object
                          userData.checks = userChecks;
                          userData.checks.push(checkId);

                          // Save the new user data
                          _data.update('users', userPhone, userData, err => {
                            if (!err) {
                              // Returm data about the new check
                              callback(200, checkObj);
                            } else {
                              callback(500, {
                                error:
                                  'Could not update the user with the new check'
                              });
                            }
                          });
                        } else {
                          callback(500, {
                            error: 'Could not create the new check'
                          });
                        }
                      });
                    } else {
                      callback(400, { error: 'The hostname did not resolve to any DNS entries' });
                    }
                  });
                } else {
                  callback(400, {
                    error: `You have exceeded the allowed ${config.maxChecks} checks`
                  });
                }
              } else {
                callback(403);
              }
            });
          } else {
            callback(403);
          }
        });
      } else {
        callback(400, { error: 'Missing or invalid inputs' });
      }
    },

    /**
     * Checks - get
     * Required data: id
     * Optional data: none
     */
    get: (data, callback) => {
      const { queryStringObject, headers } = data;
      // Check that the phone number is valid
      const id =
        typeof queryStringObject.id === 'string' &&
        queryStringObject.id.trim().length === 20
          ? queryStringObject.id.trim()
          : false;
      if (id) {
        // Lookup the check
        _data.read('checks', id, (err, checkData) => {
          if (!err && checkData) {
            // Get the token from the headers
            const token =
              typeof headers.token === 'string' ? headers.token : false;

            //Verify that the given token is valid and belongs to the user who created the check
            handlers._tokens.verifyToken(
              token,
              checkData.userPhone,
              tokenIsValid => {
                if (tokenIsValid) {
                  // Return the check data
                  callback(200, checkData);
                } else {
                  callback(403);
                }
              }
            );
          } else {
            callback(404);
          }
        });
      } else {
        callback(400, { error: 'Missing required field' });
      }
    },

    /**
     * Checks - put
     * Required data: id
     * Optional data: protocol, url, method, successCodes, timeoutSeconds (at least one must be sent)
     */
    put: (data, callback) => {
      const { payload, headers } = data;

      // Check for the required field
      const id =
        typeof payload.id === 'string' && payload.id.trim().length === 20
          ? payload.id.trim()
          : false;

      // Validate inputs
      const protocol =
        typeof payload.protocol === 'string' &&
        ['http', 'https'].includes(payload.protocol)
          ? payload.protocol
          : false;
      const url =
        typeof payload.url === 'string' && payload.url.trim().length > 0
          ? payload.url.trim()
          : false;
      const method =
        typeof payload.method === 'string' &&
        ['post', 'get', 'put', 'delete'].includes(payload.method)
          ? payload.method
          : false;
      const successCodes =
        typeof payload.successCodes === 'object' &&
        payload.successCodes instanceof Array &&
        payload.successCodes.length > 0
          ? payload.successCodes
          : false;
      const timeoutSeconds =
        typeof payload.timeoutSeconds === 'number' &&
        payload.timeoutSeconds % 1 === 0 &&
        payload.timeoutSeconds >= 1 &&
        payload.timeoutSeconds <= 5
          ? payload.timeoutSeconds
          : false;

      // Check to make sure id is valid
      if (id) {
        // Check to make sure one or more optional fields had been sent
        if (
          protocol ||
          url ||
          method ||
          method ||
          successCodes ||
          timeoutSeconds
        ) {
          // Lookup the check
          _data.read('checks', id, (err, checkData) => {
            if (!err && checkData) {
              // Get the token from the headers
              const token =
                typeof headers.token === 'string' ? headers.token : false;

              //Verify that the given token is valid and belongs to the user who created the check
              handlers._tokens.verifyToken(
                token,
                checkData.userPhone,
                tokenIsValid => {
                  if (tokenIsValid) {
                    // Update the check where necessary
                    if (protocol) checkData.protocol = protocol;
                    if (url) checkData.url = url;
                    if (method) checkData.method = method;
                    if (successCodes) checkData.successCodes = successCodes;
                    if (timeoutSeconds)
                      checkData.timeoutSeconds = timeoutSeconds;

                    // Store the updates
                    _data.update('checks', id, checkData, err => {
                      if (!err) {
                        callback(200);
                      } else {
                        callback(500, { error: 'Could not update the check' });
                      }
                    });
                  } else {
                    callback(403);
                  }
                }
              );
            } else {
              callback(400, { error: 'Check ID does not exist' });
            }
          });
        } else {
          callback(400, { error: 'Missing field(s) to update' });
        }
      } else {
        callback(400, { error: 'Missing required field' });
      }
    },

    /**
     * Checks - delete
     * Required: id
     * Optional data: none
     */
    delete: (data, callback) => {
      // Check that the phone number is valid
      const { queryStringObject, headers } = data;
      // Check that the phone number is valid
      const id =
        typeof queryStringObject.id === 'string' &&
        queryStringObject.id.trim().length === 20
          ? queryStringObject.id.trim()
          : false;

      if (id) {
        // Lookup the check
        _data.read('checks', id, (err, checkData) => {
          if (!err && checkData) {
            // Get the token from the headers
            const token =
              typeof headers.token === 'string' ? headers.token : false;

            //Verify that the given token is valid for the phone number
            handlers._tokens.verifyToken(
              token,
              checkData.userPhone,
              tokenIsValid => {
                if (tokenIsValid) {
                  // Delete the check data
                  _data.delete('checks', id, err => {
                    if (!err) {
                      // Lookup the user
                      _data.read(
                        'users',
                        checkData.userPhone,
                        (err, userData) => {
                          if (!err && userData) {
                            const userChecks =
                              typeof userData.checks === 'object' &&
                              userData.checks instanceof Array
                                ? userData.checks
                                : [];

                            // Remove the deleted check from their list of checks
                            const checkPos = userChecks.indexOf(id);
                            if (checkPos > -1) {
                              userChecks.splice(checkPos, 1);

                              // Resave user data
                              _data.update(
                                'users',
                                checkData.userPhone,
                                userData,
                                err => {
                                  if (!err) {
                                    callback(200);
                                  } else {
                                    callback(500, {
                                      error:
                                        'Cound not update the specified user'
                                    });
                                  }
                                }
                              );
                            } else {
                              callback(500, {
                                error:
                                  "Could not find the check reference on user's object to remove"
                              });
                            }
                          } else {
                            callback(500, {
                              error:
                                'Could not find the user who created the check, so unable to remove check reference from user object'
                            });
                          }
                        }
                      );
                    } else {
                      callback(500, {
                        error: 'Could not delete the check data'
                      });
                    }
                  });
                } else {
                  callback(403);
                }
              }
            );
          } else {
            callback(400, { error: 'Check ID does not exist' });
          }
        });
      } else {
        callback(400, { error: 'Missing required field' });
      }
    }
  },
  // Ping handler
  ping: (data, callback) => callback(),

  // Not found handler
  notFound: (data, callback) => callback(404)
};

// Export the module
module.exports = handlers;
