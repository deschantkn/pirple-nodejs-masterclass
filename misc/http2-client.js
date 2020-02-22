/**
 * Example http2 client
 * 
 */

// Dependencies
const http2 = require('http2');

const client = http2.connect('http://localhost:6000');

// Create a request
const req = client.request({
  ':path': '/'
});

// When a message is received add pieces together till end
let str = '';
req.on('data', (chunk) => {
  str += chunk;
});

req.on('end', () => {
  console.log(str);
});

req.end();
