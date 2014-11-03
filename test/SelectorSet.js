'use strict';

var assert = require('assert'),
    jsdom = require("jsdom").jsdom,
    doc = jsdom("<html><body></body></html>");

// SelectorSet and jQuery need a 'window' object.
global.window = doc.parentWindow;

var $ = require('jquery'),
    SelectorSet = require('../');

describe('SelectorSet', function() {

    describe("one element", function() {

        var el = $("<tag id='id' class='class'/>").get(0);

        describe("with selector set contains all element's selectors", function() {

            var sset = new SelectorSet();

            sset.add("tag", "foo", "bar") // "foo" and "bar" are arbitrary data
                .add("#id")
                .add(".class")
                .add("#id.class", "bar", "baz")
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

    describe("multiple elements", function() {

        var els = $(
                "<tag id='id1' class='class'/>" +
                "<tag id='id2' class='class'/>"
            ),
            el1 = els.get(0),
            el2 = els.get(1);

        describe("with selector set contains all element's selectors", function() {

            var sset = new SelectorSet();

            sset.add("tag", "foo", "bar") // "foo" and "bar" are arbitrary data
                .add("#id1")
                .add("#id2")
                .add(".class")
                .add("#id1.class", "bar", "baz")
                .add(".class#id1")
                .add("tag#id1.class")
                .add("tag.class#id1")
                .add("tag.class#id2")
                .add("*");

            describe("elements as arguments to 'matches'", function() {

                it("should match all selectors", function() {

                    var matches = sset.matches(el1, el2).map(function(m) {
                        return m[0]
                    });
                    assert(matches.length === 10);
                    assert(matches.indexOf("tag") !== -1);
                    assert(matches.indexOf("#id1") !== -1);
                    assert(matches.indexOf("#id2") !== -1);
                    assert(matches.indexOf(".class") !== -1);
                    assert(matches.indexOf("#id1.class") !== -1);
                    assert(matches.indexOf(".class#id1") !== -1);
                    assert(matches.indexOf("tag#id1.class") !== -1);
                    assert(matches.indexOf("tag.class#id1") !== -1);
                    assert(matches.indexOf("tag.class#id2") !== -1);
                    assert(matches.indexOf("*") !== -1);

                });

            });

            describe("elements as an array argument to 'matches'", function() {

                it("should match all selectors", function() {

                    var matches = sset.matches([el1, el2]).map(function(m) {
                        return m[0]
                    });
                    assert(matches.length === 10);
                    assert(matches.indexOf("tag") !== -1);
                    assert(matches.indexOf("#id1") !== -1);
                    assert(matches.indexOf("#id2") !== -1);
                    assert(matches.indexOf(".class") !== -1);
                    assert(matches.indexOf("#id1.class") !== -1);
                    assert(matches.indexOf(".class#id1") !== -1);
                    assert(matches.indexOf("tag#id1.class") !== -1);
                    assert(matches.indexOf("tag.class#id1") !== -1);
                    assert(matches.indexOf("tag.class#id2") !== -1);
                    assert(matches.indexOf("*") !== -1);

                });

            });

            describe("elements as arrays as arguments to 'matches'", function() {

                it("should match all selectors", function() {

                    var matches = sset.matches([el1], [el2]).map(function(m) {
                        return m[0]
                    });
                    assert(matches.length === 10);
                    assert(matches.indexOf("tag") !== -1);
                    assert(matches.indexOf("#id1") !== -1);
                    assert(matches.indexOf("#id2") !== -1);
                    assert(matches.indexOf(".class") !== -1);
                    assert(matches.indexOf("#id1.class") !== -1);
                    assert(matches.indexOf(".class#id1") !== -1);
                    assert(matches.indexOf("tag#id1.class") !== -1);
                    assert(matches.indexOf("tag.class#id1") !== -1);
                    assert(matches.indexOf("tag.class#id2") !== -1);
                    assert(matches.indexOf("*") !== -1);

                });

            });

        });

        describe("with selector set contains some of element's selectors", function() {

            var sset = new SelectorSet();

            sset.add("tag", "foo", "bar") // "foo" and "bar" are arbitrary data
                .add("#id1")
                .add("#id-1")
                .add("#id2")
                .add("#id-2")
                .add(".class")
                .add(".clas_s")
                .add("#id1.class", "bar", "baz")
                .add(".class#id1")
                .add("tag#id1.class")
                .add("tag.class#id1")
                .add("tag.class#id2")
                .add("*");

            describe("elements as arguments to 'matches'", function() {

                it("should match all selectors", function() {

                    var matches = sset.matches(el1, el2).map(function(m) {
                        return m[0]
                    });
                    assert(matches.length === 10);
                    assert(matches.indexOf("tag") !== -1);
                    assert(matches.indexOf("#id1") !== -1);
                    assert(matches.indexOf("#id2") !== -1);
                    assert(matches.indexOf(".class") !== -1);
                    assert(matches.indexOf("#id1.class") !== -1);
                    assert(matches.indexOf(".class#id1") !== -1);
                    assert(matches.indexOf("tag#id1.class") !== -1);
                    assert(matches.indexOf("tag.class#id1") !== -1);
                    assert(matches.indexOf("tag.class#id2") !== -1);
                    assert(matches.indexOf("*") !== -1);

                    assert(matches.indexOf("#id-1") === -1);
                    assert(matches.indexOf("#id-2") === -1);
                    assert(matches.indexOf(".clas_s") === -1);

                });

            });

            describe("elements as an array argument to 'matches'", function() {

                it("should match all selectors", function() {

                    var matches = sset.matches([el1, el2]).map(function(m) {
                        return m[0]
                    });
                    assert(matches.length === 10);
                    assert(matches.indexOf("tag") !== -1);
                    assert(matches.indexOf("#id1") !== -1);
                    assert(matches.indexOf("#id2") !== -1);
                    assert(matches.indexOf(".class") !== -1);
                    assert(matches.indexOf("#id1.class") !== -1);
                    assert(matches.indexOf(".class#id1") !== -1);
                    assert(matches.indexOf("tag#id1.class") !== -1);
                    assert(matches.indexOf("tag.class#id1") !== -1);
                    assert(matches.indexOf("tag.class#id2") !== -1);
                    assert(matches.indexOf("*") !== -1);

                    assert(matches.indexOf("#id-1") === -1);
                    assert(matches.indexOf("#id-2") === -1);
                    assert(matches.indexOf(".clas_s") === -1);

                });

            });

            describe("elements as arrays as arguments to 'matches'", function() {

                it("should match all selectors", function() {

                    var matches = sset.matches([el1], [el2]).map(function(m) {
                        return m[0]
                    });
                    assert(matches.length === 10);
                    assert(matches.indexOf("tag") !== -1);
                    assert(matches.indexOf("#id1") !== -1);
                    assert(matches.indexOf("#id2") !== -1);
                    assert(matches.indexOf(".class") !== -1);
                    assert(matches.indexOf("#id1.class") !== -1);
                    assert(matches.indexOf(".class#id1") !== -1);
                    assert(matches.indexOf("tag#id1.class") !== -1);
                    assert(matches.indexOf("tag.class#id1") !== -1);
                    assert(matches.indexOf("tag.class#id2") !== -1);
                    assert(matches.indexOf("*") !== -1);

                    assert(matches.indexOf("#id-1") === -1);
                    assert(matches.indexOf("#id-2") === -1);
                    assert(matches.indexOf(".clas_s") === -1);

                });

            });

        });

    });

});
