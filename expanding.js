import { inputEvent, style, dispatch, warn } from './src/helpers';
import Textarea from './src/textarea';

// Expanding Textareas v0.2.0
// MIT License
// https://github.com/bgrins/ExpandingTextareas

// Class Definition
// ================

var Expanding = function (textarea) {
  this.textarea = new Textarea(textarea);
  this.textCopy = document.createElement('span');
  this.clone = document.createElement('pre');
  this.clone.className = 'expanding-clone';
  this.clone.appendChild(this.textCopy);
  this.clone.appendChild(document.createElement('br'));
  this.wrapper = document.createElement('div');
  this.wrapper.className = 'expanding-wrapper';
  this.wrapper.style.position = 'relative';

  // Wrap
  textarea.parentNode.insertBefore(this.wrapper, textarea);
  this.wrapper.appendChild(textarea);
  this.wrapper.appendChild(this.clone);

  this.textarea.oldStyleAttribute = textarea.getAttribute('style');

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
  attach: function () {
    var _this = this;
    var events = [inputEvent, 'change'];
    function handler () { _this.update(); }

    for (var i = 0; i < events.length; i++) {
      this.textarea.on(events[i], handler);
    }
  },

  // Updates the clone with the textarea value
  update: function () {
    this.textCopy.textContent = this.textarea.value();
    dispatch('expanding:update', { target: this.textarea.element });
  },

  // Tears down the plugin: removes generated elements, applies styles
  // that were prevously present, removes instance from data, unbinds events
  destroy: function () {
    this.wrapper.removeChild(this.clone);
    this.wrapper.parentNode.insertBefore(this.textarea.element, this.wrapper);
    this.wrapper.parentNode.removeChild(this.wrapper);
    this.textarea.destroy();
  },

  setStyles: function () {
    this._resetStyles();
    this._setCloneStyles();
    this._setTextareaStyles();
  },

  // Applies reset styles to the textarea and clone
  // Stores the original textarea styles in case of destroying
  _resetStyles: function () {
    var elements = [this.textarea.element, this.clone];
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
      minHeight: this.textarea.element.offsetHeight + 'px'
    };

    if (this.textarea.element.getAttribute('wrap') === 'off') {
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
    var computedTextareaStyles = window.getComputedStyle(this.textarea.element);
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
    this.textarea.style(this.textarea.styles());
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
