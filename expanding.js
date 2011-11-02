(function ($) {

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
    
    var initializedDocuments = { };
    
    function resize(textarea) {
        $(textarea).parent().find("div").text(textarea.value + ' ');
    }
  
    function initialize(document) {
        // Only need to initialize events once per document
        if (!initializedDocuments[document]) {
            initializedDocuments[document] = true;
            
            $(document).delegate(
                ".expandingText textarea", 
                "input propertychange", 
                function () {
                    resize(this);
                }
            );
        }
    }

    $.fn.expandingTextarea = function () {

        return this.filter("textarea").not(".expanding-init").each(function () {
            
            initialize(this.ownerDocument || document);
            
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
            
            resize(this);
        });
    };

    $.fn.expandingTextarea.initialSelector = "textarea.expanding";

    $(function () {
        $($.fn.expandingTextarea.initialSelector).expandingTextarea();
    });

})(jQuery);

