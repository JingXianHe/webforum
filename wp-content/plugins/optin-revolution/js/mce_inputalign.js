// base on css line-height : 10px
// php.rcena@gmail.com
(function(tinymce) {
   var DOM = tinymce.activeEditor;    
   tinymce.create('tinymce.plugins.InputAlign', {    
    
   init : function(ed, url) {

   ed.addButton('input_align_top',
   {
   title : 'Horizontal Align',
   image : wtp + 'images/horizontal-icon.png',
   cmd : 'mceInputAlignLeft'
   });
   
   ed.addButton('input_align_left',
   {
   title : 'Vertical Align',
   image : wtp + 'images/vertical-icon.png',
   cmd : 'mceInputAlignLeft'
   });
   

	 ed.addCommand('mceInputAlignLeft', function()
   {
      wtfn.upgrade(1);
	 });
   }
  });

// Register plugin with a short name
tinymce.PluginManager.add('input_align', tinymce.plugins.InputAlign);
})(tinymce);