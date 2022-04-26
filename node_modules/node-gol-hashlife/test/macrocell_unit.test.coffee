###
 @author Raoul Harel
 @license The MIT license (LICENSE.txt)
 @copyright 2015 Raoul Harel
 @url rharel/node-gol-hashlife on GitHub
###

gol = require('../lib/gol')
MacroCell = gol.MacroCell
dead = gol.dead
alive = gol.alive

should = require('should')

should_have_children = (cell, nw, ne, sw, se) ->
  cell.nw.should.be.equal(nw)
  cell.ne.should.be.equal(ne)
  cell.sw.should.be.equal(sw)
  cell.se.should.be.equal(se)

it_should_flush_to = (cell, expected) ->
  it 'should flush to...', ->
    cell.to_array().should.be.eql(expected)

describe 'macro-cell unit', ->
  describe 'default initialization', ->
    describe 'level 1', ->
      m = new MacroCell
      it 'should be level 1', ->
        m.level().should.be.equal(1)
      it 'should have dead chlidren', ->
        should_have_children(m, dead, dead, dead, dead)
      it 'should have 0 living count', ->
        m.population().should.be.equal(0)

    describe 'level 2', ->
      nw = new MacroCell
      ne = new MacroCell
      sw = new MacroCell
      se = new MacroCell
      m = new MacroCell(nw, ne, sw, se)

      it 'should be level 2', ->
        m.level().should.be.equal(2)
      it 'should have 0 living count', ->
        m.population().should.be.equal(0)
      it 'should be dead', ->
        should_have_children(m.nw, dead, dead, dead, dead)
        should_have_children(m.ne, dead, dead, dead, dead)
        should_have_children(m.sw, dead, dead, dead, dead)
        should_have_children(m.se, dead, dead, dead, dead)

  describe 'initialization from array', ->
    describe 'level 1', ->
      m = MacroCell.from_array([
        dead, alive,
        alive, dead
      ])

      it 'should be level 1', ->
        m.level().should.be.equal(1)
      it 'should match the array', ->
        should_have_children(m, dead, alive, alive, dead)
      it 'should have 2 living count', ->
        m.population().should.be.equal(2)

    describe 'level 2', ->
      m = MacroCell.from_array([
        1, 0, 0, 1,
        0, 0, 0, 0,
        0, 0, 0, 0,
        1, 0, 0, 1,
      ])

      it 'should be level 2', ->
        m.level().should.be.equal(2)
      it 'should have 4 living count', ->
        m.population().should.be.equal(4)
      it 'should match the array', ->
        should_have_children(m.nw, alive, dead, dead, dead)
        should_have_children(m.ne, dead, alive, dead, dead)
        should_have_children(m.sw, dead, dead, alive, dead)
        should_have_children(m.se, dead, dead, dead, alive)

    describe 'level 3', ->
      a = [
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 1, 1, 0, 0, 1, 1, 0,
        0, 0, 0, 1, 0, 1, 0, 0,
        1, 1, 0, 0, 0, 0, 1, 1,
        0, 0, 0, 0, 0, 1, 0, 0,
        1, 0, 0, 1, 0, 0, 1, 0,
        0, 0, 0, 1, 0, 0, 0, 0,
        1, 1, 0, 0, 1, 1, 0, 1,
      ]
      m = MacroCell.from_array(a)

      it 'should be level 3', ->
        m.level().should.be.equal(3)
      it 'should have 20 living count', ->
        m.population().should.be.equal(20)
      it 'should match the array', ->
        should_have_children(m.nw.nw, dead, dead, dead, alive)
        should_have_children(m.nw.ne, dead, dead, alive, dead)
        should_have_children(m.nw.sw, dead, dead, alive, alive)
        should_have_children(m.nw.se, dead, alive, dead, dead)

        should_have_children(m.ne.nw, dead, dead, dead, alive)
        should_have_children(m.ne.ne, dead, dead, alive, dead)
        should_have_children(m.ne.sw, dead, alive, dead, dead)
        should_have_children(m.ne.se, dead, dead, alive, alive)

        should_have_children(m.sw.nw, dead, dead, alive, dead)
        should_have_children(m.sw.ne, dead, dead, dead, alive)
        should_have_children(m.sw.sw, dead, dead, alive, alive)
        should_have_children(m.sw.se, dead, alive, dead, dead)

        should_have_children(m.se.nw, dead, alive, dead, dead)
        should_have_children(m.se.ne, dead, dead, alive, dead)
        should_have_children(m.se.sw, dead, dead, alive, alive)
        should_have_children(m.se.se, dead, dead, dead, alive)

  describe 'conversion to array', ->
    describe 'level 1', ->
      test_case = (name, nw, ne, sw, se) ->
        expected = [nw, ne, sw, se]
        m = new MacroCell(nw, ne, sw, se)

        it name, ->
          m.to_array().should.be.eql(expected)

      test_case("should flush [#{a}, #{b}, #{c}, #{d}]", a, b, c, d) \
        for a in [dead, alive] \
        for b in [dead, alive] \
        for c in [dead, alive] \
        for d in [dead, alive]

    describe 'level 2', ->
      nw = new MacroCell(dead, dead, dead, alive)
      ne = new MacroCell(dead, dead, alive, dead)
      sw = new MacroCell(dead, dead, alive, alive)
      se = new MacroCell(dead, alive, dead, dead)
      m = new MacroCell(nw, ne, sw, se)

      it_should_flush_to(m, [
        0, 0, 0, 0
        0, 1, 1, 0,
        0, 0, 0, 1
        1, 1, 0, 0
      ])

    describe 'level 3', ->
      a = new MacroCell(dead, dead, dead, alive)
      b = new MacroCell(dead, dead, alive, dead)
      c = new MacroCell(dead, dead, alive, alive)
      d = new MacroCell(dead, alive, dead, dead)
      m1 = new MacroCell(a, b, c, d)
      m2 = new MacroCell(a, b, d, c)
      m3 = new MacroCell(b, a, c, d)
      m4 = new MacroCell(d, b, c, a)
      m = new MacroCell(m1, m2, m3, m4)

      it_should_flush_to(m, [
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 1, 1, 0, 0, 1, 1, 0,
        0, 0, 0, 1, 0, 1, 0, 0,
        1, 1, 0, 0, 0, 0, 1, 1,
        0, 0, 0, 0, 0, 1, 0, 0,
        1, 0, 0, 1, 0, 0, 1, 0,
        0, 0, 0, 1, 0, 0, 0, 0,
        1, 1, 0, 0, 1, 1, 0, 1,
      ])

  describe 'computing result', ->
    describe 'level 2', ->
      test_case = (name, nNeighbours, expected_state) ->
        describe name, ->
          nw = new MacroCell(
            nNeighbours > 0, nNeighbours > 1,
            nNeighbours > 2, alive)
          ne = new MacroCell(
            nNeighbours > 3, dead,
            nNeighbours > 4, dead)
          sw = new MacroCell(
            nNeighbours > 5, nNeighbours > 6,
            dead, dead)
          se = new MacroCell(
            nNeighbours > 7, dead,
            dead, dead)
          m = new MacroCell(nw, ne, sw, se)
          r = m.future()

          it "should be #{if expected_state then 'alive' else 'dead'}", ->
            r.nw.should.be.equal(expected_state)

      test_case("living cell with #{i} living neighbours", i,
        if i < 2 or i > 3 then dead else alive) \
        for i in [0..8]

    describe 'level 3', ->
      describe 'intermediate children', ->
        nw = new MacroCell
        ne = new MacroCell
        sw = new MacroCell
        se = new MacroCell
        m = new MacroCell(nw, ne, sw, se)

        it 'should have north composed of [nw.east, ne.west]', ->
          should_have_children(m.n, nw.ne, ne.nw, nw.se, ne.sw)
        it 'should have south composed of [sw.east, se.west]', ->
          should_have_children(m.s, sw.ne, se.nw, sw.se, se.sw)
        it 'should have west composed of [nw.south, sw.north]', ->
          should_have_children(m.w, nw.sw, nw.se, sw.nw, sw.ne)
        it 'should have east composed of [ne.south, se.north]', ->
          should_have_children(m.e, ne.sw, ne.se, se.nw, se.ne)
        it 'should have center composed of [nw.se, ne.sw, sw.ne, se.nw]', ->
          should_have_children(m.c, nw.se, ne.sw, sw.ne, se.nw)

      describe 'future', ->
        m = MacroCell.from_array([
          0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 1, 0, 0, 0, 0,
          0, 0, 0, 0, 1, 0, 0, 0,
          0, 0, 1, 1, 1, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0
        ])
        r = m.future()

        it_should_flush_to(r, [
          0, 0, 0, 0,
          0, 0, 1, 0,
          1, 0, 1, 0,
          0, 1, 1, 0
        ])

