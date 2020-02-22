/**
 * Homework Assignment #1
 * 
 * "Hello World" AOI
 * 
 */

// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// Create http server
const server = http.createServer((req, res) => {
  // Get request url and parse it
  const parsedUrl = url.parse(req.url, true);

  // Get and sanitize request path
  const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');

  // Get the payload, if any
  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', (data) => buffer += decoder.write(data));
  req.on('end', () => {
    buffer += decoder.end();

    // Pick appropriate handler or default to notFound
    const chosenHandler = typeof(router[path]) !== 'undefined' ? router[path] : handlers.notFound;

    // Route request to the chose handler
    chosenHandler((statusCode, payload) => {
      // Use statusCode or default to 200
      statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

      // Use payload or default to empty object
      payload = typeof(payload) === 'object' ? payload : {};

      // Convert payload to JSON string
      const payloadString = JSON.stringify(payload);

      // Return response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);
    });
  });
});

server.listen(3005, () => console.log('Server listening on port 3005'));

// Request handlers
const handlers = {};
handlers.hello = (callback) => callback(200, { message: 'Pirple Nodejs masterclass assignment #1' });
handlers.notFound = (callback) => callback(404);

// Routes
const router = {
  hello: handlers.hello,
};
