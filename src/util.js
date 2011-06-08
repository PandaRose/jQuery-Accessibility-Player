(function( $ ){

  // Clones the state of another accessibility player onto this one
  $.fn.accessibilityPlayer.prototype.cloneState = function(other, self)
  {
    $(self).accessibilityPlayer( 'status', $(other).accessibilityPlayer('status') );
    $(self).accessibilityPlayer( 'seek', $(other).accessibilityPlayer('seek') );
  }


  $.fn.accessibilityPlayer.prototype.fixZindex = function(){

    var z_index = $(this).closest('.jp-fullscreen-player').length == 0? '1' : '2';
    $(this).find(".oembed").css('z-index',z_index).css('position','relative');
    $(this).find("object").css('z-index',z_index).css('position','relative');
    $(this).find("embed").css('z-index',z_index).css('position','relative');

    var obj = $(this).find('object');

//    obj.attr("wmode","opaque");

//    obj.find('param[name="WMode"]').attr('name', 'wmode').attr('value', 'opaque');

//    var para = document.createElement("param");
//    para.setAttribute("name","wmode");
//    para.setAttribute("value","transparent");

//    elements.append(para);

      // Required for IE6/7 to display the play button and notifications over the flash video player
      $(this).find('.jp-interface, .notifications, .notifications div').css('z-index', '10');
      $(this).find('.jp-video-play').css('z-index', '9');

  }


})( jQuery );
