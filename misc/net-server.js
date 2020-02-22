/**
 * Example NET server
 * 
 */

const net = require('net');

const server = net.createServer((connection) => {
  const outboundMessage = 'pong';
  connection.write(outboundMessage);

  // Log out client response
  connection.on('data', (inboundMsg) => {
    const msgStr = inboundMsg.toString();
    console.log(outboundMessage + ' => ' + msgStr);
  });
});

server.listen(6000);
