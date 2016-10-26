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

export var inputEvent = inputEventSupported ? 'input' : 'keyup'

export var isIosDevice = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream

export function wrap (element, wrapper) {
  element.parentNode.insertBefore(wrapper, element)
  wrapper.appendChild(element)
}

export function style (element, styles) {
  for (var property in styles) element.style[property] = styles[property]
}

export function dispatch (eventName, options) {
  options = options || {}
  var event = document.createEvent('Event')
  event.initEvent(eventName, true, options.cancelable === true)
  event.data = options.data != null ? options.data : {}
  var target = options.target != null ? options.target : document
  target.dispatchEvent(event)
}

export function warn (text) {
  if (window.console && console.warn) console.warn(text)
}
