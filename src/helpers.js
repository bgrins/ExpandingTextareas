// Returns the version of Internet Explorer or -1
// (indicating the use of another browser).
// From: http://msdn.microsoft.com/en-us/library/ms537509(v=vs.85).aspx#ParsingUA
var ieVersion = (function () {
  var v = -1;
  if (navigator.appName === 'Microsoft Internet Explorer') {
    var ua = navigator.userAgent;
    var re = new RegExp('MSIE ([0-9]{1,}[\\.0-9]{0,})');
    if (re.exec(ua) !== null) v = parseFloat(RegExp.$1);
  }
  return v;
})();

// Check for oninput support
// IE9 supports oninput, but not when deleting text, so keyup is used.
// onpropertychange _is_ supported by IE8/9, but may not be fired unless
// attached with `attachEvent`
// (see: http://stackoverflow.com/questions/18436424/ie-onpropertychange-event-doesnt-fire),
// and so is avoided altogether.
var inputSupported = (
  'oninput' in document.createElement('input') && ieVersion !== 9
);

export var inputEvent = inputSupported ? 'input' : 'keyup';

export function style (element, styles) {
  for (var property in styles) element.style[property] = styles[property];
}

export function dispatch (eventName, options) {
  options = options || {};
  var event = document.createEvent('Event');
  event.initEvent(eventName, true, options.cancelable === true);
  event.data = options.data != null ? options.data : {};
  var target = options.target != null ? options.target : document;
  target.dispatchEvent(event);
}

export function warn(text) {
  if (window.console && console.warn) console.warn(text);
}
