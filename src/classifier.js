'use strict';

(function () {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        throw Error("no module loader found");
    }

    function factory() {

        var re = {
            ws: /(\s+)$/,
            garbage: /(\:.+?|\[.*?\])$/,
            id: /^#(?:[\w\u00c0-\uFFFF\-]|\\.)+/,
            cls: /^\.(?:[\w\u00c0-\uFFFF\-]|\\.)+/,
            candidate: /([#\.]{0,1}(?:[\w\u00c0-\uFFFF\-]|\\.)+?)$/
        };

        /**
         * Get the most significant part of a CSS selector.
         * The "significant" part is defined as any leading id, class name or
         * tag name component (in that order of precedence) of the last
         * (right most) selector.
         *
         * See test/classifier.js for examples
         *
         * @private
         * @static
         * @param {String} selector CSS selector
         * @return {String} the most significant part of the selector
         */
        function classifier(selector) {
            var i, m, l, candidates = [];
            selector = selector.replace(re.ws, "");
            selector = selector.replace(re.garbage, "");
            while (m = selector.match(re.candidate)) {
                selector = selector.replace(re.candidate, "");
                selector = selector.replace(re.garbage, "");
                candidates.push(m[0]);
            }
            l = candidates.length;
            // if no candidates, return the universal selector
            if (!l)
                return '*';
            // return the ID part of the selector:
            for (i = 0; i < l; i++)
                if (re.id.test(candidates[i]))
                    return candidates[i];
            // if no ID, return the class
            for (i = 0; i < l; i++)
                if (re.cls.test(candidates[i]))
                    return candidates[i];
            // if no class, return the tag
            return candidates[0];
        }

        return classifier;
    }
}());
