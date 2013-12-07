<?php
if(NEXTEND_SMART_SLIDER2_BASE == 'nextend-smart-slider2-full'){
    // Take over the update check
    add_filter('pre_set_site_transient_update_plugins', 'nextend_smart_slider2_check_for_plugin_update');
    
    function nextend_smart_slider2_check_for_plugin_update($checked_data) {
      static $response = null;
    	global $nextend_smart_slider2_api_url, $nextend_smart_slider2_plugin_slug, $wp_version;
      unset($checked_data->response[ $nextend_smart_slider2_plugin_slug .'/'. $nextend_smart_slider2_plugin_slug .'.php' ]);
    	if (empty($checked_data->checked))
    	   	return $checked_data;
      $plugins = get_plugins();
    	$plugin = $plugins[$nextend_smart_slider2_plugin_slug .'/'. $nextend_smart_slider2_plugin_slug .'.php'];
    	
    	$args = array(
    		'slug' => $nextend_smart_slider2_plugin_slug,
    		'version' => $plugin['Version'],
    	);
    	$request_string = array(
    			'body' => array(
    				'action' => 'basic_check', 
    				'request' => serialize($args),
    				'api-key' => md5(get_bloginfo('url')),
            'license' => get_option('nextend_smart_slider2_license', '')
    			),
    			'user-agent' => 'WordPress/' . $wp_version . '; ' . get_bloginfo('url')
    		);
    	
      if($response === null){
          $response = $raw_response = wp_remote_post($nextend_smart_slider2_api_url, $request_string);
      }else{
          $raw_response = $response;
      }
      
      
    	if (!is_object($response) && !is_wp_error($raw_response) && ($raw_response['response']['code'] == 200))
    		$response = unserialize($raw_response['body']);
    	if (is_object($response) && !empty($response)) // Feed the update data into WP updater
    		$checked_data->response[$nextend_smart_slider2_plugin_slug .'/'. $nextend_smart_slider2_plugin_slug .'.php'] = $response;
    	return $checked_data;
    }
    
    
    // Take over the Plugin info screen
    add_filter('plugins_api', 'nextend_smart_slider2_plugin_api_call', 10, 3);
    
    function nextend_smart_slider2_plugin_api_call($def, $action, $args) {
    	global $nextend_smart_slider2_plugin_slug, $nextend_smart_slider2_api_url, $wp_version;
    	if (!isset($args->slug) || ($args->slug != $nextend_smart_slider2_plugin_slug))
    		return $def;
    	
    	// Get the current version
    	$plugin_info = get_site_transient('update_plugins');
    	$current_version = $plugin_info->checked[$nextend_smart_slider2_plugin_slug .'/'. $nextend_smart_slider2_plugin_slug .'.php'];
    	$args->version = $current_version;
    	
    	$request_string = array(
    			'body' => array(
    				'action' => $action, 
    				'request' => serialize($args),
    				'api-key' => md5(get_bloginfo('url')),
            'license' => get_option('nextend_smart_slider2_license', '')
    			),
    			'user-agent' => 'WordPress/' . $wp_version . '; ' . get_bloginfo('url')
    		);
    	
    	$request = wp_remote_post($nextend_smart_slider2_api_url, $request_string);
    	
    	if (is_wp_error($request)) {
    		$res = new WP_Error('plugins_api_failed', __('An Unexpected HTTP Error occurred during the API request.</p> <p><a href="?" onclick="document.location.reload(); return false;">Try again</a>'), $request->get_error_message());
    	} else {
    		$res = unserialize($request['body']);
    		if ($res === false)
    			$res = new WP_Error('plugins_api_failed', __('An unknown error occurred'), $request['body']);
    	}
    	return $res;
    }


    add_action('admin_menu', 'nextend_smart_slider2_update_page');
    
    function nextend_smart_slider2_update_page() {
    	add_submenu_page('nextend-smart-slider2', 'Nextend Smart Slider 2 License', 'License', 'manage_options', __FILE__, 'nextend_smart_slider2_settings_page');
    }
    
    function nextend_smart_slider2_settings_page() {
    ?>
    <div>
    <h2>Nextend Smart Slider 2</h2>
    <?php
      if(isset($_POST['nextend_smart_slider2_license'])){
          $_POST['nextend_smart_slider2_license'] = trim($_POST['nextend_smart_slider2_license']);
          if(base64_encode(base64_decode($_POST['nextend_smart_slider2_license'])) === $_POST['nextend_smart_slider2_license']){
              update_option('nextend_smart_slider2_license', $_POST['nextend_smart_slider2_license']);
          }else{
             echo '<div class="error"><strong><p>The validity of license key failed</p></strong></div>';
          }
      }
    ?>
    
    <form method="post" action="<?php echo admin_url("admin.php?page=nextend-smart-slider2-full/update.php"); ?>">
    <p>If you fill out the license key field, you will be able to use the the WordPress plugin updater with Nextend Smart Slider 2.</p>
    <p>You can get your license key in the <a target="_blank" href="http://www.nextendweb.com/availabledownloads/">Download area</a> at Nextendweb.com</p>
        <table class="form-table">
            <tr valign="top">
            <th scope="row">License key</th>
            <td><input type="text" style="width: 400px;" name="nextend_smart_slider2_license" value="<?php echo get_option('nextend_smart_slider2_license', ''); ?>" /></td>
            </tr>
        </table>
        
        <?php submit_button(); ?>
    
    </form>
    </div>
    <?php 
    } 
}else{
    add_action('admin_menu', 'nextend_smart_slider2_update_page');
    
    function nextend_smart_slider2_update_page() {
    	add_submenu_page('nextend-smart-slider2', 'Nextend Smart Slider 2 License', 'Get Full', 'manage_options', __FILE__, 'nextend_smart_slider2_settings_page');
    }
    
    function nextend_smart_slider2_settings_page() {
        wp_redirect( admin_url('admin.php?page=nextend-smart-slider2&controller=sliders&view=sliders_full&action=full'), 301 );
        exit;
    }
}
