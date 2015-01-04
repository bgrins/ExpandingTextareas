module('ExpandingTextareas', {
  setup: function () {
    this.$textarea = $('textarea.manual').expanding();
  }
});

test('Returns the jQuery object', 1, function () {
  var $textarea = $('<textarea />');
  equal($textarea.expanding(), $textarea);
});

test('`data(\'expanding\')` returns an Expanding instance', 1, function () {
  ok(this.$textarea.data('expanding') instanceof $.fn.expanding.Constructor);
});

// ============
// = Defaults =
// ============

test('Auto-initialize option', 1, function () {
  ok($.expanding.autoInitialize);
});

test('Initial selector option', 1, function () {
  equal($.expanding.initialSelector, 'textarea.expanding');
});

// ========
// = Init =
// ========

test('Ignores non-textarea elements', 1, function () {
  var $input = $('<input />').appendTo('#qunit-fixture').expanding();
  ok($input.parent().is('#qunit-fixture'),
    'Non-textarea element not wrapped');
});

test('Ignores invisible textareas and textareas outside the DOM', 2, function () {
  var $outside = $('<textarea />').expanding(),
      $invisible = $('<textarea />').css('display', 'none').expanding();

  equal($outside.parents().length, 0, 'Newly created textarea not wrapped');
  equal($invisible.parents().length, 0, 'Invisible textarea not wrapped');
});

test('Prevents initializing more than once', 1, function () {
  this.$textarea.expanding();
  equal(this.$textarea.parents('div.expanding-wrapper').length, 1,
    'Textarea has a single `div.expanding-wrapper` parent when `expanding()` called twice');
});

test('Wraps the textarea', function () {
  ok(this.$textarea.parent().is('div.expanding-wrapper'),
    'Textarea wrapped in `div.expanding-wrapper`');
});

test('Creates a textarea clone', 4, function () {
  var $pre = this.$textarea.siblings('pre');
  equal($pre.length, 1, 'Textarea has a `pre` sibling (clone)');
  ok($pre.hasClass('expanding-clone'), 'Clone has `expanding-clone` class');
  equal($pre.find('span').length, 1, 'Textarea clone contains a span');
  equal($pre.find('br').length, 1, 'Textarea clone contains a br');
});

test('Sets the clone’s initial text value', function () {
  equal(this.$textarea.siblings('pre').text(), this.$textarea.val());
});

test('Sets the clone CSS `visibility` property', 1, function () {
  var $pre = this.$textarea.siblings('pre');
  equal($pre.css('visibility'), 'hidden',
    'Clone CSS `visibility` property set to `hidden`');
});

test('Copies the textarea CSS on to the clone', function () {
  var _this = this,
      $pre = this.$textarea.siblings('pre');

  var properties = [
    'lineHeight', 'textDecoration', 'letterSpacing',
    'fontSize', 'fontFamily', 'fontStyle',
    'fontWeight', 'textTransform', 'textAlign',
    'direction', 'wordSpacing', 'fontSizeAdjust',
    'wordWrap', 'word-break',
    'borderLeftWidth', 'borderRightWidth',
    'borderTopWidth', 'borderBottomWidth',
    'paddingLeft', 'paddingRight',
    'paddingTop', 'paddingBottom',
    'marginLeft', 'marginRight',
    'marginTop', 'marginBottom',
    'boxSizing', 'webkitBoxSizing', 'mozBoxSizing', 'msBoxSizing'
  ];

  $.each(properties, function (i, property) {
    equal($pre.css(property), _this.$textarea.css(property),
      'Clone CSS `' + property + '` property equal to that of the textarea');
  });
});

test('Ensures the clone is at least as tall as the textarea', 1, function () {
  var $textarea = $('<textarea rows="10" />').appendTo('#qunit-fixture'),
      expected = $textarea.outerHeight(); // cache textarea height
  $textarea.expanding();
  equal($textarea.siblings('pre').outerHeight(), expected,
    'Textarea wrapper CSS `min-height` set to textarea outer height');
});

test('Sets clone CSS `white-space` property when `textarea[wrap]` is not "off"', 2, function () {
  ok(this.$textarea.attr('wrap') !== 'off');
  equal(this.$textarea.siblings('pre').css('white-space'), 'pre-wrap',
    'Clone CSS `white-space` property set to `pre-wrap`');
});

test('Sets the clone CSS `overflow-x` property when `textarea[wrap=off]`', 1, function () {
  var $textarea = $('<textarea wrap="off" />').appendTo('#qunit-fixture').expanding(),
      $pre = $textarea.siblings('pre');
  equal($pre.css('overflow-x'), 'scroll',
    'Clone CSS `overflow-x` property to `scroll`');
});

test('Clone occupies the same coordinates as the textarea', function () {
  deepEqual(this.$textarea.offset(), this.$textarea.siblings('pre').offset());
});

test('Clone dimensions match those of the textarea', 2, function () {
  var $clone = this.$textarea.siblings('pre');
  equal(this.$textarea.outerHeight(true), $clone.outerHeight(true));
  equal(this.$textarea.outerWidth(true), $clone.outerWidth(true));
});

test('Sets the textarea CSS', 4, function () {
  var style = this.$textarea[0].style;
  equal(style.position, 'absolute',
    'Textarea CSS `position` property set to `absolute`');
  equal(style.height, '100%',
    'Textarea CSS `height` property set to 100%');
  equal(style.resize, 'none',
    'Textarea CSS `resize` property set to `none`');
  equal(style.overflow, 'auto',
    'Textarea CSS `overflow` property set to `auto`');
});

