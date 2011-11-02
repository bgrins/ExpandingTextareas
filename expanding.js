(function ($) {

    var cloneCSSProperties = [
        'lineHeight', 'textDecoration', 'letterSpacing',
        'fontSize', 'fontFamily', 'fontStyle', 
        'fontWeight', 'textTransform', 'textAlign', 
        'direction', 'wordSpacing', 'fontSizeAdjust', 
        'whiteSpace', 'wordWrap', 
        'borderLeftWidth', 'borderRightWidth',
        'borderTopWidth','borderBottomWidth'
    ];
    
    var textareaCSS = {
        position: "absolute",
        height: "100%",
        resize: "none",
        margin: "0"
    };
    
    var preCSS = {
        visibility: "hidden",
        margin: "0",
        border: "0 solid"
    };
    
    var containerCSS = {
        position: "relative",
        margin: "0",
        padding: "0"
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
            
            resize(this);
        });
    };

    $.fn.expandingTextarea.initialSelector = "textarea.expanding";

    $(function () {
        $($.fn.expandingTextarea.initialSelector).expandingTextarea();
    });

})(jQuery);

