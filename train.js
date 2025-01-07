const ai = require('./lib.js');
const fs = require('fs');
if (!process.argv[2]) {
  console.error('Expecting the test filename. Usage : node train.js tests/rgb-dark.json');
  process.exit(-1);
}

const experiment = JSON.parse(
  fs.readFileSync(process.argv[2])
);
console.log('*** ' + experiment.title + ' ***');

let population = [];
for(let g = 0; g < experiment.generations; g++) {
  console.time();
  let babies = Array.from({ length: experiment.population - population.length }, function() {
    return ai.generate(experiment.args.length, experiment.layers, 1);
  });
  population = population.concat(babies);
  for(let i = 0; i < experiment.train.length; i++) {
    population = ai.train(
      population, 
      experiment.train[i][0].map(function(i, index) { 
        return (i - experiment.args[index][0]) / experiment.args[index][1]; 
      }), 
      experiment.train[i][1],
      experiment.correction
    );
  }
  population = population.filter(function(b) {
    return b.points > 0;
  }).sort(function(a, b) {
    return b.points - a.points;
  }).slice(0, experiment.survivors);
  console.timeEnd();
  console.log((g + 1) + ' - remains ' + population.length + ' survivors - best score is ' + population[0].points + ' (' + Math.round((population[0].points / (experiment.train.length * 2)) * 100) + '%)');
  population.forEach(function(brain, index) {
    if (brain.points < experiment.train.length * 2 * 0.5) {
      console.log('* Evolve #' + index + ' : ' + brain.points);
      brain.evolve(Math.random() * 0.001);
      brain.points = 0;
    } else {
      console.log('* Keep #' + index + ' : ' + brain.points);
      brain.points = 1;
    }
  });
}

// final test : should pass 100% on new results
population.forEach(function(brain) {
  brain.points = 0;
});
for(let i = 0; i < experiment.check.length; i++) {
  population = ai.train(
    population, 
    experiment.check[i][0].map(function(i, index) { 
      return (i - experiment.args[index][0]) / experiment.args[index][1]; 
    }), 
    experiment.check[i][1]
  ).filter(function(b) { return b.points > 0 });
}
console.log('PASS with ' + population.length + ' winners');
if (population.length > 0) {
  const output = JSON.stringify(
    population[0].export(),
    null,
    2
  );
  console.log(
    population[0].points,
    output
  );
  fs.writeFileSync(process.argv[2] + '.brain', output);
}
