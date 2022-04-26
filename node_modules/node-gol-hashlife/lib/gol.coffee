###
 @author Raoul Harel
 @license The MIT license (LICENSE.txt)
 @copyright 2015 Raoul Harel
 @url rharel/node-gol-hashlife on GitHub
###

###
  Naming Convention Used
  ======================
  Any object, method, or argument whose name begins with an _underscore
  is to be considered a private implementation detail.
###

dead = 0
alive = 1

_to_int = (b) -> if b then alive else dead

###
  Returns a filtered array with only unique elements.

  @param  a     Array to filter.
  @param  hash  Hashing function.

  @details
    In order to determine uniqueness, the algorithm uses a hash-table.
    The caller of this method should supply a suitable hashing function
    for the objects expected to populate the given array.
###
_remove_duplicates = (a, hash) ->
  seen = new Object
  return a.filter(
    (x) ->
      key = hash(x)
      if seen.hasOwnProperty(key)
        return false
      else
        return seen[key] = true
  )

###
  Steps a single cell in accordance to the count of Moore's living neighbours
  it has.

  @param  cell                Dead or alive.
  @param  nLivingNeighbours   # of Moore neighbours that are alive
###
_step_single = (cell, nLivingNeighbours) ->
  nLiving = nLivingNeighbours + cell
  if nLiving is 3
    return alive
  else if nLiving is 4
    return cell
  else
    return dead

###
  Given two 2D-arrays A and B, returns a new array C whose elements are
  C[i] = concat(A[i], B[i])
###
_join_rows = (a, b) ->
  result = []
  result.push(a[i].concat(b[i])) for i in [0...a.length]
  return result

###
  Given an array C, splits each child of C into two halves, and gives one to
  an array A and the other to B. Returns [A, B]
###
_split_rows = (c) ->
  a = []
  b = []
  (a.push(c[i][0...c.length]); b.push(c[i][c.length...2 * c.length])) \
    for i in [0...c.length]
  return [a, b]



###
  A macro-cell is an analogue of a quad-tree node in the Hashlife algorithm.
  A macro-cell size is a power of two. Given a macro-cell of size 2^n, we say
  its level is n.

  Aside from the four (n-1) child-macro-cells (as in a quad-tree), we also make
  use of a fifth (n-1) child located at the center of the macro-cell. This
  child contains the state of the simulation after 2^(n-2) steps. We refer
  to this fifth child as the 'future' of its parent macro-cell.
