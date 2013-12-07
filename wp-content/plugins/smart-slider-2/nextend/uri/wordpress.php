<?php

class NextendUri extends NextendUriAbstract{
    
    function NextendUri(){
        $this->_baseuri = WP_CONTENT_URL;
        if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off') {
            $this->_baseuri = str_replace('http://', 'https://', $this->_baseuri);
        }
    }
    
    static function ajaxUri($query = ''){
        return site_url('/wp-admin/admin-ajax.php?action='.$query);
    }
}