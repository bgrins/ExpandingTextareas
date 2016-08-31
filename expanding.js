import { inputEvent, dispatch, warn } from './src/helpers';
import Textarea from './src/textarea';
import TextareaClone from './src/textarea-clone';

// Expanding Textareas v0.2.0
// MIT License
// https://github.com/bgrins/ExpandingTextareas

// Class Definition
// ================

var Expanding = function (textarea) {
  this.textarea = new Textarea(textarea);
  this.textareaClone = new TextareaClone();
  this.textarea.oldStyleAttribute = textarea.getAttribute('style');

  this.wrapper = document.createElement('div');
  this.wrapper.className = 'expanding-wrapper';
  this.wrapper.style.position = 'relative';

  // Wrap
  textarea.parentNode.insertBefore(this.wrapper, textarea);
  this.wrapper.appendChild(textarea);
  this.wrapper.appendChild(this.textareaClone.element);

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
    this.textareaClone.value(this.textarea.value());
    dispatch('expanding:update', { target: this.textarea.element });
  },

  // Tears down the plugin: removes generated elements, applies styles
  // that were prevously present, removes instance from data, unbinds events
  destroy: function () {
    this.wrapper.removeChild(this.textareaClone.element);
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
    var resetStyles = {
      margin: 0,
      webkitBoxSizing: 'border-box',
      mozBoxSizing: 'border-box',
      boxSizing: 'border-box',
      width: '100%'
    };
    // Should only be called once i.e. on initialization
    this.textareaClone.style({
      minHeight: this.textarea.element.offsetHeight + 'px'
    });
    this.textareaClone.style(resetStyles);
    this.textarea.style(resetStyles);
  },

  // Sets the basic clone styles and copies styles over from the textarea
  _setCloneStyles: function () {
    this.textareaClone.style(this.textareaClone.styles(this.textarea.element));
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
