(function ($) {
    $.expandingTextarea = $.extend({
        autoInitialize: true,
        initialSelector: "textarea.expanding"
    }, $.expandingTextarea || {});
    
    var cloneCSSProperties = [
        'lineHeight', 'textDecoration', 'letterSpacing',
        'fontSize', 'fontFamily', 'fontStyle', 
        'fontWeight', 'textTransform', 'textAlign', 
        'direction', 'wordSpacing', 'fontSizeAdjust', 
        'whiteSpace', 'wordWrap', 
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
        border: "0 solid"
    };
    
    var containerCSS = {
        position: "relative"
    };
    
    function resize() {
        $(this).parent().find("div").text(this.value + ' ');
    }
  
    $.fn.expandingTextarea = function (o) {
        
        if (o === "resize") {
            return this.trigger("input.expanding");
        }
        
        this.filter("textarea").not(".expanding-init").each(function () {
            
            var textarea = $(this).addClass("expanding-init");

            textarea.wrap("<div class='expandingText'></div>");
            textarea.after("<pre class='textareaClone'><div></div></pre>");
            
            var container = textarea.parent().css(containerCSS);
            var pre = container.find("pre").css(preCSS);

            textarea.css(textareaCSS);
            
            $.each(cloneCSSProperties, function (i, p) {
                var val = textarea.css(p);
                
                // Only set if different to prevent overriding percentage css values
                if (pre.css(p) !== val) {
                    pre.css(p, val);
                }
            });
            
            textarea.on("input.expanding propertychange.expanding", resize);
            resize.apply(this);
        });
        
        return this;
    };

    $(function () {
        if ($.expandingTextarea.autoInitialize) {
            $($.expandingTextarea.initialSelector).expandingTextarea();
        }
    });

})(jQuery);

