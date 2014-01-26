// Expanding Textareas
// https://github.com/bgrins/ExpandingTextareas

(function(factory) {
    // Add jQuery via AMD registration or browser globals
    if (typeof define === 'function' && define.amd) {
        define([ 'jquery' ], factory);
    }
    else {
        factory(jQuery);
    }
}(function ($) {

    var Expanding = function($textarea, opts) {
        Expanding._registry.push(this);

        this.$textarea = $textarea;
        this.$textCopy = $("<span />");
        this.$clone = $("<pre class='expanding-clone'><br /></pre>").prepend(this.$textCopy);

        this._resetStyles();
        this._setCloneStyles();
        this._setTextareaStyles();

        $textarea
            .wrap($("<div class='expanding-wrapper' style='position:relative' />"))
            .after(this.$clone);

        this.attach();
        this.update();
        if (opts.update) $textarea.bind("update.expanding", opts.update);
    };

    Expanding._registry = [];

    Expanding.getExpandingInstance = function(textarea) {
        var $textareas = $.map(Expanding._registry, function(instance) {
                return instance.$textarea[0];
            }),
            index = $.inArray(textarea, $textareas);
        return index > -1 ? Expanding._registry[index] : null;
    };

    // Returns the version of Internet Explorer or -1
    // (indicating the use of another browser).
    // From: http://msdn.microsoft.com/en-us/library/ms537509(v=vs.85).aspx#ParsingUA
    var ieVersion = (function() {
        var v = -1;
        if (navigator.appName === "Microsoft Internet Explorer") {
            var ua = navigator.userAgent;
            var re = new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})");
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
     var inputSupported = (function () {
        var supported;
        return function() {
            if (!supported) {
                if ("oninput" in document.body && ieVersion !== 9)
                    supported = true;
            }
            return supported;
        };
    })();

    Expanding.prototype = {

        attach: function() {
            var events = 'input.expanding change.expanding',
                _this = this;
            if(!inputSupported()) events += ' keyup.expanding';
            this.$textarea.bind(events, function() { _this.update() });
        },

        update: function() {
            this.$textCopy.text(this.$textarea.val().replace(/\r\n/g, "\n"));
            this.$textarea.trigger("update.expanding");
        },

        destroy: function() {
            this.$clone.remove();
            this.$textarea
                .unwrap()
                .attr('style', this._oldTextareaStyles || '');
            delete this._oldTextareaStyles;
            var index = $.inArray(this, Expanding._registry);
            if (index > -1) Expanding._registry.splice(index, 1);
            this.$textarea.unbind(
                'input.expanding change.expanding keyup.expanding update.expanding');
        },

        _resetStyles: function() {
            // Store the original styles in case of destroying.
            this._oldTextareaStyles = this.$textarea.attr('style');

            this.$textarea.add(this.$clone).css({
                margin: 0,
                webkitBoxSizing: "border-box",
                mozBoxSizing: "border-box",
                boxSizing: "border-box",
                width: "100%"
            });
        },

        _setCloneStyles: function() {
            var css = {
                display: 'block',
                border: '0 solid',
                visibility: 'hidden',
                minHeight: this.$textarea.outerHeight()
            };
            if(this.$textarea.attr("wrap") === "off") css.overflowX = "scroll";
            else css.whiteSpace = "pre-wrap";

            this.$clone.css(css);
            this._copyTextareaStylesToClone();
        },

        _copyTextareaStylesToClone: function() {
            var _this = this,
                properties = [
                    'lineHeight', 'textDecoration', 'letterSpacing',
                    'fontSize', 'fontFamily', 'fontStyle',
                    'fontWeight', 'textTransform', 'textAlign',
                    'direction', 'wordSpacing', 'fontSizeAdjust',
                    'wordWrap', 'word-break',
                    'borderTopStyle', 'borderBottomStyle',
                    'borderLeftWidth', 'borderRightWidth',
                    'borderTopWidth','borderBottomWidth',
                    'paddingLeft', 'paddingRight',
                    'paddingTop','paddingBottom'];

            $.each(properties, function(i, property) {
                var val = _this.$textarea.css(property);

                // Prevent overriding percentage css values.
                if(_this.$clone.css(property) !== val) {
                    _this.$clone.css(property, val);
                }
            });
        },

        _setTextareaStyles: function() {
            this.$textarea.css({
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                resize: "none"
            });
        }
    };

    $.expanding = $.extend({
        autoInitialize: true,
        initialSelector: "textarea.expanding",
        opts: {
            update: function() { }
        }
    }, $.expanding || {});

    $.fn.expanding = function(o) {

        if (o === "destroy") {
            this.each(function() {
                var instance = Expanding.getExpandingInstance(this);
                if (instance) instance.destroy();
            });
            return this;
        }

        if (o === 'isExpanding') {
            var instances = this.map(function() {
                return !!Expanding.getExpandingInstance(this);
            });
            return $.inArray(true, instances) > -1;
        }

        var opts = $.extend({ }, $.expanding.opts, o);

        this.filter("textarea").each(function() {
            if(!Expanding.getExpandingInstance(this)) {
                new Expanding($(this), opts);
            }
        });
        return this;
    };

    $(function () {
        if ($.expanding.autoInitialize) {
            $($.expanding.initialSelector).expanding();
        }
    });

}));