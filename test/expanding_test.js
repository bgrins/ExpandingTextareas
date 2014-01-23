module('ExpandingTextareas', {
    setup: function() {
        this.$textarea = $('textarea.manual').expandingTextarea();
    }
});

test('Prevents initializing more than once', 1, function() {
    this.$textarea.expandingTextarea();
    equal(this.$textarea.parents('div.expandingText').length, 1,
        'Textarea has a single `div.expandingText` parent when `expandingTextarea()` called twice');
});

test('Ignores non-textarea elements', 1, function() {
    var $input = $('<input />').expandingTextarea();
    equal($input.parents().length, 0,
        'Non-textarea element not wrapped');
});

test('Returns the jQuery object', 1, function() {
    var $textarea = $('<textarea />');
    equal($textarea.expandingTextarea(), $textarea);
});

test('Wraps the textarea', function() {
    ok(this.$textarea.parent().is('div.expandingText'),
        'Textarea wrapped in `div.expandingText`');
});

test('Sets the textarea wrapper CSS', 1, function() {
    var $wrapper = this.$textarea.parent();
    equal($wrapper.css('position'), 'relative',
        'Textarea wrapper CSS `position` set to `relative`');
});

test('Creates a textarea clone', function() {
    var $pre = this.$textarea.siblings('pre');
    equal($pre.length, 1, 'Textarea has a `pre` sibling (clone)');
    equal($pre.find('div').length, 1, 'Textarea clone contains a div');
});

test('Sets the clone CSS `visibility` property', 1, function() {
    var $pre = this.$textarea.siblings('pre');
        
    equal($pre.css('visibility'), 'hidden',
        'Clone CSS `visibility` property set to `hidden`');
});

test('Sets clone CSS `white-space` property when `textarea[wrap]` is not "off"', 2, function() {
    ok(this.$textarea.attr('wrap') !== 'off');
    equal(this.$textarea.siblings('pre').css('white-space'), 'pre-wrap',
        'Clone CSS `white-space` property set to `pre-wrap`');
});

test('Sets the clone CSS `overflow-x` property when `textarea[wrap=off]`', 1, function() {
    var $textarea = $('<textarea wrap="off" />').expandingTextarea(),
        $pre = $textarea.siblings('pre');
    equal($pre.css('overflow-x'), 'scroll',
        'Clone CSS `overflow-x` property to `scroll`');
});

test('Copies the textarea CSS on to the clone', function() {
    var _this = this,
        $pre = this.$textarea.siblings('pre');

    var properties = [
        'lineHeight', 'textDecoration', 'letterSpacing',
        'fontSize', 'fontFamily', 'fontStyle',
        'fontWeight', 'textTransform', 'textAlign',
        'direction', 'wordSpacing', 'fontSizeAdjust',
        'wordWrap', 'word-break',
        'borderLeftWidth', 'borderRightWidth',
        'borderTopWidth','borderBottomWidth',
        'paddingLeft', 'paddingRight',
        'paddingTop','paddingBottom',
        'marginLeft', 'marginRight',
        'marginTop','marginBottom',
        'boxSizing', 'webkitBoxSizing', 'mozBoxSizing', 'msBoxSizing'];
    
    $.each(properties, function(i, property) {
        equal($pre.css(property), _this.$textarea.css(property),
            'Clone CSS `' + property + '` property equal to that of the textarea');
    });
});

test('Sets the textarea CSS', 3, function() {
    var style = this.$textarea[0].style;
    equal(style.position, 'absolute',
        'Textarea CSS `position` property set to `absolute`');
    equal(style.height, '100%',
        'Textarea CSS `height` property set to 100%');
    equal(style.resize, 'none',
      'Textarea CSS `resize` property set to `none`');
});

test('Updates the clone text on input', 1, function() {
    var text = 'Hello world!';
    this.$textarea.val(text).trigger('input');
    equal(this.$textarea.siblings('pre').find('div').text(), text+' ',
        'Clone’s `div` element updated with the textarea’s value (plus blank space)');
});

test('Invokes `options.resize` callback called on input', 1, function() {
    var $textarea = $('<textarea />').expandingTextarea({
        resize: function callback() {
            ok(true, '`options.resize` callback called');
        }
    });
    $textarea.trigger('input');
});

test('Destroy resets the textarea attributes', function() {
    var height = '100px',
        $textarea = $('<textarea style="height: '+ height +'" />').expandingTextarea();

    // Prevent false positives
    equal($textarea[0].style.height, '100%',
        'Textarea’s CSS `height` property set to 100% on init');
    
    $textarea.expandingTextarea('destroy');
    ok(!$textarea.hasClass('expanding-init'),
        'Init textarea class name removed on destroy');
    equal($textarea[0].style.height, height,
        'Textarea’s CSS `height` property reset to ' + height + ' on destroy');
    ok(!$textarea.data('expanding-styles'),
        '`expanding-styles` data removed on destroy');
});

test('Destroy removes the clone', 1, function() {
    this.$textarea.expandingTextarea('destroy');
    ok(!this.$textarea.siblings('pre').length,
        'Clone removed');
});

test('Destroy removes the textarea wrapper', 1, function() {
    this.$textarea.expandingTextarea('destroy');
    ok(!this.$textarea.parent().hasClass('expandingText'),
        'Textarea wrapper removed');
});
