###
 @author Raoul Harel
 @license The MIT license (LICENSE.txt)
 @copyright 2015 Raoul Harel
 @url rharel/node-gol-hashlife on GitHub
###

gol = require('../../lib/gol')
Simulation = gol.Simulation

helpers = require('./../helpers.test')
by_x_then_y = helpers.by_x_then_y

assert = require('chai').assert

module.exports = (name, gen0, gen1, step) ->
  sim = new Simulation(step + 2)
  sim.set(p.x, p.y) for p, i in gen0

  lib_size0 = sim._library.size()
  console.log("Computing pattern #{name} to t = 2^#{step}...")
  console.time('Time: ')
  sim._root.future()
  console.timeEnd('Time: ')
  lib_size1 = sim._library.size()
  console.log('Library size: ' + lib_size1)
  console.log('Library growth: ' + (lib_size1 - lib_size0))

  assert.deepEqual(
    sim.get(step).sort(by_x_then_y),
    gen1.sort(by_x_then_y), 'incorrect simulation')