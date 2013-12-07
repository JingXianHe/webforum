<?php
/**
 * @package Optin Revolution
 * @version 1.2.8
 */

/*
  Plugin Name: Optin Revolution
  Plugin URI: http://wordpress.org/extend/plugins/optin-revolution/
  Description: Optin Revolution is a WordPress popup plugin is quite possibly the best way in the world for you to create supercharged unblockable popups to grow your list of subscribers! To get started: 1) Click the "Activate" link to the left of this description, 2) Go to your Optin Revolution settings page, and 3) Watch the video on the settings page which will show you how to get started creating your cool popups.
  Author: Optin Revolution
  Version: 1.2.8
  Author URI: http://optinrevolution.com/
  License: GPL2+
*/

if (!session_start())
session_start();

@define( 'DONOTMINIFY', true );

require_once('optinrev-fn.php');

global $optinrev_plugin, $plugin_url, $wp_version;

//init
$optinrev_plugin = 'optin-revolution/optinrev.php';

function optinrev_admin_actions()
{
  global $submenu;  

  if ( function_exists('current_user_can') && current_user_can('administrator') )
  {
    add_utility_page( _('Optin Revolution'), _('Optin Revolution'), 'administrator', 'optinrevolution', 'optinrev_admin' );
    add_submenu_page( 'optinrevolution', __( 'Optin Popup 1' ), __( 'Optin Popup 1' ), 'administrator', 'optinrevolution/optin1', 'optinrev_setup' );
    add_submenu_page( 'optinrevolution', 'Optin Revolution <code>Pro</code>', 'Optin Revolution <code>Pro</code>', 'administrator', 'optinrevolution/optin-pro-settings', 'optinrev_pro' );    
    //changed name
    $submenu['optinrevolution'][0][0] = __('Settings');
    
    add_action( 'admin_footer-toplevel_page_optinrevolution', 'optinrev_footer' );
    add_action( 'admin_footer-optin-revolution_page_optinrevolution/optin1', 'optinrev_footer' );
    add_action( 'admin_footer-optin-revolution_page_optinrevolution/optin-pro-settings', 'optinrev_footer' );        
     
  } 
  
}

add_action( 'admin_menu', 'optinrev_admin_actions' );

