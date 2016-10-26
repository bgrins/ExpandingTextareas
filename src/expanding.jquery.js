/* global jQuery, define */
import { warn } from './helpers'
import Expanding from './expanding'

// UMD jQuery Plugin Template from: https://github.com/umdjs/umd#jquery-plugin
;(function (factory) {
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
