/*
 * expanding-textareas 1.0.2
 * Copyright © 2011+ Brian Grinstead
 * Released under the MIT license
 * http://bgrins.github.com/ExpandingTextareas/
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Expanding = factory());
}(this, (function () { 'use strict';

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

return Expanding;

})));