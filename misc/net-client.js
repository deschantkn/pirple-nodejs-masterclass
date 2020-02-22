const net = require('net');

const outboundMessage = 'ping';

const client = net.createConnection({ port: 6000 }, () => {
  client.write(outboundMessage);
});

client.on('data', (msg) => {
  const msgStr = msg.toString();
  console.log(outboundMessage + ' => ' + msgStr);
  client.end();
});