###
class MacroCell
  @from_array: (a) ->
    row_size = Math.sqrt(a.length)
    row_array = []
    row_array.push(a[i...i + row_size]) for i in [0...a.length] by row_size
    return MacroCell._from_row_array(row_array)

  @_from_row_array: (a) ->
    if a.length is 2
      return new MacroCell(a[0][0], a[0][1], a[1][0], a[1][1])
    else
      j = a.length / 2
      [nw_rows, ne_rows] = _split_rows(a[0...j])
      [sw_rows, se_rows] = _split_rows(a[j...a.length])
      return new MacroCell(
        MacroCell._from_row_array(nw_rows),
        MacroCell._from_row_array(ne_rows),
        MacroCell._from_row_array(sw_rows),
        MacroCell._from_row_array(se_rows)
      )

  @_default_library: { get: (nw, ne, sw, se) -> new MacroCell(nw, ne, sw, se) }

  constructor: (
    @nw = dead, @ne = dead,
    @sw = dead, @se = dead,
    @id = 0, @library = MacroCell._default_library) ->
    if @nw._level?
      @_level = @nw._level + 1
      @_population =
        @nw._population + @ne._population +
        @sw._population + @se._population
      @n = @library.get(@nw.ne, @ne.nw, @nw.se, @ne.sw)
      @s = @library.get(@sw.ne, @se.nw, @sw.se, @se.sw)
      @w = @library.get(@nw.sw, @nw.se, @sw.nw, @sw.ne)
      @e = @library.get(@ne.sw, @ne.se, @se.nw, @se.ne)
      @c = @library.get(@nw.se, @ne.sw, @sw.ne, @se.nw)
    else
      @_level = 1
      @_population = @nw + @ne + @sw + @se

      if typeof @nw isnt 'number'
        @nw = _to_int(@nw)
        @ne = _to_int(@ne)
        @sw = _to_int(@sw)
        @se = _to_int(@se)

    @_result = null

  _to_row_array: ->
    if @_level is 1
      return [[@nw, @ne], [@sw, @se]]
    else
      top_rows = _join_rows(@nw._to_row_array(), @ne._to_row_array())
      bottom_rows = _join_rows(@sw._to_row_array(), @se._to_row_array())
      return top_rows.concat(bottom_rows)

  to_array: ->
    return @_to_row_array().reduce((p, c) -> p.concat(c))

  _base_case: ->
    return @library.get(
      _step_single(@nw.se,
        @nw.nw + @nw.ne + @nw.sw + @ne.nw + @ne.sw + @sw.nw + @sw.ne + @se.nw),
      _step_single(@ne.sw,
        @nw.ne + @nw.se + @ne.nw + @ne.ne + @ne.se + @sw.ne + @se.nw + @se.ne),
      _step_single(@sw.ne,
        @nw.sw + @nw.se + @ne.sw + @sw.nw + @sw.sw + @sw.se + @se.nw + @se.sw),
      _step_single(@se.nw,
        @nw.se + @ne.sw + @ne.se + @sw.ne + @sw.se + @se.ne + @se.sw + @se.se),
    )

  _recursive_case: ->
    lvl1_nw = @nw.future()
    lvl1_ne = @ne.future()
    lvl1_sw = @sw.future()
    lvl1_se = @se.future()
    lvl1_n = @n.future()
    lvl1_s = @s.future()
    lvl1_w = @w.future()
    lvl1_e = @e.future()
    lvl1_c = @c.future()

    lvl2_nw = @library.get(lvl1_nw, lvl1_n, lvl1_w, lvl1_c).future()
    lvl2_ne = @library.get(lvl1_n, lvl1_ne, lvl1_c, lvl1_e).future()
    lvl2_sw = @library.get(lvl1_w, lvl1_c, lvl1_sw, lvl1_s).future()
    lvl2_se = @library.get(lvl1_c, lvl1_e, lvl1_s, lvl1_se).future()

    return @library.get(lvl2_nw, lvl2_ne, lvl2_sw, lvl2_se)

  future: ->
    if @_result?
      return @_result
    else if @_population is 0
      return @_result = @nw
    else if @_level is 2
      return @_result = @_base_case()
    else if @_level > 2
      return @_result = @_recursive_case()

  level: -> @_level
  size: -> 2 ** @_level
  step_size: -> 2 ** (@_level - 2)
  population: -> @_population



###
  The hashlife algorithm takes advantage of pattern-redundancy in the
  simulation. It does so by macro-cell reuse. Every time a new macro-cell is
  needed, the library will first check if it has not already been computed, and
  if it has, then it yields a reference to the existing instance.

  In order to quickly match a given macro-cell with the library's existing
  collection, we use a hash-table. When creating a new cell, it is given a
  unique hash string - it is a combination of its children's hashes.
###
class Library
  @_hash: (nw, ne, sw, se) ->
    if nw._level? and nw._level >= 1
      result = 1
      result = 31 * result + nw.id;
      result = 31 * result + ne.id;
      result = 31 * result + sw.id;
      result = 31 * result + se.id;
      return result;
    else
      return ((nw << 3) |
              (ne << 2) |
              (sw << 1) |
               se).toString()

  @_equals: (cell, nw, ne, sw, se) ->
    return nw is cell.nw and
           ne is cell.ne and
           sw is cell.sw and
           se is cell.se

  constructor: ->
    @_id = 0
    @_map = new Object()

  size: -> @_id

  get: (nw, ne, sw, se) ->
    key = Library._hash(nw, ne, sw, se)
    bucket = @_map[key]
    if bucket is undefined
      @_map[key] = []
      bucket = @_map[key]
    else
      i = 0
      while i < bucket.length
        candidate = bucket[i]
        if Library._equals(candidate, nw, ne, sw, se)
          return candidate
        ++i

    new_entry = new MacroCell(nw, ne, sw, se, @_id, this)
    ++ @_id
    bucket.push(new_entry)
    return new_entry



