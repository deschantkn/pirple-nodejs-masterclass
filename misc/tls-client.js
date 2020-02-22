const tls = require('tls');
const fs = require('fs');
const path = require('path');

const options = {
  ca: fs.readFileSync(path.join(__dirname, '/../https/cert.pem')) // only required because certificate is self signed
};

const outboundMessage = 'ping';

const client = tls.connect(6000, options, () => {
  client.write(outboundMessage);
});

client.on('data', (msg) => {
  const msgStr = msg.toString();
  console.log(outboundMessage + ' => ' + msgStr);
  client.end();
});
