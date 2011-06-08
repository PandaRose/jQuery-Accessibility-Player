/* ================================================
 * jQuery Accessibility Player Keyboard Shortcuts Plugin
 *
 * Requires: jquery.hotkeys.js
 * ================================================ */

(function( $ ){
  $.fn.accessibilityPlayer.prototype.plugins['keyboard_shortcuts'] = function() {

    // Setting up the help menu html
    var html = '<div class="jp-help-menu"><ul>';

    // Binding the keyboard shortcuts
    var key_shortcut = $.proxy(function(shortcut, method, options, description)
    {
      html += '<li>'+shortcut+' - '+description+'</li>';

      $(document).bind('keyup', shortcut, $.proxy(function() {

        if ( $(this[0]).accessibilityPlayer('focus') == true)
            $(this[0]).accessibilityPlayer(this[1], this[2]);

      }, [this, method, options] ) );
    }, this);

    key_shortcut('alt+ctrl+p', 'toggle-play-pause', null, 'Toggle play and pause');
    key_shortcut('alt+ctrl+s', 'stop', null, 'Stop');

    key_shortcut('alt+ctrl+d', 'volume', '--', 'Decrease volume');
    key_shortcut('alt+ctrl+u', 'volume', '++', 'Increase volume');

    key_shortcut('alt+ctrl+b', 'seek', '--', 'Jump back');
    key_shortcut('alt+ctrl+f', 'seek', '++', 'Jump forward');

    key_shortcut('alt+ctrl+m', 'mute', 'toggle', 'Toggle sound mute');

    key_shortcut('alt+ctrl+a', 'audio-descriptors', 'toggle', 'Toggle audio descriptions (if available)');

    key_shortcut('alt+ctrl+c', 'captions', 'toggle', 'Toggle captions (if available)');

    key_shortcut('alt+ctrl+f', 'fullscreen', 'toggle', 'Toggle fullscreen player');

    // appending the html to the player
    html += "</ul></div>";
    $(this).append(html);

  };
})( jQuery );
