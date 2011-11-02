(function ($) {

    var cloneCSSProperties = [
        'lineHeight', 'textDecoration', 'letterSpacing',
        'fontSize', 'fontFamily', 'fontStyle', 
        'fontWeight', 'textTransform', 'textAlign', 
        'direction', 'wordSpacing', 'fontSizeAdjust', 
        'whiteSpace', 'wordWrap'
    ];
    
    var containerCSSProperties = [
        'margin-top', 'margin-bottom'
    ];
    
    var textareaCSS = {
        position: "absolute",
        height: "100%",
        resize: "none"
    };
    
    var preCSS = {
        visibility: "hidden"
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

        return this.filter("textarea").each(function () {
            
            initialize(this.ownerDocument || document);
            
            var textarea = $(this);

            textarea.wrap("<div class='expandingText'></div>");
            textarea.after("<pre class='textareaClone'><div></div></pre>");

            var container = textarea.parent().css(containerCSS);
            var pre = container.find("pre").css(preCSS);

            textarea.css(textareaCSS);
            
            $.each(cloneCSSProperties, function (i, p) {
                pre.css(p, textarea.css(p));
            });
            
            $.each(containerCSSProperties, function (i, p) {
                container.css(p, textarea.css(p));
                pre.css(p, 0);
                textarea.css(p, 0);
            });
            
            resize(this);
        });
    };

    $.fn.expandingTextarea.initialSelector = "textarea.expanding";

    $(function () {
        $($.fn.expandingTextarea.initialSelector).expandingTextarea();
    });

})(jQuery);

