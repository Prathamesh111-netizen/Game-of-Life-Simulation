
/*
 @author Raoul Harel
 @license The MIT license (LICENSE.txt)
 @copyright 2015 Raoul Harel
 @url rharel/node-gol-hashlife on GitHub
 */


/*
  Naming Convention Used
  ======================
  Any object, method, or argument whose name begins with an _underscore
  is to be considered a private implementation detail.
 */

  (function() {
    var Library, MacroCell, Simulation, _join_rows, _remove_duplicates, _split_rows, _step_single, _to_int, alive, dead, root;
  
    dead = 0;
  
    alive = 1;
  
    _to_int = function(b) {
      if (b) {
        return alive;
      } else {
        return dead;
      }
    };
  
  
    /*
      Returns a filtered array with only unique elements.
    
      @param  a     Array to filter.
      @param  hash  Hashing function.
    
      @details
        In order to determine uniqueness, the algorithm uses a hash-table.
        The caller of this method should supply a suitable hashing function
        for the objects expected to populate the given array.
     */
  
    _remove_duplicates = function(a, hash) {
      var seen;
      seen = new Object;
      return a.filter(function(x) {
        var key;
        key = hash(x);
        if (seen.hasOwnProperty(key)) {
          return false;
        } else {
          return seen[key] = true;
        }
      });
    };
  
  
    /*
      Steps a single cell in accordance to the count of Moore's living neighbours
      it has.
    
      @param  cell                Dead or alive.
      @param  nLivingNeighbours   # of Moore neighbours that are alive
     */
  
    _step_single = function(cell, nLivingNeighbours) {
      var nLiving;
      nLiving = nLivingNeighbours + cell;
      if (nLiving === 3) {
        return alive;
      } else if (nLiving === 4) {
        return cell;
      } else {
        return dead;
      }
    };
  
  
    /*
      Given two 2D-arrays A and B, returns a new array C whose elements are
      C[i] = concat(A[i], B[i])
     */
  
    _join_rows = function(a, b) {
      var i, k, ref, result;
      result = [];
      for (i = k = 0, ref = a.length; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
        result.push(a[i].concat(b[i]));
      }
      return result;
    };
  
  
    /*
      Given an array C, splits each child of C into two halves, and gives one to
      an array A and the other to B. Returns [A, B]
     */
  
    _split_rows = function(c) {
      var a, b, i, k, ref;
      a = [];
      b = [];
      for (i = k = 0, ref = c.length; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
        a.push(c[i].slice(0, c.length));
        b.push(c[i].slice(c.length, 2 * c.length));
      }
      return [a, b];
    };
  
  
    /*
      A macro-cell is an analogue of a quad-tree node in the Hashlife algorithm.
      A macro-cell size is a power of two. Given a macro-cell of size 2^n, we say
      its level is n.
    
      Aside from the four (n-1) child-macro-cells (as in a quad-tree), we also make
      use of a fifth (n-1) child located at the center of the macro-cell. This
      child contains the state of the simulation after 2^(n-2) steps. We refer
      to this fifth child as the 'future' of its parent macro-cell.
     */
  
    MacroCell = (function() {
      MacroCell.from_array = function(a) {
        var i, k, ref, ref1, row_array, row_size;
        row_size = Math.sqrt(a.length);
        row_array = [];
        for (i = k = 0, ref = a.length, ref1 = row_size; ref1 > 0 ? k < ref : k > ref; i = k += ref1) {
          row_array.push(a.slice(i, i + row_size));
        }
        return MacroCell._from_row_array(row_array);
      };
  
      MacroCell._from_row_array = function(a) {
        var j, ne_rows, nw_rows, ref, ref1, se_rows, sw_rows;
        if (a.length === 2) {
          return new MacroCell(a[0][0], a[0][1], a[1][0], a[1][1]);
        } else {
          j = a.length / 2;
          ref = _split_rows(a.slice(0, j)), nw_rows = ref[0], ne_rows = ref[1];
          ref1 = _split_rows(a.slice(j, a.length)), sw_rows = ref1[0], se_rows = ref1[1];
          return new MacroCell(MacroCell._from_row_array(nw_rows), MacroCell._from_row_array(ne_rows), MacroCell._from_row_array(sw_rows), MacroCell._from_row_array(se_rows));
        }
      };
  
      MacroCell._default_library = {
        get: function(nw, ne, sw, se) {
          return new MacroCell(nw, ne, sw, se);
        }
      };
  
      function MacroCell(nw1, ne1, sw1, se1, id, library) {
        this.nw = nw1 != null ? nw1 : dead;
        this.ne = ne1 != null ? ne1 : dead;
        this.sw = sw1 != null ? sw1 : dead;
        this.se = se1 != null ? se1 : dead;
        this.id = id != null ? id : 0;
        this.library = library != null ? library : MacroCell._default_library;
        if (this.nw._level != null) {
          this._level = this.nw._level + 1;
          this._population = this.nw._population + this.ne._population + this.sw._population + this.se._population;
          this.n = this.library.get(this.nw.ne, this.ne.nw, this.nw.se, this.ne.sw);
          this.s = this.library.get(this.sw.ne, this.se.nw, this.sw.se, this.se.sw);
          this.w = this.library.get(this.nw.sw, this.nw.se, this.sw.nw, this.sw.ne);
          this.e = this.library.get(this.ne.sw, this.ne.se, this.se.nw, this.se.ne);
          this.c = this.library.get(this.nw.se, this.ne.sw, this.sw.ne, this.se.nw);
        } else {
          this._level = 1;
          this._population = this.nw + this.ne + this.sw + this.se;
          if (typeof this.nw !== 'number') {
            this.nw = _to_int(this.nw);
            this.ne = _to_int(this.ne);
            this.sw = _to_int(this.sw);
            this.se = _to_int(this.se);
          }
        }
        this._result = null;
      }
  
      MacroCell.prototype._to_row_array = function() {
        var bottom_rows, top_rows;
        if (this._level === 1) {
          return [[this.nw, this.ne], [this.sw, this.se]];
        } else {
          top_rows = _join_rows(this.nw._to_row_array(), this.ne._to_row_array());
          bottom_rows = _join_rows(this.sw._to_row_array(), this.se._to_row_array());
          return top_rows.concat(bottom_rows);
        }
      };
  
      MacroCell.prototype.to_array = function() {
        return this._to_row_array().reduce(function(p, c) {
          return p.concat(c);
        });
      };
  
      MacroCell.prototype._base_case = function() {
        return this.library.get(_step_single(this.nw.se, this.nw.nw + this.nw.ne + this.nw.sw + this.ne.nw + this.ne.sw + this.sw.nw + this.sw.ne + this.se.nw), _step_single(this.ne.sw, this.nw.ne + this.nw.se + this.ne.nw + this.ne.ne + this.ne.se + this.sw.ne + this.se.nw + this.se.ne), _step_single(this.sw.ne, this.nw.sw + this.nw.se + this.ne.sw + this.sw.nw + this.sw.sw + this.sw.se + this.se.nw + this.se.sw), _step_single(this.se.nw, this.nw.se + this.ne.sw + this.ne.se + this.sw.ne + this.sw.se + this.se.ne + this.se.sw + this.se.se));
      };
  
      MacroCell.prototype._recursive_case = function() {
        var lvl1_c, lvl1_e, lvl1_n, lvl1_ne, lvl1_nw, lvl1_s, lvl1_se, lvl1_sw, lvl1_w, lvl2_ne, lvl2_nw, lvl2_se, lvl2_sw;
        lvl1_nw = this.nw.future();
        lvl1_ne = this.ne.future();
        lvl1_sw = this.sw.future();
        lvl1_se = this.se.future();
        lvl1_n = this.n.future();
        lvl1_s = this.s.future();
        lvl1_w = this.w.future();
        lvl1_e = this.e.future();
        lvl1_c = this.c.future();
        lvl2_nw = this.library.get(lvl1_nw, lvl1_n, lvl1_w, lvl1_c).future();
        lvl2_ne = this.library.get(lvl1_n, lvl1_ne, lvl1_c, lvl1_e).future();
        lvl2_sw = this.library.get(lvl1_w, lvl1_c, lvl1_sw, lvl1_s).future();
        lvl2_se = this.library.get(lvl1_c, lvl1_e, lvl1_s, lvl1_se).future();
        return this.library.get(lvl2_nw, lvl2_ne, lvl2_sw, lvl2_se);
      };
  
      MacroCell.prototype.future = function() {
        if (this._result != null) {
          return this._result;
        } else if (this._population === 0) {
          return this._result = this.nw;
        } else if (this._level === 2) {
          return this._result = this._base_case();
        } else if (this._level > 2) {
          return this._result = this._recursive_case();
        }
      };
  
      MacroCell.prototype.level = function() {
        return this._level;
      };
  
      MacroCell.prototype.size = function() {
        return Math.pow(2, this._level);
      };
  
      MacroCell.prototype.step_size = function() {
        return Math.pow(2, this._level - 2);
      };
  
      MacroCell.prototype.population = function() {
        return this._population;
      };
  
      return MacroCell;
  
    })();
  
  
    /*
      The hashlife algorithm takes advantage of pattern-redundancy in the
      simulation. It does so by macro-cell reuse. Every time a new macro-cell is
      needed, the library will first check if it has not already been computed, and
      if it has, then it yields a reference to the existing instance.
    
      In order to quickly match a given macro-cell with the library's existing
      collection, we use a hash-table. When creating a new cell, it is given a
      unique hash string - it is a combination of its children's hashes.
     */
  
    Library = (function() {
      Library._hash = function(nw, ne, sw, se) {
        if ((nw._level != null) && nw._level >= 1) {
          return nw.id + "-" + ne.id + "-" + sw.id + "-" + se.id;
        } else {
          return ((nw << 3) | (ne << 2) | (sw << 1) | se).toString();
        }
      };
  
      function Library() {
        this._id = 0;
        this._map = new Object();
      }
  
      Library.prototype.size = function() {
        return this._id;
      };
  
      Library.prototype.get = function(nw, ne, sw, se) {
        var key, value;
        key = Library._hash(nw, ne, sw, se);
        value = this._map[key];
        if (value === void 0) {
          this._map[key] = new MacroCell(nw, ne, sw, se, this._id, this);
          ++this._id;
          return this._map[key];
        } else {
          return value;
        }
      };
  
      return Library;
  
    })();
  
  
    /*
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
     */
  
    Simulation = (function() {
  
      /*
        @param  exp   Universe size exponent
      
        @details
          Creates a universe with size 2^exp, capable of computing 2^(exp - 2)
          generations into the future.
       */
      function Simulation(exp) {
        this._size = Math.pow(2, exp);
        this._init_library(exp);
      }
  
      Simulation.prototype._init_library = function(level) {
        var i, results;
        this._library = new Library;
        this._root = this._library.get(dead, dead, dead, dead);
        i = 1;
        results = [];
        while (i < level) {
          this._root = this._library.get(this._root, this._root, this._root, this._root);
          results.push(++i);
        }
        return results;
      };
  
      Simulation.prototype.size = function() {
        return this._size;
      };
  
      Simulation.prototype._get_child = function(cell, x, y) {
        var h, key;
        key = '';
        h = cell.size() * 0.25;
        if (x < 0) {
          x += h;
          if (y < 0) {
            key = 'sw';
            y += h;
          } else {
            key = 'nw';
            y -= h;
          }
        } else {
          x -= h;
          if (y < 0) {
            key = 'se';
            y += h;
          } else {
            key = 'ne';
            y -= h;
          }
        }
        return {
          key: key,
          x: x,
          y: y
        };
      };
  
      Simulation.prototype._trace_to_base = function(x, y) {
        var cell, record, trace;
        trace = [];
        cell = this._root;
        while (cell.level != null) {
          record = this._get_child(cell, x, y);
          record.parent = cell;
          trace.push(record);
          cell = cell[record.key];
          x = record.x;
          y = record.y;
        }
        return trace;
      };
  
      Simulation.prototype.set = function(x, y) {
        var h, i, q, record, replacement, trace;
        h = this._size * 0.5;
        if (x < -h || x >= h || y < -h || y >= h) {
          return;
        }
        replacement = alive;
        trace = this._trace_to_base(x, y);
        i = trace.length - 1;
        while (i >= 0) {
          record = trace[i];
          q = {
            nw: record.parent.nw,
            ne: record.parent.ne,
            sw: record.parent.sw,
            se: record.parent.se
          };
          q[record.key] = replacement;
          replacement = this._library.get(q.nw, q.ne, q.sw, q.se);
          --i;
        }
        return this._root = replacement;
      };
  
      Simulation.prototype._get = function(t, _cell, _tx, _ty) {
        var c, e, h, living, n, ne, nw, s, se, sw, w;
        if (_cell == null) {
          _cell = this._root;
        }
        if (_tx == null) {
          _tx = 0;
        }
        if (_ty == null) {
          _ty = 0;
        }
        living = [];
        if (_cell.population() === 0) {
          return living;
        } else if (_cell._level === 1) {
          if (_cell.nw === alive) {
            living.push({
              x: -1 + _tx,
              y: _ty
            });
          }
          if (_cell.ne === alive) {
            living.push({
              x: _tx,
              y: _ty
            });
          }
          if (_cell.sw === alive) {
            living.push({
              x: -1 + _tx,
              y: -1 + _ty
            });
          }
          if (_cell.se === alive) {
            living.push({
              x: _tx,
              y: -1 + _ty
            });
          }
          return living;
        } else {
          h = _cell.step_size();
          if (t >= h) {
            return this._get(t - h, _cell.future(), _tx, _ty);
          } else {
            if (t > 0) {
              n = this._get(t, _cell.n, _tx, _ty + h);
              s = this._get(t, _cell.s, _tx, _ty - h);
              e = this._get(t, _cell.e, _tx + h, _ty);
              w = this._get(t, _cell.w, _tx - h, _ty);
              c = this._get(t, _cell.c, _tx, _ty);
              living = living.concat(n, s, e, w, c);
            }
            nw = this._get(t, _cell.nw, _tx - h, _ty + h);
            ne = this._get(t, _cell.ne, _tx + h, _ty + h);
            sw = this._get(t, _cell.sw, _tx - h, _ty - h);
            se = this._get(t, _cell.se, _tx + h, _ty - h);
            living = living.concat(nw, ne, sw, se);
            if (_cell === this._root) {
              living = _remove_duplicates(living, function(p) {
                return p.x + "," + p.y;
              });
            }
            return living;
          }
        }
      };
  
      Simulation.prototype.get = function(exp) {
        return this._get((exp >= 0 ? Math.pow(2, exp) : 0));
      };
  
      return Simulation;
  
    })();
  
    root = this;
  
    if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
      module.exports.MacroCell = MacroCell;
      module.exports.Library = Library;
      module.exports.Simulation = Simulation;
      module.exports.dead = dead;
      module.exports.alive = alive;
    }
  
    root.gol = {
      MacroCell: MacroCell,
      Library: Library,
      Simulation: Simulation,
      dead: dead,
      alive: alive
    };
  
  }).call(this);
