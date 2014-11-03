'use strict';

(function() {
    if (typeof define === 'function' && define.amd) {
        define(['sizzle'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('sizzle'));
    } else {
        throw Error("no module loader found");
    }

    function factory(sizzle) {
        return sizzle.matchesSelector;
    }
}());
