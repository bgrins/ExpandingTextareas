/*
 * expanding-textareas 1.0.0
 * Copyright © 2011+ Brian Grinstead
 * Released under the MIT license
 * http://bgrins.github.com/ExpandingTextareas/
 */

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
  this.textarea.on(inputEvent, inputHandler)
  this.textarea.on('change', inputHandler)

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

return Expanding;

})));