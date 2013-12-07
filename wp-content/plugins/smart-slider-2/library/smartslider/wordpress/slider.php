<?php

nextendimportsmartslider2('nextend.smartslider.slider');
nextendimport('nextend.data.data');
nextendimport('nextend.parse.parse');

class NextendSliderWordpress extends NextendSlider{

    var $_data;
    
    var $_sliderid;

    function NextendSliderWordpress($sliderid, &$params, $path, $backend = false) {
        parent::NextendSlider($path, $backend);
        
        $this->_sliderid = $sliderid;
        
        $this->loadSlider($sliderid);
        
        $this->setTypePath();
        $this->setInstance();
    }
    
    function setInstance() {
        if($this->_backend){
            $this->_instance = 0;
        }else{
            $this->_instance = $this->_sliderid;
        }
    }

    function setTypePath() {
        $type = $this->_slider->get('type', 'default');
        
        $class = 'plgNextendSlidertype' . $type;
        if (!class_exists($class)) {
            echo 'Error in slider type!';
            return false;
        }
        $this->_typePath = call_user_func(array($class, "getPath"));
    }
}