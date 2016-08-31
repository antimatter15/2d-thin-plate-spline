var matrix_invert = require('./invert.js');

function base_func(x1, y1, x2, y2){
    if(x1 == x2 && y1 == y2) return 0;
    var dist = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)
    return dist * Math.log(dist)
}

module.exports = function(P, Q){
    var m = P.length;

    // initialize a big zero matrix
    var A = []
    for(var i = 0; i < m + 3; i++){
        A[i] = []
        for(var j = 0; j < m + 3; j++)
            A[i][j] = 0;
    }

    for(var i = 0; i < m; i++){
        // top right part of matrix
        A[0][3 + i] = 1
        A[1][3 + i] = P[i][0]
        A[2][3 + i] = P[i][1]

        // bottom left part of matrix
        A[3+i][0] = 1
        A[3+i][1] = P[i][0]
        A[3+i][2] = P[i][1]
    }

    // the lower right part of the matrix
    for(var r = 0; r < m; r++){
        for(var c = 0; c < m; c++){
            A[r+3][c+3] = base_func(P[r][0], P[r][1], P[c][0], P[c][1])
            A[c+3][r+3] = A[r+3][c+3]
        }
    }

    var invA = matrix_invert(A)

    // compute arrays
    var Xc = new Float64Array(m + 3),
        Yc = new Float64Array(m + 3);
    for(var r = 0; r < m + 3; r++){
        for(var c = 0; c < m; c++){
            Xc[r] += invA[r][c+3] * Q[c][0]
            Yc[r] += invA[r][c+3] * Q[c][1]
        }
    }

    return function(Px, Py){
        var Xo = Xc[0] + Xc[1] * Px + Xc[2] * Py, 
            Yo = Yc[0] + Yc[1] * Px + Yc[2] * Py;
        for(var r = 0; r < m; r++){
            var tmp = base_func(Px, Py, P[r][0], P[r][1])
            Xo += Xc[r + 3] * tmp
            Yo += Yc[r + 3] * tmp
        }
        return [Xo, Yo]
    }
}