//// end of documentation





































// direct structures
var glider = [
    {x : 22, y : 22},
    {x : 21, y : 22},
    {x : 20, y : 22},
    {x : 20, y : 21},
    {x : 21, y : 20}    
];


var glidergun = [
    {x: 14, y: 25},
 {x: 15, y: 23},
 {x: 15, y: 25},
 {x: 16, y: 13},
 {x: 16, y: 14},
 {x: 16, y: 21},
 {x: 16, y: 22},
 {x: 16, y: 35},
 {x: 16, y: 36},
 {x: 17, y: 12},
{x: 17, y: 16},
{x: 17, y: 21},
{x: 17, y: 22},
{x: 17, y: 35},
{x: 17, y: 36},
{x: 18, y: 1},
{x: 18, y: 2},
{x: 18, y: 11},
{x: 18, y: 17},
{x: 18, y: 21},
{x: 18, y: 22},
{x: 19, y: 1},
{x: 19, y: 2},
{x: 19, y: 11},
{x: 19, y: 15},
{x: 19, y: 17},
{x: 19, y: 18},
{x: 19, y: 23},
{x: 19, y: 25},
{x: 20, y: 11},
{x: 20, y: 17},
{x: 20, y: 25},
{x: 21, y: 12},
{x: 21, y: 16},
{x: 22, y: 13},
{x: 22, y: 14}
];


