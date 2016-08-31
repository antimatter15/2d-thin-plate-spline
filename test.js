var tps = require('./index.js')


// source coordinates
var P = [[0, 0], [0, 10], [10, 0]]
// target coordinates
var Q = [[50, 50], [50, 60], [60, 50]]

// returns a function interpolating (x, y) => [x', y']
var project = tps(P, Q)

console.log(project(0, 5)) // [ 50, 55 ]

