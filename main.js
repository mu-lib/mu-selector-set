'use strict';

(function() {

    if (typeof define === 'function' && define.amd) {
        define(['./src/SelectorSet.js'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(
            require('./src/SelectorSet.js')
        );
    } else {
        throw Error("no module loader found");
    }

    function factory(SelectorSet) {
        return SelectorSet;
    }

})();
