<?php if (!defined('ABSPATH')) die('You are not allowed to call this page directly.');

  define( 'OPTINREV_DIR', plugin_dir_url( __FILE__ ) );
  define( 'OPTINREV_DIR_PATH', plugin_dir_path( __FILE__ ) );
  define( 'OPTINREV_XMLRPC_URL', 'http://www.optinrevolution.com/xmlrpc/xmlrpc.php' );
  define( 'OPTINREV_SUPPORT', 'http://wordpress.org/support/plugin/optin-revolution/' );
  define( 'OPTINREV_SOCIAL_URL', 'http://goo.gl/U6GWY' );
  define( 'OPTINREV_SOCIAL_TITLE', 'Check out this KILLER FREE Wordpress plugin that allows you to create unique UNBLOCKABLE Wordpress popups!' );
  define( 'OPTINREV_TWEET', 'https://twitter.com/share' );
  define( 'OPTINREV_TUTORIAL_LINK', 'http://www.optinrevolution.com/tutorials/?utm_source=plugin&utm_medium=link&utm_campaign=tutorials' );
  define( 'OPTINREV_ADS_VIDEO', '<iframe width="640" height="360" src="http://www.youtube.com/embed/m9B54jGyuqY?hd=1&rel=0&showinfo=0&controls=0&wmode=transparent" frameborder="0" wmode="opaque" allowfullscreen></iframe>' );   

  if ( !function_exists('is_optinrev') ) {
      function is_optinrev() {
          if ( isset($_GET['page']) && $page = esc_html($_GET['page']) ){
          if (  in_array( $page, array('optinrevolution', 'optinrevolution/optin1', 'optinrevolution/optin-pro-settings') ) ) return true;
          }
          return false;
      }
  }

  if ( !function_exists('optinrev_post') ) {
      function optinrev_post( $p, $ret = false ) {
        if ( !$ret )
        echo (isset($_POST[ $p ])) ? stripcslashes($_POST[ $p ]) : '';
        else
        return (isset($_POST[ $p ])) ? stripcslashes($_POST[ $p ]) : '';
      }
  }

  if ( !function_exists('optinrev_unique_id') ) {
      function optinrev_unique_id() {
        global $wpdb;
        $tb_options = $wpdb->prefix . 'optinrev';
        $res = $wpdb->get_row( "select max(id) as ccnt from $tb_options" );
        return ( $wpdb->num_rows > 0 ) ? $res->ccnt + 1 : 0;
      }
  }

  if ( !function_exists('optinrev_popups') ) {
      function optinrev_popups() {
        $optin = array( 'optinrevolution/optin1' => 'Optin Popup 1' );
        optinrev_update( 'optinrev_popups', serialize($optin) );
        return $optin;
      }
  }

  if ( !function_exists('optinrev_update') ) {
      function optinrev_update( $name, $value ) {
        global $wpdb;
        $tb_options = $wpdb->prefix . 'optinrev';

        if ( optinrev_get( $name ) ) {
          $wpdb->update( $tb_options, array('content' => $value), array('name' => $name)  );
          } else {
          $wpdb->insert( $tb_options, array('name' => $name, 'content' => $value) );
        }
      }
  }

  if ( !function_exists('optinrev_get') ) {
      function optinrev_get( $name ) {
        global $wpdb;
        $tb_options = $wpdb->prefix . 'optinrev';
        $res = $wpdb->get_row( $wpdb->prepare("select name, content from $tb_options where name = %s", $name) );
        return ( $wpdb->num_rows > 0 ) ? $res->content : false;
      }
  }

  if ( !function_exists('optinrev_delete') ) {
      function optinrev_delete( $name ) {
        global $wpdb;
        $tb_options = $wpdb->prefix . 'optinrev';
        $wpdb->query( $wpdb->prepare("delete from $tb_options where name = %s", $name) );
      }
  }

  if ( !function_exists('optinrev_is_pro_authorized') ) {
      function optinrev_is_pro_authorized() 
      { 
         if ( $auth_info = optinrev_get('optinrev_pro_authorized') ) {
              if ( is_serialized( $auth_info ) )
              {
                $auth_info = @unserialize( $auth_info );
                return ( isset( $auth_info['amember_email'] ) );
                } else {
                optinrev_delete( 'optinrev_pro_authorized' );                  
              }         
         }         
         return false;
      }
  }  

  if ( !function_exists('optinrev_manually_queue_update') ) {
      function optinrev_manually_queue_update()
      {
         $transient = get_site_transient("update_plugins");
         set_site_transient("update_plugins", optinrev_check_for_plugin_update($transient));
      }
  }

  if ( !function_exists('optinrev_enqueue') ) {
      function optinrev_enqueue( $option ) {
         global $plugin_page, $wp_version;
         $dir = OPTINREV_DIR;

         switch( $option ) {
         case 0:
          wp_enqueue_style( 'optinrev_style', $dir . 'css/optinrev-style.css' );

          wp_enqueue_script( 'jibtn', $dir . 'js/jquery.ibutton.js' );
          wp_enqueue_script( 'jsadmin', $dir . 'js/optinrev-admin.js' );
          
         break;
         case 1:
         
          //Style
          wp_enqueue_style( 'jqueryui_css', 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/themes/ui-lightness/jquery-ui.css' );
          wp_enqueue_style( 'optinrev_css', $dir . 'optinrev-css.php?popup=' . $plugin_page . '&t=' .  md5(time()) );
          wp_enqueue_style( 'optinrev-style', $dir . 'css/optinrev-style.css?t='. md5(time()) );

          // wp js
          wp_enqueue_script( 'jquery' );
          wp_enqueue_script( 'jquery-ui-slider' );
          wp_enqueue_script( 'jquery-form' );
          
          wp_enqueue_script( 'jquery_jscolor', $dir . 'jscolor/jscolor.js', array(), $wp_version, true );
          wp_enqueue_script( 'jibtn', $dir . 'js/jquery.ibutton.js', array(), $wp_version, true );
          wp_enqueue_script( 'jquery_metadata', $dir . 'js/jquery.metadata.js', array(), $wp_version, true );
          wp_enqueue_script( 'jquery_easing', $dir . 'js/easing.js', array(), $wp_version, true );          
          
          //if ( isset( $_GET['show'] ) )
          wp_enqueue_script( 'jquery_modaljs', $dir . 'js/jquery.simplemodal.js', array(), $wp_version, true );
          
         break;
         case 2:
         wp_enqueue_style( 'optinrev_style', $dir . 'css/optinrev-style.css' );
         break;
         }
      }
  }

  if ( !function_exists('optinrev_mail_providers') ) {
      function optinrev_mail_providers() {
        //mail provider inputs
        $mailpro = array (
                    'aweber' => array(
                                 'action' => 'http://www.aweber.com/scripts/addlead.pl',
                                 'hidden' => 'listname,meta_web_form_id,meta_message,meta_adtracking,redirect,meta_redirect_onlist,meta_required,pixel_tracking_id',
                                 'text' => 'email',
                                 'input' => 'email,listname,meta_web_form_id,meta_message,meta_adtracking,redirect,meta_redirect_onlist,pixel_tracking_id'
                                ),

                    'icontact' => array (//specialid:{} will pick the listid
                                 'action' => 'https://app.icontact.com/icp/signup.php',
                                 'hidden' => 'listid,specialid,clientid,formid,reallistid,doubleopt,redirect,errorredirect',
                                 'text' => 'fields_email',
                                 'input' => 'fields_email,listid,specialid,clientid,formid,reallistid,doubleopt,redirect,errorredirect'
                                ),

                    'getresponse' => array (
                                 'action' => 'https://app.getresponse.com/add_contact_webform.html',
                                 'hidden' => 'webform_id',
                                 'text' => 'email',
                                 'input' => 'email,webform_id'
                                ),
                    'mailchimp' => array (
                                 'action' => 'http://google.us5.list-manage1.com/subscribe/post',
                                 'hidden' => 'mcu,mcid,mcaction',
                                 'text' => 'email',
                                 'input' => 'email,mcu,mcid,mcaction'
                                ),
                    'constantcontact' => array (
                                 'action' => 'http://visitor.r20.constantcontact.com/d.jsp',
                                 'hidden' => 'llr,m,p',
                                 'text' => 'email',
                                 'input' => 'email,llr,m,p'
                                ),
                    'wysija' => array(
                                'action' => '#wysija',
                                'hidden' => '',
                                'text' => 'email',
                                'input' => 'email'
                                ),            
                    'virtualsender' => array(
                                'action' => 'http://www.virtualsender.com/e/a.php/sub/2/vp9v7h',
                                'hidden' => '',
                                'text' => 'email_address',
                                'input' => 'email_address'
                                )
                                
                                );
        optinrev_update( 'optinrev_mail_providers', serialize( $mailpro ) );
      }
  }

  if ( !function_exists('optinrev_setcookie') ) {
    function optinrev_setcookie( $cookie_name, $cookie_value, $expire = null ) {
        $expire = ( empty( $expire ) ) ? time() + 3600 * 24 : $expire;
        @setcookie( $cookie_name, $cookie_value, $expire, '/', COOKIE_DOMAIN, false );
    }
  }

  if ( !function_exists('optinrev_visited_ip') ) {
    function optinrev_visited_ip() {
      if (!isset($_COOKIE['optinrev_visited_ip'])) {
      optinrev_setcookie( 'optinrev_visited_ip', $_SERVER['REMOTE_ADDR'] );
      }
    }
  }

  if ( !function_exists('optinrev_visited_once') ) {
    function optinrev_visited_once( $expire = null ) {
      if (!isset($_COOKIE['optinrev_visited_once'])) {
      optinrev_setcookie( 'optinrev_visited_once', $_SERVER['REMOTE_ADDR'], $expire );
      }
    }
  }

  if ( !function_exists('optinrev_session_browser') ) {
    function optinrev_session_browser( $expire = 0 ) {
      if (!isset($_COOKIE['optinrev_session_browser'])) {
      @setcookie( 'optinrev_session_browser', $_SERVER['REMOTE_ADDR'] , $expire, '/', COOKIE_DOMAIN, false );
      }
    }
  }

  if ( !function_exists('optinrev_get_image') ) {
      function optinrev_get_image( $optin ) {
        global $wpdb;
        $tb_options = $wpdb->prefix . 'optinrev';
        $res = $wpdb->get_results( $wpdb->prepare( "select name, content from $tb_options where name like %s", '%'. $optin .'_images_%' ) );
        return ( $wpdb->num_rows > 0 ) ? $res : false;
      }
  }

  if ( !function_exists('optinrev_delete_image') ) {
      function optinrev_delete_image( $optin ) {
        global $wpdb;
        $tb_options = $wpdb->prefix . 'optinrev';
        $res = $wpdb->get_results( $wpdb->prepare( "select name, content from $tb_options where name like %s", '%'. $optin .'_delete_images_%' ) );
        return ( $wpdb->num_rows > 0 ) ? $res : false;
      }
  }

  if ( !function_exists('optinrev_download_url') ) {
  function optinrev_download_url()
  {
    include_once( ABSPATH . 'wp-includes/class-IXR.php' );

    if ( $auth = optinrev_get('optinrev_pro_authorized') )
    {
        $auth = unserialize( $auth );
        $client = new IXR_Client( OPTINREV_XMLRPC_URL );
        
        if( !$client->query( 'proplug.get_download_url', $auth['amember_email'], optinrev_get_host() ) )
        return false;

        return $client->getResponse();
    }

    return false;
  }
  }

  if ( !function_exists('optinrev_pro_current_version') ) {
      function optinrev_pro_current_version()
      {
        include_once( ABSPATH . 'wp-includes/class-IXR.php' );

        if ( $auth = optinrev_get('optinrev_pro_authorized') )
        {
            $client = new IXR_Client( OPTINREV_XMLRPC_URL );

            if( !$client->query( 'proplug.get_current_version' ) )
              return false;

            return $client->getResponse();
        }
      }
  }

  if ( !function_exists('optinrev_get_media') ) {
      function optinrev_get_media( $id ) {
      global $wpdb;
      $tb_posts = $wpdb->prefix . 'posts';
      $res = $wpdb->get_row( $wpdb->prepare( "select ID, post_title, post_name, guid from $tb_posts where ID = %d", $id ) );
      return ( $wpdb->num_rows > 0 ) ? $res : false;
      }
  }


  if ( !function_exists('optinrev_has_optinmedia') ) {
      function optinrev_has_optinmedia( $id, $type = 'action_button' ) {
      return ( $m = optinrev_get( $type .'_'. $id ) );
      }
  }

  //action button
  if ( !function_exists('optinrev_get_action_button') ) {
      function optinrev_get_action_button() {
      global $wpdb;
      $cr_btn = basename(optinrev_get('optinrev_active_action_button'));
      $cr_btn = explode( '.', $cr_btn );
      $tb_posts = $wpdb->prefix . 'posts';
      $res = $wpdb->get_row( $wpdb->prepare( "select ID, post_title, post_name, guid from $tb_posts where guid like %s", '%'.$cr_btn[0].'%' ) );
      return ( $wpdb->num_rows > 0 ) ? $res : false;
      }
  }

  if ( !function_exists( 'optinrev_socials' ) ) {
      function optinrev_socials() {
      echo '      
          <ul>
              <li><a href="http://www.facebook.com/share.php?u='.OPTINREV_SOCIAL_URL.'&title='.OPTINREV_SOCIAL_TITLE.'" title="'.OPTINREV_SOCIAL_TITLE.'" onclick="javascript:window.open(this.href,\'\', \'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600\');return false;" class="flike"></a></li>
              <li><a href="https://twitter.com/share?url='.OPTINREV_SOCIAL_URL.'&text='.OPTINREV_SOCIAL_TITLE.'" title="'.OPTINREV_SOCIAL_TITLE.'" target="_blank" class="tweet"></a></li>
              <li><a href="https://plus.google.com/share?url='.OPTINREV_SOCIAL_URL.'" title="'.OPTINREV_SOCIAL_TITLE.'" onclick="javascript:window.open(this.href,\'\', \'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600\');return false;" class="googleplus"></a></li>
              <li><a href="http://del.icio.us/post?url='.OPTINREV_SOCIAL_URL.'&title='.OPTINREV_SOCIAL_TITLE.'" title="'.OPTINREV_SOCIAL_TITLE.'" target="_blank" class="delicious"></a></li>
              <li><a href="http://www.stumbleupon.com/submit?url='.OPTINREV_SOCIAL_URL.'" title="'.OPTINREV_SOCIAL_TITLE.'" target="_blank" class="stumbleupon"></a></li>
              <li><a href="http://digg.com/submit?url='.urlencode(OPTINREV_SOCIAL_URL).'&title='.OPTINREV_SOCIAL_TITLE.'" title="'.OPTINREV_SOCIAL_TITLE.'" target="_blank" class="digg"></a></li>
              <li><a href="http://www.linkedin.com/shareArticle?mini=true&url='.urlencode(OPTINREV_SOCIAL_URL).'&title='.OPTINREV_SOCIAL_TITLE.'&summary='.OPTINREV_SOCIAL_TITLE.'" title="'.OPTINREV_SOCIAL_TITLE.'" target="_blank" class="inshare"></a></li>
              <li><a href="http://pinterest.com/pin/create/button/?url='.urlencode(OPTINREV_SOCIAL_URL).'&media=http://optinrevolution.com/img/pin.png&description='.OPTINREV_SOCIAL_TITLE.'" title="'.OPTINREV_SOCIAL_TITLE.'" target="_blank" class="pinit"></a></li>
          </ul>
      ';
      }
  }
  
  if ( !function_exists( 'optinrev_email_support' ) ) {
      function optinrev_email_support() {
      $img_dir = plugin_dir_url( __FILE__ ) . 'images/';
      echo '      
      <center>
      <table cellpadding="10" cellspacing="0">
        <tr><td colspan="2" align="center"><a href="http://optinrevolution.com/r/aweber" target="_blank"><img src="'. $img_dir .'aweber.png" border="0" alt="aweber" title="aweber"/></a><br /><a href="http://optinrevolution.com/r/aweber" target="_blank">Money Back Guarantee! Try Aweber for $1</a></td></tr>
        <tr><td><a href="http://optinrevolution.com/r/icontact" target="_blank"><img src="'. $img_dir .'icontact.png" border="0" alt"iContact" title="iContact"/></td><td><a href="http://optinrevolution.com/r/mailchimp" target="_blank"><img src="'. $img_dir .'mailchimp.png" border="0" alt="Mailchimp" title="Mailchimp"/></a></td></tr>
        <tr><td><a href="http://optinrevolution.com/r/getresponse" target="_blank"><img src="'. $img_dir .'getresponse.png" border="0" alt="getResponse" title="getResponse"/></a></td><td><a href="http://optinrevolution.com/r/constantcontact" target="_blank"><img src="'. $img_dir .'constant_contact.png" border="0" alt="Constant Contact" title="Constant Contact"/></a></td></tr>
      </table>
      </center>
      ';
      }
  }  

  if ( !function_exists( 'optinrev_paypal_donate' ) ) {
      function optinrev_paypal_donate() {
      echo '
      <form action="https://www.paypal.com/cgi-bin/webscr" method="post">
      <input type="hidden" name="cmd" value="_s-xclick">
      <input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----">
      <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
      <img alt="" border="0" src="https://www.paypalobjects.com/en_AU/i/scr/pixel.gif" width="1" height="1">
      </form>
      ';
      }
  }

  if ( !function_exists( 'optinrev_cssminify' ) ) {
      function optinrev_cssminify($data)
      {
        $data = preg_replace( '#/\*.*?\*/#s', '', $data );
        // remove single line comments, like this, from // to \\n
        //$data = preg_replace('/(\/\/.*\n)/', '', $data);
        // remove new lines \\n, tabs and \\r
        $data = preg_replace('/(\t|\r|\n)/', '', $data);
        // replace multi spaces with singles
        $data = preg_replace('/(\s+)/', ' ', $data);
        //Remove empty rules
        $data = preg_replace('/[^}{]+{\s?}/', '', $data);
        // Remove whitespace around selectors and braces
        $data = preg_replace('/\s*{\s*/', '{', $data);
        // Remove whitespace at end of rule
        $data = preg_replace('/\s*}\s*/', '}', $data);
        // Just for clarity, make every rules 1 line tall
        //$data = preg_replace('/}/', "}\n", $data);
        $data = str_replace( ';}', '}', $data );
        $data = str_replace( ', ', ',', $data );
        $data = str_replace( '; ', ';', $data );
        $data = str_replace( ': ', ':', $data );
        $data = preg_replace( '#\s+#', ' ', $data );
        return $data;
      }
  }

  if ( !function_exists('optinrev_getbool') ) {
      function optinrev_getbool( $opt ) {
      return ( optinrev_get( $opt ) == 'true' ) ? true : false;
      }
  }

  //utils
  if ( !function_exists('optinrev_is_mobile') )
  {
    function optinrev_is_mobile(){
      
      if ( !isset( $_SERVER['HTTP_USER_AGENT'] ) ) return false;
     
      $isMobile = (bool)preg_match('#\b(ip(hone|od|ad)|android|opera m(ob|in)i|windows (phone|ce)|blackberry|tablet'.
                    '|s(ymbian|eries60|amsung)|p(laybook|alm|rofile/midp|laystation portable)|nokia|fennec|htc[\-_]'.
                    '|mobile|up\.browser|[1-4][0-9]{2}x[1-4][0-9]{2})\b#i', $_SERVER['HTTP_USER_AGENT'] );
      
      return $isMobile;    
    }
  }

  if ( !function_exists('hex2dec') ) {
  function hex2dec( $hex ) {$color = str_replace('#', '', $hex);$ret = ARRAY('r' => hexdec(substr($color, 0, 2)),'g' => hexdec(substr($color, 2, 2)),'b' => hexdec(substr($color, 4, 2)));return $ret;}
  }
  if ( !function_exists('optinrev_is_ie') ) {
  function optinrev_is_ie(){if (isset($_SERVER['HTTP_USER_AGENT']) && (strpos($_SERVER['HTTP_USER_AGENT'], 'MSIE') !== false)) {return true;} else {return false;}}
  }

  if ( !function_exists('optinrev_ie_version') ) {
      function optinrev_ie_version()
      {
        if ( !optinrev_is_ie() ) return false;

        preg_match('/MSIE (.*?);/', $_SERVER['HTTP_USER_AGENT'], $matches);
        if ( count($matches) > 1 ) {
          return (int)$matches[1];
        }
        return false;
      }
  }

  if ( !function_exists('getContrast50') ) {
  function getContrast50($hexcolor){return (hexdec($hexcolor) > 0xffffff/2) ? 'black':'white';}
  }

  if ( !function_exists( 'optinrev_delete_cookie' ) ) {
      function optinrev_delete_cookie( $name ) {
          if ( is_array( $name ) ) {
              foreach( $name as $v ) {
                  @setcookie( $v, null, time() - 3600, '/', COOKIE_DOMAIN, false );
                  unset( $_COOKIE[ $v ] );
              }
              } else {
            @setcookie( $name, null, time() - 3600, '/', COOKIE_DOMAIN, false );
            unset( $_COOKIE[ $name ] );
          }
      }
  }
  
  if ( !function_exists( 'optinrev_get_host' ) ) {
      function optinrev_get_host() {
      $site_url = parse_url( site_url() );
      return $site_url['scheme'] . '://' . $site_url['host'];
      }
  }
 
  if ( !function_exists( 'optinrev_wwwrule' ) ) {
      function optinrev_wwwrule( $url ) {   
      $parsed = parse_url( $url );
      //checking www
      $hst = explode( '.', $parsed['host'] );
      if ( count( $hst ) < 3 ) {
          $url = str_replace( '://', '://www.', $url );
      }
      return $url;
      }
   }

  if ( !function_exists( 'optinrev_remote_info' ) ) {
      function optinrev_remote_info( $arg = 'name' ) {
      $response = wp_remote_get( 'http://api.wordpress.org/plugins/info/1.0/optin-revolution' );
      
      if ( !is_wp_error($response) && ($response['response']['code'] == 200) ) {
		      $response = unserialize($response['body']);
          return $response->$arg;
      }
      
      return false;      
      }  
  }
  
 if ( !function_exists( 'optinrev_banner' ) ) {
      function optinrev_banner() {
      
      $site_url = parse_url(site_url()); 
      $response = wp_remote_get( $site_url['scheme'] . '://pub.optinrevolution.com' );
      $pub = null;
      
      if ( !is_wp_error($response) && ($response['response']['code'] == 200) ) {
		      $pub = $response['body'];
          optinrev_update( 'pub.optinrevolution.com', $pub );
          } else {
          $pub = optinrev_get( 'pub.optinrevolution.com' );          
      }
      
      return <<<BANNER
      {$pub}
BANNER;
      }
  }

 if ( !function_exists( 'optinrev_hosted_video' ) ) {
      function optinrev_hosted_video() {
      
      $site_url = parse_url(site_url()); 
      $response = wp_remote_get( $site_url['scheme'] . '://pub.optinrevolution.com/video.html' );
      $pub = null;
      
      if ( !is_wp_error($response) && ($response['response']['code'] == 200) ) {
		      $pub = $response['body'];
          optinrev_update( 'pub.optinrevolution.com/video', $pub );
          } else {
          $pub = optinrev_get( 'pub.optinrevolution.com/video' );          
      }
      
      return <<<VIDEO
      {$pub}
VIDEO;
      }
  }

 if ( !function_exists( 'optinrev_banner2' ) ) {
      function optinrev_banner2() {
      
      $site_url = parse_url(site_url()); 
      $response = wp_remote_get( $site_url['scheme'] . '://pub.optinrevolution.com/text.html' );
      $pub = null;
      
      if ( !is_wp_error($response) && ($response['response']['code'] == 200) ) {
		      $pub = $response['body'];          
          optinrev_update( 'pub.optinrevolution.com/text.html', $pub );
          } else {          
          $pub = optinrev_get( 'pub.optinrevolution.com/text.html' );          
      }      
      
      return <<<BANNER2
      {$pub}
BANNER2;
      }
  }      
     


/**
 * AJAX Callback action
 */

 if ( !function_exists('optinrev_action_callback') )
 {
     function optinrev_action_callback()
     {
      if ( function_exists('current_user_can') && !current_user_can('manage_options') )
    	die('');//keep silent;

      global $wpdb;

      //saving setup
      if (isset( $_POST['save_setup_settings'] ))
      {
          
          //email form
          $mail_form = array(
            'aweber' => 'Aweber', 'icontact' => 'Icontact', 'getresponse' => 'GetResponse', 'mailchimp' => 'Mailchimp', 'constantcontact' => 'Constant Contact', 'wysija' => 'Wysija'
          );
          
          foreach( $mail_form as $k => $v ) {
              //empty the others;          
              if ( isset( $_POST['optinrev_optin_' . $k ] ) ) {              
                  if ( isset( $_POST['optinrev_foptin_active'] ) && $_POST['optinrev_foptin_active'] !== $k ) {
                  $_POST['optinrev_optin_' . $k ] = null;
                  }              
              }          
          }
          
          if ( !isset( $_POST['optinrev_femail_validate'] ) )
          $_POST['optinrev_femail_validate'] = 'off';
          
          optinrev_update( $_POST['save_setup_settings'], serialize($_POST) );

          echo 'success';
          exit();
      }

      //enabled/disabled
      if (isset( $_POST['optinrev_popup_enabled'] ))
      {
          optinrev_update( 'optinrev_popup_enabled', $_POST['optinrev_popup_enabled'] );
          exit();
      }
      //enabled/disabled
      if (isset( $_POST['optinrev_popup'] ) && $pop = strip_tags($_POST['optinrev_popup'])) {
          optinrev_update( 'optinrev_optinrevolution/optin1_enabled', $pop );
          exit();
      }

      //optinrev_show_where
      if (isset( $_POST['optinrev_show_where'] ) && $show_on = esc_html( $_POST['optinrev_show_where'] ))
      {
          optinrev_update( 'optinrev_show_where', $show_on );
          exit();
      }

      //showing popup
      if (isset( $_POST['optinrev_show_popup'] ) && $setp = esc_html($_POST['optinrev_show_popup'])) {

          $setp_ar = explode( '|',  $setp );
          $setv = $setp;

          if ( count($setp_ar) > 0 ) {
               if ( $setp_ar[0] == 'show_once_in' )
               {
                  $et = strtotime( '+' . $setp_ar[1] . ' day' );
                  $setv = $setv. '|' . time() .'|'. $et;
               }
          }

          optinrev_update( 'optinrev_show_popup', $setv );

          if ( function_exists('wp_cache_clear_cache') ) {
              wp_cache_clear_cache();
          }

          exit();
      }
      //optinrev_pixel_tracking
      if (isset( $_POST['optinrev_pixel_tracking'] )) {
          optinrev_update( 'optinrev_pixel_tracking', esc_html($_POST['optinrev_pixel_tracking']) );
          exit();
      }

      //delete img
      if ( isset( $_POST['optinrev_remove_img'] ) && $img = esc_html($_POST['optinrev_remove_img']))
      {
         optinrev_delete( $img );
         echo json_encode( array('action' => 'success') );
         exit();
      }

      //add images
      if ( isset( $_POST['optinrev_add_image'] ) && $add_img = esc_html($_POST['optinrev_add_image']) )
      {
          //images from wp/content/uploads
          $img_id = explode( '_', $add_img );
          $img_id = $img_id[2];

          $add_img_id = $_POST['optinrev_curr_page'] . '_img_uid_' . optinrev_unique_id() . '_' . $img_id;

          $img = optinrev_get_media( $img_id );
          $imgurl = parse_url( $img->guid );

          optinrev_update( $add_img, basename( $imgurl['path'] ) .'|'. $add_img );
          echo json_encode( array('action' => 'success', 'image' => 'http://' . $_SERVER['HTTP_HOST'] . $imgurl['path'] ) );
          exit();
      }

      //reset
      if ( isset( $_POST['optinrev_popup_reset'] ) && $reset = esc_html($_POST['optinrev_popup_reset']) ) {
          optinrev_update( $reset, optinrev_get( 'optinrev_default' ) );
          optinrev_update( 'optinrev_active_action_button', 'get_access2.png' );

          $tb_options = $wpdb->prefix . 'optinrev';
          $wpdb->query( $wpdb->prepare("delete from $tb_options where name like %s", '%_img_uid_%' ) );
          $wpdb->query( $wpdb->prepare("delete from $tb_options where name like %s", 'stage_img_%' ) );
          $wpdb->query( $wpdb->prepare("delete from $tb_options where name like %s", 'action_button_%' ) );

          echo 'success';
          exit();
      }

      //get the validator
      if ( isset( $_POST['optinrev_mce_validator'] ) && $page = esc_html($_POST['optinrev_mce_validator']) ) {
          $p = unserialize(optinrev_get( $page ));
          echo json_encode($p['optinrev_input_validator']);
          exit();
      }

      //mail provider form
      if ( isset( $_POST['optinrev_mail_webform'] ) && $cur_page = esc_html($_POST['optinrev_mail_webform']) ) {
          //optin setup
          $optin = unserialize( optinrev_get( $cur_page ) );

          if ( $optin )
          {
              //providers
              $prov = $_POST['optinrev_mail_provider'];
              $mpro = unserialize( optinrev_get( 'optinrev_mail_providers' ) );
              $mdta = explode( ',', $mpro[ $prov ]['input'] );
              //input text
              $inputs = (isset($optin['optinrev_email_form'][ $prov ]))?$optin['optinrev_email_form'][ $prov ]:null;
              $inputs_enabled = (isset($optin['optinrev_input_enabled']))?$optin['optinrev_input_enabled']:'';

              $htm = '';
              foreach( $mdta as $v )
              {
                $fable = (isset($inputs_enabled[ $v ]))?$inputs_enabled[ $v ] : false;

                $vl = ( isset( $inputs[ $v ] ) ) ? $inputs[ $v ] : '';
                
                $lbl = ucwords( str_replace( '_', ' ', $v ) );                
                
                //Input label
                $lbl = str_replace( 'Fields Email', 'Email', $lbl );

                $reqvalid = $req = $autotxt = $ismchimp = '';
                
                $value_email = array( 'email', 'fields_email' );                
                $valid_field = array( 'email', 'fields_email');
                
                if ( in_array( $v, $valid_field ) )
                {
                  $req = ( isset($optin['validate'][$v]) ) ? 'checked' : '';                  
                  $reqvalid = 'Validate&nbsp;<input type="checkbox" name="validate['.$v.']" value="1" '.$req.'/>';                  
                }

                if ( $prov == 'mailchimp' ){
                if ( $lbl == 'Mcaction' )
                $ismchimp = '<div class="row"><label>&nbsp;</label><span class="note">Example Value: <b>mailchimp.us1.list-manage.com</b> ( Replace with your url with your action value information )</span></div>';

                $vl = str_replace( 'http://', '', $vl );
                $lbl = ucfirst(str_replace('Mc', '', $lbl));
                }              
                
                $name_sel = '';                
                $txt = '';
                
                if ( in_array( $v, $value_email ) ) {
                if ( empty( $vl ) ) $vl = 'Enter Your Email...';
                $txt = 'onfocus="wtfn.intips(this, \''. $vl .'\',1);" onblur="wtfn.intips(this, \''. $vl .'\',0);"';
                }
                
                //if has an 'id'
                $lbl = str_replace(' Id', ' ID', $lbl);                

                $htm .= '<div class="row"><label>'.$lbl.'</label><input type="text" name="optinrev_email_form['. $_POST['optinrev_mail_provider'] .']['.$v.']" '.$txt.' value="'.$vl.'" size="40">'.$ismchimp.'&nbsp;'. $reqvalid .'&nbsp;'.$name_sel.'</div>';

                }

              echo $htm;
          }
          exit();
      }
      //Member verification
      if ( isset( $_POST['authenticate'] ) && $user = esc_html($_POST['authenticate']) )
      {
          include_once( ABSPATH . 'wp-includes/class-IXR.php' );

          parse_str( str_replace('amp;','', $user), $post );
          
          if ( empty($post['amember_email']) ) { echo 'invalid_user'; exit(); }
          if ( !strpos( $post['amember_email'], '@' ) ) { echo 'invalid_user'; exit(); }

          $client = new IXR_Client( OPTINREV_XMLRPC_URL );

          if( $client->query( 'proplug.is_user_authorized', $post['amember_email'], optinrev_get_host() ) ) {
          echo $client->getResponse();
          } else {
          echo 2;
          }

          exit;
      }
      //Save the info
      if ( isset( $_POST['pro_authorized'] ) && $pro = esc_html($_POST['pro_authorized']) )
      {
          parse_str( str_replace('amp;','', $pro), $post );
          optinrev_update( 'optinrev_pro_authorized', serialize($post) );
          echo 'valid';
          exit;
      }

      //set autosave
      if ( isset( $_POST['optinrev_autosave'] ) && $autosave = esc_html($_POST['optinrev_autosave']) )
      {
          optinrev_update( 'optinrev_autosave', $autosave );
          exit();
      }
      //set poweredby
      if ( isset( $_POST['optinrev_poweredby'] ) && $poweredby = esc_html($_POST['optinrev_poweredby']) )
      {
          optinrev_update( 'optinrev_poweredby', $poweredby );
          exit();
      }

      if ( isset( $_POST['optinrev_showmobile'] ) && $showmobile = esc_html($_POST['optinrev_showmobile']) )
      {
          optinrev_update( 'optinrev_showmobile', $showmobile );
          exit();
      }

      //optinrev_add_image_briefcase
      if ( isset( $_POST['optinrev_add_image_briefcase'] ) && $img = esc_html($_POST['optinrev_add_image_briefcase']) )
      {
          $img_id = esc_html($_POST['optinrev_curr_page']) . '_images_' . optinrev_unique_id();
          optinrev_update( $img_id, $img );
          exit();
      }

      //optinrev_del_image_briefcase
      if ( isset( $_POST['optinrev_del_image_briefcase'] ) && $img = esc_html($_POST['optinrev_del_image_briefcase']) )
      {
          $img_id = esc_html($_POST['optinrev_curr_page']) . '_delete_images_' . optinrev_unique_id();
          optinrev_update( $img_id, $img );
          exit();
      }

      //optinrev_add_action button_briefcase
      if ( isset( $_POST['optinrev_add_button_briefcase'] ) && $img = esc_html($_POST['optinrev_add_button_briefcase']) )
      {
          optinrev_update( 'optinrev_add_button_briefcase', $img );
          exit();
      }

      //remove an image to the stage
      if ( isset( $_POST['optinrev_remove_object'] ) && $img_id = esc_html( $_POST['optinrev_remove_object'] ) ) {
          optinrev_delete( $img_id );
          exit();
      }

      //getimage size
      if ( isset( $_POST['optinrev_getimagesize'] ) && $img = esc_html( $_POST['optinrev_getimagesize'] ) ) {
          if ( list( $width, $height ) = @getimagesize( $_SERVER['DOCUMENT_ROOT'] . $img ) ) {
              $imgd = array( 'width' => $width, 'height' => $height );
              echo json_encode($imgd);
              } else {
              echo '0';
          }
          exit();
      }
      
      //reset action button
      if ( isset( $_POST['optinrev_reset_action_button'] ) ) {
          optinrev_update( 'optinrev_active_action_button', 'get_access2.png' );
          exit();
      }
      
      //Email form reset
      if ( isset( $_POST['optinrev_emailform_reset'] ) && intval( $_POST['optinrev_emailform_reset'] ) ) {
          $optin = maybe_unserialize(optinrev_get( 'optinrevolution/optin1' ));
          $optin['optinrev_optin_aweber'] = null; 
          $optin['optinrev_optin_icontact'] = null; 
          $optin['optinrev_optin_getresponse'] = null; 
          $optin['optinrev_optin_mailchimp'] = null; 
          $optin['optinrev_optin_constantcontact'] = null; 
          $optin['wysija_list_id'] = null;    
          $optin['optinrev_femail_validate'] = null;    
          $optin['optinrev_foptin_active'] = null;
          $optin['optinrev_foptin_form_active'] = null;          
          optinrev_update( 'optinrevolution/optin1', serialize($optin) );          
          exit();
      }
      //Factory Reset
      if ( isset( $_POST['optinrev_factory_reset'] ) && intval( $_POST['optinrev_factory_reset'] ) ) {          
          
          optinrev_update( 'optinrevolution/optin1', optinrev_get( 'optinrev_default' ) );
          optinrev_update( 'optinrev_active_action_button', 'get_access2.png' );

          $tb_options = $wpdb->prefix . 'optinrev';
          $wpdb->query( $wpdb->prepare("delete from $tb_options where name like %s", '%_img_uid_%' ) );
          $wpdb->query( $wpdb->prepare("delete from $tb_options where name like %s", 'stage_img_%' ) );
          $wpdb->query( $wpdb->prepare("delete from $tb_options where name like %s", 'action_button_%' ) );
                    
          exit();
      }
      
      
      
    }}//end action callback
  
  if ( !function_exists( 'optinrev_footer' ) ) {
      function optinrev_footer() {  
      echo '<div id="optinrev-footer"><div id="footer-left" class="alignleft">Optin Revolution Lite <a target="_blank" href="http://wordpress.org/support/plugin/optin-revolution/">Support</a>&nbsp;|&nbsp;<a target="_blank" href="http://www.optinrevolution.com/?utm_source=plugin&utm_medium=footer&utm_campaign=upgrade" title="Upgrade Now">Upgrade</a>
      &nbsp;|&nbsp;Add your&nbsp;<a target="_blank" href="http://wordpress.org/support/view/plugin-reviews/optin-revolution?filter=5#postform">&#9733;&#9733;&#9733;&#9733;&#9733;</a> on 
      &nbsp;<a target="_blank" href="http://wordpress.org/plugins/optin-revolution/">wordpress.org</a> and keep this plugin essentially free.</div></div>';
      }
  } 
?>
