// Expanding Textareas v0.2.0
// MIT License
// https://github.com/bgrins/ExpandingTextareas

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function ($) {

  // Class Definition
  // ================

  var Expanding = function ($textarea, options) {
    this.$textarea = $textarea;
    this.$textCopy = $('<span />');
    this.$clone = $('<pre class="expanding-clone"><br /></pre>').prepend(this.$textCopy);

    $textarea
      .wrap($('<div class="expanding-wrapper" style="position:relative" />'))
      .after(this.$clone);

    this.attach();
    this.setStyles();
    this.update();

    if (typeof options.update === 'function') {
      $textarea.bind('update.expanding', options.update);
    }
  };

  Expanding.DEFAULTS = {
    autoInitialize: true,
    initialSelector: 'textarea.expanding'
  };

  $.expanding = $.extend({}, Expanding.DEFAULTS, $.expanding || {});

  // Returns the version of Internet Explorer or -1
  // (indicating the use of another browser).
  // From: http://msdn.microsoft.com/en-us/library/ms537509(v=vs.85).aspx#ParsingUA
  var ieVersion = (function () {
    var v = -1;
    if (navigator.appName === 'Microsoft Internet Explorer') {
      var ua = navigator.userAgent;
      var re = new RegExp('MSIE ([0-9]{1,}[\\.0-9]{0,})');
      if (re.exec(ua) !== null) v = parseFloat(RegExp.$1);
    }
    return v;
  })();

  // Check for oninput support
  // IE9 supports oninput, but not when deleting text, so keyup is used.
  // onpropertychange _is_ supported by IE8/9, but may not be fired unless
  // attached with `attachEvent`
  // (see: http://stackoverflow.com/questions/18436424/ie-onpropertychange-event-doesnt-fire),
  // and so is avoided altogether.
  var inputSupported = 'oninput' in document.createElement('input') && ieVersion !== 9;

  Expanding.prototype = {

    // Attaches input events
    // Only attaches `keyup` events if `input` is not fully suported
    attach: function () {
      var events = 'input.expanding change.expanding',
        _this = this;
      if (!inputSupported) events += ' keyup.expanding';
      this.$textarea.bind(events, function () { _this.update(); });
    },

    // Updates the clone with the textarea value
    update: function () {
      this.$textCopy.text(this.$textarea.val().replace(/\r\n/g, '\n'));

      // Use `triggerHandler` to prevent conflicts with `update` in Prototype.js
      this.$textarea.triggerHandler('update.expanding');
    },

    // Tears down the plugin: removes generated elements, applies styles
    // that were prevously present, removes instance from data, unbinds events
    destroy: function () {
      this.$clone.remove();
      this.$textarea
        .unwrap()
        .attr('style', this._oldTextareaStyles || '')
        .removeData('expanding')
        .unbind('input.expanding change.expanding keyup.expanding update.expanding');

      delete this._oldTextareaStyles;
    },

    setStyles: function () {
      this._resetStyles();
      this._setCloneStyles();
      this._setTextareaStyles();
    },

    // Applies reset styles to the textarea and clone
    // Stores the original textarea styles in case of destroying
    _resetStyles: function () {
      this._oldTextareaStyles = this.$textarea.attr('style');

      this.$textarea.add(this.$clone).css({
        margin: 0,
        webkitBoxSizing: 'border-box',
        mozBoxSizing: 'border-box',
        boxSizing: 'border-box',
        width: '100%'
      });
    },

    // Sets the basic clone styles and copies styles over from the textarea
    _setCloneStyles: function () {
      var css = {
        display: 'block',
        border: '0 solid',
        visibility: 'hidden',
        minHeight: this.$textarea.outerHeight()
      };

      if (this.$textarea.attr('wrap') === 'off') css.overflowX = 'scroll';
      else css.whiteSpace = 'pre-wrap';

      this.$clone.css(css);
      this._copyTextareaStylesToClone();
    },

    _copyTextareaStylesToClone: function () {
      var _this = this,
        properties = [
          'lineHeight', 'textDecoration', 'letterSpacing',
          'fontSize', 'fontFamily', 'fontStyle',
          'fontWeight', 'textTransform', 'textAlign',
          'direction', 'wordSpacing', 'fontSizeAdjust',
          'wordWrap', 'word-break',
          'borderLeftWidth', 'borderRightWidth',
          'borderTopWidth', 'borderBottomWidth',
          'paddingLeft', 'paddingRight',
          'paddingTop', 'paddingBottom', 'maxHeight'
        ];

      $.each(properties, function (i, property) {
        var val = _this.$textarea.css(property);

        // Prevent overriding percentage css values.
        if (_this.$clone.css(property) !== val) {
          _this.$clone.css(property, val);
          if (property === 'maxHeight' && val !== 'none') {
            _this.$clone.css('overflow', 'hidden');
          }
        }
      });
    },

    _setTextareaStyles: function () {
      this.$textarea.css({
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        resize: 'none',
        overflow: 'auto'
      });
    }
  };


  // Plugin Definition
  // =================

  function Plugin(option) {
    if (option === 'active') return !!this.data('expanding');

    this.filter('textarea').each(function () {
      var $this = $(this);

      var instance = $this.data('expanding');

      if (instance && option === 'destroy') return instance.destroy();

      if (instance && option === 'refresh') return instance.setStyles();

      var visible = this.offsetWidth > 0 || this.offsetHeight > 0;

      if (!visible) _warn('ExpandingTextareas: attempt to initialize an invisible textarea. ' +
                          'Call expanding() again once it has been inserted into the page and/or is visible.');

      if (!instance && visible) {
        var options = $.extend({}, $.expanding, typeof option === 'object' && option);
        $this.data('expanding', new Expanding($this, options));
      }
    });
    return this;
  }

  $.fn.expanding = Plugin;
  $.fn.expanding.Constructor = Expanding;

  function _warn(text) {
    if (window.console && console.warn) console.warn(text);
  }

  $(function () {
    if ($.expanding.autoInitialize) {
      $($.expanding.initialSelector).expanding();
    }
  });

}));