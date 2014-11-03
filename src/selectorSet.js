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

        SelectorSet.prototype.add = function(selector) {
            var i, subset,
                data = Array.prototype.slice.call(arguments, 1),
                key = classify(selector);
            for (i = 0; i < this.subsets.length; i++) {
                subset = this.subsets[i];
                if (subset.isOfType(key)) {
                    subset.add(key, {
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
        SelectorSet.prototype.matches = function(el) {
            var i, j, k, subset, elKey, elKeys, candidate, candidates, res = [];
            for (i = 0; i < this.subsets.length; i++) {
                subset = this.subsets[i];
                elKeys = subset.extractElementKeys(el);
                for (j = 0; j < elKeys.length; j++) {
                    elKey = elKeys[j];
                    candidates = subset.get(elKey);
                    for (k = 0; k < candidates.length; k++) {
                        candidate = candidates[k];
                        if (matchesSelector(el, candidate.selector))
                            res.push(candidate);
                    }
                }
            }
            return res.map(function(r) {
                var m = [r.selector];
                Array.prototype.push.apply(m, r.data);
                return m;
            });
        };

        return SelectorSet;
    }
}());
