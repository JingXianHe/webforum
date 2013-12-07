<?php

class NextendTextAbstract2{

    static $loadedfiles = array();
    
    static $lng = 'en_GB';
    
    static $translated = array();
    
    static $untranslated = array();
    
    static $folder = '';
    
    static function l($file, $folder = null, $lng = null){
        if(!$folder) $folder = self::$folder;
        $f = $folder.($lng ? $lng : self::$lng).'/'.$file.'.ini';
        if(!isset(self::$loadedfiles[$f])){
            if(NextendFilesystem::fileexists($f)){
                self::$translated+=parse_ini_file($f);
                self::$loadedfiles[$f] = true;
            }else if($lng != 'en_GB'){
                self::$loadedfiles[$f] = false;
                self::l($file, $folder, 'en_GB');
            }
        }
    }
    
    static function _($text){
        return isset(self::$translated['NEXTEND_'.$text]) ? self::$translated['NEXTEND_'.$text] : $text;
    }
    
    static function sprintf($text){
        $args = func_get_args();
        if (count($args) > 0){
            $args[0] = NextendText::_($args[0]);
            return call_user_func_array('printf', $args);
        }
        return $text;
    }
    
    static function toIni(){
        $res = '';
        foreach(self::$untranslated as $key => $val){
            $res.= $key.' = "'.$val.'"'."\n";
        }
        echo $res;
    }
}
if(getNextend('debuglng', 0)){
    class NextendTextAbstract extends NextendTextAbstract2{
    
        static function _($text){
            if(isset(self::$translated['NEXTEND_'.$text])){
                return '•'.self::$translated['NEXTEND_'.$text].'•';
            }else{
                self::$untranslated['NEXTEND_'.preg_replace('/[^\da-z_]/i', '', preg_replace('/\s+/', '_', $text))] = $text;
                return '??'.$text.'??';
            }
        }
    }
}else{
    class NextendTextAbstract extends NextendTextAbstract2{
    
    }
}

if (nextendIsJoomla()) {
    nextendimport('nextend.language.joomla');
} elseif (nextendIsWordPress()) {
    nextendimport('nextend.language.wordpress');
}elseif (nextendIsMagento()) {
    nextendimport('nextend.language.magento');
}else{
    nextendimport('nextend.language.default');
}

NextendText::$folder = dirname(__FILE__).'/languages/';