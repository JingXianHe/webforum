// php.rcena@gmail.com
(function() {
tinymce.create('tinymce.plugins.ifdragedit', {    
    
   init : function(ed, url) {
   
	 ed.addCommand('mceIfDragEdit', function( ui, v )
   {
      var is_drag = jQuery('#optinrev_dragging').val();      
      is_drag = ( is_drag == 1 ) ? '' : 1;      
      jQuery('#optinrev_dragging').val( is_drag );
      wtfn.mce_toolbar( is_drag );
      
      if ( !tinymce.isIE ) {
        ed.getDoc().designMode = 'off';
        
        is_editing = ( is_drag ) ? true : false;      
        wtfn.clear_layer( ed );
      }
	 });
   
   ed.addCommand( 'mceIfDragEditHelp', function( ui, v ) {
     return;
   })
   
   ed.addButton('ifdragedit',
   {
   title : 'Enabled / Disabled Layer Dragging',
   image : wtp + 'images/drag.png',
   cmd : 'mceIfDragEdit'
   });
   
   ed.addButton('ifdragedithelp',
   {
   title : null,
   image : wtp + 'images/drag-help.png',
   cmd : 'mceIfDragEditHelp'
   });
   
   
   }
  });

// Register plugin with a short name
tinymce.PluginManager.add('ifdragedit', tinymce.plugins.ifdragedit);
})();