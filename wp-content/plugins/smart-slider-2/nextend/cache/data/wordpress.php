<?php

class NextendCacheData extends NextendCacheDataAbstract {

    // $time in minutes
    function cache($group = '', $time = 1440, $callable = null, $params = null) {
        $hash = 'ss2_'.md5($group.json_encode($callable).json_encode($params));
        
        if ( false === ( $data = get_transient( $hash ) ) ) {
            if (!is_array($params)){
                $params = !empty($params) ? array(&$params) : array();
            }
            $data = call_user_func_array($callable, $params);
            set_transient($hash, $data, $time * 60);
        }        
        return $data;
    }
}