var spaceship = [
 {x: 19, y: 3},
 {x: 20, y: 1},
 {x: 20, y: 5},
 {x: 21, y: 6},
 {x: 22, y: 1},
 {x: 22, y: 6},
 {x: 23, y: 2},
 {x: 23, y: 3},
 {x: 23, y: 4},
 {x: 23, y: 5},
 {x: 23, y: 6}
];


var pulsar = [
    {x: 16, y: 16},
    {x: 16, y: 17},
    {x: 16, y: 21},
    {x: 16, y: 22},
    {x: 16, y: 23},
    {x: 18, y: 13},
    {x: 18, y: 18},
    {x: 18, y: 20},
    {x: 18, y: 25},
    {x: 16, y: 15},
{x: 19, y: 13},
{x: 19, y: 18},
{x: 19, y: 20},
{x: 19, y: 25},
{x: 20, y: 13},
{x: 20, y: 18},
{x: 20, y: 20},
{x: 20, y: 25},
{x: 21, y: 15},
{x: 21, y: 16},
{x: 21, y: 17},
{x: 21, y: 21},
{x: 21, y: 22},
{x: 21, y: 23},
{x: 23, y: 15},
{x: 23, y: 16},
{x: 23, y: 17},
{x: 23, y: 21},
{x: 23, y: 22},
{x: 23, y: 23},
{x: 24, y: 13},
{x: 24, y: 18},
{x: 24, y: 20},
{x: 24, y: 25},
{x: 25, y: 13},
{x: 25, y: 18},
{x: 25, y: 20},
{x: 25, y: 25},
{x: 26, y: 13},
{x: 26, y: 18},
{x: 26, y: 20},
{x: 26, y: 25},
{x: 28, y: 15},
{x: 28, y: 16},
{x: 28, y: 17},
{x: 28, y: 21},
{x: 28, y: 22},
{x: 28, y: 23},
];











