/**
 * Lib tests
 * 
 */

// Dependencies
const lib = require('../app/lib');
const assert = require('assert');

const libTests = {};

libTests['lib.parseJsonToObj should return valid a valid javascript object given valid JSON'] = (done) => {
  const validJSON = '{"firstName":"Morile","lastName":"Kounou","phone":"0784492637","hashedPassword":"c4a66013b737f07a7cab8954989a363ef18f2217a9ecd224a87240c934509826","tosAgreement":true,"checks":["7qgfi0uo2to811lvolty","4f63ya5ezo45ki474j0f"]}';
  const result = lib.parseJsonToObj(validJSON);
  assert.equal(typeof result, 'object');
  done();
}

libTests['lib.parseJsonToObj should return valid an empty javascript object given invalid JSON'] = (done) => {
  const validJSON = '{"firstName""Morile","lastName":"Kounou","phone":"0784492637","hashedPassword":"c4a66013b737f07a7cab8954989a363ef18f2217a9ecd224a87240c934509826","tosAgreement":true,"checks":["7qgfi0uo2to811lvolty","4f63ya5ezo45ki474j0f"]}';
  const result = lib.parseJsonToObj(validJSON);
  assert.ok(result);
  assert.equal(Object.keys(result).length, 0);
  done();
}

libTests['lib.createRandomString should return a string of predictable length'] = (done) => {
  const str = lib.createRandomString(10);
  assert.equal(typeof str, 'string');
  assert.equal(str.length, 10);
  done();
}

libTests['lib.createRandomString should return false with invalid input'] = (done) => {
  const str = lib.createRandomString('invalid input');
  assert.equal(str, false);
  done();
}

module.exports = libTests;
