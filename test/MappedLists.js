var assert = require('assert'),
    MappedLists = require('../src/MappedLists');

describe('MappedLists', function() {
    'use strict';

    describe("adding elements to different keys", function() {

        var ml = new MappedLists();

        ml.add("key1", "el1");
        ml.add("key1", "el2");
        ml.add("key2", "el3");
        ml.add("key3", "el4");
        ml.add("key4", ["i1", "i2", 3]);
        ml.add("key4", "el5");

        var l1 = ml.get("key1"),
            l2 = ml.get("key2"),
            l3 = ml.get("key3"),
            l4 = ml.get("key4");

        it("should have the correct elements in 'key1'", function() {

            assert(l1.length === 2);
            assert(l1[0] === "el1");
            assert(l1[1] === "el2");

        });

        it("should have the correct elements in 'key2'", function() {

            assert(l2.length === 1);
            assert(l2[0] === "el3");

        });

        it("should have the correct elements in 'key3'", function() {

            assert(l3.length === 1);
            assert(l3[0] === "el4");

        });

        it("should have the correct elements in 'key4'", function() {

            assert(l4.length === 2);
            assert(l4[0].length === 3);
            assert(l4[0][0] === "i1");
            assert(l4[0][1] === "i2");
            assert(l4[0][2] === 3);
            assert(l4[1] === "el5");

        });

    });

    describe("removing lists", function() {

        var ml = new MappedLists();

        ml.add("key1", "el1");
        ml.add("key1", "el2");
        ml.add("key2", "el3");
        ml.add("key3", "el4");
        ml.add("key4", ["i1", "i2", 3]);
        ml.add("key4", "el5");

        ml.remove("key1");

        var l1 = ml.get("key1"),
            l2 = ml.get("key2"),
            l3 = ml.get("key3"),
            l4 = ml.get("key4");

        it("should not have elements in 'key1' list", function() {

            assert(l1.length === 0);

        });

        it("should have the correct elements in 'key2'", function() {

            assert(l2.length === 1);
            assert(l2[0] === "el3");

        });

        it("should have the correct elements in 'key3'", function() {

            assert(l3.length === 1);
            assert(l3[0] === "el4");

        });

        it("should have the correct elements in 'key4'", function() {

            assert(l4.length === 2);
            assert(l4[0].length === 3);
            assert(l4[0][0] === "i1");
            assert(l4[0][1] === "i2");
            assert(l4[0][2] === 3);
            assert(l4[1] === "el5");

        });

    });

    describe("removing elements - without comparator", function() {

        var ml = new MappedLists(),
            tmp = ["i1", "i2", 3];

        ml.add("key1", "el1");
        ml.add("key1", "el2");
        ml.add("key2", "el3");
        ml.add("key3", "el4");
        ml.add("key4", tmp);
        ml.add("key4", "el5");

        ml.remove("key1", "el1");
        ml.remove("key4", tmp);

        var l1 = ml.get("key1"),
            l2 = ml.get("key2"),
            l3 = ml.get("key3"),
            l4 = ml.get("key4");

        it("should have the correct elements in 'key1'", function() {

            assert(l1.length === 1);
            assert(l1[0] === "el2");

        });

        it("should have the correct elements in 'key2'", function() {

            assert(l2.length === 1);
            assert(l2[0] === "el3");

        });

        it("should have the correct elements in 'key3'", function() {

            assert(l3.length === 1);
            assert(l3[0] === "el4");

        });

        it("should have the correct elements in 'key4'", function() {

            assert(l4.length === 1);
            assert(l4[0] === "el5");

        });

    });

    describe("removing elements - with comparator", function() {

        var ml = new MappedLists();

        ml.add("key1", "1el");
        ml.add("key1", "2el");
        ml.add("key2", "el3");
        ml.add("key3", "el4");
        ml.add("key4", ["i1", "i2", 3]);
        ml.add("key4", ["i1", "i3", 33]);

        ml.remove("key1", "1", function(el, cand){
            return el[0] === cand[0];
        });
        ml.remove("key4", ["i1", "i2"], function(el, cand){
           return el[0] === cand[0] && el[1] === cand[1];
        });

        var l1 = ml.get("key1"),
            l2 = ml.get("key2"),
            l3 = ml.get("key3"),
            l4 = ml.get("key4");

        it("should have the correct elements in 'key1'", function() {

            assert(l1.length === 1);
            assert(l1[0] === "2el");

        });

        it("should have the correct elements in 'key2'", function() {

            assert(l2.length === 1);
            assert(l2[0] === "el3");

        });

        it("should have the correct elements in 'key3'", function() {

            assert(l3.length === 1);
            assert(l3[0] === "el4");

        });

        it("should have the correct elements in 'key4'", function() {

            assert(l4.length === 1);
            assert(l4[0][0] === "i1");
            assert(l4[0][1] === "i3");
            assert(l4[0][2] === 33);

        });

    });

});
