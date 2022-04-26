###
 @author Raoul Harel
 @license The MIT license (LICENSE.txt)
 @copyright 2015 Raoul Harel
 @url rharel/node-gol-hashlife on GitHub
###

# Sorts array of positions
exports.by_x_then_y = (a, b) ->
  c = a.x - b.x
  if c isnt 0 then c else (a.y - b.y)

# Converts .rle data to array of living cell positions.
exports.from_rle = (sx, sy, w, h, data) ->
  living = []
  x = sx
  y = sy
  n = ''
  for c, i in data
    do ->
      if c is '$'
        x = sx
        n = if n is '' then 1 else parseInt(n)
        y += n
        n = ''
      else if c is 'b'
        n = if n is '' then 1 else parseInt(n)
        x += n
        n = ''
      else if c is 'o'
        q = n
        n = if n is '' then 1 else parseInt(n)
        living.push({x: x++, y: y}) for j in [1..n]
        n = ''
      else if !isNaN(parseInt(c))
        n += c
  return living