var canvaswidth =  676;
var canvasheight = 676;
var len = 15;
var cols = canvaswidth / len; 
var rows = canvasheight / len;
// function stop and start functionality
var statusGen = false;
var GenID;
var time = 0

var colors = [];
var Neighbours_count = [];

// Drawing section

function setup() {
  createCanvas(675, 675);
  for (var i = 0; i < rows; i++){
    colors[i] = [];
    Neighbours_count[i] = [];
    for (var j = 0; j < cols; j++){
      colors[i].push(255);
      Neighbours_count[i].push(0);
    }
  }
}

function draw() {
  background(220);
  for (var i = 0; i < rows; i++)
  for (var j = 0; j < cols; j++){
  {
      var x = j * len;
      var y = i * len;
      fill(colors[i][j])      
      rect(x, y, len, len); 
    }
  }
}

function mousePressed(){
  for (var i = 0; i < rows; i++){
    for (var j = 0; j < cols; j++){
      var x = j * len;
      var y = i * len;
      if (isInside(x, y, len, len)){
        ToggleState(i, j);
      }
    }
  }
}

function isInside(x, y, w, h){
  if(mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) 
    return true; 
  else 
    return false;
}

function ToggleState(i, j){
    if (colors[i][j] == 255)
      colors[i][j] = 1;
    else
      colors[i][j] = 255;
}


