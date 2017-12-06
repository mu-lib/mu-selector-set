var assert = require('assert'),
    jsdom = require("jsdom").jsdom,
    doc = jsdom("<html><body></body></html>");

// SelectorSet and jQuery need a 'window' object.
global.window = doc.parentWindow;

var $ = require('jquery'),
    SelectorSet = require('../');

describe('SelectorSet', function() {
    'use strict';

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
                    return m[0];
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
                    return m[0];
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
                        return m[0];
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
                        return m[0];
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
                        return m[0];
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
                        return m[0];
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
                        return m[0];
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
                        return m[0];
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

    describe("compound selectors", function() {

        var els = $(
                "<tag id='id1' class='class1 class2'/>" +
                "<tag id='id2' class='class3 class4'/>"
            ),
            el1 = els.get(0),
            el2 = els.get(1);

        var sset = new SelectorSet();

        sset.add("#id1, #id2", "foo", "bar") // "foo" and "bar" are arbitrary data
            .add("  #id1 , .class3 ")
            .add(".class1 , .class2, .class3 , .class4 ");

        it("should match all selectors for el1", function() {

            var matches = sset.matches(el1).map(function(m) {
                return m[0];
            });
            assert(matches.length === 4);
            assert(matches.filter(function(m){
                return m === "#id1";
            }).length === 2);
            assert(matches.indexOf(".class1") !== -1);
            assert(matches.indexOf(".class2") !== -1);

        });

        it("should match all selectors for el2", function() {

            var matches = sset.matches(el2).map(function(m) {
                return m[0];
            });
            assert(matches.length === 4);
            assert(matches.filter(function(m){
                return m === ".class3";
            }).length === 2);
            assert(matches.indexOf("#id2") !== -1);
            assert(matches.indexOf(".class4") !== -1);

        });

    });

    describe("remove selectors", function(){

        var els = $(
                "<tag id='id1' class='class'/>" +
                "<tag id='id2' class='class'/>"
            ),
            el1 = els.get(0),
            el2 = els.get(1);

        describe("remove selectors", function() {

            var sset = new SelectorSet();

            sset.add("tag", "foo", "bar") // "foo" and "bar" are arbitrary data
                .add("#id1");

            sset.remove("#id1");
            sset.remove("tag");

            it("should not match selectors", function() {

                var matches = sset.matches(el1);
                assert(matches.length === 0);

            });

        });

        describe("remove selectors + data", function() {

            var sset = new SelectorSet(),
                f = function(){};

            sset.add("tag", "foo", "bar")
                .add(".class", "foo", "bar")
                .add("#id1", f);

            sset.remove("#id1", f);
            sset.remove("tag");
            sset.remove(".class", "foo");

            it("should not match selectors", function() {

                var matches = sset.matches(el1);
                assert(matches.length === 0);

            });

        });

        describe("remove compound selectors", function() {

            var sset = new SelectorSet(),
                f = function(){};

            sset.add("#id1, #id2", "foo", "bar") // "foo" and "bar" are arbitrary data
                .add("#id1, .class", f);

            sset.remove(".class, #id1", f);

            it("should succeed", function() {

                var matches1 = sset.matches(el1),
                    matches2 = sset.matches(el2);

                assert(matches1.length === 1);
                assert(matches1.some(function(m) {
                    return m[0] === "#id1" && m[1] === "foo" && m[2] === "bar";
                }));
                assert(matches2.length === 1);
                assert(matches2.some(function(m) {
                    return m[0] === "#id2" && m[1] === "foo" && m[2] === "bar";
                }));

            });

        });

    });

    describe("SVG element", function() {

        var svgStr =
            '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
                '<g id="id" class="class"></g>' +
            '</svg>';

        var el = $(svgStr).find('g').get(0);

        describe("with selector set contains all element's selectors", function() {

            var sset = new SelectorSet();

            sset.add("g", "foo", "bar") // "foo" and "bar" are arbitrary data
                .add("#id")
                .add(".class")
                .add("#id.class", "bar", "baz")
                .add(".class#id")
                .add("g#id.class")
                .add("g.class#id")
                .add("*");

            it("should match all selectors", function() {

                var matches = sset.matches(el).map(function(m) {
                    return m[0];
                });
                assert(matches.length === 8);
                assert(matches.indexOf("g") !== -1);
                assert(matches.indexOf("#id") !== -1);
                assert(matches.indexOf(".class") !== -1);
                assert(matches.indexOf("#id.class") !== -1);
                assert(matches.indexOf(".class#id") !== -1);
                assert(matches.indexOf("g#id.class") !== -1);
                assert(matches.indexOf("g.class#id") !== -1);
                assert(matches.indexOf("*") !== -1);

            });

        });

        describe("with selector set contains some of element's selectors", function() {

            var sset = new SelectorSet();
            sset.add("g")
                .add("gg")
                .add("#id")
                .add("#i-d")
                .add(".class")
                .add(".clas_s")
                .add("#id.class")
                .add(".class#id")
                .add("g#id.class")
                .add("g.class#id")
                .add("*");

            it("should match some selectors", function() {

                var matches = sset.matches(el).map(function(m) {
                    return m[0];
                });
                assert(matches.length === 8);
                assert(matches.indexOf("g") !== -1);
                assert(matches.indexOf("#id") !== -1);
                assert(matches.indexOf(".class") !== -1);
                assert(matches.indexOf("#id.class") !== -1);
                assert(matches.indexOf(".class#id") !== -1);
                assert(matches.indexOf("g#id.class") !== -1);
                assert(matches.indexOf("g.class#id") !== -1);
                assert(matches.indexOf("*") !== -1);

                assert(matches.indexOf("gg") === -1);
                assert(matches.indexOf("#i-d") === -1);
                assert(matches.indexOf(".clas_s") === -1);

            });

        });

    });

    describe("insertion order", function() {

        var els = $(
                "<span id='id1'/>" +
                "<span id='id2'/>" +
                "<span class='class1'/>" +
                "<span class='class2'/>" +
                "<span class='class3'/>" +
                "<span class='class4'/>"
            ),
            id1el = els.get(0),
            id2el = els.get(1),
            class1el = els.get(2),
            class2el = els.get(3),
            class3el = els.get(4),
            class4el = els.get(5);

        var sset = new SelectorSet();

        sset.add("#id1, #id2", "1")
            .add("  #id1 , .class3 ", "2")
            .add("  #id2 , .class3 ", "3")
            .add(".class1 , .class2, .class3 , .class4 ", "4");

        describe("id1el data", function(){

            it("should be retrieved in the correct order", function(){

                var matches = sset.matches(id1el);
                assert(matches.length === 2);
                assert(matches[0][0] === "#id1");
                assert(matches[0][1] === "1");
                assert(matches[1][0] === "#id1");
                assert(matches[1][1] === "2");

            });

        });

        describe("id2el data", function(){

            it("should be retrieved in the correct order", function(){

                var matches = sset.matches(id2el);
                assert(matches.length === 2);
                assert(matches[0][0] === "#id2");
                assert(matches[0][1] === "1");
                assert(matches[1][0] === "#id2");
                assert(matches[1][1] === "3");

            });

        });

        describe("class1el data", function(){

            it("should be retrieved in the correct order", function(){

                var matches = sset.matches(class1el);
                assert(matches.length === 1);
                assert(matches[0][0] === ".class1");
                assert(matches[0][1] === "4");

            });

        });

        describe("class2el data", function(){

            it("should be retrieved in the correct order", function(){

                var matches = sset.matches(class2el);
                assert(matches.length === 1);
                assert(matches[0][0] === ".class2");
                assert(matches[0][1] === "4");

            });

        });

        describe("class3el data", function(){

            it("should be retrieved in the correct order", function(){

                var matches = sset.matches(class3el);
                assert(matches.length === 3);
                assert(matches[0][0] === ".class3");
                assert(matches[0][1] === "2");
                assert(matches[1][0] === ".class3");
                assert(matches[1][1] === "3");
                assert(matches[2][0] === ".class3");
                assert(matches[2][1] === "4");

            });

        });

        describe("class4el data", function(){

            it("should be retrieved in the correct order", function(){

                var matches = sset.matches(class4el);
                assert(matches.length === 1);
                assert(matches[0][0] === ".class4");
                assert(matches[0][1] === "4");

            });

        });

    });

});
