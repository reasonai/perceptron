const ai = require('./lib.js');
const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(question) {
    return new Promise(function(done) {
        rl.question(question, function (response) {
            done(Number.parseFloat(response));
        });
    });
}

if (!process.argv[2]) {
  console.error('Expecting the test filename. Usage : node test.js tests/rgb-dark.json.brain');
  process.exit(-1);
}
const brain = ai.create(
    JSON.parse(fs.readFileSync(process.argv[2]))
);
const experiment = JSON.parse(fs.readFileSync(process.argv[2].substring(0, process.argv[2].length - 6)));
(async () => {
    console.log(experiment.title);
    const args = [];
    for(let i = 0; i < experiment.args.length; i++) {
        // ask 
        args[i] = await prompt("Arg " + (i + 1) + ". Enter a value " + experiment.args[i] + " : ")
        // normalize
        args[i] = (args[i] -  experiment.args[i][0]) /  experiment.args[i][1];
    }
    console.log("Response :");
    console.log(
        brain.call(null, args)
    );
    process.exit(0);
})();
  