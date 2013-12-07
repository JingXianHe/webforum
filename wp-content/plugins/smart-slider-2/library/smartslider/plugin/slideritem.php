<?php

class plgNextendSliderItemAbstract extends NextendPluginBase {
    
    var $_identifier = 'identifier';
    
    var $_title = 'Title';
    
    function onNextendSliderItemList(&$list){
        $list[$this->_identifier] = array($this->_title, $this->getTemplate(), $this->getPrefilledTemplate(), json_encode($this->getValues()), $this->getPath());
    }
    
    /*
     * Here comes the HTML source of the item. {param_name} are identifier for the parameters in the configuration.xml params(linked with the parameter name).
     * Parser.js may define custom variables for this.
     */
    function getTemplate(){
        return "{nothing}";
    }
    
    /*
     * Set default values into the template
     */
    function getPrefilledTemplate(){
        $html = $this->getTemplate();
        foreach($this->getValues() AS $k => $v){
            $html = str_replace('{'.$k.'}',$v,$html);
        }
        return $html;
    }
    
    /*
     * Default values, which are the same which available for the getTemplate method's template.
     */
    function getValues(){
        return array(
            'nothing' => 'Abstract'
        );
    }
    
    function getPath(){
        return dirname(__FILE__).DIRECTORY_SEPARATOR.self::$_identifier.DIRECTORY_SEPARATOR;
    }  
}