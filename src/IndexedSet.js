'use strict';

(function (global) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        throw Error("no module loader found");
    }

    function factory() {

        function IndexedSet() {
            this.sets = {};
        }

        IndexedSet.prototype.add = function (key, data) {
            key += " ";
            this.sets[key] = this.sets[key] || [];
            this.sets[key].push(data);
            return this;
        };

        IndexedSet.prototype.get = function (key) {
            key += " ";
            return this.sets[key] || [];
        };

        return IndexedSet;
    }
}(this));
