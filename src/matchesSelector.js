'use strict';

(function() {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        throw Error("no module loader found");
    }

    function factory() {
        var docElem = window.document.documentElement,
            matchesSelector = docElem.matches ||
                docElem.matchesSelector ||
                docElem.webkitMatchesSelector ||
                docElem.mozMatchesSelector ||
                docElem.oMatchesSelector ||
                docElem.msMatchesSelector ||
                matchesSelectorPoly;

        function matchesSelectorPoly(selector) {
            var element = this;
            var matches = (element.document || element.ownerDocument).querySelectorAll(selector);
            var i = 0;
            while (matches[i] && matches[i] !== element) {
                i++;
            }
            return matches[i] ? true : false;
        }

        return function(element, selector) {
            return matchesSelector.call(element, selector);
        }
    }
}());
