// Expanding Textareas
// https://github.com/adrianschmidt/ExpandingTextareas
// Forked from:
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
    $.expandingTextarea = $.extend({
        autoInitialize: true,
        initialSelector: "textarea.expanding",
        opts: {
            resize: function() { }
        }
    }, $.expandingTextarea || {});

    var cloneCSSProperties = [
        'lineHeight', 'textDecoration', 'letterSpacing',
        'fontSize', 'fontFamily', 'fontStyle',
        'fontWeight', 'textTransform', 'textAlign',
        'direction', 'wordSpacing', 'fontSizeAdjust',
        'word-break',
        'borderLeftWidth', 'borderRightWidth',
        'borderTopWidth','borderBottomWidth',
        'paddingLeft', 'paddingRight',
        'paddingTop','paddingBottom',
        'marginLeft', 'marginRight',
        'marginTop','marginBottom',
        'boxSizing', 'webkitBoxSizing', 'mozBoxSizing', 'msBoxSizing'
    ];

    var textareaCSS = {
        position: "absolute",
        height: "100%",
        resize: "none",
        overflow: "hidden"
    };

    var preCSS = {
        visibility: "hidden",
        border: "0 solid",
        whiteSpace: "pre-wrap"
    };

    var containerCSS = {
        position: "relative"
    };

    function resize() {
        $(this).closest('.expandingText').find("div").text(this.value + ' ');
        $(this).trigger("resize.expanding");
    }

    $.fn.expandingTextarea = function(o) {

        var opts = $.extend({ }, $.expandingTextarea.opts, o);

        if (o === "resize") {
            return this.trigger("input.expanding");
        }

        if (o === "destroy") {
            this.filter(".expanding-init").each(function() {
                var textarea = $(this).removeClass('expanding-init');
                var container = textarea.closest('.expandingText');

                container.before(textarea).remove();
                textarea
                    .attr('style', textarea.data('expanding-styles') || '')
                    .removeData('expanding-styles');
            });

            return this;
        }

        this.filter("textarea").not(".expanding-init").addClass("expanding-init").each(function() {
            var textarea = $(this);

            var container = $("<div class='expandingText'></div>").css(containerCSS);
            var pre = $("<pre class='textareaClone'><div></div></pre>").css(preCSS);
            pre.find('div').css('wordWrap', 'break-word');

            textarea.wrap(container);
            textarea.after(pre);

            // Store the original styles in case of destroying.
            textarea.data('expanding-styles', textarea.attr('style'));
            textarea.css(textareaCSS);

            $.each(cloneCSSProperties, function(i, p) {
                var val = textarea.css(p);

                // Only set if different to prevent overriding percentage css values.
                if (pre.css(p) !== val) {
                    pre.css(p, val);
                }
            });

            textarea.bind("input.expanding propertychange.expanding keyup.expanding", resize);
            resize.apply(this);

            if (opts.resize) {
                textarea.bind("resize.expanding", opts.resize);
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
