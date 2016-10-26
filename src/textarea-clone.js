import { style, isIosDevice } from './helpers'

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

export default function TextareaClone () {
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
