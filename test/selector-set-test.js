/*globals buster:false*/
buster.testCase("mu-lib/selector-set", function (run) {
	"use strict";

	var assert = buster.referee.assert;

	require([ "mu-selector-set", "jquery" ], function (SelectorSet, $) {
		var tail = SelectorSet.tail;

		var TAG = "tag";
		var ID = "id";
		var CLASS = "class";
		var UNIVERSAL = "universal";
		var INDEXES = "indexes";
		var INDEXED = "indexed";
		var MATCHES_SELECTOR = $.find.matchesSelector;

		run({
			"tail": {
				"able to extract tag/id/class": function () {
					assert.equals(tail(".class"), ".class");
					assert.equals(tail("#id"), "#id");
					assert.equals(tail("tag"), "tag");
				},

				"able to extract tag/id/class with stacking": function() {
					assert.equals(tail("tag #id .class"), ".class");
					assert.equals(tail("tag #id.class"), "#id");
					assert.equals(tail("tag#id.class"), "tag");
				},

				"able to extract tag/id/class with attributes": function() {
					assert.equals(tail(".class[attr = '#123']"), ".class");
					assert.equals(tail("#id[attr = '#123']"), "#id");
					assert.equals(tail("tag[attr = '#123']"), "tag");
				},

				"able to extract tag/id/class with attributes and stacking": function() {
					assert.equals(tail("tag #id .class[attr = '#123']"), ".class");
					assert.equals(tail("tag #id.class[attr = '#123']"), "#id");
					assert.equals(tail("tag#id.class[attr = '#123']"), "tag");
				},

				"able to extract tag/id/class with attributes, stacking and escaped chars": function() {
					assert.equals(tail("tag #id .class[attr = '\\[#123\\]'"), ".class");
					assert.equals(tail("tag #id.class[attr = '\\[#123\\]']"), "#id");
					assert.equals(tail("tag#id.class[attr = '\\[#123\\]']"), "tag");
				},

				"able to extract tag from shortest possible selector": function() {
					assert.equals(tail(".a"), ".a");
					assert.equals(tail("#a"), "#a");
					assert.equals(tail("a"), "a");
				},

				"able to extract from empty selector": function () {
					assert.equals(tail(""), "*");
				}
			},

			"add": {
				"starts with empty INDEXES": function () {
					var selector = new SelectorSet();
					var indexes = selector[INDEXES];
					var expected = [];

					assert.equals(indexes, expected);
				},

				"groups INDEXES correctly": function () {
					var selector = new SelectorSet();
					var indexes = selector[INDEXES];
					var expected = [];

					selector
						.add("tag")
						.add("#id")
						.add(".class")
						.add("*");

					expected[TAG] = expected[0] = {};
					expected[TAG][INDEXED] = {};

					expected[ID] = expected[1] = {};
					expected[ID][INDEXED] = {};

					expected[CLASS] = expected[2] = {};
					expected[CLASS][INDEXED] = {};

					expected[UNIVERSAL] = expected[3] = {};
					expected[UNIVERSAL][INDEXED] = {};

					assert.match(indexes, expected);
				}
			},

			"matches": {
				"tag/id/class": function () {
					var selector = new SelectorSet();
					var element = $("<tag id='id' class='class'/>").get(0);

					assert.match(selector
						.add("tag")
						.add("#id")
						.add(".class")
						.add("*")
						.matches(MATCHES_SELECTOR, element), [ [ "tag" ], [ "#id" ], [ ".class" ], [ "*" ] ]);
				},

				"excludes unmatched rules": function () {
					var selector = new SelectorSet();
					var element = $("<tag id='id' class='class'/>").get(0);

					assert.match(selector
						.add("tag")
						.add("otherTag")
						.add("#id")
						.add("#otherId")
						.add(".class")
						.add(".otherClass")
						.add("*")
						.matches(MATCHES_SELECTOR, element), [ [ "tag" ], [ "#id" ], [ ".class" ], [ "*" ] ]);
				},

				"multiple element arguments": function () {
					var selector = new SelectorSet();
					var $element = $("<tag id='id'/><tag class='class' />");
					var element1 = $element.get(0);
					var element2 = $element.get(1);

					assert.match(selector
						.add("tag")
						.add("#id")
						.add(".class")
						.matches(MATCHES_SELECTOR, element1, element2), [ [ "tag" ], [ "#id" ], [ ".class" ] ]);
				},

				"array of element arguments": function () {
					var selector = new SelectorSet();
					var $element = $("<tag id='id'/><tag class='class' />");
					var element1 = $element.get(0);
					var element2 = $element.get(1);

					assert.match(selector
						.add("tag")
						.add("#id")
						.add(".class")
						.matches(MATCHES_SELECTOR, [ element1, element2 ]), [ [ "tag" ], [ "#id" ], [ ".class" ] ]);
				},

				"array of array of element arguments": function () {
					var selector = new SelectorSet();
					var $element = $("<tag id='id'/><tag class='class' />");
					var element1 = $element.get(0);
					var element2 = $element.get(1);

					assert.match(selector
						.add("tag")
						.add("#id")
						.add(".class")
						.matches(MATCHES_SELECTOR, [ element1 ], [ element2 ]), [ [ "tag" ], [ "#id" ], [ ".class" ] ]);
				}

			}
		});
	});
});
