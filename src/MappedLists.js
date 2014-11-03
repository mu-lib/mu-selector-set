'use strict';

(function(global) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        throw Error("no module loader found");
    }

    function factory() {

        function MappedLists() {
            this.lists = {};
        }

        MappedLists.prototype.add = function(key, data) {
            key += " ";
            this.lists[key] = this.lists[key] || [];
            this.lists[key].push(data);
            return this;
        };

        MappedLists.prototype.get = function(key) {
            key += " ";
            return this.lists[key] || [];
        };

        return MappedLists;
    }
}(this));
