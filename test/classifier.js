'use strict';

var assert = require('assert'),
    classify = require('../src/classifier');

describe('classify', function () {

    describe("simple selector", function () {

        describe("without attributes", function () {

            it("should be able to extract class", function () {
                assert(classify(".cla_ss") === ".cla_ss");
                assert(classify("  .cl-a-s_s ") === ".cl-a-s_s");
            });

            it("should be able to extract id", function () {
                assert(classify("#id") === "#id");
                assert(classify("#\\i\\d   ") === "#\\i\\d");
                assert(classify("     #id--d   ") === "#id--d");
            });

            it("should be able to extract tag", function () {
                assert(classify("div") === "div");
                assert(classify("tag ") === "tag");
                assert(classify(" a") === "a");
                assert(classify(" ul ") === "ul");
            });

            it("should be able to extract empty selector", function () {
                assert(classify("") === "*");
                assert(classify("   ") === "*");
            });

        });

        describe("with attributes", function () {

            describe("without escaped chars", function () {

                it("should be able to extract class", function () {
                    assert(classify(".cla_ss[attr='#123']") === ".cla_ss");
                    assert(classify(".cla-ss[attr = '#123']") === ".cla-ss");
                    assert(classify("  .class[attr = '#123'] ") === ".class");
                });

                it("should be able to extract id", function () {
                    assert(classify("#id[attr='#123']") === "#id");
                    assert(classify("#id[attr = '#123']") === "#id");
                    assert(classify(" #id[attr = '#123']  ") === "#id");
                });

                it("should be able to extract tag", function () {
                    assert(classify("tag[attr='#123']") === "tag");
                    assert(classify("tag[attr   =  '#123']") === "tag");
                    assert(classify(" tag[attr ='#123'] ") === "tag");
                });

                it("should be able to extract empty selector", function () {
                    assert(classify("[attr='#123']") === "*");
                    assert(classify("[attr = '#123']") === "*");
                    assert(classify("   [attr  ='#123']") === "*");
                });

            });

            describe("with escaped chars", function () {

                it("should be able to extract class", function () {
                    assert(classify(".class[attr = '\\[#123\\]']") === ".class");
                });

                it("should be able to extract id", function () {
                    assert(classify("#id[attr = '\\[#123\\]']") === "#id");
                });

                it("should be able to extract tag", function () {
                    assert(classify("tag[attr = '\\[#123\\]']") === "tag");
                });

                it("should be able to extract empty selector", function () {
                    assert(classify("[attr = '\\[#123\\]']") === "*");
                });

            });

        });

    });

    describe("stacked selectors", function () {

        describe("without attributes", function () {

            it("should be able to extract from multiple selectors", function () {
                assert(classify("tag#id-hello.class") === "#id-hello");
                assert(classify("tag#id_world.class  ") === "#id_world");
                assert(classify(" tag#id-foo_bar.class ") === "#id-foo_bar");
            });

            it("should be able to extract from single child selector", function () {
                assert(classify("tag #id .class") === ".class");
                assert(classify("tag #id   .class") === ".class");
                assert(classify(" tag     #id .class   ") === ".class");
            });

            it("should be able to extract from multiple child selectors", function () {
                assert(classify("tag #id.class") === "#id");
                assert(classify("tag     a#id.class") === "#id");
                assert(classify("     tag  .class#id ") === "#id");
            });

        });

        describe("with attributes", function () {

            describe("without escaped chars", function () {

                it("should be able to extract from multiple selectors", function () {
                    assert(classify("tag#id.class[attr = '#123']") === "#id");
                    assert(classify("tag#i_d[attr = '#123'].class") === "#i_d");
                    assert(classify("tag[attr = '#123']#i-d.class") === "#i-d");
                });

                it("should be able to extract from single child selector", function () {
                    assert(classify("tag #id .class[attr = '#123']") === ".class");
                    assert(classify("tag #id[attr = '#123'] .class") === ".class");
                    assert(classify("tag[attr = '#123'] #id .class") === ".class");
                    assert(classify("tag [attr = '#123'] #id .class") === ".class");
                });

                it("should be able to extract from multiple child selectors", function () {
                    assert(classify("tag #id.class[attr = '#123']") === "#id");
                    assert(classify("tag #id[attr = '#123'].class") === "#id");
                    assert(classify("tag[attr = '#123'] #id.class") === "#id");
                    assert(classify("tag [attr = '#123'] .class#id.class-2") === "#id");
                });

                it("should be able to extract child with no selectors", function () {
                    assert(classify("tag #id.class [attr = '#123']") === "*");
                    assert(classify("tag #id [attr = '#123'].class [attr = '#123']") === "*");
                    assert(classify("tag [attr = '#123'] #id.class [attr = '#123']") === "*");
                    assert(classify("tag [attr = '#123'] #id.class [attr = '#123']") === "*");
                });

            });

            describe("with escaped chars", function () {

                it("should be able to extract from multiple selectors", function () {
                    assert(classify("tag#id.class[attr = '\\[#123\\]']") === "#id");
                    assert(classify("tag#id[attr = '\\[#123\\]'].class") === "#id");
                    assert(classify("tag[attr = '\\[#123\\]']#id.class") === "#id");
                });

                it("should be able to extract from single child selector", function () {
                    assert(classify("tag #id .class[attr = '\\[#123\\]']") === ".class");
                    assert(classify("tag #id[attr = '\\[#123\\]'] .class") === ".class");
                    assert(classify("tag[attr = '\\[#123\\]'] #id .class") === ".class");
                });

                it("should be able to extract from multiple child selectors", function () {
                    assert(classify("tag #id.class[attr = '\\[#123\\]']") === "#id");
                    assert(classify("tag #id[attr = '\\[#123\\]'].class") === "#id");
                    assert(classify("tag[attr = '\\[#123\\]'] #id.class") === "#id");
                    assert(classify("tag[attr = '\\[#123\\]'] .class#id") === "#id");
                });

            });

        });

    });

});