function optinrev_plugin_admin_init()
{
 global $plugin_page, $wp_version;

 $dir = plugin_dir_url( __FILE__ );

  //Clear all cookies
  if ( isset($_GET['cookies']) && $cls_cookies = esc_html( $_GET['cookies'] ) ) {
      if ( $cls_cookies === 'clear' ) {
          foreach ( $_COOKIE as $key => $value ) {
              @setcookie( $key, $value, time() - 3600, '/', COOKIE_DOMAIN, false );
          }
          update_option('optinrev_cookies', 'cleaned');
          wp_redirect( 'admin.php?page=optinrevolution' ); exit;
      }
  }

  //enabled
  if (isset( $_GET['enable'] )) {
  optinrev_update('optinrev_popup_enabled', 'true');
  wp_redirect( 'admin.php?page='. $plugin_page ); exit;
  }

  //optin
  if ( $plugin_page == 'optinrevolution' )
  {
    //enabled
    if (isset( $_GET['enable'] )) {
    optinrev_update('optinrev_popup_enabled', 'true');
    }
    optinrev_enqueue(0);

  } else if ( $plugin_page == 'optinrevolution/optin1' )
  {
    add_filter( 'wp_default_editor', create_function('', 'return "tinymce";') );

    optinrev_enqueue(1);
    //wotoptin images
   if ( !optinrev_get( 'optinrev_default_images' ) ) {
      $wot_imgs = array(
        'get_access' => array( 'get_access1' => $dir . 'images/get_access1.png', 'get_access2' => $dir . 'images/get_access2.png', 'get_access3' => $dir . 'images/get_access3.png'),
        'close_btn' => array( 'close1' => $dir . 'images/close1b.png', 'close2' => $dir . 'images/close2b.png', 'close3' => $dir . 'images/close3b.png', 'close4' => $dir . 'images/close1r.png', 'close5' => $dir . 'images/close2r.png', 'close6' => $dir . 'images/close3r.png', 'close7' => $dir . 'images/btn1.png', 'close8' => $dir . 'images/btn2.png' )
      );
      optinrev_update( 'optinrev_default_images', serialize( $wot_imgs ) );
      //init get access button
      foreach( $wot_imgs['get_access'] as $km => $vm ) {
        optinrev_update( 'optinrev_cuid_'. optinrev_unique_id() , $km .'.png|'. $km );
      }
   }
   
   //default content
   if ( !optinrev_get( 'optinrev_default' ) ) {
        $default_optin = array(
            'action' => 'optinrev_action',
            'save_setup_settings' => 'optinrevolution/optin1',
            'optinrev_data' => '<div style="position: absolute; left: 421px; top: 297px;border: 1px solid transparent;"><img id="wm" alt="" src="'.$dir.'assets/get_access2.png" border="0"></div><div style="position: absolute; left: 270px; top: 128px;border: 1px solid transparent;"><img id="stage_img_48" alt="" src="'. $dir .'assets/v-arrows.gif" border="0"></div><div style="position: absolute; left: 492px; top: 384px;border: 1px solid transparent;"><img id="stage_img_47" alt="" src="'. $dir .'assets/padlock.png" border="0"></div><div style="position: absolute; left: 511px; top: 387px; z-index: 1;border: 1px solid transparent;"><span style="font-size: 8pt;" data-mce-style="font-size: 8pt;">Your Privacy Is Protected.</span></div><div style="position: absolute; left: 87px; top: 85px; z-index: 1; text-align: center;border: 1px solid transparent;"><strong><span style="font-family: tahoma, arial, helvetica, sans-serif; font-size: 14pt;" data-mce-style="font-family: tahoma, arial, helvetica, sans-serif; font-size: 14pt;">On Average, 8 Out Of 10 People Will Read Headline Copy</span></strong><br><strong><span style="font-family: tahoma, arial, helvetica, sans-serif; font-size: 14pt;" data-mce-style="font-family: tahoma, arial, helvetica, sans-serif; font-size: 14pt;">But Only 2 Out Of 10 Will Read The Rest.</span></strong></div><div style="position: absolute; left: 4px; top: 10px; z-index: 1; text-align: center;border: 1px solid transparent;"><span style="font-family: impact, chicago; font-size: 24pt; color: #ff0000;">Remember, Every Element Of Compelling Copy Has Just<br>One Purpose - To Get The Next Sentence Read!</span></div><div style="position: absolute; left: 422px; top: 185px; z-index: 1; text-align: center; line-height: 16px; border: 1px solid transparent;"><span style="font-size: 10pt; font-family: arial, helvetica, sans-serif;" data-mce-style="font-size: 10pt; font-family: arial, helvetica, sans-serif;">Simply enter your best email below then click</span><br><span style="font-size: 10pt; font-family: arial, helvetica, sans-serif;" data-mce-style="font-size: 10pt; font-family: arial, helvetica, sans-serif;">"Get Access Now!" button and get instant</span><br><span style="font-size: 10pt; font-family: arial, helvetica, sans-serif;" data-mce-style="font-size: 10pt; font-family: arial, helvetica, sans-serif;">access to _____________ - <strong><span style="color: #ff0000;" data-mce-style="color: #ff0000;">100% FREE</span></strong></span></div><div style="position: absolute; left: 416px; top: 137px; z-index: 1; text-align: center;border: 1px solid transparent;"><span style="font-family: impact, chicago; font-size: 24pt; background-color: #ffff99;" data-mce-style="font-family: impact, chicago; font-size: 24pt; background-color: #ffff99;">FREE INSTANT ACCESS</span></div><div style="position: absolute; left: 7px; top: 116px; z-index: 2; border: 1px solid transparent;"><img id="stage_img_250" alt="" src="'. $dir .'assets/girl.gif" border="0" /></div><div id="poweredby" style="position: absolute; left: 240px; top: 420px; color: white;"><a href="http://www.optinrevolution.com/?utm_source=plugin&amp;utm_medium=link&amp;utm_campaign=poweredby" target="_new_blank" rel="nofollow" style="color:white !important">Wordpress Popup</a> <span style="color:white">by</span> <a href="http://www.optinrevolution.com/?utm_source=plugin&amp;utm_medium=link&amp;utm_campaign=poweredby" target="_blank" rel="nofollow" style="color:white !important">Optin Revolution Pro</a></div><form method="post" id="mce_getaccessed" action="http://www.optinrevolution.com/setup/?utm_source=plugin&utm_medium=not-setup&utm_campaign=lite" target="_blank"><div style="display:none;"><input type="hidden" name="listname" value="optinrev_course"><input type="hidden" name="meta_web_form_id" value="1712095327"><input type="hidden" name="meta_message" value="1"><input type="hidden" name="meta_adtracking" value="Pro"><input type="hidden" name="redirect" value="http://www.optinrevolution.com/free-course/thankyou.php"><input type="hidden" name="meta_redirect_onlist" value=""><input type="hidden" name="meta_required" value="email"></div><div style="position: absolute; left: 0px; top: 0px; border: 1px solid transparent; display: none;display:none;"><input type="text" name="name" id="name" value="Enter Your Name..." style="font-family: arial !important;font-size:20px;color:#000000;padding-top:8px !important;padding-bottom:8px !important;width:261px;background-color:#FFFFCC !important;border:5px solid #666666;"></div><div style="position: absolute; left: 425px; top: 237px;border: 1px solid transparent;"><input type="text" name="email" id="email" value="Enter Your Email..." style="font-family: arial !important;font-size:20px;color:#000000;padding-top:8px !important;padding-bottom:8px !important;width:261px;background-color:#FFFFCC !important;border:5px solid #666666;"></div></form>',
            'optinrev_close_button' => 'left:722.5px;top:33.5;', 'optinrev_close_button_class' => 'close2', 'optinrev_dragging' => 1, 'optinrev_call_action_button' => 'get_access2',
            'optinrev_excerpt' => '<div id="simplemodal-container" style="width: 720px; height: 410px; border: 8px solid rgba(0,119,255,0.75); background-color: #ffffff; -moz-border-radius: 25px; -webkit-border-radius: 25px; border-radius: 25px;"><div class="close2" id="close" style="left:704.5px; top:-29.5px;"> </div><div class="simplemodal-data" id="simplemodal-data"><div style="position: absolute; left: 421px; top: 297px;"><img id="wm" alt="" src="'. $dir .'assets/get_access2.png" border="0" /></div><div style="position: absolute; left: 270px; top: 128px;"><img id="stage_img_48" alt="" src="'. $dir .'assets/v-arrows.gif" border="0" /></div><div style="position: absolute; left: 492px; top: 384px;"><img id="stage_img_47" alt="" src="'. $dir .'assets/padlock.png" border="0" /></div><div style="position: absolute; left: 511px; top: 387px; z-index: 1;"><span style="font-size: 8pt;">Your Privacy Is Protected.</span></div><div style="position: absolute; left: 87px; top: 85px; z-index: 1; text-align: center;"><strong><span style="font-family: tahoma, arial, helvetica, sans-serif; font-size: 14pt;">On Average, 8 Out Of 10 People Will Read Headline Copy</span></strong><br /><strong><span style="font-family: tahoma, arial, helvetica, sans-serif; font-size: 14pt;">But Only 2 Out Of 10 Will Read The Rest.</span></strong></div><div style="position: absolute; left: 4px; top: 10px; z-index: 1; text-align: center;"><span style="font-family: impact, chicago; font-size: 24pt; color: #ff0000;">Remember, Every Element Of Compelling Copy Has Just<br />One Purpose - To Get The Next Sentence Read!</span></div><div style="position: absolute; left: 422px; top: 185px; line-height: 16px; z-index: 1; text-align: center;"><span style="font-size: 10pt; font-family: arial, helvetica, sans-serif;">Simply enter your best email below then click</span><br /><span style="font-size: 10pt; font-family: arial, helvetica, sans-serif;">"Get Access Now!" button and get instant</span><br /><span style="font-size: 10pt; font-family: arial, helvetica, sans-serif;">access to _____________ - <strong><span style="color: #ff0000;">100% FREE</span></strong></span></div><div style="position: absolute; left: 416px; top: 137px; z-index: 1; text-align: center;"><span style="font-family: impact, chicago; font-size: 24pt; background-color: #ffff99;">FREE INSTANT ACCESS</span></div><div style="position: absolute; left: 7px; top: 116px; z-index: 2; border: 1px solid transparent;"><img id="stage_img_250" alt="" src="'. $dir .'assets/girl.gif" border="0" /></div><div id="poweredby" style="position: absolute; left: 240px; top: 420px; color: white;"><a style="color: white !important;" href="http://www.optinrevolution.com/?utm_source=plugin&amp;utm_medium=link&amp;utm_campaign=poweredby" target="_blank" rel="nofollow">Wordpress Popup</a> <span style="color: white;">by</span> <a style="color: white !important;" href="http://www.optinrevolution.com/?utm_source=plugin&amp;utm_medium=link&amp;utm_campaign=poweredby" target="_blank" rel="nofollow">Optin Revolution Pro</a></div><form id="mce_getaccessed" action="http://www.optinrevolution.com/setup/?utm_source=plugin&utm_medium=not-setup&utm_campaign=lite" method="post" target="_blank"><div style="display: none;"><input type="hidden" name="listname" value="optinrev_course" /><input type="hidden" name="meta_web_form_id" value="1712095327" /><input type="hidden" name="meta_message" value="1" /><input type="hidden" name="meta_adtracking" value="Pro" /><input type="hidden" name="redirect" value="http://www.optinrevolution.com/free-course/thankyou.php" /><input type="hidden" name="meta_redirect_onlist" value="" /><input type="hidden" name="meta_required" value="email" /></div><div style="position: absolute; left: 0px; top: 0px; border: 1px solid transparent; display: none;"><input id="name" style="font-family: arial !important; font-size: 20px; color: #000000; padding-top: 8px !important; padding-bottom: 8px !important; width: 261px; background-color: #ffffcc !important; border: 5px solid #666666;" type="text" name="name" value="Enter Your Name..." /></div><div style="position: absolute; left: 425px; top: 237px;"><input id="email" style="font-family: arial !important; font-size: 20px; color: #000000; padding-top: 8px !important; padding-bottom: 8px !important; width: 261px; background-color: #ffffcc !important; border: 5px solid #666666;" type="text" name="email" value="Enter Your Email..." /></div></form></div></div>',
            'optinrev_email_form_opt' => 'aweber', 'optinrev_foptin_active' => 'aweber', 'optinrev_email_form' => array( 'aweber' => array( 'name' => 'Enter Your Name...', 'email' => 'Enter Your Email...', 'listname' => '', 'meta_web_form_id' => '', 'meta_message' => null, 'meta_adtracking' => '', 'redirect' => '', 'meta_redirect_onlist' => '', 'pixel_tracking_id' => '' )),
            'optinrev_input_enabled' => array('name' => 0), 'validate' => array( 'email' => 1 ), 'optinrev_inputh' => 50, 'optinrev_inputw' => 259, 'optinrev_inputtc' => '#000000', 'optinrev_inputfz' => 20,
            'optinrev_inputc' => '#FFFFCC', 'optinrev_inputb' => '#666666', 'optinrev_inputbt' => 5, 'optinrev_wbg_color' => '#000000', 'optinrev_wbg_opacity' => 50, 'optinrev_delay' => 0, 'optinrev_pwbg_color' => '#FFFFFF', 'optinrev_border_color' => '#0077FF', 'optinrev_border_thickness' => 8, 'optinrev_border_opacity' => 75, 'optinrev_border_radius' => 25, 'optinrev_round_border' => 'on', 'optinrev_top_margin' => 127, 'optinrev_wwidth' => 720, 'optinrev_hheight' => 410, 'optinrev_link_color' => '#1122CC','optinrev_close_popup_image' => 'close2', 'optinrev_gotowebsite' => 'top', 'optinrev_cookie_delay' => 10
        );
       optinrev_update( 'optinrev_default', serialize( $default_optin ) );
   }

  // mail providers
  optinrev_mail_providers();

  } else if ( $plugin_page == 'optinrevolution/optin-pro-settings' ) {
  optinrev_enqueue(2);
  }  
  
  optinrev_update( 'optinrev_poweredby', 'true' );
  optinrev_update( 'optinrev_optinrevolution/optin1_enabled', 'true' );
  
  //set default;
  if ( !optinrev_get( 'optinrev_show_popup' ) ) {
  optinrev_update( 'optinrev_show_popup', 'show_always' );//show always default      
  }  

}

if (is_optinrev())
add_action( 'admin_init', 'optinrev_plugin_admin_init' );


