<?php

global $nextend_head, $nextend_body;

$nextend_head = '';
$nextend_body = '';

if (!defined('NEXTENDLIBRARY')) {
    require_once(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'library.php');

    nextendimport('nextend.wordpress.settings');
    
    add_action('wp_footer', 'nextend_generate');
    add_action('admin_footer', 'nextend_generate');
    function nextend_generate() {
        global $nextend_head, $nextend_body;
        if (class_exists('NextendCss', false) || class_exists('NextendJavascript', false)) {
            ob_start();
              $css = NextendCss::getInstance();
              $css->generateCSS();
              echo '<script type="text/javascript">
(function (w, d, u) {
    if(w.njQuery === u){
        w.bindNextendQ = [];
    
        function pushToReady(x) {
            w.bindNextendQ.push([alias.handler,"ready", x]);
        }
        
        function pushToLoad(x) {
            w.bindNextendQ.push([alias.handler,"load", x]);
        }

        var alias = {
            handler: w,
            ready: pushToReady,
            load: pushToLoad
        }

        w.njQuery = function (handler) {
            alias.handler = handler;
            return alias;
        }
    }
})(window, document);
              </script>';
            $nextend_head = ob_get_clean();
            
            ob_start();
            $js = NextendJavascript::getInstance();
            $js->generateJs();
            $nextend_body = ob_get_clean();
        }
        if(getNextend('safemode', 0)) echo $nextend_head.$nextend_body;
        return true;
    }
    
    function nextend_render_end($buffer){
        global $nextend_head, $nextend_body;
        if($nextend_head != ''){
            $buffer = preg_replace('/<\/head>/', $nextend_head.'</head>', $buffer, 1);
        }
        if($nextend_body != ''){
            $buffer = preg_replace('/<\/body>/', $nextend_body.'</body>', $buffer, 1);
        }
        return $buffer;
    }
    
    if(is_admin()){
        add_action('admin_init', 'nextend_wp_loaded', 3000);
    }else{
        add_action('wp', 'nextend_wp_loaded', 3000); // fix for gzip ob_starts
    }
    function nextend_wp_loaded() {
        setNextend('safemode', 0);
        if(!getNextend('safemode', 0)){
            ob_start("nextend_render_end");
            ob_start();
        }
    }
}
?>
