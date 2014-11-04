(function() {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['./MappedLists'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('./MappedLists'));
    } else {
        throw Error("no module loader found");
    }

    function factory(MappedLists) {

        function Subset(re, extractor, ci) {
            var mappedLists = new MappedLists();
            this.isOfType = function(selector) {
                return re.test(selector);
            };
            this.extractElementKeys = extractor;
            this.add = function(key, data) {
                mappedLists.add(ci ? key.toLowerCase() : key, data);
                return this;
            };
            this.get = function(key) {
                return mappedLists.get(ci ? key.toLowerCase() : key);
            };
        }

        return function() {

            var subsets = [];

            // ID selectors subset
            subsets.push(
                new Subset(
                    /^#.+$/,
                    function(el) {
                        return el.id ? ["#" + el.id] : [];
                    }
                )
            );

            // CLASS selectors subset
            subsets.push(
                new Subset(
                    /^\..+$/,
                    function(el) {
                        var res = [], classes = el.className;
                        if (typeof classes === 'string')
                            res = classes.split(/\s+/);
                        if (typeof classes === 'object' && 'baseVal' in classes)
                            res = classes.baseVal.split(/\s+/);
                        return res.map(function(r) {
                            return "." + r;
                        });
                    }
                )
            );

            // TAG selectors subset
            subsets.push(
                new Subset(
                    /^[^\*\.#].*$/,
                    function(el) {
                        return [el.nodeName];
                    },
                    true // case insensitive
                )
            );

            // other selectors subset
            subsets.push(
                new Subset(
                    /^\*$/,
                    function(el) {
                        return ['*'];
                    }
                )
            );

            return subsets;

        };

    }
}());