function optinrev_check_for_plugin_update($checked_data) {
	global $optinrev_plugin;
	
	if (empty($checked_data->checked))
		return $checked_data;    
  
  $new_version = optinrev_remote_info('version');
  $download_url = optinrev_remote_info('download_link');
	
	if( optinrev_is_pro_authorized() )
  {
     $download_url = optinrev_download_url();
     $new_version = optinrev_pro_current_version();
  } else {  
  
  //most recent  
  if ( isset( $checked_data->checked[ $optinrev_plugin ] ) ) {
      $current_version = $checked_data->checked[ $optinrev_plugin ];  
      if ( !version_compare( $current_version, $new_version, '<' ) ) {
      return $checked_data;      
      }
  }
     
  }
  
  $obj = new stdClass();
  $obj->slug = 'optinrevolution';
  $obj->new_version = $new_version;
  $obj->url = 'http://optinrevolution.com';
  $obj->package = $download_url;
  $checked_data->response[$optinrev_plugin] = $obj;   
	
	return $checked_data;
}
add_filter('pre_set_site_transient_update_plugins', 'optinrev_check_for_plugin_update');

function optinrev_plugin_api_call($def, $action, $args) {
	global $optinrev_plugin, $wp_version;
	
	if (!isset($args->slug) || ($args->slug != 'optinrevolution'))
		return false;
	
	// Get the current version
	$plugin_info = get_site_transient('update_plugins');
	$current_version = $plugin_info->checked[ $optinrev_plugin ];
	$args->version = $current_version;
	
	$request_string = array(
			'body' => array(
				'action' => $action, 
				'request' => serialize($args),
				'api-key' => md5(get_bloginfo('url'))
			),
			'user-agent' => 'WordPress/' . $wp_version . '; ' . get_bloginfo('url')
		);
	
	$request = wp_remote_post('http://api.wordpress.org/plugins/info/1.0/optin-revolution', $request_string);
	
	if (is_wp_error($request)) {
		$res = new WP_Error('plugins_api_failed', __('An Unexpected HTTP Error occurred during the API request.</p> <p><a href="?" onclick="document.location.reload(); return false;">Try again</a>'), $request->get_error_message());
	} else {
		$res = unserialize($request['body']);
		
		if ($res === false)
			$res = new WP_Error('plugins_api_failed', __('An unknown error occurred'), $request['body']);
	}
  
	return $res;
}
add_filter('plugins_api', 'optinrev_plugin_api_call', 10, 3);

function optinrev_pro_action_needed( $plugin )
{
  global $optinrev_plugin;

  if( $plugin == $optinrev_plugin && optinrev_is_pro_authorized() )
  {
    optinrev_manually_queue_update();
    $inst_install_url = wp_nonce_url('update.php?action=upgrade-plugin&plugin=' . $plugin, 'upgrade-plugin_' . $plugin);
  ?>
    <td colspan="3" class="plugin-update"><div class="update-message" style="-moz-border-radius-bottomleft:5px; -moz-border-radius-bottomright:5px; -moz-border-radius-topleft:5px; -moz-border-radius-topright:5px; border-style:solid; border-width:1px; margin:5px; background-color:#FFEBE8; border-color:#CC0000; padding:3px 5px;"><?php printf(__('Optin Revolution Pro installation isn\'t quite complete yet.<br/>%1$sAutomatically Upgrade to Enable Optin Revolution Pro%2$s', 'optin'), '<a href="'.$inst_install_url.'">', '</a>'); ?></div></td>
  <?php
  }
}
add_action('after_plugin_row', 'optinrev_pro_action_needed');

function optinrev_pro_get_started_headline()
{
  global $optinrev_plugin, $plugin_page, $wp_version;

  $this_uri = preg_replace('#&.*?$#', '', str_replace( '%7E', '~', $_SERVER['REQUEST_URI']));
  
  if ( defined('W3TC') )  
  $_POST['optinrev_w3tc'] = time();
  
  if ( isset( $_GET['action'] ) && $_GET['action'] == 'upgrade-plugin' && $_GET['plugin'] == $optinrev_plugin ) {
      optinrev_delete( 'optinrev_default' );
      optinrev_delete( 'optinrev_popups' );
      return;
  }

  if (  in_array( $plugin_page, array('optinrevolution', 'optinrevolution/optin1', 'optinrevolution/optin-pro-settings') ) ) {

    echo __('<div class="updated" style="padding:6px;"><a href="http://www.optinrevolution.com/tutorials/?utm_source=plugin&utm_medium=link&utm_campaign=tutorials">Click here</a> to access your step-by-step <a href="http://www.optinrevolution.com/?utm_source=plugin&utm_medium=topbar&utm_campaign=upgrade">video tutorials</a> that can help you on your Optin Revolution Lite journey! <b>Want more subscribers?</b><a href="http://www.optinrevolution.com/?utm_source=plugin&utm_medium=topbar&utm_campaign=upgrade"> <b>Upgrade to Pro</b>.</a></div>');

    if (version_compare($wp_version, '3.3', '<')) {
    ?>
    <div class="error" style="padding:8px;"><?php echo __('Please update your wordpress in order to use the editor. <a href="update-core.php">Update now.</a>'); ?></div>
    <?php
    }

    if ( !optinrev_get('optinrev_popup_enabled') || optinrev_get('optinrev_popup_enabled') == 'false' ) {
    ?>
      <div class="error" id="_disopt" style="padding:8px;"><?php printf(__('Optin Revolution Popup is disabled.<br/>%1$sEnable it now.%2$s', 'optin'), '<a href="'. $this_uri .'&enable=1">','</a>'); ?></div>
    <?php
    }
    
    if ( optinrev_is_pro_authorized() )
    {
      optinrev_manually_queue_update();
      $inst_install_url = wp_nonce_url('update.php?action=upgrade-plugin&plugin=' . $optinrev_plugin, 'upgrade-plugin_' . $optinrev_plugin);
      ?>
      <div class="error" style="padding:8px;"><?php printf(__('Optin Revolution Pro installation isn\'t quite complete yet.<br/>%1$sAutomatically Upgrade to Enable Optin Revolution Pro%2$s', 'optin'), '<a href="'.$inst_install_url.'">','</a>'); ?></div>
      <?php
    }
  }
  return;
}
add_action('admin_notices', 'optinrev_pro_get_started_headline');

function optinrev_activate()
{
  global $wpdb;

  $table_name = $wpdb->prefix . "optinrev";
  $sql = "CREATE TABLE IF NOT EXISTS `$table_name` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(64) NOT NULL DEFAULT '',
	`content` LONGTEXT NOT NULL,
	PRIMARY KEY (`id`),
	UNIQUE INDEX `name` (`name`)
  );";

  require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
  dbDelta($sql);
  
  optinrev_delete( 'optinrev_pro_installed' );
  optinrev_delete( 'optinrev_pro_authorized' );
  optinrev_delete( 'optinrev_default' );
  optinrev_delete( 'optinrev_mail_providers' );
  delete_option( '_site_transient_update_plugins' );
}
register_activation_hook( __FILE__, 'optinrev_activate' );

function optinrev_deactivate()
{
  optinrev_delete( 'optinrev_default' );
  optinrev_delete( 'optinrev_mail_providers' );
  delete_option( '_site_transient_update_plugins' );
}
register_deactivation_hook( __FILE__, 'optinrev_deactivate' );

function optinrev_js()
{
  global $plugin_page, $wp_version;

  $dir = plugin_dir_url( __FILE__ );

  $optin = optinrev_popups();
  //mail providers
  $mailpro = json_encode( unserialize(optinrev_get('optinrev_mail_providers')) );
  //is autosave
  $autosave = optinrev_get('optinrev_autosave');
  $poweredby = optinrev_get('optinrev_poweredby');

  if ( isset($plugin_page) )
  $_POST = unserialize(optinrev_get( $plugin_page ));

  //mail provider set
  $mail_form_name = (isset($_POST['optinrev_foptin_active']))?trim($_POST['optinrev_foptin_active']):'aweber';

  $optinrev_ctcurl = ( isset($_POST['optinrev_ctcurl']) && $_POST['optinrev_foptin_active']=='constantcontact') ? $_POST['optinrev_ctcurl'] : '';

  //briefcase images - it will insert to the canvas
  $is_bfcase = 0;
  if ( $imgs = optinrev_get_image( $plugin_page )) {
      $is_bfcase = array();
      foreach( $imgs as $v ) {
        $is_bfcase[] = $v->content;
        optinrev_delete( $v->name );
      }
      $is_bfcase = json_encode($is_bfcase);
  }

  $is_delbfcase = 0;
  if ( $imgs = optinrev_delete_image( $plugin_page )) {
      $is_delbfcase = array();
      foreach( $imgs as $v ) {
        $is_delbfcase[] = $v->content;
        optinrev_delete( $v->name );
      }
      $is_delbfcase = json_encode($is_delbfcase);
  }

  //briefcase button - it will insert to the canvas
  $is_actionbtn = 0;
  if ( $case_btn = optinrev_get('optinrev_add_button_briefcase') )
  {
      $is_actionbtn = $case_btn;
      optinrev_update( 'optinrev_active_action_button', $is_actionbtn );
      optinrev_delete( 'optinrev_add_button_briefcase' );
  }

  $is_upload = optinrev_get( 'optinrev_upload' );


  $ht = '';
  //setting page
  if ( $plugin_page == 'optinrevolution' )
  {
  $ht .= '$("#optinrev_popup_enabled").iButton({change: function($input){$(\'#_disopt\').hide();$.post("admin-ajax.php", {action : "optinrev_action", "optinrev_popup_enabled" : $input.is(":checked")}, function(res){wtfn.msg(\'Successfully Updated.\');});}});';
  ?>
  <script type="text/javascript">
  var admin = {cookies : function() {if ( confirm('Are you sure you want to clear all cookies ?') ) {window.location.href = 'admin.php?page=optinrevolution&cookies=clear';}}};
  jQuery(document).ready(function($){<?php echo $ht;?>});
  </script>
  <?php }
  else if ( $plugin_page == 'optinrevolution/optin1' ) {include_once(  plugin_dir_path( __FILE__ ) . 'js/optinrev-js.php'); echo '<script type="text/javascript" src="'.$dir.'js/optinrev.js?ver='.$wp_version.'"></script>';}
  else if ( $plugin_page == 'optinrevolution/optin-pro-settings' ) { echo '<script type="text/javascript" src="'.$dir.'js/optinrev-pro-setting.js?ver='. $wp_version .'"></script>'; }
}//jsload

