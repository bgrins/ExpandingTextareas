import { wrap, inputEvent, dispatch } from './helpers'
import Textarea from './textarea'
import TextareaClone from './textarea-clone'

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

export default Expanding
