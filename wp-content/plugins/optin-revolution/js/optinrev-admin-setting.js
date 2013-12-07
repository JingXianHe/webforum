jQuery(document).ready(function($){            
	$("#optinrev_optin1_enabled").iButton({change: function($input){$.post("admin-ajax.php", {action : "optinrev_action", "optinrev_popup" : $input.is(":checked")}, function(res){wtfn.msg('Successfully Updated.');});}});
  $("#optinrev_autosave").iButton({change: function($input){$.post("admin-ajax.php", {action : "optinrev_action", "optinrev_autosave" : $input.is(":checked")}, function(res){wtfn.msg('Successfully Updated.');});}});
  $("#optinrev_poweredby").iButton({change: function($input){$.post("admin-ajax.php", {action : "optinrev_action", "optinrev_poweredby" : $input.is(":checked")}, function(res){wtfn.msg('Successfully Updated.');});}});
  $("#optinrev_showmobile").iButton({change: function($input){ $('#is-mobile-tip').text( ( ($input.is(":checked")) ? 'Popup shown on mobiles.' : 'Popup not shown on mobiles.' ) );  $.post("admin-ajax.php", {action : "optinrev_action", "optinrev_showmobile" : $input.is(":checked")}, function(res){wtfn.msg('Successfully Updated.');});}}); 
  
	$('input[name="optinrev_show[]"]').change(function(){ $('#save_showset').show(); });	
	$('#optinrev_save_showset').click(function(){
	jQuery('#save_showset').hide();        
	$('input[name="optinrev_show[]"]').each(function(i,v){
	   vl = $(v).val(); 
	   if ( $(v).attr('checked') ) {            
	       if ( vl == 'times_per_session' ) {
	       wtfn.optinrev_show_popup('show_times_per_session');       
	       } else if ( v == 'times_per_session' ) {
	       wtfn.optinrev_show_popup('show_once_in');
	       }       
	   }
	});
	});
	
	$('#save_showset').hide();
});