if (is_optinrev())
add_action( 'admin_head', 'optinrev_js' );

//Pro settings
//Optin Setting
function optinrev_pro()
{
  global $optinrev_plugin, $plugin_url;
  $this_uri = preg_replace('#&.*?$#', '', str_replace( '%7E', '~', $_SERVER['REQUEST_URI']));

  $auth_info = array();
  if ( $auth_info = optinrev_get('optinrev_pro_authorized') )
  $auth_info = unserialize( $auth_info );
  
?>
<div id="optin-revolution">
  <div class="wrap fform pro-license">
    <div class="get-help">Get Help : <a href="<?php echo OPTINREV_TUTORIAL_LINK;?>" target="_blank">Tutorials</a> | <a href="http://www.optinrevolution.com/?utm_source=plugin&utm_medium=link&utm_campaign=upgrade" title="Upgrade to Pro" target="_blank"><b>Upgrade to Pro</b></a></div>
    <div class="icon32" id="icon-options-general"><br /></div><?php echo "<h2>" . __( 'Optin Revolution Pro Settings', 'optinrev_trdom' ) . "</h2>"; ?> <br />
    <h3>Optin Revolution Pro License Information</h3>
    <form id="cred_form" name="cred_form" method="post" action="<?php echo $this_uri;?>">
      <?php wp_nonce_field(); ?>         
      <div class="row"><label><b>Email</b>&nbsp;</label><input type="text" name="amember_email" id="amember_email" size="30" value="<?php echo (count($auth_info))?$auth_info['amember_email']:'';?>"></div>
      <div class="row"><label>&nbsp;</label><input type="submit" name="Submit" class="optinrev_xbutton" value="<?php _e('Save', 'optin'); ?>" />&nbsp;<span id="acn_verify"></span></div>
    </form><br />
    <p>  
    <?php echo optinrev_hosted_video();?>
    </p>
  </div>
</div>
<?php
}

//Optin Setting
function optinrev_admin()
{
  global $optinrev_plugin, $wp_version;  

  $dir = plugin_dir_url( __FILE__ );

  $this_uri = preg_replace('#&.*?$#', '', str_replace( '%7E', '~', $_SERVER['REQUEST_URI']));

  $optin = optinrev_popups(); 

  $optinrev_show_popup = optinrev_get('optinrev_show_popup');
  $ispopup = optinrev_get('optinrev_popup_enabled');

  $is_showonload = optinrev_get('optinrev_show_where');
  if ( empty($is_showonload) ) {
      optinrev_update( 'optinrev_show_where', 'show_on_load' );
  }
  
  optinrev_update( 'optinrev_autosave', 'false' );
  optinrev_update( 'optinrev_showmobile', 'false' );
  optinrev_update( 'optinrev_poweredby', 'false' );

  //if show
  $wshow = explode( '|', $optinrev_show_popup );
  $ispop = optinrev_getbool( 'optinrev_optinrevolution/optin1_enabled' );  
  
  $r = 1;
  
?>
<div id="optin-revolution">
<div class="or-social-icons">
  <div class="social-center">
  <?php optinrev_socials();?>
  </div>
</div>
<div class="get-help">Get Help : <a href="<?php echo OPTINREV_TUTORIAL_LINK;?>" target="_blank">Tutorials</a> | <a href="http://www.optinrevolution.com/?utm_source=plugin&utm_medium=link&utm_campaign=upgrade" title="Upgrade to Pro" target="_blank"><b>Upgrade to Pro</b></a></div>
<div class="col1">
<div class="wrap fform">
<?php if (get_option('optinrev_cookies')) { ?>
  <div id="message" class="updated fade" style="padding:10px;">
  <strong><?php echo __('Successfully cookies cleaned.'); ?></strong>
  </div>
<?php delete_option('optinrev_cookies');}?>
<div class="icon32" id="icon-options-general"><br /></div><?php echo "<h2>" . __( 'Optin Revolution Settings', 'optinrev_trdom' ) . "</h2>"; ?> <br />
  <div id="post-message" class="updated"></div>
  <div class="clear"></div>  
  <!--//banner-->  
  <?php echo optinrev_banner();?>  
  <!--//banner-->
  
  <form name="optinrev_form" id="optinrev_form" method="post" action="<?php echo $this_uri;?>">
    <?php wp_nonce_field();?>
    <p><label class="lbladmin"><?php _e('Optin Revolution Popup'); ?></label><div class="fbox"><input type="checkbox" name="optinrev_popup_enabled" id="optinrev_popup_enabled" <?php echo ($ispopup === 'true') ? 'checked="checked"': '';?>/></div><div class="clear"></div></p>
    <div class="row"><label class="lbladmin"><?php _e('Show Optin Revolution Popup');?></label>
        <div class="fbox popup-option">
        <div class="rw"><input type="radio" name="optinrev_show[]" id="show_always" value="always" onchange="wtfn.optinrev_show_popup('show_always');" <?php echo ($wshow[0] === 'show_always')?'checked':'';?>/>&nbsp;&nbsp;Always</div>
        <div class="rw"><input type="radio" name="optinrev_show[]" id="show_times_per_session" value="times_per_session" onchange="wtfn.optinrev_show_popup('show_times_per_session');" <?php echo ($wshow[0] === 'show_times_per_session')?'checked':'';?>/>&nbsp;<input type="hidden" name="optinrev_time_session" id="optinrev_time_session" size="5" value="<?php echo (isset($wshow[1]) && $wshow[0] === 'show_times_per_session') ? $wshow[1]: 1;?>"/>&nbsp;Once per browser session</div>
        </div>
        <div class="clear"></div>
    </div>
    <div class="row" id="save_showset"><label>&nbsp;</label><span class="submit"><input type="button" name="optinrev_save_showset" class="optinrev_xbutton" id="optinrev_save_showset" value="Save"/></span></div>
    <br />    
    <div class="row"><label class="lbladmin"><?php _e('Cookies'); ?></label><input type="button" class="optinrev_xbutton" name="optinrev_clean_cookies" value="Clear Cookies" onclick="admin.cookies();"/></div>
    <div class="row"><label class="lbladmin"><?php _e('Email Form Settings'); ?></label><input type="button" class="optinrev_xbutton" name="optinrev_reset_emailforms" value="Reset" onclick="wtfn.reset_emailform();"/></div>
    <div class="row"><label class="lbladmin"><?php _e('Popup and Email Form Settings'); ?></label><input type="button" class="optinrev_xbutton" name="optinrev_reset_popup" value="Reset" onclick="wtfn.reset_popup();"/></div>    
  </form>
  <script type="text/javascript" src="<?php echo $dir;?>js/optinrev-admin-setting.js?ver=<?php echo $wp_version;?>"></script><br />
  <p>
  <?php echo optinrev_hosted_video();?>
  </p>  
</div>
</div>

<div class="col2">
  <div class="need-support-box" style="margin-top:50px;">
  <h2>Need support?</h2>
  <p>If you are having problems with this plugin, please talk about them in the <a href="<?php echo OPTINREV_SUPPORT;?>" target="_blank">Support forums</a>.</p>
  </div>

  <div class="social-box">
  <h2>Need a email provider? We support:</h2>
  <?php optinrev_email_support();?>
  <div class="clear"></div>
  </div>
</div>
<div class='clear'></div>
</div>
<?php
}

