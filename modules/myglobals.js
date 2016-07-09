'use strict'

var myglobals = {};

myglobals.redis = null;
var _dict = {};

myglobals.getVar = function getVar(key, cb) {
    if (myglobals.redis) {
        myglobals.redis.get(key, (e, s) => cb && cb(e, s));
    }
    else {
        cb(null, _dict[key]);
    }
}

myglobals.setVar = function setVar(k, v) {
    if (myglobals.redis) {
        myglobals.redis.set(k, v);
    }
    else {
        _dict[k] = v;
    }
}


module.exports = myglobals;