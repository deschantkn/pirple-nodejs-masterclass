/**
 * Server related tasks
 * 
 */

// Dependencies
const http =  require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const handlers = require('./handlers');
const helpers = require('./helpers');
const path = require('path');
const util = require('util');
const debug = util.debuglog('server');

// Instantiate the server module object
const server = {};

// Instantiate http and start server
server.httpServer = http.createServer((req, res) => server.unifiedServer(req, res));

// Instantiate and start https server
server.httpsServerOptions = {
  key: fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
};
server.httpsServer = https.createServer(server.httpsServerOptions, (req, res) => server.unifiedServer(req, res));

// All the server logic for both the http and https server
server.unifiedServer = (req, res) => {
  // Get the URL and parse it
  const parsedURL = url.parse(req.url, true);

  // Get the path
  const path = parsedURL.pathname
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  const queryStringObject = parsedURL.query;
  console.log(queryStringObject);

  // Get the HTTP method
  const method = req.method.toLowerCase();

  // Get the headers as an object
  const headers = req.headers;

  // Get the payload, if any
  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', (data) => buffer += decoder.write(data));
  req.on('end', () => {
    buffer += decoder.end();

    // Choose the handler this request should go to. Default to notFound
    let chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;

    // If the request is within the public directory use to the public handler instead
    chosenHandler = trimmedPath.indexOf('public/') > -1 ? handlers.public : chosenHandler;

    // Construct the data object to send to the handler
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      payload: helpers.parseJsonToObj(buffer),
      headers
    };

    // Route the request to chosen handler
    try {
      chosenHandler(data, (statusCode, payload, contentType) => {
        server.processHandlerResponse(res, method, trimmedPath, statusCode, payload, contentType);
      });
    } catch (error) {
      debug(error);
      server.processHandlerResponse(res, method, trimmedPath, 500, { error: 'An unknow error has occured' }, 'json');
    }
  });
};

server.processHandlerResponse = (res, method, trimmedPath, statusCode, payload, contentType) => {
  // Determine the type of response (fallback to JSON)
  contentType = typeof contentType === 'string' ? contentType : 'json';

  // Use statusCode or default to 200
  statusCode = typeof statusCode === 'number' ? statusCode : 200;

  // Return content-specific respose parts
  let payloadString = '';
  switch (contentType) {
    case 'json':
      res.setHeader('Content-Type', 'application/json');
      payload = typeof payload === 'object' ? payload : {};
      payloadString = JSON.stringify(payload);
      break;

    case 'html':
      res.setHeader('Content-Type', 'text/html');
      payloadString = typeof payload === 'string' ? payload : '';
      break;

    case 'favicon':
      res.setHeader('Content-Type', 'image/x-icon');
      payloadString = typeof payload !== 'undefined' ? payload : '';
      break;

    case 'plain':
      res.setHeader('Content-Type', 'text/plain');
      payloadString = typeof payload !== 'undefined' ? payload : '';
      break;

    case 'css':
      res.setHeader('Content-Type', 'text/css');
      payloadString = typeof payload !== 'undefined' ? payload : '';
      break;

    case 'png':
      res.setHeader('Content-Type', 'image/png');
      payloadString = typeof payload !== 'undefined' ? payload : '';
      break;

    case 'jpg':
      res.setHeader('Content-Type', 'image/jpeg');
      payloadString = typeof payload !== 'undefined' ? payload : '';
      break;

    default:
      break;
  }
  // Return response parts that are commong to all content types
  res.writeHead(statusCode);
  res.end(payloadString);

  // Log the request path
  if (statusCode === 200) {
    debug('\x1b[32m%s\x1b[0m', `${method.toUpperCase()} - /${trimmedPath} ${statusCode}`); // Log in green
  } else {
    debug('\x1b[31m%s\x1b[0m', `${method.toUpperCase()} - /${trimmedPath} ${statusCode}`); // Log in red
  }
};

// Define a request router
server.router = {
  '': handlers.index,
  'account/create': handlers.accountCreate,
  'account/edit': handlers.accountEdit,
  'account/deleted': handlers.accountDeleted,
  'session/create': handlers.sessionCreate,
  'session/deleted': handlers.sessionDeleted,
  'checks/all': handlers.checksList,
  'checks/create': handlers.checksCreate,
  'checks/edit': handlers.checksEdit,
  'ping': handlers.ping,
  'api/users': handlers.users,
  'api/tokens': handlers.tokens,
  'api/checks': handlers.checks,
  'favicon.ico': handlers.favicon,
  'public': handlers.public,
  'examples/error': handlers.exampleError
};

// Init script
server.init = () => {
  // Start the HTTP server
  server.httpServer.listen(config.httpPort, () => {
    console.log('\x1b[35m%s\x1b[0m', `Server listening on port ${config.httpPort} in ${config.envName} mode`);
  });

  // Start the HTTPS server
  server.httpsServer.listen(config.httpsPort, () => console.log('\x1b[32m%s\x1b[0m', `Server listening on port ${config.httpsPort} in ${config.envName} mode`));
};

module.exports = server;
