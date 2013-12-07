<?php

if(!defined('WP_ADMIN') || !is_admin()) return;

global $wpdb;

function NextendSplitSql($sql){
  $start = 0;
  $open = false;
  $char = '';
  $end = strlen($sql);
  $queries = array();

  for ($i = 0; $i < $end; $i++){
      $current = substr($sql,$i,1);
      if (($current == '"' || $current == '\'')) {
          $n = 2;

          while (substr($sql,$i - $n + 1, 1) == '\\' && $n < $i){
              $n ++;
          }

          if ($n%2==0) {
              if ($open) {
                  if ($current == $char) {
                      $open = false;
                      $char = '';
                  }
              } else {
                  $open = true;
                  $char = $current;
              }
          }
      }

      if (($current == ';' && !$open)|| $i == $end - 1) {
          $queries[] = substr($sql, $start, ($i - $start + 1));
          $start = $i + 1;
      }
  }

  return $queries;
}

if(defined('MULTISITE') && MULTISITE){
    $blogs = function_exists('wp_get_sites') ? wp_get_sites(array('network_id' => $wpdb->siteid)) : get_blog_list( 0, 'all' );
    foreach($blogs AS $blog){
        $query = str_replace('#__', $wpdb->get_blog_prefix($blog['blog_id']), file_get_contents(dirname(__FILE__).'/install.sql'));
        $queries = NextendSplitSql($query);
        foreach($queries AS $query){
            if(trim($query) != '') $wpdb->query($query);
        }
    }
}else{
    $query = str_replace('#__', $wpdb->prefix, file_get_contents(dirname(__FILE__).'/install.sql'));
    $queries = NextendSplitSql($query);
    foreach($queries AS $query){
        if(trim($query) != '') $wpdb->query($query);
    }
}

if(NEXTEND_SMART_SLIDER2_BASE == 'nextend-smart-slider2-full'){
    if(!file_exists(WP_PLUGIN_DIR.'/nextend/nextend.php')){
      include ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
      
      class nextend_smart_slider2 extends Plugin_Installer_Skin{
        	function feedback($string) {
        		if ( isset( $this->upgrader->strings[$string] ) )
        			$string = $this->upgrader->strings[$string];
        
        		if ( strpos($string, '%') !== false ) {
        			$args = func_get_args();
        			$args = array_splice($args, 1);
        			if ( !empty($args) )
        				$string = vsprintf($string, $args);
        		}
        		if ( empty($string) )
        			return;
        		echo $string;
        	}
        };
        
      	$upgrader = new Plugin_Upgrader( new nextend_smart_slider2( compact('type', 'title', 'nonce') ) );
        ob_start();
      	$result = $upgrader->install( dirname(__FILE__) . DIRECTORY_SEPARATOR . 'nextend/nextend.zip');
        if(!$result){
            echo 'Nextend library can NOT be installed automatically. Please install it manually from wp-contents/plugins/nextend-smart-slider2/nextend.zip<br />'.ob_get_clean();exit;
        }else{
            ob_end_clean();
        }
    }
    
    if(!is_plugin_active('nextend/nextend.php')){
        add_action('activated_plugin', 'nextend_smart_slider2_activated_plugin', 11, 1);
    
        function nextend_smart_slider2_run_activate_plugin( $plugin ) {
            $current = get_option( 'active_plugins', array() );
    
            $plugin = plugin_basename( trim( $plugin ) );
        
            if ( !in_array( $plugin, $current ) ) {
                $current[] = $plugin;
                sort( $current );
                do_action( 'activate_plugin', trim( $plugin ) );
                update_option( 'active_plugins', $current );
                do_action( 'activate_' . trim( $plugin ) );
                do_action( 'activated_plugin', trim( $plugin) );
            }
            return null;
        }
        function nextend_smart_slider2_activated_plugin($plugin){
            if($plugin == 'nextend-smart-slider2-full/nextend-smart-slider2-full.php'){
                nextend_smart_slider2_run_activate_plugin('nextend/nextend.php');
            }
        }
    }
}

