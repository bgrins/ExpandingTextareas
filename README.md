# Expanding Textareas jQuery Plugin

Based off of work by [Neil Jenkins](http://nmjenkins.com/) that can be seen here: http://www.alistapart.com/articles/expanding-text-areas-made-elegant/

## How To Use

Start with markup like this: 

    <script src='expanding.js' type='text/javascript'></script>
    <textarea class='expanding'></textarea>

*And that's it*.  The plugin finds textareas with the 'expanding' class on page load and initializes them for you.  If you would prefer to initialize the textareas on your own, do something like this:

    <script type='text/javascript'>
        $("#element").expandingTextarea();
    </script>

If you'd like to change the initial selector to grab ALL textareas on load, you can change this property:

    $.fn.expandingTextarea.initialSelector = "textarea";
        
## How it works

See the [original article](http://www.alistapart.com/articles/expanding-text-areas-made-elegant/) for a great explanation of how this technique works.

The plugin will automatically find this textarea, and turn it into an expanding one.  The final (generated) markup will look something like this:

    <div class="expandingText">
      <textarea class="expanding"></textarea>
      <pre class="textareaClone"><div></div></pre>
    </div>

The way it works is that as the user types, the text content is copied into the div inside the pre (which is actually providing the height of the textarea).  So it could look like this:

    <div class="expandingText">
      <textarea class="expanding">Some Content\nWas Entered</textarea>
      <pre class="textareaClone"><div>Some Content
      Was Entered</div></pre>
    </div>

## Styling

You can style things how you'd like for the textarea, and they will automatically be copied over to the invisible pre tag.

    textarea {
      padding: 10px;
      background: transparent;
      font-family: Arial;
      font-style: italic;
      font-size:20px;
    }

If you'd like to use percentage widths, there are two options.  One is to apply the rule to both the textarea and the invisible pre, like this: 

    textarea, .textareaClone {
       width: 50%;
    }

If you'd prefer to center the content, set the width to 100% on the textarea, and specify the width on the expandingText container:

    textarea {
      -webkit-box-sizing: border-box;
         -moz-box-sizing: border-box;
          -ms-box-sizing: border-box;
              box-sizing: border-box;
      width: 100%;
    }
    .expandingText {
      width: 50%;
      margin: 0 auto;
    }


See the [demo](http://bgrins.github.com/ExpandingTextareas/) to see the plugin in action.

## Browser Support

I have checked this in Chrome, Safari, Firefox, IE7, and mobile Safari and it works in all of them.