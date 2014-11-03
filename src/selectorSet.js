'use strict';

(function() {
    if (typeof define === 'function' && define.amd) {
        define([
            './classifier',
            './Subsets',
            './matchesSelector'
        ], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(
            require('./classifier'),
            require('./Subsets'),
            require('./matchesSelector')
        );
    } else {
        throw Error("no module loader found");
    }

    function factory(classify, Subsets, matchesSelector) {

        function SelectorSet() {
            this.subsets = Subsets();
        }

        // matchesSelector can be overridden by the user.
        SelectorSet.prototype.matchesSelector = matchesSelector;

        SelectorSet.prototype.add = function(selector) {
            var i, subset,
                args = Array.prototype.slice.call(arguments),
                key = classify(selector);
            for (i = 0; i < this.subsets.length; i++) {
                subset = this.subsets[i];
                if (subset.isOfType(key)) {
                    subset.add(key, args);
                    return this;
                }
            }
            return this;
        };

        /**
         * Match DOM elements to selectors in the set.
         * @param el1, el2, ... The DOM elements to match.
         * @returns A list of selectors that match the elements
         */
        SelectorSet.prototype.matches = function() {
            var i, j, k, t, el, subset, elKey, elKeys, candidate, candidates,
                res = [],
                els = Array.prototype.slice.call(arguments);
            els = Array.prototype.concat.apply([], els); // flatten 'els'
            for (t = 0; t < els.length; t++) {
                el = els[t];
                for (i = 0; i < this.subsets.length; i++) {
                    subset = this.subsets[i];
                    elKeys = subset.extractElementKeys(el);
                    for (j = 0; j < elKeys.length; j++) {
                        elKey = elKeys[j];
                        candidates = subset.get(elKey);
                        for (k = 0; k < candidates.length; k++) {
                            candidate = candidates[k];
                            if (res.indexOf(candidate) === -1 &&
                                this.matchesSelector(el, candidate[0]))
                                res.push(candidate);
                        }
                    }
                }
            }
            return res;
        };

        return SelectorSet;
    }
}());
