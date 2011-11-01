## Expanding Textareas

Based off of work by [Neil Jenkins](http://nmjenkins.com/)

http://www.alistapart.com/articles/expanding-text-areas-made-elegant/

Start with markup like this: 

    <textarea class='expanding'></textarea>

The plugin will automatically find this textarea, and turn it into an expanding one.  The final (generated) markup will look something like this:

    <div class="expandingText">
      <textarea class="expanding"></textarea>
      <pre class="textareaClone"><span></span><br></pre>
    </div>
    

You can style things how you'd like for the textarea, but it is best (especially if you are using percentages for values, if you combine these into a rule with the `pre` tag, like this:

    textarea, .textareaClone {
      padding: 3%;
      background: transparent;
      font-family: Arial;
      font-style: italic;
      font-size:33px;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    
See the [original article](http://www.alistapart.com/articles/expanding-text-areas-made-elegant/) for a great explanation of how this technique works.