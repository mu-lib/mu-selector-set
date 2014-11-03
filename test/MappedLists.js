'use strict';

var assert = require('assert'),
    MappedLists = require('../src/MappedLists');

describe('MappedLists', function () {

    describe("adding elements to different keys",function(){

        var ml = new MappedLists();

        ml.add("key1","el1");
        ml.add("key1","el2");
        ml.add("key2","el3");
        ml.add("key3","el4");

        var l1 = ml.get("key1"),
            l2 = ml.get("key2"),
            l3 = ml.get("key3");

        it("should have the correct elements in 'key1'",function(){

            assert(l1.length === 2);
            assert(l1[0] === "el1");
            assert(l1[1] === "el2");

        });

        it("should have the correct elements in 'key2'",function(){

            assert(l2.length === 1);
            assert(l2[0] === "el3");

        });

        it("should have the correct elements in 'key3'",function(){

            assert(l3.length === 1);
            assert(l3[0] === "el4");

        });

    });

});