test('Sets the textarea wrapper CSS', 1, function () {
  var $wrapper = this.$textarea.parent();
  equal($wrapper.css('position'), 'relative',
    'Textarea wrapper CSS `position` set to `relative`');
});

test('Textarea maintains its coordinates after expanding init', function () {
  var $textarea = $('<textarea style="margin: 0" />').appendTo('#qunit-fixture'),
      expected = $textarea.offset();
  $textarea.expanding();
  deepEqual($textarea.offset(), expected,
    'Textarea offset remained the same after init');
});

// ==========
// = Update =
// ==========

test('Updates the clone text on input', 1, function () {
  var text = 'Hello world!';
  this.$textarea.val(text).trigger('input');
  equal(this.$textarea.siblings('pre').find('span').text(), text,
    'Clone’s `span` element updated with the textarea’s value');
});

test('Clone and wrapper grow with textarea when long text inserted', 4, function () {
  var $clone = this.$textarea.siblings('pre'),
      $wrapper = this.$textarea.parent(),
      longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
  for (var i = 0; i < 5; i++) {
    longText += longText + longText;
  }
  this.$textarea.val(longText).trigger('input');
  equal(this.$textarea.outerHeight(true), $clone.outerHeight(true));
  equal(this.$textarea.outerWidth(true), $clone.outerWidth(true));
  equal(this.$textarea.outerHeight(true), $wrapper.outerHeight());
  equal(this.$textarea.outerWidth(true), $wrapper.outerWidth());
});

test('Height does not increase once textarea max-height is reached', function () {
  var maxHeight = 50,
      text = 'Hello world!\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n',
      $textarea = $('<textarea />').appendTo('#qunit-fixture');

  $textarea.css('maxHeight', maxHeight).expanding();

  $textarea.val(text).trigger('input');

  equal($textarea.outerHeight(), maxHeight);
  equal($textarea.outerHeight(), $textarea.siblings('pre').outerHeight());
});

// ============
// = Callback =
// ============

(function () {
  // Returns the version of Internet Explorer or -1
  var ieVersion = (function () {
    var v = -1;
    if (navigator.appName === 'Microsoft Internet Explorer') {
      var ua = navigator.userAgent;
      var re = new RegExp('MSIE ([0-9]{1,}[\\.0-9]{0,})');
      if (re.exec(ua) !== null) v = parseFloat(RegExp.$1);
    }
    return v;
  })();

  var inputSupported = 'oninput' in document.createElement('input') && ieVersion !== 9;

  if (inputSupported) {
    test('Invokes `options.update` callback called once on keypress', 1, function () {
      var $textarea = $('<textarea />').appendTo('#qunit-fixture').expanding({
        update: function callback() {
          ok(true, '`options.update` callback called');
        }
      });
      // Simulate keypress
      $textarea
        .trigger('keydown')
        .trigger('input')
        .trigger('keyup');
    });
  }
  else {
    test('Invokes `options.update` callback called once on keyup', 1, function () {
      var $textarea = $('<textarea />').appendTo('#qunit-fixture').expanding({
        update: function callback() {
          ok(true, '`options.update` callback called');
        }
      });
      // Simulate keypress for browesers that do no support oninput
      $textarea
        .trigger('keydown')
        .trigger('keyup');
    });
  }

})();

// ===========
// = Refresh =
// ===========

test('Refresh restyles the additional elements', function () {
  var $clone = this.$textarea.siblings('pre'),
      newFontSize = '35px';

  // Ensure newFontSize is different from existing font size
  notEqual(this.$textarea.css('font-size'), newFontSize);

  this.$textarea.css({'font-size': newFontSize});
  this.$textarea.expanding('refresh');

  equal($clone.css('font-size'), this.$textarea.css('font-size'));
});

test('Refresh returns the jQuery object', 1, function () {
  equal(this.$textarea.expanding('refresh'), this.$textarea);
});

// ===========
// = Destroy =
// ===========

test('Destroy resets the textarea attributes', 2, function () {
  var height = '100px',
      $textarea = $('<textarea style="height: ' + height + '" />')
        .appendTo('#qunit-fixture').expanding();

  // Prevent false positives
  equal($textarea[0].style.height, '100%',
    'Textarea’s CSS `height` property set to 100% on init');

  $textarea.expanding('destroy');
  equal($textarea[0].style.height, height,
    'Textarea’s CSS `height` property reset to ' + height + ' on destroy');
});

test('Destroy removes the clone', 1, function () {
  this.$textarea.expanding('destroy');
  ok(!this.$textarea.siblings('pre').length,
    'Clone removed');
});

test('Destroy removes the textarea wrapper', 1, function () {
  this.$textarea.expanding('destroy');
  ok(!this.$textarea.parent().hasClass('expanding-wrapper'),
    'Textarea wrapper removed');
});

test('Destroy unbinds events', function () {
  this.$textarea.expanding('destroy');
  ok(!$._data(this.$textarea[0], 'events'),
    'Textarea events unbound');
});

test('Destroy called on an uninitialized node', function () {
  $('<textarea />').expanding('destroy');
  ok(true,
    'Calling destroy on an uninitialized jQuery object should not raise an exception');
});

// ==========
// = Active =
// ==========

test('active returns true when expanding initialized', function () {
  equal(this.$textarea.expanding('active'), true);
});

test('active returns false when expanding is not initialized', function () {
  equal($('<textarea />').expanding('active'), false);
});
