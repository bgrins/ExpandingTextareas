/*
 * expanding-textareas 1.0.2
 * Copyright © 2011+ Brian Grinstead
 * Released under the MIT license
 * http://bgrins.github.com/ExpandingTextareas/
 */

(function () {
'use strict';

function wrap (element, wrapper) {
  element.parentNode.insertBefore(wrapper, element)
  wrapper.appendChild(element)
}

function style (element, styles) {
  for (var property in styles) element.style[property] = styles[property]
}

function dispatch (eventName, options) {
  options = options || {}
  var event = document.createEvent('Event')
  event.initEvent(eventName, true, options.cancelable === true)
  event.data = options.data != null ? options.data : {}
  var target = options.target != null ? options.target : document
  target.dispatchEvent(event)
}

function warn (text) {
  if (window.console && console.warn) console.warn(text)
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
  paddingLeft: null,
  paddingRight: null,
  paddingTop: null,
  textAlign: null,
  textDecoration: null,
  textTransform: null,
  wordBreak: null,
  wordSpacing: null,
  wordWrap: null
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

function Expanding (textarea) {
  this.element = createElement()
  this.textarea = new Textarea(textarea)
  this.textareaClone = new TextareaClone()
  this.textarea.oldStyleAttribute = textarea.getAttribute('style')
  resetStyles.call(this)
  setStyles.call(this)

  wrap(textarea, this.element)
  this.element.appendChild(this.textareaClone.element)

  var inputHandler = this.update.bind(this)
  this.textarea.on('input', inputHandler)

  this.update()
}

Expanding.prototype = {
  update: function () {
    this.textareaClone.value(this.textarea.value())
    dispatch('expanding:update', { target: this.textarea.element })
  },

  refresh: function () {
    setStyles.call(this)
  },

  destroy: function () {
    this.element.removeChild(this.textareaClone.element)
    this.element.parentNode.insertBefore(this.textarea.element, this.element)
    this.element.parentNode.removeChild(this.element)
    this.textarea.destroy()
  }
}

function createElement () {
  var element = document.createElement('div')
  element.className = 'expanding-wrapper'
  element.style.position = 'relative'
  return element
}

function resetStyles () {
  var styles = {
    margin: 0,
    webkitBoxSizing: 'border-box',
    mozBoxSizing: 'border-box',
    boxSizing: 'border-box',
    width: '100%'
  }
  // Should only be called once i.e. on initialization
  this.textareaClone.style({
    minHeight: this.textarea.element.offsetHeight + 'px'
  })
  this.textareaClone.style(styles)
  this.textarea.style(styles)
}

function setStyles () {
  this.textareaClone.style(this.textareaClone.styles(this.textarea.element))
  this.textarea.style(this.textarea.styles())
}

/* global jQuery, define */
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory)
  } else if (typeof module === 'object' && module.exports) {
    module.exports = function (root, jQuery) {
      if (jQuery === undefined) {
        if (typeof window !== 'undefined') {
          jQuery = require('jquery')
        } else {
          jQuery = require('jquery')(root)
        }
      }
      factory(jQuery)
      return jQuery
    }
  } else {
    factory(jQuery)
  }
}(function ($) {
  function plugin (option) {
    if (option === 'active') return !!this.data('expanding')

    this.filter('textarea').each(function () {
      var $this = jQuery(this)
      var instance = $this.data('expanding')

      if (instance) {
        switch (option) {
          case 'destroy':
            $this.removeData('expanding')
            instance.destroy()
            return
          case 'refresh':
            instance.refresh()
            return
          default:
            return
        }
      } else if (!(this.offsetWidth > 0 || this.offsetHeight > 0)) {
        warn(
          'ExpandingTextareas: attempt to initialize an invisible textarea. ' +
          'Call expanding() again once it has been inserted into the page and/or is visible.'
        )
        return
      } else {
        return $this.data('expanding', new Expanding(this))
      }
    })
    return this
  }

  var defaults = {
    autoInitialize: true,
    initialSelector: 'textarea.expanding'
  }
  $.expanding = $.extend({}, defaults, $.expanding || {})
  $.fn.expanding = plugin
  $.fn.expanding.Constructor = Expanding

  if ($.expanding.autoInitialize) {
    $(document).ready(function () {
      $($.expanding.initialSelector).expanding()
    })
  }
}))

}());