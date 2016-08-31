import { inputEvent, style, dispatch, warn } from './src/helpers'

// Expanding Textareas v0.2.0
// MIT License
// https://github.com/bgrins/ExpandingTextareas

// Class Definition
// ================

var Expanding = function (textarea) {
  this.textarea = textarea;
  this.textCopy = document.createElement('span');
  this.clone = document.createElement('pre');
  this.clone.className = 'expanding-clone';
  this.clone.appendChild(this.textCopy);
  this.clone.appendChild(document.createElement('br'));
  this.wrapper = document.createElement('div');
  this.wrapper.className = 'expanding-wrapper';
  this.wrapper.style.position = 'relative';

  // Wrap
  this.textarea.parentNode.insertBefore(this.wrapper, this.textarea);
  this.wrapper.appendChild(this.textarea);
  this.wrapper.appendChild(this.clone);

  this._eventListeners = {};
  this._oldTextareaStyles = this.textarea.getAttribute('style');

  this.attach();
  this.setStyles();
  this.update();
};

Expanding.DEFAULTS = {
  autoInitialize: true,
  initialSelector: 'textarea.expanding'
};

$.expanding = $.extend({}, Expanding.DEFAULTS, $.expanding || {});

Expanding.prototype = {

  // Attaches input events
  // Only attaches `keyup` events if `input` is not fully suported
  attach: function () {
    var _this = this;
    var events = [inputEvent, 'change'];
    function handler () { _this.update(); }

    for (var i = 0; i < events.length; i++) {
      var event = events[i];
      this.textarea.addEventListener(event, handler);
      this._eventListeners[event] = handler;
    }
  },

  // Updates the clone with the textarea value
  update: function () {
    this.textCopy.textContent = this.textarea.value.replace(/\r\n/g, '\n');
    dispatch('expanding:update', { target: this.textarea });
  },

  // Tears down the plugin: removes generated elements, applies styles
  // that were prevously present, removes instance from data, unbinds events
  destroy: function () {
    this.wrapper.removeChild(this.clone);
    this.wrapper.parentNode.insertBefore(this.textarea, this.wrapper);
    this.wrapper.parentNode.removeChild(this.wrapper);
    this.textarea.setAttribute('style', this._oldTextareaStyles || '');
    delete this._oldTextareaStyles;

    for (var event in this._eventListeners) {
      this.textarea.removeEventListener(event, this._eventListeners[event]);
    }
  },

  setStyles: function () {
    this._resetStyles();
    this._setCloneStyles();
    this._setTextareaStyles();
  },

  // Applies reset styles to the textarea and clone
  // Stores the original textarea styles in case of destroying
  _resetStyles: function () {
    var elements = [this.textarea, this.clone];
    for (var i = 0; i < elements.length; i++) {
      style(elements[i], {
        margin: 0,
        webkitBoxSizing: 'border-box',
        mozBoxSizing: 'border-box',
        boxSizing: 'border-box',
        width: '100%'
      });
    }
  },

  // Sets the basic clone styles and copies styles over from the textarea
  _setCloneStyles: function () {
    var css = {
      display: 'block',
      border: '0 solid',
      visibility: 'hidden',
      minHeight: this.textarea.offsetHeight + 'px'
    };

    if (this.textarea.getAttribute('wrap') === 'off') {
      css.overflowX = 'scroll';
    } else css.whiteSpace = 'pre-wrap';

    style(this.clone, css);
    this._copyTextareaStylesToClone();
  },

  _copyTextareaStylesToClone: function () {
    var properties = [
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
    var computedTextareaStyles = window.getComputedStyle(this.textarea);
    var computedCloneStyles = window.getComputedStyle(this.clone);

    for (var i = 0; i < properties.length; i++) {
      var property = properties[i];
      var computedTextareaStyle = computedTextareaStyles[property];
      var computedCloneStyle = computedCloneStyles[property];

      // Prevent overriding percentage css values.
      if (computedCloneStyle !== computedTextareaStyle) {
        this.clone.style[property] = computedTextareaStyle;
        if (property === 'maxHeight' && computedTextareaStyle !== 'none') {
          this.clone.style.overflow = 'hidden';
        }
      }
    }
  },

  _setTextareaStyles: function () {
    style(this.textarea, {
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

    if (instance && option === 'destroy') {
      $this.removeData('expanding');
      return instance.destroy();
    }

    if (instance && option === 'refresh') return instance.setStyles();

    var visible = this.offsetWidth > 0 || this.offsetHeight > 0;

    if (!visible) warn('ExpandingTextareas: attempt to initialize an invisible textarea. ' +
                        'Call expanding() again once it has been inserted into the page and/or is visible.');

    if (!instance && visible) {
      var options = $.extend({}, $.expanding, typeof option === 'object' && option);
      $this.data('expanding', new Expanding($this[0], options));
    }
  });
  return this;
}

$.fn.expanding = Plugin;
$.fn.expanding.Constructor = Expanding;

$(function () {
  if ($.expanding.autoInitialize) {
    $($.expanding.initialSelector).expanding();
  }
});

export default Expanding;
