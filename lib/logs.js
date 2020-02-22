/**
 * Library for storing and rotating logs
 */

 // Dependencies
 const fs = require('fs');
 const path = require('path');
 const zlib = require('zlib');

 // Container for the module
 const lib = {};

 // Base directory of the data folder
lib.baseDir = path.join(__dirname, '/../.logs');

// Append a string to a file, Create the file if it does not exist.
lib.append = (file, str, callback) => {
  // Open the file for appending
  fs.open(`${lib.baseDir}/${file}.log`, 'a', (err, fd) => {
    if (!err && fd) {
      // Append the file and close it
      fs.appendFile(fd, `${str}\n`, (err) => {
        if (!err) {
          fs.close(fd, (err) => {
            if (!err) {
              callback(false);
            } else {
              callback('Error closing file that was being appended');
            }
          });
        } else {
          callback('Error appending to file');
        }
      });
    } else {
      callback('Could not open file for appending');
    }
  });
};

// List all the logs and optionalyl include the compressed logs
lib.list = (withCompressedLogs, callback) => {
  fs.readdir(lib.baseDir, (err, data) => {
   if (!err && data && data.length > 0) {
     const trimmedFileNames = [];
     data.forEach((fileName) => {
       // Add the .log files
       if (fileName.indexOf('.log') > -1) {
         trimmedFileNames.push(fileName.replace('.log', ''));
       }

       // Add on the .gz files
       if (fileName.indexOf('.gz.b64') > -1 && withCompressedLogs) {
         trimmedFileNames.push(fileName.replace('.gz.b64', ''));
       }
     });
     callback(false, trimmedFileNames);
   } else {
     callback(err, data);
   } 
  });
};

// Compress the contents of one .log file into .gz.b64
lib.compress = (logId, newFileId, cb) => {
  const sourceFile = `${logId}.log`;
  const destFile = `${newFileId}.gz.b64`;

  // Read the source file
  fs.readFile(`${lib.baseDir}/${sourceFile}`, 'utf8', (err, inputString) => {
    if (!err && inputString) {
      // Compress the data using gzip
      zlib.gzip(inputString, (err, buffer) => {
        if (!err && buffer) {
          // Send the data to the destination file
          fs.open(`${lib.baseDir}/${destFile}`, 'wx', (err, fd) => {
            if (!err && fd) {
              // Write to the destination file
              fs.writeFile(fd, buffer.toString('base64'), (err) => {
                if (!err) {
                  // Close the dest file
                  fs.close(fd, (err) => {
                    if (!err) {
                      cb(false);
                    } else {
                      cb(err);
                    }
                  });
                } else {
                  cb(err)
                }
              });
            } else {
              cb(err);
            }
          });
        } else {
          cb(err);
        }
      });
    } else {
      cb(err)
    }
  });
};

// Decompress the contents of a .gz.b64 file into a string variable
lib.decompress = (fileId, cb) => {
  const fileName = `${fileId}.gz.b64`;
  fs.readFile(`${lib.baseDir}/${fileName}`, 'utf8', (err, str) => {
    if (!err && str) {
      // Decompress the data
      const inputBuffer = Buffer.from(str, 'base64');
      zlib.unzip(inputBuffer, (err, outputBuffer) => {
        if (!err && outputBuffer) {
          // Callback
          const str = outputBuffer.toString();
          cb(false, str);
        } else {
          cb(err);
        }
      });
    } else {
      cb(err);
    }
  });
};

// Truncate a log file
lib.truncate = (logId, cb) => {
  fs.truncate(`${lib.baseDir}/${logId}.log`, 0, (err) => {
    if (!err) {
      cb(false);
    } else {
      cb(err);
    }
  });
};

module.exports = lib;