// Logic Section : Finding Neighbours
function __findneighboursCount(){

  for (var i = 0; i < rows; i++){
    for (var j = 0; j < cols; j++){
      Neighbours_count[i][j] = 0;
      // there are maximum  8 neighbors for each cell
      // ++
      if ( i + 1 < rows && j + 1 < cols && isActive(i + 1, j + 1))
        Neighbours_count[i][j]++;
      // --
      if ( i - 1 >= 0 && j - 1 >= 0 && isActive(i - 1, j - 1))
        Neighbours_count[i][j]++;
      // +-
      if ( i + 1 < rows && j - 1 >= 0 && isActive(i + 1, j - 1))
        Neighbours_count[i][j]++;
      // -+
      if ( i - 1 >= 0 && j + 1 < cols && isActive(i - 1, j + 1))
        Neighbours_count[i][j]++;
      // +0
      if ( i + 1 < rows && j < cols && isActive(i + 1, j))
        Neighbours_count[i][j]++;
      // -0
      if ( i - 1 >= 0 && j < cols && isActive(i - 1, j))
        Neighbours_count[i][j]++;
      // 0+
      if ( i < rows && j + 1 < cols && isActive(i, j + 1))
        Neighbours_count[i][j]++;
      // 0-
      if ( i < rows && j - 1 >= 0 && isActive(i, j - 1))
        Neighbours_count[i][j]++;
    }
  }
}

