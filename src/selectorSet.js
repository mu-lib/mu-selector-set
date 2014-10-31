'use strict';

(function () {
    if (typeof define === 'function' && define.amd) {
        define([
            './classifier',
            './matchesSelector',
            './IndexedSet'
        ], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(
            require('./classifier'),
            require('./matchesSelector'),
            require('./IndexedSet')
        );
    } else {
        throw Error("no module loader found");
    }

    function factory(classify, matchesSelector, IndexedSet) {

        var sets = [{
            name: "id",
            test: /^#.+$/.test,
            map: function (el) {
                return el.id ? [el.id] : [];
            }
        }, {
            name: "class",
            test: /^\..+$/.test,
            map: function (el) {
                var classes = el.className;
                if (typeof classes === 'string')
                    return classes.split(/\s+/);
                if (typeof classes === 'object' && 'baseVal' in classes)
                    return classes.baseVal.split(/\s+/);
                return [];
            }
        }, {
            name: "tag",
            test: /^[^\*\.#].*$/.test,
            map: function (el) {
                return [el.nodeName];
            }
        }, {
            name: "other",
            test: /^\*$/.test,
            map: function () {
                return ['*'];
            }
        }];

        function SelectorSet() {
            this.indexedSets = {};
            var i, setType;
            for (i = 0; i < sets.length; setType = sets[i++]) {
                this.indexedSets[setType.name] = new IndexedSet();
            }
        }

        SelectorSet.prototype.add = function (selector, data) {
            var i, setType, key = classify(selector);
            for (i = 0; i < sets.length; setType = sets[i++]) {
                if (setType.test(key)) {
                    this.indexedSets[setType.name].add(key, {
                        selector: selector,
                        data: data
                    });
                    return this;
                }
            }
            return this;
        };

        /**
         * Match a DOM element to selectors in the set.
         * @param el The DOM element to match.
         * @returns A list of selectors that match the element
         */
        SelectorSet.prototype.matches = function (el) {
            var i, j, k, set, elKey, elKeys, candidate, candidates, res = [];
            for (i = 0; i < sets.length; set = sets[i++]) {
                elKeys = setType.map(el);
                for (j = 0; j < elKeys.length; elKey = elKeys[j++]) {
                    candidates = this.indexedSets[setType.name].get(key);
                    for (k = 0; k < candidates.length; candidate = candidates[k++]) {
                        if (matchesSelector(el, candidate))
                            res.push(candidate);
                    }
                }
            }
            return res;
        };

        return SelectorSet;
    }
}());
