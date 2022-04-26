###
 @author Raoul Harel
 @license The MIT license (LICENSE.txt)
 @copyright 2015 Raoul Harel
 @url rharel/node-gol-hashlife on GitHub
###

gol = require('../lib/gol')
Simulation = gol.Simulation
dead = gol.dead
alive = gol.alive

helpers = require('./helpers.test')
by_x_then_y = helpers.by_x_then_y
from_rle = helpers.from_rle

should = require('should')

describe 'gol integration', ->
  describe 'initialization', ->
    sim = new Simulation(3)

    it 'should have 2^3 size', ->
      sim.size().should.be.equal(8)

  describe 'setting cell values', ->
    sim = null

    it 'should save the value of a single cell', ->
      sim = new Simulation(2)
      sim.set(0, 0)
      sim._root.to_array().should.be.eql([
        0, 0, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 0,
        0, 0, 0, 0
      ])

    it 'should save the value of multiple cells (4x4)', ->
      sim = new Simulation(2)
      sim.set(p[0], p[1]) for p, i in [
        [0, 0], [1, -1], [1, -2], [0, -2], [-1, -2]
      ]
      sim._root.to_array().should.be.eql([
        0, 0, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
        0, 1, 1, 1
      ])

    it 'should save the value of multiple cells (8x8)', ->
      sim = new Simulation(3)
      sim.set(p[0], p[1]) for p, i in [
        [0, 0], [1, -1], [1, -2], [0, -2], [-1, -2]
      ]
      sim._root.to_array().should.be.eql([
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 1, 0, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 0,
        0, 0, 0, 1, 1, 1, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0
      ])

  describe 'getting cell values', ->
    it 'should return nothing for empty universe', ->
      sim = new Simulation(2)
      sim.get(-1).length.should.be.equal(0)

    describe 'tracking the glider pattern', ->
      ###
        t = 0      t = 1      t = 2
        -----      -----      -----
        0 1 0 0    0 0 0 0    0 0 0 0
        0 0 1 0    1 0 1 0    0 0 1 0
        1 1 1 0    0 1 1 0    1 0 1 0
        0 0 0 0    0 1 0 0    0 1 1 0
      ###
      gen0 = [
        {x: -2, y: -1},
        {x: -1, y: -1},
        {x: -1, y:  1},
        {x:  0, y: -1},
        {x:  0, y:  0}
      ]  # .sort(by_x_then_y)
      gen1 = [
        {x: -2, y:  0},
        {x: -1, y: -2},
        {x: -1, y: -1},
        {x:  0, y: -1},
        {x:  0, y:  0}
      ]  # .sort(by_x_then_y)
      gen2 = [
        {x: -2, y: -1},
        {x: -1, y: -2},
        {x:  0, y: -2},
        {x:  0, y: -1},
        {x:  0, y:  0}
      ]  # .sort(by_x_then_y)

      sim = new Simulation(3)
      sim.set(p.x, p.y) for p, i in gen0

      it 'should match data at t = 0', ->
        sim.get(-1).sort(by_x_then_y).should.be.eql(gen0)
      it 'should match data at t = 1', ->
        sim.get(0).sort(by_x_then_y).should.be.eql(gen1)
      it 'should match data at t = 2', ->
        sim.get(1).sort(by_x_then_y).should.be.eql(gen2)

    describe 'tracking the \'figure eight\' pattern', ->
      gen_rle = [
        {w: 6, h: 6, data: '3o$3o$3o$3b3o$3b3o$3b3o!'},
        {w: 8, h: 8, data: '2bo$bobo$o3bo$bo3bo$2bo3bo$3bo3bo$4bobo$5bo!'},
        {w: 8, h: 8, data: '2bo$b3o$3obo$bo3bo$2bo3bo$3bob3o$4b3o$5bo!'},
        {w: 10, h: 10, \
          data: '3bo$2b2o$bob2o$3o2bo$2bobobo' +
                '$3bobobo$4bo2b3o$5b2obo$6b2o$6bo!'}
        {w: 6, h: 6, data: '3o$3o$3o$3b3o$3b3o$3b3o!'}
      ]
      gen = gen_rle.map((g) ->
        from_rle(-g.w / 2, -g.h / 2, g.w, g.h, g.data))
      gen0 = gen[0]
      gen = gen[1...gen.length]

      # The 'figure eight' pattern is an oscillator with period 8.
      # If we want to view its evolution fully, we will need a universe at least
      # at level 5, since then we can simulate 2^(5-2) = 8 steps into
      # the future.
      sim = new Simulation(5)
      sim.set(p.x, p.y) for p, i in gen0

      it 'should match data at t = 0', ->
        sim.get(-1).sort(by_x_then_y)
          .should.be.eql(gen0.sort(by_x_then_y))

      for f, t in gen
        do (sim, f, t) ->
          it 'should match data at t = 2^' + t, ->
            sim.get(t).sort(by_x_then_y)
              .should.be.eql(f.sort(by_x_then_y))
