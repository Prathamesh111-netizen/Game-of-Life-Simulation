###
 @author Raoul Harel
 @license The MIT license (LICENSE.txt)
 @copyright 2015 Raoul Harel
 @url rharel/node-gol-hashlife on GitHub
###

gol = require('../lib/gol')
Library = gol.Library
dead = gol.dead
alive = gol.alive

should = require('should')

describe 'library unit', ->
  describe 'initialization', ->
    lib = new Library
    it 'should have size 0', ->
      lib.size().should.be.equal(0)

  describe 'id', ->
    lib = new Library
    it 'should increment id for each new cell', ->
      a = lib.get(dead, dead, dead, dead)
      b = lib.get(dead, dead, dead, alive)
      c = lib.get(dead, dead, alive, alive)

      b.id.should.be.equal(a.id + 1)
      c.id.should.be.equal(b.id + 1)
    it 'should have size 2', ->
      lib.size().should.be.equal(3)

  describe 'hash', ->
    it 'should equal the binary representation for level 1 cells', ->
      result = []
      result.push(Library._hash(a, b, c, d)) \
      for a in [dead, alive] \
      for b in [dead, alive] \
      for c in [dead, alive] \
      for d in [dead, alive]

      result.sort()
        .should.be.eql(
          [0...16].map((x) -> x.toString()).sort())

  describe 'lookup', ->
    lib = new Library
    it 'should return cached cell if it exists', ->
      a = lib.get(dead, dead, dead, dead)
      b = lib.get(dead, dead, dead, dead)

      b.should.be.equal(a)