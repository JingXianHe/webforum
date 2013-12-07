// php.rcena@gmail.com
(function(tinymce) {
   var DOM = tinymce.activeEditor;    
   tinymce.create('tinymce.plugins.TextAlign', {    
    
   init : function(ed, url) {
   var t = this, duration = 500;
	 t.editor = ed;
   
   ed.addButton('text_align_left',
   {
   title : 'Text Align Left',
   image : wtp + 'images/text-align-left-icon.png',
   cmd : 'mceTextAlignLeft'
   });
   
   ed.addButton('text_align_center',
   {
   title : 'Text Align Center',
   image : wtp + 'images/text-align-center-icon.png',
   cmd : 'mceTextAlignCenter'
   });
   
   ed.addButton('text_align_justify',
   {
   title : 'Text Align Justify',
   image : wtp + 'images/text-align-justify-icon.png',
   cmd : 'mceTextAlignJustify'
   });
   
   ed.addButton('text_align_right',
   {
   title : 'Text Align Right',
   image : wtp + 'images/text-align-right-icon.png',
   cmd : 'mceTextAlignRight'
   });
   
   
   ed.addCommand('mceTextAlignLeft', function() {    
   if ( wl = ed.dom.get('mceWotlayer') ) {
       if ( jQuery('span', wl) )
       jQuery(wl).css( 'text-align', 'left' );
   }
   });

   ed.addCommand('mceTextAlignCenter', function() {   
   if ( wl = ed.dom.get('mceWotlayer') ) {
       if ( jQuery('span', wl) )
       jQuery(wl).css( 'text-align', 'center' );       
   }
   });

   ed.addCommand('mceTextAlignJustify', function() {   
   if ( wl = ed.dom.get('mceWotlayer') ) {
       if ( jQuery('span', wl) )
       jQuery(wl).css( 'text-align', 'justify' );
   }
   });

   ed.addCommand('mceTextAlignRight', function() {   
   if ( wl = ed.dom.get('mceWotlayer') ) {
       if ( jQuery('span', wl) )
       jQuery(wl).css( 'text-align', 'right' );
   }
   });         

   ed.onMouseDown.add(function(ed, e) {     
      is_span = ( e.target.nodeName != 'SPAN' );
      ed.controlManager.setDisabled( 'text_align_left', is_span );
      ed.controlManager.setDisabled( 'text_align_center', is_span );
      ed.controlManager.setDisabled( 'text_align_justify', is_span );
      ed.controlManager.setDisabled( 'text_align_right', is_span );
	 });

   
   }
   
           		
	 });
   
    
   
   

// Register plugin with a short name
tinymce.PluginManager.add('text_align', tinymce.plugins.TextAlign);
})(tinymce);