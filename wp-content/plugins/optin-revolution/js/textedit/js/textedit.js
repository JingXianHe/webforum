tinyMCEPopup.requireLangPack();
var TextEditDialog = {
	init : function() {
		var ed = tinyMCEPopup.editor;    
    jQuery('#mce_textedit').css({ 'width':'100%', 'height':'440px' }).val( jQuery('.mceWotlayer',ed.getDoc()).html() );
    jQuery('.scn').css({ 'width': jQuery(window).width() - 1, 'height': jQuery(window).height() - 7 });    
	},  
 	insert : function() {       
    var ed = tinyMCEPopup.editor, pcont = tinyMCE.activeEditor.getContent(), lh = '0';
    pcont = ( pcont.indexOf('span') != -1 ) ? pcont : '<span>'+pcont+'</span><div id="mceDeleteObj"></div>';
    
    jQuery('span', tinyMCE.activeEditor.getBody()).each(function(i, e){
        lh = jQuery( e ).css('line-height');        
    });
    
    ed.dom.setHTML( 'mceWotlayer', pcont );
    jQuery( ed.dom.get('mceWotlayer') ).css('line-height', lh);
    ed.dom.show('mceDeleteObj');
		tinyMCEPopup.close();
	}  
};
tinyMCEPopup.onInit.add(TextEditDialog.init, TextEditDialog);
