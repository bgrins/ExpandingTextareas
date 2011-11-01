(function ($) {

    var cloneCSSProperties = [
        'lineHeight', 'textDecoration', 'letterSpacing',
        'fontSize', 'fontFamily', 'fontStyle', 
        'fontWeight', 'textTransform', 'textAlign', 
        'direction', 'wordSpacing', 'fontSizeAdjust', 
        'whiteSpace', 'wordWrap'
    ];
    
    var textareaCSS = {
        overflow: "hidden",
        position: "absolute",
        top: "0",
        left: "0",
        height: "100%",
        resize: "none"
    };
    
    var preCSS = {
        display: "block",
        visibility: "hidden"
    };
    
    var containerCSS = {
        position: "relative"
    };
    
    var initializedDocuments = { };
    
    function resize(textarea) {  
        $(textarea).parent().find("span").text(textarea.value);
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
            textarea.after("<pre class='textareaClone'><span></span><br /></pre>");

            var container = textarea.parent().css(containerCSS);
            var pre = container.find("pre").css(preCSS);

            textarea.css(textareaCSS);
        
            $.each(cloneCSSProperties, function (i, p) {
                pre.css(p, textarea.css(p));
            });
            
            resize(this);
        });
    };

    $.fn.expandingTextarea.initialSelector = "textarea.expanding";

    $(function () {
        $($.fn.expandingTextarea.initialSelector).expandingTextarea();
    });

})(jQuery);