###
  Simulates a cell grid running Conway's Game of Life (GOL).

  @details
    In GOL, a cell can be either dead or alive. The simulation proceeds in
    discrete time steps and cells evolve according to the following rules:
      1. A living cell with fewer than 2 living neighbours dies from isolation.
      2. A living cell with more than 3 living neighbours dies from over-
         crowding.
      3. A dead cell with with exactly 3 living neighbours becomes alive due to
         reproduction.

    The hashlife algorithm is not suitable for following the simulation one
    generation at a time, but it is extremely efficient at computing its state
    by steps that are a power of two.

    If you are interested in the 2^n-th generation of a pattern, you should
    create a simulation with universe size k = n + 2, since a universe with
    size 2^k can compute up to 2^(k-2) generations into the future.
###
class Simulation
  ###
    @param  exp   Universe size exponent

    @details
      Creates a universe with size 2^exp, capable of computing 2^(exp - 2)
      generations into the future.
  ###
  constructor: (exp) ->
    @_size = 2 ** exp
    @_init_library(exp)

  _init_library: (level) ->
    @_library = new Library
    @_root = @_library.get(dead, dead, dead, dead)
    i = 1
    while i < level
      @_root = @_library.get(@_root, @_root, @_root, @_root)
      ++i

  size: -> @_size

  _get_child: (cell, x, y) ->
    key = ''
    h = cell.size() * 0.25
    if x < 0
      x += h
      if y < 0
        key = 'sw'
        y += h
      else
        key = 'nw'
        y -= h
    else
      x -= h
      if y < 0
        key = 'se'
        y += h
      else
        key = 'ne'
        y -= h
    return {key: key, x: x, y: y}

  _trace_to_base: (x, y) ->
    trace = []
    cell = @_root
    while cell.level?
      record = @_get_child(cell, x, y)
      record.parent = cell
      trace.push(record)
      cell = cell[record.key]
      x = record.x; y = record.y
    return trace

  set: (x, y) ->
    h = @_size * 0.5
    if x < -h or x >= h or y < -h or y >= h
      return
    replacement = alive
    trace = @_trace_to_base(x, y)
    i = trace.length - 1
    while i >= 0
      record = trace[i]
      q =
        nw: record.parent.nw
        ne: record.parent.ne
        sw: record.parent.sw
        se: record.parent.se
      q[record.key] = replacement
      replacement = @_library.get(q.nw, q.ne, q.sw, q.se)
      --i
    @_root = replacement

  _get: (t, _cell = @_root, _tx = 0, _ty = 0) ->
    living = []
    if _cell.population() is 0
      return living
    else if _cell._level is 1
      if _cell.nw is alive
        living.push({x: -1 + _tx, y: _ty})
      if _cell.ne is alive
        living.push({x: _tx, y: _ty})
      if _cell.sw is alive
        living.push({x: -1 + _tx, y: -1 + _ty})
      if _cell.se is alive
        living.push({x: _tx, y: -1 + _ty})
      return living
    else
      h = _cell.step_size()
      if t >= h
        return @_get(t - h, _cell.future(), _tx, _ty)
      else
        if t > 0
          n = @_get(t, _cell.n, _tx, _ty + h)
          s = @_get(t, _cell.s, _tx, _ty - h)
          e = @_get(t, _cell.e, _tx + h, _ty)
          w = @_get(t, _cell.w, _tx - h, _ty)
          c = @_get(t, _cell.c, _tx, _ty)
          living = living.concat(n, s, e, w, c)

        nw = @_get(t, _cell.nw, _tx - h, _ty + h)
        ne = @_get(t, _cell.ne, _tx + h, _ty + h)
        sw = @_get(t, _cell.sw, _tx - h, _ty - h)
        se = @_get(t, _cell.se, _tx + h, _ty - h)
        living = living.concat(nw, ne, sw, se)

        if (_cell is @_root)
          living = _remove_duplicates(living, (p) -> "#{p.x},#{p.y}")

        return living

  get: (exp) ->
    return @_get((if exp >= 0 then 2 ** exp else 0))


root = this
if module?.exports?
  module.exports.MacroCell = MacroCell
  module.exports.Library = Library
  module.exports.Simulation = Simulation
  module.exports.dead = dead
  module.exports.alive = alive
root.gol =
  MacroCell: MacroCell
  Library: Library
  Simulation: Simulation
  dead: dead
  alive: alive
