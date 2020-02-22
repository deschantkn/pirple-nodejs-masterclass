/**
 * Library of testable functions
 * 
 */

const lib = {
  // Parse a JSON string to an object in all cases, without throwing
  parseJsonToObj: (str) => {
    try {
      const obj = JSON.parse(str);
      return obj;
    } catch (err) {
      return {};
    }
  },

  // Create a string of random alphanumeric characters of a given length
  createRandomString: (strLength) => {
    strLength = typeof strLength === 'number' && strLength > 0 ? strLength : false;
    if (strLength) {
      // Define all possible characters that could go into a string
      const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

      // Start the final string;
      let str = '';
      for (i = 1; i <= strLength; i++) {
        // Get a random character
        const randomChar = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length))
        //Append to the final string
        str += randomChar;
      }

      return str;
    } else {
      return false;
    }
  },
};

module.exports = lib;
