/**
 * Example REPL server
 * Take in the word 'fizz' and log out 'buzz'
 * 
 */

// Dependencies
const repl = require('repl');

// Start the repl
repl.start({
  prompt: '>',
  eval: (str) => {
    // Evaluation function for incoming inputs
    console.log("At the evaluation stage: ", str);

    if (str.includes('fizz')) {
      console.log('buzz');
    }
  }
});