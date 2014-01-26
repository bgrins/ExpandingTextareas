# Expanding Textareas jQuery Plugin

Based off of work by [Neil Jenkins](http://nmjenkins.com/) that can be seen here: http://www.alistapart.com/articles/expanding-text-areas-made-elegant/

## Usage

Start with markup like this:
    
    <!-- jQuery 1.9+ required for best performance -->
    <script src="http://code.jquery.com/jquery-1.11.0.min.js"></script>
    <script src='PATH/TO/expanding.js'></script>
    <textarea class='expanding'></textarea>

*And that's it*.  The plugin finds textareas with the 'expanding' class on page load and initializes them for you.  If you would prefer to initialize the textareas on your own, do something like this:

    <script type='text/javascript'>
        $("#element").expanding();
    </script>

The textareas will automatically resize now as the user changes the value.  If you'd like to change the value by code and have it resize manually, you can do:

    $('textarea').val('New\nValue!').change()

If you'd like to change the initial selector to grab ALL textareas on load, you can change this property:

    $.fn.expanding.initialSelector = "textarea";

### destroy

Once attached, the expanding behaviour can be removed as follows:

    $(".element").expanding('destroy');

### isExpanding

To test whether a jQuery selection has expanding behaviour:

    $(".element").expanding('isExpanding');

Note: this behaves like `.hasClass()`: it will return `true` is _any_ of the nodes in the selection have expanding behaviour.

## How it works

See the [original article](http://www.alistapart.com/articles/expanding-text-areas-made-elegant/) for a great explanation of how this technique works.

The plugin will automatically find this textarea, and turn it into an expanding one.  The final (generated) markup will look something like this:

    <div class="expanding-wrapper">
      <textarea class="expanding"></textarea>
      <pre class="expanding-clone"><div></div></pre>
    </div>

The way it works is that as the user types, the text content is copied into the div inside the pre (which is actually providing the height of the textarea).  So it could look like this:

    <div class="expanding-wrapper">
      <textarea class="expanding">Some Content\nWas Entered</textarea>
      <pre class="expanding-clone"><div>Some Content
      Was Entered</div></pre>
    </div>

## Styling

You can style things how you'd like for the textarea, and they will automatically be copied over to the invisible pre tag, **with the exception of margins** (which are reset to 0, to ensure that the clone maintains the correct size and positioning).

**[Flash of unstyled content](http://en.wikipedia.org/wiki/Flash_of_unstyled_content) (FOUC)** can be avoided by adding the following styles to your stylesheet (adjust the selector if necessary):

    textarea.expanding {
      margin: 0;
      -webkit-box-sizing: border-box;
         -moz-box-sizing: border-box;
              box-sizing: border-box;
      width: 100%;
    }

By default, the textarea will behave like a block-level element: its width will expand to fill its container. To restrict the textarea width, simply apply a width declaration to a parent element e.g. the textarea wrapper:

    .expanding-wrapper {
       width: 50%;
    }

See the [demo](http://bgrins.github.com/ExpandingTextareas/) to see the plugin in action.

## Browser Support

This has been checked in Chrome, Safari, Firefox, IE8, and mobile Safari and it works in all of them.

## Running Tests

**Browser**: open `test/index.html`

**Command line**: make sure you have installed [node.js](http://nodejs.org/), and [grunt-cli](http://gruntjs.com/getting-started), then run:

    $ npm install

Followed by:

    $ grunt test

## Continuous Deployment

View tests online at: https://travis-ci.org/bgrins/ExpandingTextareas.
