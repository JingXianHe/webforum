/**
 * editor_plugin_src.js
 *
 * Copyright 2012 
 */

(function() {
	tinymce.create('tinymce.plugins.TextEdit', {
		init : function(ed, url) {
			var t = this;
      
			t.editor = ed;

			// Register commands
			ed.addCommand('mceTextEdit', function(ui) {                
				ed.windowManager.open({
					file : url + '/edit.php',
					width : '900',
					height : '500',
					inline : 1
				}, {
					plugin_url : url
				});
			});

			// Register buttons
			ed.addButton('textedit', {title : 'Text Popup Editing', image : url + '/img/textedit.gif', cmd : 'mceTextEdit'});
		},

		getInfo : function() {
			return {
				longname : 'TextEdit plugin',
				author : 'php.rcena@gmail.com',
				authorurl : 'http://www.moxiecode.com',
				infourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/template',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		}
    
	});

	// Register plugin
	tinymce.PluginManager.add('textedit', tinymce.plugins.TextEdit);
})();