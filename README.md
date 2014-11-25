[![Version](http://img.shields.io/npm/v/mu-selector-set.svg)](https://www.npmjs.org/package/mu-selector-set)
[![Version](http://img.shields.io/bower/v/mu-selector-set.svg)](https://github.com/mu-lib/mu-selector-set)
[![Build Status](https://api.travis-ci.org/mu-lib/mu-selector-set.svg?branch=master)](https://travis-ci.org/mu-lib/mu-selector-set)
[![Coverage Status](https://img.shields.io/coveralls/mu-lib/mu-selector-set/master.svg)](https://coveralls.io/r/mu-lib/mu-selector-set)

# mu-selector-set

A CSS selector set with fast DOM element matching.

Background in [this post](https://github.com/blog/1756-optimizing-large-selector-sets)
(as well as an [alternative implementation](https://github.com/josh/selector-set))
by [josh](https://github.com/josh/).

Here we provide a **faster**, **more modular**, **UMD-compliant** implementation
of Selector Set.

[See benchmarks](http://jsperf.com/selectorset-match/4).

## Usage

`var set = new SelectorSet()`

### `set.add(selector, data ...)`

Add a selector to the set.

0. `selector {String}` - The selector to add.
0. `data ...` - Arbitrary number of additional parameters which will be added
   with the selector as associated data.

Returns the set instance, so `remove` / `add` calls can be chained.

### `set.remove(selector, data ...)`

Remove a selector (+data) from the set.

0. `selector {String}` - The selector to remove.
0. `data ...` - Arbitrary number of additional parameters for more specific
   removal of selectors.

Returns the set instance, so `remove` / `add` calls can be chained.

### `set.matches(element ...)`

Matches DOM elements to selectors in the set.

0. `element ... {DOMElement}` - The DOM elements to match.

Returns array of arrays. Each sub-array is a selector that matches the elements
+ the data this selector was added with.

### `SelectorSet.prototype.matchesSelector`

`matchesSelector` is a function which checks if an element matches a selector.
It's used internally by `SelectorSet`, but exposed through the prototype to
allow overriding with a custom method.

It takes the following parameters:

0. `element {DOMElement}` - The element to match
0. `selector {String}` - The selector to match against

It returns `true` if the element matches the selector. `false` otherwise.

The default implementation tries to use the browser's native `match` or
`matchesSelector` DOM functions, or a [polyfill](https://developer.mozilla.org/en-US/docs/Web/API/Element.matches#Polyfill)
for older browsers.

It can be overridden by:

0. Overriding the prototype, thus modifying all instances of
   SelectorSet:

   ```
   SelectorSet.prototype.matchesSelector = customFunction;
   var sSet = new SelectorSet();
   ```

0. Overriding the instance, thus modifying a specific instance of
   SelectorSet:

   ```
   var sSet = new SelectorSet();
   sSet.matchesSelector = customFunction;
   ```

## Installation

- Node:
    0. `npm install mu-selector-set`
    0. `var SelectorSet = require('mu-selector-set');`
- AMD (install with bower):
    0. `bower install mu-selector-set`
    0. `require(['mu-selector-set'], function(SelectorSet){ /* ... */ });`

Run tests with `npm test`.

Run coverage analysis with `npm run coverage` (coverage report is saved to
`./coverage`).

## Examples

```Javascript
var el = $("<div id='foo' class='bar'/>").get(0),
    sSet = new SelectorSet();

sSet.add("div")
    .add(".bar", 123, 456)
    .add(".baz", 123, "abc")
    .add("#foo.bar")
    .add("*");

sSet.matches(el);
//[ [ '#foo.bar' ],
//  [ '.bar', 123, 456 ],
//  [ 'div' ],
//  [ '*' ] ]
```

**Multiple elements:**

```Javascript
var el1 = $("<div id='foo'/>").get(0),
    el2 = $("<div class='bar'/>").get(0),
    sSet = new SelectorSet();

sSet.add("div")
    .add(".bar", 123, 456)
    .add(".baz", 123, "abc")
    .add("#foo.bar, .bar.baz")
    .add("*");

set.matches(el1, el2);
//[ [ 'div' ],
//  [ '*' ],
//  [ '.bar', 123, 456 ] ]
```
