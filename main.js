/**
 * @license MIT http://mu-lib.mit-license.org/
 */
define(function () {
	"use strict";

	/**
	 * An optimized CSS selector matcher
	 * @class mu-lib.selector-set
	 * @mixin Function
	 */

	var UNDEFINED;
	var ARRAY_PROTO = Array.prototype;
	var ARRAY_SLICE = ARRAY_PROTO.slice;
	var ARRAY_CONCAT = ARRAY_PROTO.concat;
	var LENGTH = "length";
	var INDEXES = "indexes";
	var INDEXED = "indexed";
	var INDEXER = "indexer";
	var CLASS = "class";
	var ID = "id";
	var TAG = "tag";
	var UNIVERSAL = "universal";
	var SLASH = "\\";
	var SPACE = " ";
	var STAR = "*";
	var POUND = "#";
	var PERIOD = ".";
	var COLON = ":";
	var LEFT_BRACKET = "[";
	var RIGHT_BRACKET = "]";
	var COUNT = "count";
	var BASEVAL = "baseVal";
	var RE_SPACE = /\s+/;

	/**
	 * Extracts key for universal indexer
	 * @ignore
	 * @return {String[]}
	 */
	function getElementUniversal() {
		return [ STAR ];
	}

	/**
	 * Extracts key for tag indexer
	 * @ignore
	 * @param element
	 * @return {String[]}
	 */
	function getElementTagName(element) {
		return [ element.nodeName.toUpperCase() ];
	}

	/**
	 * Extracts key for class indexer
	 * @ignore
	 * @param element
	 * @return {String[]}
	 */
	function getElementClassNames(element) {
		var className;
		var result;

		// Do we have a `className` property
		if ((className = element.className) !== UNDEFINED) {
			// DOM `className`
			if (typeof className === "string") {
				result = className.split(RE_SPACE);
			}
			// SVG `className`
			else if (typeof className === "object" && BASEVAL in className) {
				result = className[BASEVAL].split(RE_SPACE);
			}
		}

		return result;
	}

	/**
	 * Extracts key for id indexer
	 * @ignore
	 * @param element
	 * @return {String[]}
	 */
	function getElementId(element) {
		var id;

		return (id = element.id) !== UNDEFINED && [ id ];
	}

	/**
	 * Gets the last **SIGNIFICANT** of a CSS selector, the "significant" is defined as - any leading id, class name or
	 * tag name component of the last selector.
	 *
	 * Examples:
	 *
	 * 	tail("div.bar");                  // "div"
	 * 	tail("#foo.bar");                 // "#foo"
	 * 	tail("p > div.bar");              // "div"
	 * 	tail("p > a:active");             // "a"
	 * 	tail(".bar");                     // ".bar"
	 * 	tail("input.foo[type='button']"); // "input"
	 * 	tail("[type='button']");          // "*"
	 *
	 * For more examples see [CSS3 selector spec](http://www.w3.org/TR/selectors/#w3cselgrammar)
	 * @private
	 * @static
	 * @param {String} selector CSS selector
	 * @return {String} last token
	 */
	function tail(selector) {
		var start = selector[LENGTH];
		var stop = start;
		var c = selector.charAt(--start);
		var skip = false;

		step: while (start >= 0) {
			switch (c) {
				case SPACE:
					/* Marks EOT if:
					 * * Next c is not SLASH
					 * * Not in skip mode
					 */
					if ((c = selector.charAt(--start)) !== SLASH && !skip) {
						// We're 2 steps passed the end of the selector so we should adjust for that
						start += 2;

						// Break the outer while
						break step;
					}
					break;

				case RIGHT_BRACKET:
					/* Marks begin of skip if:
					 * * Next c is not SLASH
					 */
					skip = (c = selector.charAt(--start)) !== SLASH;
					break;

				case LEFT_BRACKET:
					/* Marks end of skip if:
					 * * Next c is not SLASH
					 */
					if (!(skip = (c = selector.charAt(--start)) === SLASH)) {
						// Compensate for start already decreased
						stop = start + 1;
					}
					break;

				case POUND:
				case COLON:
				case PERIOD:
					/* Marks stop if:
					 * * Next c is not SLASH
					 * * Next c is not SPACE
					 * * Not in skip mode
					 */
					if ((c = selector.charAt(--start)) && c!== UNDEFINED && c!== SLASH && c !== SPACE && !skip) {
						// Compensate for start already decreased
						stop = start + 1;
					}
					break;

				default:
					// Store next c
					c = selector.charAt(--start);
					break;
			}
		}

		return selector.substring(start, stop) || STAR;
	}

	/**
	 * Compares candidates (that have COUNT properties)
	 * @ignore
	 * @param {Object} a
	 * @param {Object} b
	 * @return {Number}
	 */
	function compareCandidates(a, b) {
		return a[COUNT] - b[COUNT];
	}

	/**
	 * @method constructor
	 */
	function SelectorSet() {
		var me = this;

		/**
		 * Cached indexes
		 * @protected
		 * @readonly
		 * @property {Array} indexes
		 */
		me[INDEXES] = [];

		/**
		 * Index counter
		 * @private
		 * @readonly
		 * @property {Number} count
		 */
		me[COUNT] = 0;
	}

	SelectorSet.prototype = {
		/**
		 * Adds candidate
		 * @chainable
		 * @param {String} selector CSS selector
		 * @param {...*} [args] Additional arguments attached with candidate
		 */
		"add": function add(selector, args) {
			var me = this;
			var indexes = me[INDEXES];
			var indexed;
			var indexer;
			var index;
			var name;
			var key = tail(selector);

			// Convert arguments to array
			args = ARRAY_SLICE.call(arguments);

			// Set COUNT on args
			args[COUNT] = me[COUNT]++;

			// Check the first char to determine name/indexer and transform key
			switch (key.charAt(0)) {
				case POUND:
					name = ID;
					indexer = getElementId;
					key = key.substring(1);
					break;

				case PERIOD:
					name = CLASS;
					indexer = getElementClassNames;
					key = key.substring(1);
					break;

				case STAR:
					name = UNIVERSAL;
					indexer = getElementUniversal;
					break;

				default:
					name = TAG;
					indexer = getElementTagName;
					key = key.toUpperCase();
					break;
			}

			// Get index and indexed
			if ((index = indexes[name]) !== UNDEFINED) {
				indexed = index[INDEXED];
			}
			// Or create index and indexed
			else {
				index = indexes[name] = indexes[indexes[LENGTH]] = {};
				index[INDEXER] = indexer;
				indexed = index[INDEXED] = {};
			}

			// Add args to index[key]
			if (key in indexed) {
				indexed[key].push(args);
			}
			// Or create index[key] and initialize with args
			else {
				indexed[key] = [ args ];
			}

			return me;
		},

		/**
		 * Matches candidates against element
		 * @param {Function} matchesSelector `matchesSelector` function
		 * @param {HTMLElement|HTMLElement[]...} element DOM Element
		 * @return {Array} Matching array of candidates
		 */
		"matches": function matches(matchesSelector) {
			var me = this;
			var indexer;
			var indexed;
			var indexes = me[INDEXES];
			var index;
			var indexCount = indexes[LENGTH];
			var keys;
			var keysCount;
			var candidates;
			var candidate;
			var candidateCount;
			var result = [];
			var resultCount = 0;
			var args = ARRAY_CONCAT.apply(ARRAY_PROTO, ARRAY_SLICE.call(arguments, 1));
			var argsCount = args[LENGTH];
			var argsIndex;
			var element;

			while (indexCount--) {
				index = indexes[indexCount];
				indexer = index[INDEXER];
				indexed = index[INDEXED];

				for (argsIndex = 0; argsIndex < argsCount; argsIndex++) {
					element = args[argsIndex];
					keys = indexer(element);
					keysCount = keys[LENGTH];

					while (keysCount--) {
						if ((candidates = indexed[keys[keysCount]]) !== UNDEFINED) {
							candidateCount = candidates[LENGTH];

							while (candidateCount--) {
								candidate = candidates[candidateCount];

								if (result.indexOf(candidate) === -1 && matchesSelector(element, candidate[0])) {
									result[resultCount++] = candidate;
								}
							}
						}
					}
				}
			}

			return result.sort(compareCandidates);
		}
	};

	SelectorSet.tail = tail;

	return SelectorSet;
});