function optinrev_setup() {
  global $plugin_page;

  $dir = plugin_dir_url( __FILE__ );
  //default button images
  $def_images = unserialize( optinrev_get('optinrev_default_images') );
  $get_access_btns = $def_images['get_access'];
  $close_btns = $def_images['close_btn'];

  //configs
  $optin = optinrev_popups();
  if ( isset($plugin_page) )
  {
    $_POST = unserialize(optinrev_get( $plugin_page ));
  }

  $is_call_action = (optinrev_post('optinrev_call_action_button', true)) ? optinrev_post('optinrev_call_action_button', true) : 'get_access1';
  $is_close_btn = (optinrev_post('optinrev_close_popup_image', true)) ? optinrev_post('optinrev_close_popup_image', true) : 'close1';

  $action_btn_view = $get_access_btns[ $is_call_action ];

  //editing content
  $content = (optinrev_post('optinrev_excerpt', true)) ? optinrev_post('optinrev_excerpt', true) : '';
  //email form
  $mail_form = array(
  'aweber' => 'Aweber', 'icontact' => 'Icontact', 'getresponse' => 'GetResponse', 'mailchimp' => 'Mailchimp', 'constantcontact' => 'Constant Contact', 'wysija' => 'Wysija'
  );

  $email_form_opt = (optinrev_post('optinrev_email_form_opt', true)) ? optinrev_post('optinrev_email_form_opt', true) : 'virtualsender';
  
  $foptin = (optinrev_post('optinrev_foptin_active', 1)) ? optinrev_post('optinrev_foptin_active', 1) : 'aweber';
  $foptin_form = (optinrev_post('optinrev_foptin_form_active', 1)) ? optinrev_post('optinrev_foptin_form_active', 1) : '';
  
  $femail_validate = (optinrev_post('optinrev_femail_validate', 1)) ? optinrev_post('optinrev_femail_validate', 1) : '';
  
  $wylist_id = (optinrev_post('wysija_list_id', 1)) ? optinrev_post('wysija_list_id', 1) : ''; 
  
  //input text
  $inputs = (isset($_POST['optinrev_email_form'])) ? $_POST['optinrev_email_form'] : '';
  $inputs_enabled = (isset($_POST['optinrev_input_enabled'])) ? $_POST['optinrev_input_enabled'] : '';
  
  //goto website button location
  $gw = (optinrev_post('optinrev_gotowebsite', true)) ? optinrev_post('optinrev_gotowebsite', true) : 'top';
  
  $optinrev_delay = (optinrev_post('optinrev_delay',true)) ? optinrev_post('optinrev_delay', true) : 0;
  $optinrev_ctcurl = (isset($_POST['optinrev_ctcurl'])) ? $_POST['optinrev_ctcurl'] : '';
?>
<div id="optin-revolution">
<div class="or-social-icons">
<div class="social-center">
<?php optinrev_socials();?>
</div>
</div>
<div class="get-help">Get Help : <a href="<?php echo OPTINREV_TUTORIAL_LINK;?>" target="_blank">Tutorials</a> | <a href="http://www.optinrevolution.com/?utm_source=plugin&utm_medium=link&utm_campaign=upgrade" title="Upgrade to Pro" target="_blank"><b>Upgrade to Pro</b></a></div>

<div class="wrap fform">
<div class="icon32" id="icon-options-general"><br /></div><?php echo "<h2>" . __( $optin[ $plugin_page ] . ' Settings', 'wotp_trdom' ) . "</h2>"; ?> <br />
  <div id="post-message" class="updated"></div>  
  <?php echo optinrev_banner();?>  
  <form name="optinrev_setup_form" id="optinrev_setup_form" method="POST" action="admin-ajax.php">
    <input type="hidden" name="action" value="optinrev_action"/>
    <input type="hidden" name="save_setup_settings" id="page" value="<?php echo $plugin_page;?>"/>
    <input type="hidden" name="optinrev_data" id="optinrev_data"/>
    <input type="hidden" name="optinrev_close_button" id="optinrev_close_button" value="<?php optinrev_post('optinrev_close_button');?>"/>
    <input type="hidden" name="optinrev_close_button_class" id="optinrev_close_button_class"/>
    <input type="hidden" name="optinrev_dragging" id="optinrev_dragging" value="<?php optinrev_post('optinrev_dragging');?>"/>
    <input type="hidden" name="optinrev_call_action_button" id="optinrev_call_action_button" value="<?php echo $is_call_action;?>">
    <input type="hidden" name="optinrev_foptin_active" id="optinrev_foptin_active" value="<?php echo $foptin;?>">
    <input type="hidden" name="optinrev_foptin_form_active" id="optinrev_foptin_form_active" value="<?php echo $foptin_form;?>">
    
    <div>    
    <div class="left" style="margin-top:5px;">
    <input type="button" name="action_reset" class="optinrev_xbutton" id="action_reset" value="<?php _e('Reset') ?>" />        
    </div>    
    <div class="right" id="wotbuttons">    
    <span class="spin" id="save_setting_spin"></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="button" class="optinrev_button" name="action_save_settings" value="<?php _e('Save Settings') ?>" onclick="wtfn.save(1);" />&nbsp;&nbsp;&nbsp;    
    <input alt="" title="<?php echo $optin[$plugin_page];?> Preview" id="action_preview" class="optinrev_button" type="button" value="Preview" />
    </div>    
    </div>
    
    <div class="clear"></div><br />    

    <div class="col1">
    <?php
    if ( function_exists('wp_editor') ) {
        wp_editor( $content, 'optinrev_excerpt', array('textarea_rows' => 14, 'media_buttons' => false, 'tinymce' => true) );
    }
    ?><br />    
    <p><?php echo optinrev_banner2();?></p>
    </div>    
    <div class="col2">
    <div class="need-support-box">
    <h2>Need support?</h2>
    <p>If you are having problems with this plugin, please talk about them in the <a href="<?php echo OPTINREV_SUPPORT;?>" target="_blank">Support forums</a>.</p>
    </div>
    <div class="social-box">
    <h2>Need a email provider? We support:</h2>
    <?php optinrev_email_support();?>
    <div class="clear"></div>
    </div>
    </div>
    <div class='clear'></div>
    
    <div id="icon-themes" class="icon32"><br></div>
    <h2 class="nav-tab-wrapper" id="optinrev-nav-tab">
      <a href="#email-forms" class="nav-tab nav-tab-active" data-tab="1" onclick="wtfn.tabs(this);">Email Forms</a>
      <a href="#input-fields" class="nav-tab" data-tab="2" onclick="wtfn.tabs(this);">Input Fields</a>
      <a href="#background" class="nav-tab" data-tab="3" onclick="wtfn.tabs(this);">Background</a>
      <a href="#popup" class="nav-tab" data-tab="4" onclick="wtfn.tabs(this);">Popup</a>
    </h2><br />
    
    
    <div class="optinrev-settab1">
    
    <div class="inmsg"></div><br />    
    
    <div class="optinrev_mail_providers">
          <div class="box1">
          <ul id="femail_tab">
          <?php
              
              foreach( $mail_form as $k => $v )
              {
                $sel = ( $foptin == $k ) ? 'active' : '';      
                echo '<li id="'. $k .'" class="'. $sel .'" data-title="'. $v .'"><img src="'. OPTINREV_DIR .'images/'. (($k === 'constantcontact')? 'constant_contact': $k) . '.png" border="0"/></li>';      
              }//check active form          
          ?>
          </ul>
          </div>
          <div class="box2">              
              
              <ul id="foptin_box">
              <?php foreach( $mail_form as $k => $v ) { 
              $sel_optin = ( $foptin !== $k || $foptin_form ) ? 'display:none' : '';
              
              if ( $k !== 'wysija' ) {              
              ?>
              <li style="<?php echo $sel_optin;?>" id="optinrev_optin_<?php echo $k;?>">
              <h2>Please Fill in the Following Details:</h2>
              <h3>Enter your html opt-in code below and we'll hook up your forms to the template:</h3>

              <?php if ( $k == 'constantcontact' ) { ?>
              <div class="optinrev_ctc">Enter your share url to form&nbsp;<input type="text" name="optinrev_ctcurl" id="optinrev_ctcurl" data-ctc="optinrev_optincode_<?php echo $k;?>" size="30" onblur="wtfn.getctc_form(this);" value="<?php echo $optinrev_ctcurl;?>">&nbsp;<em>Don't have a url. <a href="https://ui.constantcontact.com/rnavmap/em/contacts/signuptools" target="_blank" rel="nofollow">Get your share url here.</a></em></div>
              <?php }?>
              
              <textarea name="optinrev_optin_<?php echo $k;?>" id="optinrev_optincode_<?php echo $k;?>" cols="100" rows="12"><?php echo ( optinrev_post('optinrev_optin_'. $k, 1) ) ? optinrev_post('optinrev_optin_'. $k, 1) : '';?></textarea>
              <div class="row"><input type="button" name="save_wait" class="optinrev_xbutton" value="Optin Code Update" onclick="wtfn.optin_form('<?php echo $k;?>');"></div>
              </li>              
              <?php } else {?>
              
              <li style="<?php echo $sel_optin;?>" id="optinrev_optin_<?php echo $k;?>">              
              <?php              
                if ( defined('WYSIJA') ) {
                      
                $modelL=&WYSIJA::get('list','model');
                
                $listsdata=$modelL->get(array('list_id','name'),array('is_enabled'=>'1'));       
                
                $htm = '';
                $htm .= '<h3>Wysija Mailing List</h3>';
                $htm .= '<p><select name="wysija_list_id" id="wysija_list_id" style="width:150px;">';
                
                $htm .= '<option value="">--Select List ID--</option>';
                foreach($listsdata as $list){
                $htm .= '<option value="'. $list['list_id'] .'" '. ( ( $wylist_id === $list['list_id'] ) ? 'selected': '' ) .'>'. $list['name'] ."</option>";
                }
                echo $htm .= '</select></p>';
                
              ?>
              <div class="row"><input type="button" name="save_wait" class="optinrev_xbutton" value="Optin Code Update" onclick="wtfn.optin_form('<?php echo $k;?>');"></div>
              
              <?php } else {?>
              <h2><em>No WYSIJA plugin has been found.</em></h2><br />              
              <?php }?>
              
              </li>
              
              <?php }}?>
              </ul>
              
              <?php
                //email value;
                $optinrev_email = (optinrev_post('optinrev_email', 1)) ? optinrev_post('optinrev_email', 1) : 'Enter Your Email...';
              ?>
              
              <div class="foptin_ifo" <?php echo ( $foptin_form )? 'style="display:block"':'';?>>
                <h3>Your <span id="foptin_ifo_lbl"><b><?php echo $mail_form[$foptin];?></b></span> form code is now linked to Optin Revolution Lite</h3><br /><br /><br />
                <div class="foptin_active"><h2>Active</h2></div><br /><br /><br />
                <p>Email&nbsp;<input type="text" name="optinrev_email" id="femail" value="<?php echo $optinrev_email;?>" size="30" onfocus="if (this.value=='Enter Your Email...') { this.value = ''; }" onblur="wtfn.optin_form_email(this);">&nbsp;<input type="checkbox" name="optinrev_femail_validate" id="femail_validate" <?php echo ( $femail_validate == 'on' ) ? 'checked':'';?>>&nbsp;Validate</p>
                <br /><br />
                <div class="foptin_deactivate"><h3><a href="javascript:;" onclick="wtfn.optin_form_deactivate();">Deactivate</a></h3></div>
                <br /><br /><br />
              </div>
              
              <div class="clear"></div>              
              
          </div>
          <div class="clear"></div>
    </div><br />
    
    </div>
    
    <div class="optinrev-settab2">
                    
    <h3><?php _e('Input Fields'); ?></h3>
    
    <div class="row"><label><?php _e('Height'); ?></label>
    <div class="fbox"><input type="text" name="optinrev_inputh" id="optinrev_inputh" value="<?php echo (optinrev_post('optinrev_inputh',true))?optinrev_post('optinrev_inputh',true):'50';?>" size="10" readonly>px</div>
    <div class="wjui-box"><div id="optinrev_inpuths" class="wjui"></div></div>
    <div class="clear"></div>
    </div>
    <div class="row"><label><?php _e('Width'); ?></label>
    <div class="fbox"><input type="text" name="optinrev_inputw" id="optinrev_inputw" value="<?php echo (optinrev_post('optinrev_inputw',true))?optinrev_post('optinrev_inputw',true):'160';?>" size="10" readonly>px</div>
    <div class="wjui-box"><div id="optinrev_inputws" class="wjui"></div></div>
    <div class="clear"></div>
    </div>

    <div class="row"><label><?php _e('Text Color'); ?></label><input type="text" name="optinrev_inputtc" class="color {hash:true}" value="#<?php echo (optinrev_post('optinrev_inputtc',true))?optinrev_post('optinrev_inputtc',true):'000000';?>" size="10"></div>

    <div class="row"><label><?php _e('Font Size'); ?></label>
    <div class="fbox"><input type="text" name="optinrev_inputfz" id="optinrev_inputfz" value="<?php echo (optinrev_post('optinrev_inputfz', true))?optinrev_post('optinrev_inputfz',true):'12';?>" size="10" readonly>px</div>
    <div class="wjui-box"><div id="optinrev_inputfzs" class="wjui"></div></div>
    <div class="clear"></div>
    </div>

    <div class="row"><label><?php _e('Background Color'); ?></label><input type="text" name="optinrev_inputc" class="color {hash:true}" value="#<?php echo (optinrev_post('optinrev_inputc',true))?optinrev_post('optinrev_inputc',true):'ffffff';?>" size="10"></div>
    <div class="row"><label><?php _e('Border Color'); ?></label><input type="text" name="optinrev_inputb" class="color {hash:true}" value="#<?php echo (optinrev_post('optinrev_inputb',true))?optinrev_post('optinrev_inputb',true):'000000';?>" size="10"></div>

    <div class="row"><label><?php _e('Border Thickness'); ?></label>
    <div class="fbox"><input type="text" name="optinrev_inputbt" id="optinrev_inputbt" value="<?php echo (optinrev_post('optinrev_inputbt', true))?optinrev_post('optinrev_inputbt',true):'1';?>" size="10" readonly>px</div>
    <div class="wjui-box"><div id="optinrev_inputbts" class="wjui"></div></div>
    <div class="clear"></div>
    </div>
    </div>    
    
    <div class="optinrev-settab3">
    
    <h3><?php _e('Background'); ?></h3>
    
    <div class="row"><label><?php _e('Background Color'); ?></label><input type="text" name="optinrev_wbg_color" id="optinrev_wbg_color" class="color {hash:true}" value="<?php optinrev_post('optinrev_wbg_color');?>" size="10"></div>
    <div class="row"><label><?php _e('Background Opacity'); ?></label>
    <div class="fbox"><input type="text" name="optinrev_wbg_opacity" id="optinrev_wbg_opacity" value="<?php echo (optinrev_post('optinrev_wbg_opacity',true))?optinrev_post('optinrev_wbg_opacity',true):'0';?>" size="10" readonly>%</div>
    <div class="wjui-box"><div id="wbg_opacity_slider" class="wjui"></div></div>
    <div class="clear"></div>
    </div>

    </div>    
    
    <div class="optinrev-settab4">
    
    <h3><?php _e('Popup'); ?></h3>
    
    <div class="row"><label><?php _e('Seconds Delay'); ?></label>
    <div class="fbox"><input type="text" name="optinrev_delay" id="optinrev_vdelay" value="<?php echo (optinrev_post('optinrev_delay',true))?optinrev_post('optinrev_delay',true):'0';?>" size="10" readonly>Sec</div>
    <div class="wjui-box" style="width: 440px;"><div id="optinrev_sdelay" class="wjui"></div>&nbsp;&nbsp;&nbsp;<span id="optinrev_need_longer" style="<?php echo ( $optinrev_delay > 0 ) ? '' : 'display:none;';?>">Need longer than 15 seconds? <a href="http://www.optinrevolution.com/?utm_source=plugin&utm_medium=link&utm_campaign=15-seconds" target="_blank">Upgrade to Pro</a></span></div>
    <div class="clear"></div>        
    </div>    

    <div class="row"><label><?php _e('Background Color'); ?></label><input type="text" name="optinrev_pwbg_color" class="color {hash:true}" value="<?php echo (optinrev_post('optinrev_pwbg_color',true))?optinrev_post('optinrev_pwbg_color',true):'ffffff';?>" size="10"></div>
    <div class="row"><label><?php _e('Border Color'); ?></label><input type="text" name="optinrev_border_color" class="color {hash:true}" value="<?php echo (optinrev_post('optinrev_border_color',true))?optinrev_post('optinrev_border_color',true):'000000';?>" size="10"></div>

    <div class="row"><label><?php _e('Border Thickness'); ?></label>
    <div class="fbox"><input type="text" name="optinrev_border_thickness" id="optinrev_vborder_thickness" value="<?php echo (optinrev_post('optinrev_border_thickness', true))?optinrev_post('optinrev_border_thickness',true):'1';?>" size="10" readonly>px</div>
    <div class="wjui-box"><div id="optinrev_sborder_thickness" class="wjui"></div></div>
    <div class="clear"></div>
    </div>

    <div class="row"><label><?php _e('Border Opacity'); ?></label>
    <div class="fbox"><input type="text" name="optinrev_border_opacity" id="optinrev_border_opacity" value="<?php echo (optinrev_post('optinrev_border_opacity',true))?optinrev_post('optinrev_border_opacity',true):'0';?>" size="10" readonly>%</div>
    <div class="wjui-box"><div id="border_opacity_slider" class="wjui"></div></div>
    <div class="clear"></div>
    </div>

    <?php if ( optinrev_post('optinrev_round_border', true) == 'on' ) { ?>
    <div class="row" id="_nbr"><label class="lbladmin"><?php _e('Border Radius'); ?></label>
    <div class="fbox"><input type="text" name="optinrev_border_radius" id="optinrev_border_radius" value="<?php echo (optinrev_post('optinrev_border_radius',true))?optinrev_post('optinrev_border_radius',true):'0';?>" size="10" readonly>%</div>
    <div class="wjui-box"><div id="border_radius_slider" class="wjui"></div></div>
    <div class="clear"></div>
    </div>
    <?php }?>

    <div><label class="lbladmin"><?php _e('Rounded Border'); ?></label><div class="fbox"><input type="checkbox" name="optinrev_round_border" id="optinrev_round_border" <?php echo (optinrev_post('optinrev_round_border',true)=='on') ? 'checked':'';?>/></div><div class="clear"></div></div>
    <div class="row"><label><?php _e('Popup Top Margin'); ?></label>
    <div class="fbox"><input type="text" name="optinrev_top_margin" id="optinrev_vtop_margin" value="<?php echo (optinrev_post('optinrev_top_margin', true))?optinrev_post('optinrev_top_margin',true):'0';?>" size="10" readonly>px</div>
    <div class="wjui-box"><div id="optinrev_stop_margin" class="wjui"></div></div>
    <div class="clear"></div>
    </div>
    <div class="row"><label><?php _e('Popup Width'); ?></label>
    <div class="fbox"><input type="text" name="optinrev_wwidth" id="optinrev_vwidth" value="<?php echo (optinrev_post('optinrev_wwidth',true))?optinrev_post('optinrev_wwidth',true):'900';?>" size="10" readonly>px</div>
    <div class="wjui-box"><div id="optinrev_swidth" class="wjui"></div>&nbsp;&nbsp;&nbsp;&nbsp;<span class="description">Maximum width = 900px</span></div>
    <div class="clear"></div>
    </div>
    <div class="row"><label><?php _e('Popup Height'); ?></label>
    <div class="fbox"><input type="text" name="optinrev_hheight" id="optinrev_vheight" value="<?php echo (optinrev_post('optinrev_hheight',true))?optinrev_post('optinrev_hheight',true):'600';?>" size="10" readonly>px</div>
    <div class="wjui-box"><div id="optinrev_sheight" class="wjui"></div>&nbsp;&nbsp;&nbsp;&nbsp;<span class="description">Maximum height = 600px</span></div>
    <div class="clear"></div>
    </div>
    
        <div class="clear"></div>
    <div class="row"><label><?php _e('Action Button'); ?></label><a href="javascript:;" class="button" id="reset_cab">Reset</a></div><div class="clear"></div>

    <div class="row"><label><h3><?php _e('Hyperlink'); ?></h3></label><span>&nbsp;</span></div><br />
    <div class="row"><label><?php _e('Hyperlink Color'); ?></label><input type="text" name="optinrev_link_color" id="optinrev_link_color" class="color {hash:true}" value="<?php echo (optinrev_post('optinrev_link_color',true))?optinrev_post('optinrev_link_color',true):'1122CC';?>" size="10">&nbsp;<span>Link, visited, hover and active</span></div>
    <div><label class="lbladmin"><?php _e('Hyperlink Underline'); ?></label><div class="fbox"><input type="checkbox" name="optinrev_link_underline" id="optinrev_link_underline" <?php echo (optinrev_post('optinrev_link_underline',true)=='on') ? 'checked':'';?>/></div><div class="clear"></div></div>
        
    <br />
    <h3><?php _e('Close Popup Image'); ?></h3>
    <div>
    <p>
    <?php $cb = 0;foreach( $close_btns as $bk => $bv ) { $sel = ( $is_close_btn == $bk ) ? 'checked' : '';?>
        <input type="radio" name="optinrev_close_popup_image" value="<?php echo $bk;?>" <?php echo $sel; ?>>&nbsp;<img src="<?php echo $bv;?>" border="0"/>&nbsp;&nbsp;&nbsp;
        <?php if ( $cb == 5 ) echo '<div>&nbsp;</div>'; ?>
    <?php $cb++;} ?>
        <p>Location Top / Bottom&nbsp;
        <select name="optinrev_gotowebsite" id="optinrev_gotowebsite" onchange="wtfn.gw_loc_btn(this.value);">
        <option value="top" <?php echo ($gw == 'top')?'selected':'';?>>Top</option>
        <option value="bottom" <?php echo ($gw == 'bottom')?'selected':'';?>>Bottom</option>
        </select></p>
    </p>
    </div>
    
    </div>
    <br />
    
    <p>&nbsp;</p>
    <script type="text/javascript">
        jQuery(document).ready(function($){
        $('#wotinput_fields').load('admin-ajax.php', {action : 'optinrev_action', optinrev_mail_webform : '<?php echo $plugin_page;?>', optinrev_mail_provider: $('input[name="optinrev_email_form_opt"]:checked').val()}, function(){
           $('select', this).each(function(i,v){
              nm = $(v).attr('name');
              if ( nm.indexOf('input_enabled') > 0 ) {
              if ( $(v).val() == 0 ) {
              nm = nm.substring( nm.indexOf('[') + 1, nm.indexOf(']'));
              wtfn.input_setenabled( nm,  $(v).val());
              }
              }
           });
        });
        });
    </script>
  </form>
</div>




</div>
<?php
}

