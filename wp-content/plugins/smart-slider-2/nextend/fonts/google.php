<?php

class NextendFontsGoogle {
    
    var $_fonts;
    
    function NextendFontsGoogle() {
        $this->_fonts = '';
    }
    
    static function getInstance() {

        static $instance;
        if (!is_object($instance)) {
            $instance = new NextendFontsGoogle();
        }

        return $instance;
    }
    
    function addFont($family, $style='400', $subset='latin'){
        if(!isset($this->_fonts[$family])){
            $this->_fonts[$family] = array($style, $subset);
        }
        $this->_fonts[$family][0].=','.$style;
        $this->_fonts[$family][1].=','.$subset;
    }
    
    function generateFonts(){
        $file = $this->getFontUrl();
        if($file){
            nextendimport('nextend.css.css');
            $css = NextendCss::getInstance();
            $css->addCssFile($this->getFontUrl());
        }
    }
    
    function getFontUrl(){
        $css = NextendCss::getInstance();
        $url = 'https://fonts.googleapis.com/css?family=';
        $subset = '';
        if(count($this->_fonts)){
            foreach($this->_fonts AS $family => $font){
                $style = explode(',',$font[0]);
                $style = array_filter(array_unique($style));
                foreach($style AS $k => $s){
                    $file = NEXTENDLIBRARYASSETS.'fonts/'.preg_replace("/[^a-z0-9]/", '', strtolower($family)).'/'.$s.'/s.css';
                    if(NextendFilesystem::existsFile($file)){
                        unset($style[$k]);
                        $css->addCssFile($file, null, true);
                    }
                }
                if(count($style)){
                    $url.=$family.':'.implode(',', $style).'|';
                    $subset.= $font[1].',';
                }
            }
        }
        if($url == 'https://fonts.googleapis.com/css?family=') return '';
        $url = substr($url, 0, -1);
        $subset = explode(',',$subset);
        $subset = array_filter(array_unique($subset));
        $url.='&amp;subset='.implode(',', $subset);
        return $url;
    }
}
