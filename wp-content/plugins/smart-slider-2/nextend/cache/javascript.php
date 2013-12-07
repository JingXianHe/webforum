<?php
nextendimport('nextend.cache.cache');

class NextendCacheJavascript extends NextendCache{
    
    var $_inline;
    
    function NextendCacheJavascript(){
        $this->_subfolder = 'js'.DIRECTORY_SEPARATOR;
        parent::NextendCache();
        $this->_filetype = 'js';
        $this->_inline = '';
        $this->_gzip = getNextend('gzip', 0);
    }
    
    function addInline($inline){
        $this->_inline.=$inline."\n";
    }
    
    function parseCached($cached){
        return $cached."\n\n".$this->_inline;
    }
    
    function parseHash($hash){
        return $hash.$this->_inline;
    }
    
    function getContentHeader(){
        return 'header("Content-type: text/javascript", true);';
    }
}