function optinrev_enqueue_scripts() {
  wp_enqueue_script( 'jquery' );
}
add_action('wp_enqueue_scripts', 'optinrev_enqueue_scripts');

function optinrev_modal_wphead()
{
  global $wp_version, $optinrev_play;

  @define( 'DONOTCACHEPAGE', 1 );

  if ( is_admin() ) return false;

  if ( !optinrev_is_ie() && optinrev_is_mobile() ) return false;
  if ( !optinrev_getbool( 'optinrev_popup_enabled' ) ) return false;
  if ( !optinrev_getbool( 'optinrev_optinrevolution/optin1_enabled' ) ) return false;

  $optin = optinrev_get( 'optinrevolution/optin1' );
  if ( empty($optin) ) return;
  
  $optin = unserialize( $optin );

 //Popup Frequency
  $show_time = optinrev_get('optinrev_show_popup');
  $optinrev_play = 0;
  $ts = explode( '|', $show_time );

  wp_enqueue_style( 'optinrev-mcss-' . time(), plugin_dir_url( __FILE__ ) . 'optinrev-css.php?t='.time().'&view='. md5(time()) );

  //always
  if ( count($ts) == 0 )
  {
      $optinrev_play = 1;
      optinrev_delete_cookie( array( 'optinrev_visited_once', 'optinrev_session_browser' ) );
      optinrev_visited_ip();

  } else {

      if ( $ts[0] == 'show_always' )
      {
        $optinrev_play = 1;
        optinrev_delete_cookie( array( 'optinrev_visited_once', 'optinrev_session_browser' ) );
        optinrev_visited_ip();
        add_action( 'init', 'optinrev_visited_ip' );
      }
      else if ( $ts[0] == 'show_once_in' )
      {         
        //restricted days
        $dates = array();
        for($current = date('Y-m-d', $ts[2]); $current != date('Y-m-d', $ts[3] ); $current = date('Y-m-d', strtotime("$current +1 day"))) {
        $dates[] = $current;
        }
        $dates[] = date('Y-m-d', $ts[3] );

        if ( !isset($_COOKIE['optinrev_visited_once']) ) {
            $optinrev_play = 1;
            optinrev_delete_cookie( array( 'optinrev_visited_ip', 'optinrev_session_browser' ) );
        }

        if ( in_array( date('Y-m-d') , $dates) ) {
            optinrev_delete_cookie( array( 'optinrev_visited_ip', 'optinrev_session_browser' ) );                        
        }

        } else {
        
            //session per browser
            if ( !isset( $_COOKIE['optinrev_session_browser'] ) ) {
                $optinrev_play = 1;
                optinrev_delete_cookie( array( 'optinrev_visited_once', 'optinrev_visited_ip' ) );                
                } else {
                @setcookie( 'optinrev_session_browser', $_SERVER['REQUEST_URI'], 0, COOKIEPATH, COOKIE_DOMAIN, false );
            }
        
      }
    }
}

