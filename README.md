ExpandingTextareas
==================

[![Build Status](https://travis-ci.org/bgrins/ExpandingTextareas.svg?branch=master)](https://travis-ci.org/bgrins/ExpandingTextareas)

An elegant approach to making textareas automatically grow. Based on [Expanding Text Areas Made Elegant](http://www.alistapart.com/articles/expanding-text-areas-made-elegant/) by [Neil Jenkins](http://nmjenkins.com/).

Installation
------------

`Expanding` can be installed via NPM, Bower, or by downloading the script located at `dist/expanding.js`. It can be required via CommonJS, AMD, or as a global (e.g. `window.Expanding`).

via npm:

```
npm install expanding-textareas
…
var Expanding = require('expanding-textareas')
```

via bower:

```
bower install expanding-textareas
```

The library is also available as a jQuery plugin (see below).

Usage
-----

`Expanding` is a constructor which takes a textarea DOM node as its only argument:

```js
var textarea = document.querySelector('textarea')
var expanding = new Expanding(textarea)
```

That's it! The textarea will now expand as the user types.

### `update`

Updates the textarea height. This method is called automatically when the user types, but when setting the textarea content programmatically, it can be used to ensure the height expands as needed. For example:

```js
var textarea = document.querySelector('textarea')
var expanding = new Expanding(textarea)

textarea.value = 'Hello\nworld!' // Height is not yet updated
expanding.update() // Height is now updated
```

### `refresh`

Resets the styles of the internal elements to match those of the textarea. This may be useful if the textarea has percentage padding, and the browser window resizes, or if the textarea styles change after `Expanding is called`.

### `destroy`

Removes the behavior. It unbinds the internal event listeners and removes the DOM nodes created by the library.

jQuery Plugin
-------------

Download the jQuery plugin located at `dist/expanding.jquery.js`, and include it in your page (after jQuery). For example:

```html
<script src="http://code.jquery.com/jquery-3.1.0.min.js"></script>
<script src='PATH/TO/expanding.js'></script>
```

Then, include the `expanding` class in any textarea you wish to add the behavior to:

```html
<textarea class="expanding"></textarea>
```

The plugin will attach the behavior to every `.expanding` textarea when the DOM is ready.

### Customizing the Initial Selector

To change the selector used for automatic initialization, modify `$.expanding.initialSelector`. For example:

```javascript
$.expanding = {
  initialSelector: '[data-behavior=expanding]'
}
```

### Disabling Automatic Initialization

To disable auto-initialization, set `$.expanding.autoInitialize` to `false`:

```
$.expanding = {
  autoInitialize: false
}
```

### Manual Initialization

To manually initialize the plugin call `expanding()` on the jQuery selection. For example to apply the behavior to all textareas:

```javascript
$('textarea').expanding()
```

### Options

#### `destroy`

`'destroy'` will remove the behavior:

```js
$('textarea').expanding('destroy')
```

#### `active`

`'active'` will check whether it has the expanding behavior applied:

```js
$('textarea').expanding('active') // returns true or false
```

Note: this behaves like `.hasClass()`: it will return `true` if _any_ of the nodes in the selection have the expanding behaviour.

#### `refresh`

`'refresh'` will update the styles (see above for more details):

```javascript
$('textarea').expanding('refresh')
```

Caveats
-------

Textareas must be visible for the library to function properly. The library creates a textarea clone with identical dimensions to that of the original. It therefore requires that the textarea be in place in the DOM for these dimensions to be correct.

Any styling applied to the target textarea will be maintained with the exception of margins and widths. (Margins are reset to 0 to ensure that the textarea maintains the correct size and positioning.)

After the expanding behavior has been applied, the textarea will appear like a block-level element: its width will expand to fill its container. To restrict the textarea width, apply a width declaration to a parent element. The library's wrapper (`.expanding-wrapper`) element may be useful in this case:

```css
.expanding-wrapper {
   width: 50%;
}
```

[Flash of unstyled content](http://en.wikipedia.org/wiki/Flash_of_unstyled_content) can be avoided by adding the following styles (adjust the selector as necessary):

```css
textarea.expanding {
  margin: 0;
  -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
          box-sizing: border-box;
  width: 100%;
}
```

Browser Support
---------------

The library aims to support modern versions of the following browsers: Chrome, Firefox, IE (9+), Opera, and Safari (incl. iOS). View [the test suite](http://bgrins.github.io/ExpandingTextareas/test/) to see if check if your browser is fully supported. (If there are no failures then you're good to go!)

Development & Testing
---------------------

This library has been developed with ES2015 modules and bundled with [Rollup](http://rollupjs.org). To get started with development, first clone the project:

```
git clone git@github.com:bgrins/ExpandingTextareas.git
```

Then navigate to the project and install the dependencies:

```
cd ExpandingTextareas
npm install
```

To bundle the source files:

```
npm run build
```

And finally to test:

```
npm test
```

Run the tests in a browser by opening `test/index.html`.
