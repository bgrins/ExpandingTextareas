
// typetype jQuery plugin by @iamdanfox (github.com/iamdanfox/typetype/)
jQuery.fn.extend({typetype:function(e,n){var t,u;return u=jQuery.extend({keypress:function(){},callback:function(){},ms:100,e:.04},n),t=function(n){return Math.random()*u.ms*(e[n-1]===e[n]?1.6:"."===e[n-1]?12:"!"===e[n-1]?12:"?"===e[n-1]?12:"\n"===e[n-1]?12:","===e[n-1]?8:";"===e[n-1]?8:":"===e[n-1]?8:" "===e[n-1]?3:2)},this.each(function(){var n;return n=this,jQuery(n).queue(function(){var r,i,c,o;return i=n.tagName==="input".toUpperCase()||n.tagName==="textarea".toUpperCase()?"value":"innerHTML",r=function(e,t){e?(n[i]+=e[0],setTimeout(function(){return r(e.slice(1),t)},u.ms)):t()},c=function(e,t){e?(n[i]=n[i].slice(0,-1),setTimeout(function(){return c(e-1,t)},u.ms)):t()},(o=function(a){var s,f,l;a<=(f=e.length)?(s=function(){return setTimeout(function(){return o(a)},t(a))},l=Math.random()/u.e,.3>l&&e[a-1]!==e[a]&&f>a+4?r(e.slice(a,a+4),function(){return c(4,s)}):.5>l&&e[a-1]!==e[a]&&f>a?r(e[a],function(){return c(1,s)}):.8>l&&e[a-1]!==e[a]&&f>a?r(e[a]+e[a-1],function(){return c(2,s)}):1>l&&a>1&&e[a-2]===e[a-2].toUpperCase()&&f>a+4?r(e[a-1].toUpperCase()+e.slice(a,a+4),function(){return c(5,s)}):(n[i]+=e[a-1],u.keypress.call(n,a),setTimeout(function(){return o(a+1)},t(a)))):(u.callback.call(n),jQuery(n).dequeue())})(1)})})}});

// home page
$(function() {
  // initialisation stuff:
  $('#downarrow').click(function(){ introSeq.resolve() })
  $('#demo textarea').val("")

  // intro before the narrative fades in.
  var introSeq = new $.Deferred()
  var introAnimation = new $.Deferred()
  introSeq.done(function(){
    // makes the narrative fade-in when the intro is done.
    $('body').addClass('demo-done')
    setTimeout(function(){introAnimation.resolve()}, 1000) // CSS animation
  })

  // start the ghost typing
  $('#demo textarea').
    focus().
    delay(600).
    typetype("This is just a normal textarea...\n\n", {
      e:0, // no typing errors!
      ms:90, // fast typing
      keypress: function(){$(this).change()},
      callback: function(){$('#demo').addClass('persp')}
    }).
    typetype("except it expands when you type!", {
      keypress: function(){$(this).change()},
      callback: function(){introSeq.resolve()}
    })

  // immediately show narrative if user tries to scroll (prevents scrolling)
  $(window).on('DOMMouseScroll mousewheel', function (e) {
    if(e.originalEvent.detail > 0 || e.originalEvent.wheelDelta < 0)
      introSeq.resolve()
    return false;
  });

  // re-allow scrolling when animation done
  introAnimation.done(function(){
    $(window).off('DOMMouseScroll mousewheel')
  })
});