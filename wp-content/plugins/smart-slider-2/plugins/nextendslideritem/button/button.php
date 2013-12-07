<?php

nextendimportsmartslider2('nextend.smartslider.plugin.slideritem');

class plgNextendSliderItemButton extends plgNextendSliderItemAbstract {
    
    var $_identifier = 'button';
    
    var $_title = 'Button';
    
    function getTemplate(){
        return "
<div class='nextend-smartslider-button-{buttonclass}-container {fontclass}' style='cursor:pointer; width: 100%;'>
    <a href='{url}' onclick='if(this.getAttribute(\'href\') == \'#\') return false;'  target='{target}' style='display: block;' class='nextend-smartslider-button-{buttonclass} {class}' >
      {content}
    </a>
</div>
<style type=\"text/css\">
    div#{{id}} div.nextend-smartslider-button-{buttonclass}-container a.nextend-smartslider-button-{buttonclass}{
        {css}
    }
    
    div#{{id}} div.nextend-smartslider-button-{buttonclass}-container a.nextend-smartslider-button-{buttonclass}:HOVER,
    div#{{id}} div.nextend-smartslider-button-{buttonclass}-container a.nextend-smartslider-button-{buttonclass}:FOCUS,
    div#{{id}} div.nextend-smartslider-button-{buttonclass}-container a.nextend-smartslider-button-{buttonclass}:ACTIVE{
        {csshover}
    }
</style>
        ";
    }
    
    function getValues(){
        return array(        
            'class' => '',            
            'link' => '#|*|_self',
            'url' => '',
            'target' => '_self',
            'content' => 'Button',
            'fontclass' => 'sliderfont11',
            'css' => 'padding: 8px 10px;
box-shadow: 0 1px 1px RGBA(0,0,0,0.2);
text-transform: uppercase;
-webkit-border-radius: 2px;
-moz-border-radius: 2px;
border-radius: 2px;
background: #2381e2;
-webkit-transition: all 0.4s ease-out 0s;
-moz-transition: all 0.4s ease-out 0s;
-ms-transition: all 0.4s ease-out 0s;
-o-transition: all 0.4s ease-out 0s;
transition: all 0.4s ease-out 0s;',
            'csshover' => 'background: #1e70c5;
-webkit-border-radius: 25px;
-moz-border-radius: 25px;
border-radius: 25px;',
            'buttonclass' => 'blue-transition-rounded-button',
            'skins' => '',
            'skin' => ''
        );
    }
    
    function getPath(){
        return dirname(__FILE__).DIRECTORY_SEPARATOR.$this->_identifier.DIRECTORY_SEPARATOR;
    } 
}

NextendPlugin::addPlugin('nextendslideritem', 'plgNextendSliderItemButton');