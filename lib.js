/**
 * Neuronal process unit
 */
const neuron = function(threshold, weights) {
    const process = function(args) {
      let signal = 0;
      const s = args.length;
      for(let i = 0; i < s; i++) {
        signal += args[i] * weights[i];
      }
      // console.log(signal + ' ? ' + threshold);
      return signal > threshold ? signal : 0;
    };
    process.data = function() {
      return [threshold, weights];
    }
    process.evolve = function(bias) {
      for(let i = 0; i < weights.length; i++) {
        const r = Math.random();
        if (r > 0.7) {
          weights[i] += bias;
        } else if (r < 0.3) {
          weights[i] -= bias;
        }
      }
    };
    return process;
  };
  
  /**
   * Neuronal process unit
   */
  const layer = function(size, next, entrypoint) {
    let neurons = [];
    const process = function(args) {
      const s = args.length;
      const out = [];
      for(let n = 0; n < size; n++) {
        out.push(
          neurons[n](entrypoint ? [args[n]] : args)
        );
      }
      if (next) {
        return next(out);
      }
      return out;
    };
    process.next = next;
    process.size = size;
    process.points = 0;
    process.init = function(data) {
      neurons = [];
      for(let i = 0; i < size; i++) {
        neurons.push(
          neuron(data[i][0], data[i][1])
        );
      }
    };
    process.export = function(parent) {
      if (!parent) parent = [];
      let s = [];
      for(let i = 0; i < size; i++) {
        s.push(neurons[i].data());
      }
      parent.push(s);
      if (process.next) {
        process.next.export(parent);
      }
      return parent;
    };
    process.evolve = function(ratio) {
      for(let i = 0; i < neurons.length; i++) {
        neurons[i].evolve(ratio);
      }
      if (next) next.evolve(ratio);
    };
    return process;
  };
  
  
  const create = function(structure) {
    let brain = null;
    const s = structure.length - 1;
    for(let i = s; i > -1; i--) {
      brain = layer(structure[i].length, brain);
      brain.init(structure[i]);
    }
    return brain;
  };
  
  /**
   * Creates a generic brain
   */
  const generate = function(entryArgs, hiddenLayers, outputArgs) {
    let brain = null;
    brain = layer(outputArgs, brain);
    if (hiddenLayers) {
      for(let i = 0; i < hiddenLayers.length; i++) {
        brain = layer(hiddenLayers[hiddenLayers.length - i - 1], brain);
      }
    }
    let result = layer(entryArgs, brain, true);
    result.init(rand(entryArgs, 1));
    let parent = result;
    while(parent && parent.next) {
      parent.next.init(
        rand(
          parent.next.size,
          parent.size
        )
      );
      parent = parent.next;
    }
    return result;
  };
  
  
  /**
   * Generates a random array
   */
  const rand = function(size, synapses) {
    const result = [];
    while(size--) {
      result.push([
        Math.random(),
        Array.from({ length: synapses }, function() {
          return Math.random();
        })
      ]);
    }
    return result;
  }
  
  /**
   * Run args over a brain and outputs result
   */
  const train = function(population, args, expect, evolve) {
    return population.map(function(brain) {
      const out = brain(args) != 0;
      
      if(out == expect) {
        brain.points += 2;
      } else {
        if (evolve) {
          let gen = 0;
          while(++gen < evolve.generations) {
            brain.evolve(Math.random() * evolve.factor);
            if(out == expect) {
              brain.points += 4;
              break;
            }
          }  
        }
        brain.points -= 2;
      }
      return brain;
    });
  }
  
  module.exports = {
    train,
    layer,
    create,
    generate
  };