  var wtfnm = {
    //message alert
  msg: function( id, msg ) {
    jQuery('#' + id).html(msg).fadeIn();          
    setTimeout(function(){ jQuery('#' + id).fadeOut(); }, 2000);
  },
  action_add_image: function( img ) {     
     if ( confirm('Are you sure, you want to insert this image in Optin Popup 1 ?') ) {
     jQuery.post('admin-ajax.php', {action : 'optinrev_action', optinrev_add_image_briefcase : img, optinrev_curr_page : 'optinrevolution/optin1'}, function(){wtfnm.msg( img + '_msg', 'Successfully added.' );});         
     }
     return false;
  },
  action_del_image: function( img ) {        
   if ( confirm('Are you sure, you want to remove this image ?') ) {
   jQuery.post('admin-ajax.php', {action : 'optinrev_action', optinrev_del_image_briefcase : img, optinrev_curr_page : 'optinrevolution/optin1'}, function(){wtfnm.msg( img + '_msg', 'Successfully removed.' );});   
   }
   return false; 
  },
  action_update_button: function( img, src ) {       
   if ( confirm('Are you sure, you want to update the action button of Optin Popup 1') ) {   
   jQuery.post('admin-ajax.php', {action : 'optinrev_action', optinrev_add_button_briefcase : src, optinrev_curr_page : 'optinrevolution/optin1'}, function(){wtfnm.msg( img + '_msg', 'Successfully updated.' );});   
   }   
   return false; 
  }    
 }
 
 jQuery(document).ready(function($){
   $('.optrmsg').css({'position':'absolute','background-color':'#fff','color':'#ff8000','border':'1px solid','-moz-box-shadow':'0 0 4px #ccc','-webkit-box-shadow':'0 0 4px #ccc','box-shadow':'0 0 4px #ccc','-moz-border-radius':'4px','border-radius':'4px','padding':'6px'}).hide();
 }); 