/* ================================================
 * jQuery Accessibility Player FullScreen Plugin
 * ================================================ */

(function( $ ){
  $.fn.accessibilityPlayer.prototype.plugins['fullscreen'] = function() {

    var data = $(this).data('accessibilityPlayer');
    var options = data['options'];

    data['fullscreen-player'] = null;
    // fullscreen triggers
    $('.jp-fullscreen', $(this)).bind( 'click', $.proxy( function() {$(this).trigger('fullscreen', true)}, this ) );

    // fullscreen event
    $(this).bind('fullscreen', function(event, enable_fullscreen) {

      var data = $(this).data('accessibilityPlayer');

      // open fullscreen
      if (enable_fullscreen == true && data['fullscreen-player'] == null)
      {
        // adding the fullscreen player to the dom
        data['fullscreen-player'] = $('<div class="jp-fullscreen-player"></div>');
        $('body').append(data['fullscreen-player']);

        data['fullscreen-player'].bind($.jPlayer.event.ready, $.proxy(function() {
          // pausing the current player and copying it's settings
          $.fn.accessibilityPlayer.prototype.cloneState($(this), data['fullscreen-player']);
          $('.jp-jplayer', $(this)).jPlayer('pause');

          // moving the main player off screen to effectively hide it
          $(this).children().css({
            position: 'absolute',
            left: '-1000000px',
            top: '0px'
          });
        }, this));

        // creating the second accessibility player to act as a fullscreen player
        var fullscreen_options = $.extend({}, options, {
          'allow_fullscreen': false,
          'fullscreen_slave': true,
          'width': options['fullscreen']['width'],
          'height': options['fullscreen']['height']
        });
        data['fullscreen-player'].accessibilityPlayer(fullscreen_options).css({
          'position': 'absolute',
          'left': '50%',
          'top': '50%',
          'margin-left': "-" + options['fullscreen']['width']/2 + "px",
          'margin-top': "-" + options['fullscreen']['height']/2 + "px",
          'z-index': '20000000000000000000'
        });

        $('.jp-exit-full-screen', data['fullscreen-player']).bind( 'click', $.proxy( function() {
          $(this).trigger('fullscreen', false);
        }, this) );

        // creating the lightbox effect
        var $overlay = $('<div></div>');
        data['fullscreen-overlay'] = $overlay;
        $('body').append($overlay);
        if ($.browser.msie == false || parseInt($.browser.version, 10) > 7)
        {
          $overlay.hide().css({
            width: '100%',
            height: '100%',
            position: 'absolute',
            left: '0px',
            top: '0px',
            background: 'black',
            opacity: 0.6,
            filter: 'alpha(opacity=60)',
            'z-index': '100000000'
          }).click(function(event) { event.stopPropagation(); }).fadeIn(1500);
        }

      }

      // exit fullscreen
      if (enable_fullscreen == false)
      {
        // Killing the full screen flash object before restarting the main player (it can cause problems)
        $(data['fullscreen-player']).find('object').remove();

        // Updating the player (replicating the fullscreen player state)
        $.fn.accessibilityPlayer.prototype.cloneState(data['fullscreen-player'], $(this));

        // Repositioning (unhiding) the player
        $(this).children().css({
          left: '',
          right: '',
          position: ''
        });

        // deleting the fullscreen player
        data['fullscreen-player'].remove();
        data['fullscreen-player'] = null;
        // fading out the overlay and deleting it
        data['fullscreen-overlay'].fadeOut().queue(function() {
          $(this).remove();
        });
        data['fullscreen-overlay'] = null;

        $.fn.accessibilityPlayer.prototype.focusedPlayer = null;
      }
    });

  };

})( jQuery );
