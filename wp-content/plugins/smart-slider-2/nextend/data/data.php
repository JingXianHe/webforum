<?php
nextendimport('nextend.json.json');

class NextendData {
    
    var $_data;
    
    function NextendData() {
        
        $this->_data = array();
    }
    
    function loadJSON($json) {

        $this->_data = json_decode($json, true);
    }
    
    function loadArray($array) {
        if(is_array($array))
            $this->_data = array_merge($this->_data, $array);
    }
    
    function toJSON() {

        return json_encode($this->_data);
    }
    
    function toArray() {
        return $this->_data;
    }
    
    function get($key, $default = '') {

        if (isset($this->_data[$key])) return $this->_data[$key];
        return $default;
    }
    
    function set($key, $value) {

        $this->_data[$key] = $value;
    }
}
