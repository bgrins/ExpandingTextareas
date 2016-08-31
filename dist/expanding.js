(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Expanding = factory());
}(this, (function () { 'use strict';

var userAgent = window.navigator.userAgent

// Returns the version of Internet Explorer or -1
// (indicating the use of another browser).
// From: http://msdn.microsoft.com/en-us/library/ms537509(v=vs.85).aspx#ParsingUA
var ieVersion = (function () {
  var version = -1
  if (window.navigator.appName === 'Microsoft Internet Explorer') {
    var regExp = new RegExp('MSIE ([0-9]{1,}[\\.0-9]{0,})')
    if (regExp.exec(userAgent) !== null) version = parseFloat(RegExp.$1)
  }
  return version
})()

// Check for oninput support
// IE9 supports oninput, but not when deleting text, so keyup is used.
// onpropertychange _is_ supported by IE8/9, but may not be fired unless
// attached with `attachEvent`
// (see: http://stackoverflow.com/questions/18436424/ie-onpropertychange-event-doesnt-fire),
// and so is avoided altogether.
var inputEventSupported = (
  'oninput' in document.createElement('input') && ieVersion !== 9
)

var inputEvent = inputEventSupported ? 'input' : 'keyup'

var isIosDevice = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream

function style (element, styles) {
  for (var property in styles) element.style[property] = styles[property];
}

function dispatch (eventName, options) {
  options = options || {};
  var event = document.createEvent('Event');
  event.initEvent(eventName, true, options.cancelable === true);
  event.data = options.data != null ? options.data : {};
  var target = options.target != null ? options.target : document;
  target.dispatchEvent(event);
}

function warn(text) {
  if (window.console && console.warn) console.warn(text);
}

function Textarea (element) {
  this.element = element
  this._eventListeners = {}
}

Textarea.prototype = {
  style: function (styles) {
    style(this.element, styles)
  },

  styles: function () {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      resize: 'none',
      overflow: 'auto'
    }
  },

  value: function (value) {
    if (arguments.length === 0) {
      return this.element.value.replace(/\r\n/g, '\n')
    } else {
      this.element.value = value
    }
  },

  on: function (eventName, handler) {
    this.element.addEventListener(eventName, handler)
    this._eventListeners[eventName] = handler
  },

  off: function (eventName) {
    if (arguments.length === 0) {
      for (var event in this._eventListeners) { this.off(event) }
    } else {
      this.element.removeEventListener(
        eventName,
        this._eventListeners[eventName]
      )
      delete this._eventListeners[eventName]
    }
  },

  destroy: function () {
    this.element.setAttribute('style', this.oldStyleAttribute || '')
    this.off()
  }
}

var styleProperties = {
  borderBottomWidth: null,
  borderLeftWidth: null,
  borderRightWidth: null,
  borderTopWidth: null,
  direction: null,
  fontFamily: null,
  fontSize: null,
  fontSizeAdjust: null,
  fontStyle: null,
  fontWeight: null,
  letterSpacing: null,
  lineHeight: null,
  maxHeight: null,
  paddingBottom: null,
  paddingLeft: paddingHorizontal,
  paddingRight: paddingHorizontal,
  paddingTop: null,
  textAlign: null,
  textDecoration: null,
  textTransform: null,
  wordBreak: null,
  wordSpacing: null,
  wordWrap: null
}

function paddingHorizontal (computedStyle) {
  return isIosDevice ? (parseFloat(computedStyle) + 3) + 'px' : computedStyle
}

function TextareaClone () {
  this.element = document.createElement('pre')
  this.element.className = 'expanding-clone'
  this.innerElement = document.createElement('span')
  this.element.appendChild(this.innerElement)
  this.element.appendChild(document.createElement('br'))
}

TextareaClone.prototype = {
  value: function (value) {
    if (arguments.length === 0) return this.innerElement.textContent
    else this.innerElement.textContent = value
  },

  style: function (styles) {
    style(this.element, styles)
  },

  styles: function (textarea) {
    var wrap = textarea.getAttribute('wrap')
    var styles = {
      display: 'block',
      border: '0 solid',
      visibility: 'hidden',
      overflowX: wrap === 'off' ? 'scroll' : 'hidden',
      whiteSpace: wrap === 'off' ? 'pre' : 'pre-wrap'
    }

    var computedStyles = window.getComputedStyle(textarea)

    for (var property in styleProperties) {
      var valueFunction = styleProperties[property]
      var computedStyle = computedStyles[property]
      styles[property] = (
        valueFunction ? valueFunction(computedStyle) : computedStyle
      )
    }

    return styles
  }
}

// Expanding Textareas v0.2.0
// MIT License
// https://github.com/bgrins/ExpandingTextareas

// Class Definition
// ================

var Expanding = function (textarea) {
  this.textarea = new Textarea(textarea);
  this.textareaClone = new TextareaClone();
  this.textarea.oldStyleAttribute = textarea.getAttribute('style');
  resetStyles.call(this);
  this.setStyles();

  this.wrapper = document.createElement('div');
  this.wrapper.className = 'expanding-wrapper';
  this.wrapper.style.position = 'relative';

  // Wrap
  textarea.parentNode.insertBefore(this.wrapper, textarea);
  this.wrapper.appendChild(textarea);
  this.wrapper.appendChild(this.textareaClone.element);

  this.attach();
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

  setStyles: function () {
    this.textareaClone.style(this.textareaClone.styles(this.textarea.element));
    this.textarea.style(this.textarea.styles());
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
  }
};

function resetStyles () {
  var styles = {
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
  this.textareaClone.style(styles);
  this.textarea.style(styles);
}

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

return Expanding;

})));