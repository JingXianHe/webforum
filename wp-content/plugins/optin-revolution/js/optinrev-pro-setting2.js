jQuery(document).ready(function($){
    var sp = document.createElement('span');
    $(sp).attr('class','status').css('font-weight','bold');    
    var pro = {                
        msg: function( msg ) {$('.status').remove();$('#acn_verify').append( $(sp).css('color','#ffcc00').html( msg ) );},
        load: function( msg ) {$('.status').remove();pro.msg( msg );setTimeout(function(){$('.status').fadeOut();}, 3000) },
        error: function( msg ) {$('.status').remove();$('#acn_verify').append( $(sp).css('color','red').html( 'Error : ' + msg ) );setTimeout(function(){$('.status').remove();}, 3000)},        
        verify: function() {       
                
        pro.msg('Verifying member account and the domain...');        
        setTimeout(function(){
        $.post('admin-ajax.php', {action : "optinrev_action", authenticate : $('#cred_form').serialize()}, function( res ){          
                       
          res = $.trim(res);             
                        
          if ( res.indexOf('invalid_user') !== -1 ) {
          pro.error('Invalid Email.');
          return false;
          }                            
          
          if ( res.indexOf('invalid_domain') !== -1 ) {
          pro.error('You need to login to your member account and activate the domain');
          return false;
          }

          if ( res.indexOf('invalid_member') !== -1 ) {
          pro.error('Invalid Member Account');
          return false;
          }

          if ( res.indexOf('locked_member') !== -1 ) {
          pro.error('Your account has been locked. Please contact the support.');
          return false;
          }                    
          
          if ( res.indexOf('refund') !== -1 ) {
          pro.error('Product has been refund.');
          return false;
          }          
                  
          if ( res.indexOf('valid') !== -1 )
          {        
            $.post('admin-ajax.php', {action : "optinrev_action", pro_authorized : $('#cred_form').serialize()}, function( res ){
            if ($.trim(res) == 'valid') {pro.load('Successfully verified.');location.reload();}        
            });
          }
          
          return false;                    
          });}, 2000); 
        },
        is_valid_email: function(emailAddress) {
        var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
        return pattern.test(emailAddress);
        }        
        }
    $('#cred_form').submit(function(){    
    var email = $('#amember_email').val();
    
    if ( email == '' ) return false;
    
    if ( !pro.is_valid_email( email ) ) {
    pro.error('Invalid email address.');
    return false; 
    }
    
    pro.verify();
    return false;
    
    });    
    
  });  