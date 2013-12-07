<?php
nextendimport('nextend.form.element.hidden');

class NextendElementList extends NextendElementHidden {
    
    var $_tooltip = true;
    
    var $_translateable = false;
    
    function fetchElement() {
        
        $js = NextendJavascript::getInstance();
        $js->addLibraryJsAssetsFile('dojo', 'element.js');
        $js->addLibraryJsAssetsFile('dojo', 'element/list.js');
        $this->_value = $this->_form->get($this->_name, $this->_default);
        $this->_values = explode('||', $this->_value);
        if(!is_array($this->_values)){
            $this->_values = array();
        }
        $this->_multiple = intval(NextendXmlGetAttribute($this->_xml, 'multiple'));
        
        $this->_translateable = intval(NextendXmlGetAttribute($this->_xml, 'translateable'));
        
        $size = NextendXmlGetAttribute($this->_xml, 'size');
        if($size != '') $size = " size='".$size."'";
        
        
        $html = "<div class='nextend-list' style='".NextendXmlGetAttribute($this->_xml, 'style')."'>";
        $html.= "<select id='" . $this->_id . "_select' class='nextend-select' name='select" . $this->_inputname . "' ".$size.$this->isMultiple()." style='font-family:Arial !important;'  autocomplete='off'>";
        $html.= $this->generateOptions($this->_xml);
        if($this->_xml->optgroup){
            $html.= $this->generateOptgroup($this->_xml);
        }
        $html.= "</select>";
        $html.= "</div>";
        
        $html.= parent::fetchElement();
        
        $js->addLibraryJs('dojo', '
            new NextendElementList({
              hidden: "' . $this->_id . '",
              multiple: '.$this->_multiple.',
              value: "'.$this->_value.'"
            });
        ');
        
        return $html;
    }
    
    function generateOptgroup(&$xml){
        $html = '';
        foreach($xml->optgroup AS $optgroup){
            $label = NextendXmlGetAttribute($optgroup, 'label');
            $html.="<optgroup label='".NextendText::_($label)."'>";
            $html.= $this->generateOptions($optgroup);
            $html.="</optgroup>";
        }
        return $html;
    }
    
    function generateOptions(&$xml){
        $html = '';
        foreach($xml->option AS $option){
            $v = NextendXmlGetAttribute($option, 'value');
            $html.= '<option value="'.$v.'" '.$this->isSelected($v).'>' .($this->_translateable ? NextendText::_((string)$option) : ((string)$option)).'</option>';
        }
        return $html;
    }
    
    function isSelected($value){
        if(in_array($value, $this->_values)){
            return ' selected="selected"';
        }
        return '';
    }
    
    function isMultiple(){
        if($this->_multiple) return ' multiple="multiple" class="nextend-element-hastip" title="<b>For windows</b>: Hold down the control (ctrl) button to select multiple options<br><b>For Mac</b>: Hold down the command button to select multiple options" ';
        return '';
    }
}