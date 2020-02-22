/**
 * Example TLS server
 * 
 */

const tls = require('tls');
const fs = require('fs');
const path = require('path');

const options = {
  key: fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
};

const server = tls.createServer(options, (connection) => {
  const outboundMessage = 'pong';
  connection.write(outboundMessage);

  // Log out client response
  connection.on('data', (inboundMsg) => {
    const msgStr = inboundMsg.toString();
    console.log(outboundMessage + ' => ' + msgStr);
  });
});

server.listen(6000);
