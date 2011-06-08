/* ================================================
 * jQuery Accessibility Player Audio Descriptors Plugin
 * ================================================ */

(function( $ ){
  $.fn.accessibilityPlayer.prototype.plugins['audio_descriptors'] = function() {

    var data = $(this).data('accessibilityPlayer'); // internal player data
    var options = data['options']; // the options the player was originally created with

    // Appending the audio descriptor html
    var $audio_descriptors = $($('<div style="position: absolute; left: -10000, top: 0px;"></div>'));
    data['audio_descriptors'] = $audio_descriptors;
    $('body').append($audio_descriptors);

    // hiding the audio descriptors player
    $audio_descriptors.bind('ready', function() {
//    alert('audio ready');
      $(this).css({
        position: 'absolute',
        left: '-10000px',
        top: '0px'
      });
    });

    // Extracting the media types keys from the audio descriptors hash
    var supplied = '';
    for(var i in options['audio_descriptors']) if (options['audio_descriptors'].hasOwnProperty(i))
    {
      if (supplied != '') supplied += ', ';
      supplied += i;
    }

    // Initializing the audio descriptor's player (a hidden audio accesssibility player)
    $audio_descriptors.accessibilityPlayer({
      ready: $.proxy(function () {
        $(this[0]).find('.jp-jplayer').jPlayer("setMedia", this[1]);
      }, [ $audio_descriptors, options['audio_descriptors'] ]),

      swfPath: options['swfPath'],
      solution: options['solution'],
      supplied: supplied,

      keyboard_shortcuts: false,
      captions: false,
      audio_descriptors: false
    });

    $audio_descriptors.find(".jp-interface, .jp-playlist, .jp-video-play").hide();


    // Tracking the main player's events with the accessibility player
    $(this).bind('status_change', function(event, status) {
      if ($(this).accessibilityPlayer('audio-descriptors') != true) return;
      $audio_descriptors = $( $(this).data('accessibilityPlayer')['audio_descriptors'] );

      $audio_descriptors.accessibilityPlayer('status', status);
      $audio_descriptors.accessibilityPlayer('seek', $(this).accessibilityPlayer('seek'));
    });

    $(this).bind('seeked', function(event) {
      if ($(this).accessibilityPlayer('audio-descriptors') != true) return;
      $audio_descriptors = $( $(this).data('accessibilityPlayer')['audio_descriptors'] );
      $audio_descriptors.accessibilityPlayer('seek', $(this).accessibilityPlayer('seek'));

    });



    // Adding the audio descriptors on/off toggle
    $(this).find('.notifications')
      .append('<div class="audio-description" title="toggle audio descriptors"><div class="ad-img"></div><div class="ad-text">Audio Descriptions are off</div></div>');

    $(this).find('.audio-description').click($.proxy(function(event) {
        var state = $(this).accessibilityPlayer('audio-descriptors') != true;
        $(this).accessibilityPlayer('audio-descriptors', state);

        event.stopPropagation();
      }, this));

    // Adding the event listener to disable/enable the captions
    $(this).bind('audio-descriptors', function(event, state) {
      $audio_descriptors = $( $(this).data('accessibilityPlayer')['audio_descriptors'] );

      // Updating the ui
      if  (state == true) $(this).find('.ad-text').html("Audio Descriptions are on");
      if  (state == false) $(this).find('.ad-text').html("Audio Descriptions are off");

      // Updating the player
      if (state == true)
      {
        $audio_descriptors.accessibilityPlayer('status', $(this).accessibilityPlayer('status'));
        $audio_descriptors.accessibilityPlayer('seek', $(this).accessibilityPlayer('seek'));
      }
      else
      {
        $audio_descriptors.accessibilityPlayer('pause');
      }
    });

  };
})( jQuery );
