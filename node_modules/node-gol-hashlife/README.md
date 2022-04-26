[![npm version](https://badge.fury.io/js/node-gol-hashlife.svg)](http://badge.fury.io/js/node-gol-hashlife)
[![Build Status](https://travis-ci.org/rharel/node-gol-hashlife.svg)](https://travis-ci.org/rharel/node-gol-hashlife)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com)

## Use case

[Hashlife](https://en.wikipedia.org/wiki/Hashlife) is an algorithm used to evolve Conway's [Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) simulation. If you are not familiar with this cellular automata model or other Life-algorithms, you might want to take a look at the following guidelines for using hashlife:

You should use hashlife for:
  - Patterns containing a lot of redundancy (sub-patterns that show up often).
  - Far-future evolution of the simulation.

Conversely, you shouldn't use hashlife for:
  - Highly chaotic patterns.
  - Evolving the simulation one generation at a time.
  - Memory light execution.

## Installation

Install via npm: `npm install node-gol-hashlife`

The `dist/` directory contains both a normal (`gol.js`) as well as a minified version of the library (`gol.min.js`).
Import either into Node.js using `require("gol")` or directly include in the browser using `<script src="gol.min.js"></script>`

## Usage

Lets take a look at a basic example. Say we wish to view the evolution of the [glider](https://en.wikipedia.org/wiki/Glider_%28Conway%27s_Life%29) pattern.

### Create a universe
Universe size is important. The amount of generations we can simulate in the future depends on it. A universe's size is always a power of two, and a universe with size 2<sup>n</sup> can simulate 2<sup>n - 2</sup> generations ahead.

Suppose we are interested in the glider's evolution two generations into the future. For that, we will need a universe of size 8x8, since 8 = 2^3 which means we can now simulate the pattern 2<sup>(3 - 1)</sup> generations ahead.

```javascript
var gol = require('gol');
var sim = new gol.Simulation(3);  // creates a (2^3)x(2^3) = 8x8 universe
```

### Set initial pattern
Now that we have an empty universe, lets populate it with the initial glider pattern:
```javascript
/*
    The glider pattern looks like this:
    t = 0      t = 1      t = 2
    -----      -----      -----
    0 1 0 0    0 0 0 0    0 0 0 0
    0 0 1 0    1 0 1 0    0 0 1 0
    1 1 1 0    0 1 1 0    1 0 1 0
    0 0 0 0    0 1 0 0    0 1 1 0
*/

// These are the living cell coordinates of the glider at t = 0
// (origin is at the center of the universe)
var gen0 = [
    {x: -2, y: -1},
    {x: -1, y: -1},
    {x: -1, y:  1},
    {x:  0, y: -1},
    {x:  0, y:  0}
];

// Populate the universe with our glider
for (i in gen0) {
    p = gen0[i]
    sim.set(p.x, p.y)  // Sets the cell to 'alive'
}
```

### Simulate and inspect
Now that we have the glider in the universe, lets inspect its evolution. The simulation object allows us to view generations that are a power of two ahead in time:
```javascript
// Get all living cells 2 generations into the future:
population = sim.get(1)  // 1 as in 2^1

/* 
	'population' now contains the following positions:
    population == [
        {x: -2, y: -1},
        {x: -1, y: -2},
        {x:  0, y: -2},
        {x:  0, y: -1},
        {x:  0, y:  0}
    ]
 */
```
Note that the hashlife algorithm evaluates this future state for the central quadrant of the universe. In our case we evaluated cells from (-2, -2) up to (2, 2) two generations into the future. Had we wanted to evaluate a larger neighbourhood, we'd need a larger universe.
## License

This software is licensed under the **MIT License**. See the [LICENSE](LICENSE.txt) file for more information.