add_action( 'init', 'optinrev_modal_wphead' );

function optinrev_wphead() {
  global $wp_version, $optinrev_play;

  @define( 'DONOTCACHEPAGE', 1 );

  //optinrev_popup_enabled
  
  if ( !optinrev_is_ie() && optinrev_is_mobile() ) return false;
  if ( !optinrev_getbool( 'optinrev_popup_enabled' ) ) return false;

  //default
  $optin_id = 1;

  //is popup enabled
  if ( !optinrev_getbool( 'optinrev_optinrevolution/optin1_enabled' ) ) return false;

  //optin popup
  $optin = optinrev_get( 'optinrevolution/optin' . $optin_id );

  if ( empty($optin) ) return;

  $optin = unserialize( $optin );
  $dir = plugin_dir_url( __FILE__ );

  $content = preg_replace("/'/","\'",preg_replace('/\s+/', ' ',stripcslashes($optin['optinrev_data'])));
  
  $modal_delay = (isset($optin['optinrev_delay']))?$optin['optinrev_delay']:0;  

  $round_corner = (isset($optin['optinrev_border_radius']))?$optin['optinrev_border_radius']:0;
  
  $validate = '{}';
  if ( isset( $optin['optinrev_femail_validate'] ) && $optin['optinrev_femail_validate'] == 'on' ) {
  $validate = '{email:1}';
  }
  
  //Wysija
  $wysija_msg = '';
  $wysija_id = '';
  if ( isset($optin['wysija_list_id']) && $wysija_list_id = $optin['wysija_list_id'] )
  {
    $wysija_msg = 'You\'ve successfully subscribed. Check your inbox now to confirm your subscription.';
    $wysija_id = $wysija_list_id; 
  }   
  
  $optinrev_visited_once = 0;
  
  $show_time = optinrev_get('optinrev_show_popup');   
  $ts = explode( '|', $show_time );
  $show_time = $ts[0];  
  
  if ( $ts[0] == 'show_once_in' ) {
  $optinrev_visited_once = $ts[1];
  }

  $optinrev_ctcurl = ( isset($optin['optinrev_ctcurl']) && $optin['optinrev_foptin_active']=='constantcontact') ? $optin['optinrev_ctcurl'] : '';
  
  //Load inline
  $js = '<script type="text/javascript" src="'. $dir .'js/jquery.simplemodal.js"></script>';
  $js .= '<script type="text/javascript" src="'. $dir .'js/optinrev-utils.js"></script>';
  $js .= '<script type="text/javascript" src="'. $dir .'js/optinrev-showonload.js?t='. time() .'"></script>';
  echo '<script type="text/javascript">/* <![CDATA[ */var purl="'. $dir .'", _0a38277f56e2d868e6088d7345f218f7 = document.createElement(\'div\'), ch = jQuery(window).height(), exh = 30, _0a38277f56e2d868e6088d7345f218f7 = jQuery(_0a38277f56e2d868e6088d7345f218f7).html(\''. $content .'\'), tshow = "'. $optinrev_play .'", isvalid = '. $validate .', mail_form_name = \''.$optin['optinrev_foptin_active'].'\',optinrev_close_button_class = \''. $optin['optinrev_close_button_class'].'\', optinrev_top_margin = '.$optin['optinrev_top_margin'].',optinrev_wbg_opacity = '.$optin['optinrev_wbg_opacity'].', modal_delay = '. $modal_delay .', box_started = 0, rnd='.$round_corner.',optinrev_visited_once='.$optinrev_visited_once.', optinrev_show_time="'. $show_time .'", optinrev_isie="'. optinrev_ie_version() .'", optinrev_wysija_id="'. $wysija_id .'" ,optinrev_wysija_msg="'. $wysija_msg .'", optinrev_ctcurl="'. $optinrev_ctcurl .'";/* ]]> */</script>'.$js;
}

  add_action( 'wp_head', 'optinrev_wphead' );
  add_action('wp_ajax_optinrev_action', 'optinrev_action_callback');

  //WP CSS
  if ( ! function_exists('optinrev_mce_css') )
  {
  	function optinrev_mce_css($wp) {
      global $plugin_page;
      $dir = plugin_dir_url( __FILE__ );
  		$wp = $dir . 'optinrev-css.php?popup=' . $plugin_page;
  	  return $wp;
  	}
  }

  if ( is_optinrev() )
  add_filter( 'mce_css', 'optinrev_mce_css' );

  //TINYMCE
  function optinrev_mce_before_init( $in )
  {    
   $in['theme']= "advanced";
   $in['elements'] = "optinrev_excerpt";
   $in['mode'] = "exact";
   $in['cleanup'] = true;
   $in['plugins'] = 'textedit,inlinepopups,layer,textbox,input_align,ifdragedit,object_align,text_align';
   $in['wpautop'] = true;
   $in['apply_source_formatting']=false;
   $in['theme_advanced_buttons1']='textedit,|,moveforward,movebackward,|,textbox,|,text_align_left,text_align_center,text_align_justify,text_align_right,|,input_align_left,input_align_top,|,object_align_top,object_align_bottom,object_align_center,object_align_left,object_align_right,|,undo,redo,ifdragedit,ifdragedithelp';
   $in['theme_advanced_buttons2']='';
   $in['theme_advanced_buttons3']='';
   $in['theme_advanced_buttons4']='';
   $in['theme_advanced_resizing']=false;
   $in['invalid_elements'] = 'p';
   $in['force_br_newlines'] = true;
   $in['force_p_newlines'] = false;
   $in['forced_root_block'] = '';
   $in['setup'] = 'wtfn.tinymce';
   $in['handle_event_callback'] = 'wtfn.tinymce_event';
   return $in;
  }

  if (is_optinrev())
  add_filter('tiny_mce_before_init', 'optinrev_mce_before_init');

  function optinrev_mce_addbuttons()
  {
    if ( ! current_user_can('edit_posts') && ! current_user_can('edit_pages') )
    return;

    if ( get_user_option('rich_editing') == 'true') {
    add_filter("mce_external_plugins", "optinrev_mce_plugin");
    }
  }

  function optinrev_mce_plugin( $plugin )
  {
    $dir = plugin_dir_url( __FILE__ );
    $plugin['layer'] = $dir . 'js/mce_layer.js';
    $plugin['textbox'] = $dir . 'js/mce_textbox.js';
    $plugin['input_align'] = $dir . 'js/mce_inputalign.js';
    $plugin['ifdragedit'] = $dir . 'js/mce_ifdragedit.js';
    $plugin['object_align'] = $dir . 'js/mce_objectalign.js';
    $plugin['textedit'] = $dir . 'js/textedit/editor_plugin.js';
    $plugin['text_align'] = $dir . 'js/mce_textalign.js';    

    return $plugin;
  }

  if ( is_optinrev() )
  add_action('init', 'optinrev_mce_addbuttons');

  function optinrev_media_column( $posts_columns ) {
	$posts_columns['optinrev_media'] = _x('Optin Revolution', 'column name');
	return $posts_columns;
  }
  add_filter( 'manage_media_columns', 'optinrev_media_column' );

  function optinrev_manage_attachment_media_column( $column_name, $id ) {
  	switch( $column_name ) {
  	case 'optinrev_media':
    $ac_id = 'action_button_' . $id;
    $stg_id = 'stage_img_' . $id;
    $img = optinrev_get_media($id);
    $imgurl = parse_url($img->guid);

    $cr_btn = optinrev_get_action_button();

    $is_action_button = ( isset($cr_btn->ID) && $cr_btn->ID == $id ) ? 'checked="true"' : '';
    $is_stage_image = (optinrev_has_optinmedia( $id, 'stage_img')) ? 'checked="true"' : '';

    echo '<div>          
          <a href="javascript:;" title="Changed action button in the stage." onclick="wtfnm.action_update_button(\''.$ac_id.'\',\''.$imgurl['path'].'\');">Action Button</a>&nbsp;<span id="'.$ac_id.'_msg" class="optrmsg"></span><br />
          <a href="javascript:;" title="Attach this image in the stage." onclick="wtfnm.action_add_image(\''.$stg_id.'\');">Attach to Stage&nbsp;<span id="'.$stg_id.'_msg" class="optrmsg"></span></div>';
  	break;
  	default:
  	break;
  	}
  }
	add_action('manage_media_custom_column', 'optinrev_manage_attachment_media_column', 10, 2);

  if ( is_admin() ) {
  if ( strstr( $_SERVER['SCRIPT_NAME'], 'wp-admin/upload.php' ) ) {
  function optinrev_media_js() {
  wp_enqueue_script( 'optinrev_mediajs', plugin_dir_url( __FILE__ ) . 'js/optinrev-media.js' );
  }
  add_action( 'admin_init', 'optinrev_media_js' );
  }
  }
?>
