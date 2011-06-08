/* ================================================
 * jQuery Accessibility Player Captions Plugin
 * ================================================ */

(function( $ ){

  // translates the caption xml time format to a number of seconds
  $.fn.accessibilityPlayer.prototype.caption_time = function (c, time) {
    var caption_time_str = $(c).attr(time).split(":");
    caption_time_str[2] = caption_time_str[2].split(".")[0];
    caption_time_str[3] = caption_time_str[2].split(".")[1];
    var millis = parseInt(caption_time_str[0], 10) *24;
    millis += parseInt(caption_time_str[1], 10);
    millis *= 60;
    millis += parseInt(caption_time_str[2], 10);
    //TODO: double parsing
    //caption_time_str[3]

    return millis;
  };


  $.fn.accessibilityPlayer.prototype.plugins['captions'] = function() {

    var data = $(this).data('accessibilityPlayer');
    var options = data['options'];

    /*
     * Captions Setup
     */
    var caption_h_margins = 10;
    var caption_v_margins = 5;
    var caption_line_height = 19;

    $(this).append("<div class='caption_box'><center><div>loading captions..</div></center></div>");

    $caption = $('.caption_box', $(this));
    var $caption_text  = $('.caption_box center :first-child', $(this));

    //$caption.hide();
    $caption.css({
      'position': 'absolute',
      'margin-top': (-90-caption_line_height*3)+'px',
      'z-index': '1000',
      'width': options['width'],
      'font-size': caption_line_height+'px',
      'line-height': caption_line_height+'px',
      'display': 'none'
    });

    $caption_text.css({
      'background-color': 'black',
      'color': 'white',
      'width': '350px',
      'text-align': 'left',
      'padding-left': caption_h_margins+'px',
      'padding-right': caption_h_margins+'px',
      'padding-top': caption_v_margins+'px',
      'padding-bottom': caption_v_margins+'px'
    });

  // Load the captions file with a ajax get
  $.get( options['captions'], $.proxy(function(captions_file) {
    //$(this).data('captions_file', captions_file);
    $(this).data('captions', $(captions_file).find("p"));
    $('.caption_box center :first-child', this).html("");
  }, this), 'xml');


    // Using the on time jwplayer event to update the captions every 0.1 seconds
    $(this).bind('timeUpdate', $.proxy(function(event, current_time)
    {
      
      var $captions = $(this).data('captions');

      if ($captions == null) return; // we are still loading the captions

      var $current_caption = null;

      // searching the caption xml file using DOM for the current caption node
      $captions.each(function() {
        var caption_start_time = $.fn.accessibilityPlayer.prototype.caption_time($(this), "begin");
        var caption_end_time = $.fn.accessibilityPlayer.prototype.caption_time($(this), "end");
        if ( current_time >= caption_start_time && current_time < caption_end_time)
        {
          // chrome debuging
          //console.log(current_time + " [ "+caption_start_time+" - "+caption_end_time+" ]: "+$(this).text());
          $current_caption = $(this);
          return false;
        }
      });

      // setting the current caption
      var text_container = $('.caption_box center :first-child', this)
      var text = "";
      if ($current_caption != null)
        text = $current_caption.text();
//          text = $.fn.accessibilityPlayer.prototype.caption_time($current_caption, "begin")+" "+$current_caption.text(); /*debug*/

      text_container.html(text);
      text_container.toggle($current_caption != null);
    }, this));


    // Adding the caption on/off toggle
    $(this).find('.notifications')
      .append('<div class="closed-captions" title="toggle closed-captioning"><div class="cc-img"></div><div class="cc-text">Closed Captions are off</div></div>');

    $(this).find('.closed-captions').click($.proxy(function(event) {
        var state = $(this).accessibilityPlayer('captions') != true;
        $(this).accessibilityPlayer('captions', state);

        event.stopPropagation();
      }, this));

    // Adding the event listener to disable/enable the captions
    $(this).bind('captions', function(event, state) {
      if  (state == true) $(this).find('.cc-text').html("Closed Captions are on");
      if  (state == false) $(this).find('.cc-text').html("Closed Captions are off");

      $('.caption_box', this).toggle(state);
    });

  };
})( jQuery );
