/**
 * API tests
 * 
 */

//  Dependencies
const app = require('../');
const assert = require('assert');
const http = require('http');
const config = require('../lib/config');

const api = {};

const helpers = {
  makeGetRequest: (path, callback) => {
    // Configure the request details
    const requestDetails = {
      protocol: 'http:',
      hostname: 'localhost',
      port: config.httpPort,
      method: 'GET',
      path,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    // Send the request
    const req = http.request(requestDetails, (res) => callback(res));
    req.end();
  },
};

api['app.init should start without throwing'] = (done) => {
  assert.doesNotThrow(() => {
    app.init((err) => done());
  }, TypeError);
};

api['/ping should respong to get with 200'] = (done) => {
  helpers.makeGetRequest('/ping', (res) => {
    assert.equal(res.statusCode, 200);
    done();
  });
};

api['/api/users should respong to get with 400'] = (done) => {
  helpers.makeGetRequest('/api/users', (res) => {
    assert.equal(res.statusCode, 400);
    done();
  });
};

api['/random/path should respong to get with 404'] = (done) => {
  helpers.makeGetRequest('/randompath', (res) => {
    assert.equal(res.statusCode, 404);
    done();
  });
};

module.exports = api;
