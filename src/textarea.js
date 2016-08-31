import { style } from './helpers'

export default function Textarea (element) {
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
