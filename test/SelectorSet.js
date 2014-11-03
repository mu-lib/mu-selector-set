'use strict';

var assert = require('assert'),
    jsdom = require("jsdom").jsdom,
    doc = jsdom("<html><body></body></html>");

// SelectorSet and jQuery need a 'window' object.
global.window = doc.parentWindow;

var $ = require('jquery'),
    SelectorSet = require('../src/SelectorSet');

describe('SelectorSet', function() {

    describe("one element", function() {

        var el = $("<tag id='id' class='class'/>").get(0);

        describe("with selector set contains all element's selectors", function() {

            var sset = new SelectorSet();
            sset.add("tag")
                .add("#id")
                .add(".class")
                .add("#id.class")
                .add(".class#id")
                .add("tag#id.class")
                .add("tag.class#id")
                .add("*");

            it("should match all selectors", function() {

                var matches = sset.matches(el).map(function(m) {
                    return m[0]
                });
                assert(matches.length === 8);
                assert(matches.indexOf("tag") !== -1);
                assert(matches.indexOf("#id") !== -1);
                assert(matches.indexOf(".class") !== -1);
                assert(matches.indexOf("#id.class") !== -1);
                assert(matches.indexOf(".class#id") !== -1);
                assert(matches.indexOf("tag#id.class") !== -1);
                assert(matches.indexOf("tag.class#id") !== -1);
                assert(matches.indexOf("*") !== -1);

            });

        });

        describe("with selector set contains some of element's selectors", function() {

            var sset = new SelectorSet();
            sset.add("tag")
                .add("tagtag")
                .add("#id")
                .add("#i-d")
                .add(".class")
                .add(".clas_s")
                .add("#id.class")
                .add(".class#id")
                .add("tag#id.class")
                .add("tag.class#id")
                .add("*");

            it("should match some selectors", function() {

                var matches = sset.matches(el).map(function(m) {
                    return m[0]
                });
                assert(matches.length === 8);
                assert(matches.indexOf("tag") !== -1);
                assert(matches.indexOf("#id") !== -1);
                assert(matches.indexOf(".class") !== -1);
                assert(matches.indexOf("#id.class") !== -1);
                assert(matches.indexOf(".class#id") !== -1);
                assert(matches.indexOf("tag#id.class") !== -1);
                assert(matches.indexOf("tag.class#id") !== -1);
                assert(matches.indexOf("*") !== -1);

                assert(matches.indexOf("tagtag") === -1);
                assert(matches.indexOf("#i-d") === -1);
                assert(matches.indexOf(".clas_s") === -1);

            });

        });

    });

});
