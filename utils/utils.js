
'use strict';
const groupBy2 = function (xs, prop) {
    var grouped = {};
    for (var i=0; i<xs.length; i++) {
        var p = xs[i][prop];
        if (!grouped[p]) { grouped[p] = []; }
        grouped[p].push(xs[i]);
    }
    return grouped;
}

module.exports = {
    groupBy2: groupBy2
}
