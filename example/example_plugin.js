/* ================================================
 * jQuery Accessibility Player Example Plugin
 * ================================================ */

(function( $ ){
  // by adding your function to the plugins hash users can set options under your plugin's name
  // in this example you could set the example_plugin option to anything other then null or false 
  // to have it included in your player.
  $.fn.accessibilityPlayer.prototype.plugins['example_plugin'] = function() {

    var data = $(this).data('accessibilityPlayer'); // internal player data
    var options = data['options']; // the options the player was originally created with

    // Your Awesome Plugin Here!

  };
})( jQuery );
