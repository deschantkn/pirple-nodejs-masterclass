/**
 * Example http2 server
 * 
 */

// Dependencies
const http2 = require('http2');

// Init the server
const server = http2.createServer();

// On a stream, send back hello world html
server.on('stream', (stream, headers) => {
  stream.respond({
    status: 200,
    'content-type': 'text/html',
  });
  stream.end(`<html>
    <body>
      <h1>Hello World</h1>
    </body>
  </html>`);
});

// Listen
server.listen(6000);
