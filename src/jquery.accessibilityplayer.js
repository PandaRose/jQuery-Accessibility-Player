(function( $ ){
  $.fn.accessibilityPlayer = function(method,options) {

    // methods
    // -------------------------------------

    if (typeof(method) == 'string')
    {

      if ($(this).length == 0 || $(this).data("accessibilityPlayer") == null) throw "not an accessibility player";

      switch (method)
      {
        case 'toggle-play-pause':
          $('.jp-play, .jp-pause', $(this)).not('.jp-hidden').click();
          break;

        case 'play':
          $('.jp-play', $(this)).click();
          break;

        case 'pause':
          $('.jp-pause', $(this)).click();
          break;

        case 'stop':
          $('.jp-stop', $(this)).click();
          break;

        // set or get the status of this player
        case 'status':
          if (options == false || options == null) return $(this).data('accessibilityPlayer')['status'];

          switch(options)
          {
            case 'playing':
              $(this).accessibilityPlayer('play');
              break;
            case 'paused':
              $(this).accessibilityPlayer('pause');
              break;
            case 'stopped':
              $(this).accessibilityPlayer('stop');
              break;
          }
          break;

        case 'focus':
          var focus = $.fn.accessibilityPlayer.prototype.focusedPlayer;
          return (focus == null || $(this).filter(focus).length > 0 )? true : false;

        // seek position (range: 0 to 100)
        case 'seek':
          // get seek position
          var seek_pos = $(this).data("accessibilityPlayer")["seek"];
          if (seek_pos == null) seek_pos = 0;
          // set seek position
          if (options == null) return seek_pos;
          if (options == '++') seek_pos += 10;
          if (options == '--') seek_pos -= 10;
          if (typeof(options) == 'number') seek_pos = options;
          var seek_pos = $(this).data("accessibilityPlayer")["seek"] = seek_pos;
          $(".jp-jplayer", $(this)).jPlayer( "playHead", Math.min(100, Math.max(0, seek_pos) ) )
          break;

        // volume level (range: 0 to 100)
        case 'volume':
          var volume = $(this).data("accessibilityPlayer")['volume'];
          if (volume == null) volume = 100;
          if (options == null) return volume;
          if (options == '++') volume += 10;
          if (options == '--') volume -= 10;
          if (typeof(options) == 'number') volume = options;

          volume = Math.min(100, Math.max(0, volume ) );
          $(this).data("accessibilityPlayer")['volume'] = volume;
          $(".jp-jplayer", $(this)).jPlayer( "volume", volume / 100 )
          break;

        case 'mute':
          var mute = $(this).data("accessibilityPlayer")['mute'];
          if (options == null) return mute;
          if (options == true || options == false) mute = options;
          if (options == "toggle") mute = (mute == true? false : true);

          $(this).data("accessibilityPlayer")['mute'] = mute;

          $(this).trigger('mute-change');
          $(".jp-jplayer", $(this)).jPlayer( (mute == true? "unmute" : "mute") );
          break;

        case 'captions':
          if (options == null) return $(this).data("accessibilityPlayer")['captions'] == true;
          if (options == 'toggle') options = ($(this).data('accessibilityPlayer')['captions'] == false);
          $(this).data('accessibilityPlayer')['captions'] = (options == true);
          $(this).trigger('captions', (options == true));
          break;

        case 'audio-descriptors':
          if (options == null) return $(this).data("accessibilityPlayer")['audio-descriptors'] == true;
          if (options == 'toggle') options = ($(this).data('accessibilityPlayer')['audio-descriptors'] == false);
          $(this).data('accessibilityPlayer')['audio-descriptors'] = options;
          $(this).trigger('audio-descriptors', (options == true));
          break;

        case 'fullscreen':
          if (options == 'toggle')
          {
            $(this).find('.jp-fullscreen, .jp-exit-full-screen').click();
          }
          break;
      }

      return this;
    }

    options = method;


    /* ================================================
     * Accessibility Player default options and data
     * ================================================ */

    var defaults = {
      'track_name': '',
//      wmode: "transparent",
      'allow_fullscreen': true,

      /* False => no captions, URL => loads captions from url via ajax get. */
      'captions': false,

      /* used internally, set to true when this is a
       * fullscreen overlay controlled by another Accessbility Player. */
      'fullscreen_slave': false,

      'width': 480,
      'height': 270,

      fullscreen:
      {
        width: 940,
        height: 400
      },
      keyboard_shortcuts: true
    };
    var options = $.extend({}, defaults, options); 

    var data = {'options': options, 'mute': false, 'seek': 0};
    $(this).data('accessibilityPlayer', data);


    /* ================================================
     * Generating the Accessibility Player html
     * ================================================ */

    var html = '<div class="jp-video jp-video-scalable">'
                +'<div class="jp-type-single">'
                  +'<div class="jp-jplayer"></div>'
                  +'<div class="jp-interface">'
                    +'<div class="jp-video-play"></div>'
                    +'<ul class="jp-controls">';

    var controls = ['play', 'stop', 'pause', 'mute', 'unmute', 'fastforward', 'rewind'];
    if (options['allow_fullscreen'] == true) controls[controls.length] = 'fullscreen';
    if (options['fullscreen_slave'] == true) controls[controls.length] = 'exit full screen';
    controls[controls.length] = 'help';

    for(var i = 0; i < controls.length; i++)
    {
      html+= '<li><a href="#" class="jp-'+controls[i].replace(' ', '-').replace(' ', '-')+'" title="'+controls[i]+'" tabindex="1">'
          +controls[i]+'</a></li>';
    }

    html +=          '</ul>'
                    +'<div class="jp-progress">'
                      +'<div class="jp-seek-bar"><div class="jp-play-bar"></div></div>'
                    +'</div>'
                    +'<div class="jp-volume-bar"><div class="jp-volume-bar-value"></div></div>'
                    +'<div class="jp-current-time"></div>'
                    +'<div class="jp-duration"></div>'
                  +'</div>'
                  +'<div class="jp-playlist">'
                    +'<ul><li>'+options['track_name']+'</li></ul>'
                  +'</div>'
                +'</div>'
              +'</div>';

    $(this).html(html);


    /* ================================================
     * Loading the jPlayer
     * ================================================ */

    var id = $.jPlayer.prototype.count +1;
    data['player-id'] = id;
    // Updating ids of the other ui elements
    $(".jp-jplayer", $(this)).attr('id', 'jquery_jplayer_'+id);
    $(".jp-interface", $(this)).attr('id', 'jp_interface_'+id);
    $(".jp-playlist", $(this)).attr('id', 'jp_playlist_'+id);
    options['cssSelectorAncestor'] = "#jp_interface_"+id;

    // scaling the jPlayer elements
    var scaler = function (){
      var options = this[1];

      // widths and heights of player containers / flash objects
      $(this[0]).find(".jp-jplayer, .jp-interface, .jp-playlist, object, .jp-video-play").css('width', options['width']);
      $(this[0]).find(".jp-jplayer, object, .jp-video-play").css('height', options['height']);

      // position of play button
      $(this[0]).find('.jp-video-play').css('top', '-'+($(this[0]).find('.jp-jplayer').height())+'px');

      // trigger the ready event once we're good and scaled
      if (this[2] == true) $(this[0]).trigger('ready');
    };

    $.proxy(scaler, [this, options, false])();

    $(this).find('.jp-jplayer').bind($.jPlayer.event.ready, $.proxy(scaler, [this, options, true]));
    $(this).find('.jp-jplayer').bind($.jPlayer.event.play, $.proxy(scaler, [this, options, false]));


    $(".jp-jplayer", $(this)).jPlayer(options);


    // Storing status information in jquery data for easier access
    //-------------------------------------------------------------------

    $(".jp-jplayer", $(this)).bind($.jPlayer.event.timeupdate, $.proxy(function(event) {
      // seek position
      $(this).data("accessibilityPlayer")["seek"] = event.jPlayer.status.currentPercentAbsolute;
      $(this).trigger('timeUpdate', event.jPlayer.status.currentTime);
    }, this));

    // volume
    $(".jp-jplayer", $(this)).bind($.jPlayer.event.volumechange, $.proxy(function(event) {
      $(this).data("accessibilityPlayer")["volume"] = event.jPlayer.status.volume * 100;
    }, this));
    
    // mute
    $(this).find(".jp-mute, .jp-unmute").click($.proxy(function(event) {
      var mute = ( $(this).data("accessibilityPlayer")['mute'] == true? false : true );
      $(this).data("accessibilityPlayer")['mute'] = mute;
      $(this).trigger('mute-change', mute);
    }, this));


    // player status
    data['status'] = 'stopped';

    var stopped = $.proxy(function(event) {
        $(this).data('accessibilityPlayer')['status'] = 'stopped';
        $(this).trigger('status_change', $(this).data('accessibilityPlayer')['status']);
    }, this);
    
    var status_events = {};
    
    status_events[$.jPlayer.event.play] = $.proxy(function() {
        $(this).data('accessibilityPlayer')['status'] = 'playing';
        $(this).trigger('status_change', $(this).data('accessibilityPlayer')['status']);
      }, this);
    status_events[$.jPlayer.event.pause] = $.proxy(function() {
        $(this).data('accessibilityPlayer')['status'] = 'paused';
        $(this).trigger('status_change', $(this).data('accessibilityPlayer')['status']);
      }, this);
    status_events[$.jPlayer.event.abort] = stopped;
    status_events[$.jPlayer.event.ended] = stopped;

    $(".jp-jplayer", $(this)).bind(status_events);

    // binding to the ui for more robust flash/html5 seek events
    $(this).find('.jp-seek-bar, .jp-play-bar').bind('click', $.proxy(function() {
      $(".jp-jplayer", $(this)).one($.jPlayer.event.timeupdate, $.proxy(function(event) {
        $(this).data("accessibilityPlayer")["seek"] = event.jPlayer.status.currentPercentAbsolute;
        $(this).trigger('seeked');
      }, this) );

    }, this) );


    // helper variables and css for plugins
    // -------------------------------------

    // adding css selectors to play/pause buttons
    $('.jp-pause', $(this)).addClass('jp-hidden');
    $(this).bind('status_change', function(event, status)
    {
      if(status == 'playing' || status == 'paused')
      {
        $('.jp-play, .jp-pause', $(this)).toggleClass('jp-hidden');
      }
    });


    // Appending a notifications overlay to the player (or text links in older browsers)
    if ($.browser.msie == false || parseInt($.browser.version, 10) > 6)
    {
      $(this).find('.jp-interface').append('<div class="notifications notifications-overlay"></div>');
      $(this).find('.notifications-overlay').css('top', "-"+$('.jp-jplayer').height()+"px");
    }
    else
    {
      $(this).find('.jp-interface').append('<div class="notifications notifications-fallback"></div>');
    }

    // Scaling the flash player (if applicable)
//    alert(options['width']);
//      height: options['height']+'px'
//    });


    /* ================================================
     * Loading in the Plugins
     * ================================================ */

     for (p in $.fn.accessibilityPlayer.prototype.plugins)
     {
      if (options[p] != null && options[p] != false)
      {
        $.proxy($.fn.accessibilityPlayer.prototype.plugins[p], this)();
      }
     }

    // focusing the new player on creation
    $.fn.accessibilityPlayer.prototype.focusedPlayer = $(this);

    // fix the flash player's z-index (for overlayed html content)
    $.proxy($.fn.accessibilityPlayer.prototype.fixZindex, this)();
//alert($(this).attr('id'));


    return this;
  };


  $.fn.accessibilityPlayer.prototype.plugins = {};

})( jQuery );
