###
 @author Raoul Harel
 @license The MIT license (LICENSE.txt)
 @copyright 2015 Raoul Harel
 @url rharel/node-gol-hashlife on GitHub
###

measure = require('./measure.test')
helpers = require('./../helpers.test')
from_rle = helpers.from_rle

# Patterns were independently generated using Golly (golly.sourceforge.net)

# The '104P177' pattern at t = 0
gen0 = from_rle(0, 0, 46, 46,
  '16bo12bo16b$9b2o24b2o9b$8b3o3b2o14b2o3b3o8b$14b2ob2o8b2ob2o14b$16bo12b
  o16b4$2bo40bo2b$b2o40b2ob$b2o40b2ob4$2b2o38b2o2b$2b2o38b2o2b$o3bo36bo
  3bo$3bo38bo3b$3bo38bo3b9$3bo38bo3b$3bo38bo3b$o3bo36bo3bo$2b2o38b2o2b$
  2b2o38b2o2b4$b2o40b2ob$b2o40b2ob$2bo40bo2b4$16bo12bo16b$14b2ob2o8b2ob
  2o14b$8b3o3b2o14b2o3b3o8b$9b2o24b2o9b$16bo12bo!')
# The pattern at t = 2^15
gen2p15 = from_rle(-2, -2, 50, 50,
  '13b2o20b2o$12bo2bo18bo2bo$11bo26bo$11bo4b4o10b4o4bo$11bo2b4o2bo8bo2b4o
  2bo$12b5o4bo6bo4b5o$17bo3bo6bo3bo$17bo3bo6bo3bo$15b2o4bo6bo4b2o$15b4o
  2bo6bo2b4o$17bo3bo6bo3bo$2b3o10b2o16b2o10b3o$bo3bo14bo8bo14bo3bo$o4bo
  10bo2bo10bo2bo10bo4bo$o3b2o11bo14bo11b2o3bo$bo2b2o2b2obo26bob2o2b2o2bo
  $3b3o2b2obobo22bobob2o2b3o$3b2ob2ob2o3bo20bo3b2ob2ob2o$3bo5bo30bo5bo$
  3bo9bo22bo9bo$4bo7bo24bo7bo$5b6o28b6o7$5b6o28b6o$4bo7bo24bo7bo$3bo9bo
  22bo9bo$3bo5bo30bo5bo$3b2ob2ob2o3bo20bo3b2ob2ob2o$3b3o2b2obobo22bobob
  2o2b3o$bo2b2o2b2obo26bob2o2b2o2bo$o3b2o11bo14bo11b2o3bo$o4bo10bo2bo10b
  o2bo10bo4bo$bo3bo14bo8bo14bo3bo$2b3o10b2o16b2o10b3o$17bo3bo6bo3bo$15b
  4o2bo6bo2b4o$15b2o4bo6bo4b2o$17bo3bo6bo3bo$17bo3bo6bo3bo$12b5o4bo6bo4b
  5o$11bo2b4o2bo8bo2b4o2bo$11bo4b4o10b4o4bo$11bo26bo$12bo2bo18bo2bo$13b
  2o20b2o!'
  .replace(/\s/, '')
)
# The pattern at t = 2^24
gen2p24 = from_rle(-5, -5, 56, 56,
  '16bo22bo$15bo2bo4b2o6b2o4bo2bo$16b2o4bo2bo4bo2bo4b2o$23b2o6b2o$12bo5bo
  18bo5bo$12bo5bo18bo5bo$12bo5bo18bo5bo2$14b3o22b3o4$4b3o42b3o2$8bo38bo$
  bo6bo38bo6bo$obo5bo38bo5bobo$2bo50bo$bo2b3o42b3o2bo4$2bo50bo$bobo48bob
  o$bobo48bobo$2bo50bo5$2bo50bo$bobo48bobo$bobo48bobo$2bo50bo4$bo2b3o42b
  3o2bo$2bo50bo$obo5bo38bo5bobo$bo6bo38bo6bo$8bo38bo2$4b3o42b3o4$14b3o
  22b3o2$12bo5bo18bo5bo$12bo5bo18bo5bo$12bo5bo18bo5bo$23b2o6b2o$16b2o4bo
  2bo4bo2bo4b2o$15bo2bo4b2o6b2o4bo2bo$16bo22bo!'
  .replace(/\s/, '')
)

measure('104P177', gen0, gen2p15, 15)
measure('104P177', gen0, gen2p24, 24)