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
    $.expandingTextarea = $.extend({
        autoInitialize: true,
        initialSelector: "textarea.expanding"
    }, $.expandingTextarea || {});
    
    var cloneCSSProperties = [
        'lineHeight', 'textDecoration', 'letterSpacing',
        'fontSize', 'fontFamily', 'fontStyle', 
        'fontWeight', 'textTransform', 'textAlign', 
        'direction', 'wordSpacing', 'fontSizeAdjust', 
        'wordWrap', 
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
        resize: "none"
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
        var $self = $(this),
            onResize = $self.data('onResize');

        $self.closest('.expandingText').find("div").text(this.value + ' ');
        if (onResize) onResize($self);
    }
    
    $.fn.expandingTextarea = function(o) {
        
        if (typeof o === 'string') {
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
        } else if (typeof o === 'object') {
            if (o.onResize) $(this).data('onResize', o.onResize);
        }
        
        this.filter("textarea").not(".expanding-init").each(function() {
            var textarea = $(this).addClass("expanding-init");
            
            textarea.wrap("<div class='expandingText'></div>");
            textarea.after("<pre class='textareaClone'><div></div></pre>");
            
            var container = textarea.parent().css(containerCSS);
            var pre = container.find("pre").css(preCSS);
            
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
            
            textarea.bind("input.expanding propertychange.expanding", resize);
            resize.apply(this);
        });
        
        return this;
    };
    
    $(function () {
        if ($.expandingTextarea.autoInitialize) {
            $($.expandingTextarea.initialSelector).expandingTextarea();
        }
    });
    
}));
