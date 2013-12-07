// php.rcena@gmail.com
(function(tinymce) {
   var DOM = tinymce.activeEditor;    
   tinymce.create('tinymce.plugins.ObjectAlign', {    
    
   init : function(ed, url) {
   var t = this, duration = 500;
	 t.editor = ed;
   
   ed.addButton('object_align_top',
   {
   title : 'Object Top Align',
   image : wtp + 'images/objtop.png',
   cmd : 'mceObjectAlignTop'
   });
   
   ed.addButton('object_align_bottom',
   {
   title : 'Object Bottom Align',
   image : wtp + 'images/objbottom.png',
   cmd : 'mceObjectAlignBottom'
   });
   
   ed.addButton('object_align_left',
   {
   title : 'Object Left Align',
   image : wtp + 'images/objleft.png',
   cmd : 'mceObjectAlignLeft'
   });
   
   ed.addButton('object_align_right',
   {
   title : 'Object Right Align',
   image : wtp + 'images/objright.png',
   cmd : 'mceObjectAlignRight'
   });
   
   ed.addButton('object_align_center',
   {
   title : 'Object Center Align',
   image : wtp + 'images/objcenter.png',
   cmd : 'mceObjectAlignCenter'
   });      
   
   ed.addCommand('mceObjectAlignTop', function() {   
   if ( wl = ed.dom.get('mceWotlayer') ) {       
       jQuery(wl).animate({top: 1 }, duration);
   }
   });

   ed.addCommand('mceObjectAlignBottom', function() {
   if ( wl = ed.dom.get('mceWotlayer') ) {       
       jQuery(wl).animate({top: (parseInt(t.stage(ed).height) - 1) - wl.offsetHeight }, duration);
   }   
   });   
   
   ed.addCommand('mceObjectAlignLeft', function() {
   if ( wl = ed.dom.get('mceWotlayer') ) {       
       jQuery(wl).animate({left: 1 }, duration);
   }
   });   

   ed.addCommand('mceObjectAlignRight', function() {
   if ( wl = ed.dom.get('mceWotlayer') ) {       
       jQuery(wl).animate({left: (parseInt(t.stage(ed).width) - 1) - wl.offsetWidth }, duration);
   }   
   });
      
   ed.addCommand('mceObjectAlignCenter', function() {
   if ( wl = ed.dom.get('mceWotlayer') ) {
       jQuery(wl).animate({left: Math.floor(parseInt(t.stage(ed).width) / 2) - Math.floor( wl.offsetWidth / 2 ) }, duration);
   }   
   });
   
   },//init
    stage : function(ed) {
      var dom = ed.dom, obstg = dom.get('simplemodal-container');
      return ed.dom.parseStyle( ed.dom.getAttrib(obstg, 'style') );
    }        		
	 });

// Register plugin with a short name
tinymce.PluginManager.add('object_align', tinymce.plugins.ObjectAlign);
})(tinymce);