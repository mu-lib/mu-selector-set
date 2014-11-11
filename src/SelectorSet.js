(function() {
    'use strict';

    /* istanbul ignore next */
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

        var IGNORE_BOUNDARIES = ['\'', '"'],
            SELECTORS_DELIMITER = ',';

        /**
         * A SelectorSet is an object which manages a set of CSS selectors.
         * It provides two core functionalities:
         * 1. Adding selectors to the set.
         * 2. Matching a DOM element against selectors in the set and retrieving
         *    an array of selectors which match the element.
         * The SelectorSet object internal implementation takes care of indexing
         * the selectors added to it, such that later retrieving matches against
         * a DOM object is very fast.
         * The indexing is done according to:
         * 1. The most significant part of the selector.
         * 2. The type of the most significant type.
         * For example, the selector `".parent .child#bobby"` will be indexed as
         * an ID selector with the ID `"#bobby"`.
         * @constructor
         */
        function SelectorSet() {
            this.subsets = Subsets();
        }

        /**
         * matchesSelector is a function which checks if an element matches a
         * selector.
         * It can be overridden by the user by:
         * 1. Overriding the prototype, thus modifying all instances of
         *    SelectorSet:
         *    ```
         *    SelectorSet.prototype.matchesSelector = customFunction`;
         *    var sSet = new SelectorSet();
         *    ```
         * 2. Overriding the instance, thus modifying a specific instance of
         *    SelectorSet:
         *    ```
         *    var sSet = new SelectorSet();
         *    sSet.matchesSelector = customFunction`;
         *    ```
         * @param element {DOMElement} The element to match
         * @param selector {String} The selector to match against
         * @returns true if the element matches the selector. false otherwise.
         */
        SelectorSet.prototype.matchesSelector = matchesSelector;

        /**
         * Add a selector to the set.
         * @param selector {String} The selector to add.
         * @param datum1, datum2, ... Arbitrary number of additional parameters
         * which will be added with the selector as associated data.
         * @returns {SelectorSet}
         */
        SelectorSet.prototype.add = function(selector) {
            // selector might actually contain multiple selections seperated
            // by a comma. we need to separate them.
            var args = Array.prototype.slice.call(arguments), 
                from = 0, 
                len = 0, 
                tot = selector.length,
                flag = false; // ignore flag
            while (from + len < tot) {
                while (
                    selector[from + len] &&
                    (flag || selector[from + len] !== SELECTORS_DELIMITER)
                ) {
                    if (selector[from + len] === flag){
                        flag = false;
                    } else if (
                        flag === false && 
                        IGNORE_BOUNDARIES.indexOf(selector[from + len]) !== -1
                    ){
                        flag = selector[from + len];
                    }
                    len++;
                }
                args.splice(0, 1, selector.substr(from, len));
                _add.apply(this, args);
                from += len + 1;
                len = 0;
            }
            return this;
        };

        function _add( /* selector, arg1, arg2, ... */ ) {
            var i, subset, key,
                args = Array.prototype.slice.call(arguments);
            args[0] = args[0].trim();
            key = classify(args[0]);
            for (i = 0; i < this.subsets.length; i++) {
                subset = this.subsets[i];
                if (subset.isOfType(key)) {
                    subset.add(key, args);
                    return;
                }
            }
        }

        /**
         * Match DOM elements to selectors in the set.
         * @param el1, el2, ... The DOM elements to match.
         * @returns {Array} An array of arrays. Each sub-array is a selector
         * that matches the elements + the data this selector was added with.
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