function isActive(i, j){
  if (colors[i][j] == 1)
    return true;
  else
    return false;
}

// Logic Section : Next Generation
// Any live cell with fewer than two live neighbours dies, as if by underpopulation.
// Any live cell with two or three live neighbours lives on to the next generation.
// Any live cell with more than three live neighbours dies, as if by overpopulation.
// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

// Any live cell with two or three live neighbours survives.
// Any dead cell with three live neighbours becomes a live cell.
// All other live cells die in the next generation. Similarly, all other dead cells stay dead.

function __nextGeneration(){

  __findneighboursCount();
  for (var i = 0; i < rows; i++){
    for (var j = 0; j < cols; j++){

      if (isActive(i, j)){
        if (Neighbours_count[i][j] > 3 || Neighbours_count[i][j] < 2)
          ToggleState(i, j);
      }
      else{
        if (Neighbours_count[i][j] == 3 )
          ToggleState(i, j);
      }

    }
  }
  currentGeneration++;
  var totalgen = document.getElementById("currentGen");
    totalgen.innerHTML = currentGeneration;
    var timeelap = document.getElementById("timeelap");
    timeelap.innerHTML =( Date.now() - time)/1000;
}

function Control(){
  const button = document.getElementById("PlayPause");
  if (statusGen == true){
    clearInterval(GenID);
    button.innerHTML = "Play";
  }
  else{
    if (time == 0)
          time = Date.now();
    button.innerHTML = "Pause";
    GenID = setInterval(__nextGeneration, 200);
  }
  statusGen = !statusGen;
}

function Clear(){
  for (var i = 0; i < rows; i++)
    for (var j = 0; j < cols; j++)
      colors[i][j] = 255;
  time = 0;
  currentGeneration = 0
}

function changeRuleDirect(){
    var elements = document.getElementById("ruleDirect").elements;
    for(var i = 0 ; i < elements.length - 1; i++){
        var item = elements.item(i);
        console.log(item)
        console.log(item.checked)
        if (item.checked == true && item.name == "Glider"){
            __draw__givenDesign(glider);
        }
        else if (item.checked == true && item.name == "GliderGun"){
            __draw__givenDesign(glidergun);  
            console.log(glidergun)          
        }
        else if (item.checked == true && item.name == "Spaceship"){
            __draw__givenDesign(spaceship);            
        }
        else if (item.checked == true && item.name == "Pulsar"){
            __draw__givenDesign(pulsar);            
        }
    }
    return false;
}


function getfutureGen(){
    const futuregen = document.getElementById("futuregen").value;
    var arr = [];
    for (var i = 0; i < rows; i++)
        for (var j = 0; j < cols; j++)
            if(colors[i][j] == 1)
                arr.push({x : i, y : j});
    const gen0 = arr;

    var sim = new gol.Simulation(45);
    for (var i in gen0) {
        const p = gen0[i]
        sim.set(p.x, p.y)  // Sets the cell to 'alive'
    }
    const population = sim.get(parseInt(futuregen))
    console.log(futuregen)
    console.log(gen0)
    console.log(population)
    __draw__givenDesign(population);
    return false;
}



function __draw__givenDesign(gen0){
    Clear();

    for (var i in gen0){
        const p = gen0[i]
        var x = p.x * len;
        var y = p.y * len;
        // console.log(x, y)
        console.log(p.x, p.y)
        colors[p.x][p.y] = 1      
        rect(x, y, len, len); 
    }
    return false;
}



function returnDark(){
    var arr = [];
    for (var i = 0; i < rows; i++)
        for (var j = 0; j < cols; j++)
            if(colors[i][j] == 1)
                arr.push({x : i, y : j});
    return arr;
}

