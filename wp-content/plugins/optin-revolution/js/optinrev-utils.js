var css = {
parseCSSBlock : function(css) { 
    var rule = {};
    var declarations = css.split(';');
    declarations.pop();
    var len = declarations.length;
    for (var i = 0; i < len; i++)
    {
        var loc = declarations[i].indexOf(':');
        var property = jQuery.trim(declarations[i].substring(0, loc));
        var value = jQuery.trim(declarations[i].substring(loc + 1));

        if (property != "" && value != "")
            rule[property] = value;
    }
    return rule;
},
cssBlock : function( parsed_css ) {
    var rule = '';    
    for( v in parsed_css ) {
        rule += v + ':' + parsed_css[ v ] + ';';
    };      
    return rule;    
}
}

var input_valid = {msg: function(m){alert(m);},
is_email: function( email ) {var re = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;return re.test( email );},
is_name: function( name ) {var re = /^[a-zA-Z]+$/;return re.test( name );}
};

var wtfn = {
  create_cookie: function(name, value, days ) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
  },    
  read_cookie: function(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
  },

  getctc_captcha: function( u, dialog ) {

  if ( u == '' ) return false;

  if ( u.indexOf( 'constantcontact.com' ) !== -1 ) {

  jQuery.post( purl + 'optinrev-ccform.php', {url: u}, function(res){

  var tf = document.createElement('div');
  jQuery( tf ).attr('id','temp_form').html( res );

  c = jQuery( '#captcha\\.control', tf ).val();
  jQuery( '#captcha\\.control', dialog ).val( c );

  });

  }

  }
}
