/**
 * Example UDP server
 * Create a UDP datagram server listening on 6000
 *
 */

// Dependencies
const dgram = require('dgram');

const server = dgram.createSocket('udp4');

server.on('message', (messageBuffer, sender) => {
  const messageString = messageBuffer.toString();
  console.log(messageString);
});

server.bind(6000);
