# perceptron

Test the perceptron algorithm

Just a little experiment on how a perceptron behaves, without regression (and bias) - juste making random evolutions.

WiP around another implementation based on a perceptron computing with binary masks instead float operations, still figuring it out ;)

---

To run on your computer :

```
$ node train.js tests/rgb-dark.json
*** Detect if the RGB values are a dark tone ? isDark => true if dark ***
default: 1.138s
1 - remains 4 survivors - best score is 6 (43%)
* Evolve #0 : 6
* Evolve #1 : 6
* Evolve #2 : 6
* Evolve #3 : 6
[...]
99 - remains 4 survivors - best score is 15 (107%)
* Keep #0 : 15
* Keep #1 : 15
* Evolve #2 : 6
* Evolve #3 : 6
default: 997.786ms
100 - remains 4 survivors - best score is 15 (107%)
* Keep #0 : 15
* Keep #1 : 15
* Keep #2 : 10
* Evolve #3 : 6
PASS with 0 winners
```

If suceeds the netword is saved under the file + ".brain"


```
$ node run.js tests/rgb-dark.json.brain 
Detect if the RGB values are a dark tone ? isDark => true if dark
Arg 1. Enter a value [0,255] : 58
Arg 2. Enter a value [0,255] : 255
Arg 3. Enter a value [0,255] : 200
Call [0.22745098039215686,1,0.7843137254901961]
Response : false
```

