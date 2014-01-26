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
        this.$clone = $("<pre><br /></pre>").prepend(this.$textCopy);

        this._resetStyles();
        this._setCloneStyles();
        this._setTextareaStyles();

        $textarea
            .wrap($("<div class='expandingText' style='position:relative' />"))
            .after(this.$clone)
            .bind("input.expanding propertychange.expanding keyup.expanding change.expanding",
                $.proxy(this.update, this));

        this.update();
        if (opts.resize) $textarea.bind("resize.expanding", opts.resize);
    };

    Expanding._registry = [];

    Expanding.getExpandingInstance = function(textarea) {
        var $textareas = $.map(Expanding._registry, function(instance) {
                return instance.$textarea[0];
            }),
            index = $.inArray(textarea, $textareas);
        return index > -1 ? Expanding._registry[index] : null;
    };

    Expanding.prototype = {

        update: function() {
            this.$textCopy.text(this.$textarea.val().replace(/\r\n/g, "\n"));
            this.$textarea.trigger("resize.expanding");
        },

        destroy: function() {
            this.$clone.remove();
            this.$textarea
                .unwrap()
                .attr('style', this._oldTextareaStyles || '');
            var index = $.inArray(this, Expanding._registry);
            if (index > -1) Expanding._registry.splice(index, 1);
        },

        isExpanding: function(textarea) {

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

    $.expandingTextarea = $.extend({
        autoInitialize: true,
        initialSelector: "textarea.expanding",
        opts: {
            resize: function() { }
        }
    }, $.expandingTextarea || {});

    $.fn.expandingTextarea = function(o) {

        if (o === "resize") return this.trigger("input.expanding");

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
            return $.inArray(true, instances) > -1 ? true : false;
        }

        var opts = $.extend({ }, $.expandingTextarea.opts, o);

        this.filter("textarea").each(function() {
            if(!Expanding.getExpandingInstance(this)) {
                new Expanding($(this), opts);
            }
        });
        return this;
    };

    $(function () {
        if ($.expandingTextarea.autoInitialize) {
            $($.expandingTextarea.initialSelector).expandingTextarea();
        }
    });

}));