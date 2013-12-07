<?php
nextendimport('nextend.form.element.list');

class NextendElementWordpressmenu extends NextendElementList{
    
    function fetchElement() {
        $menus = get_terms('nav_menu');
        $ids = array();
        
        for($i = 0; $i < count($menus); $i++){
            $this->_xml->addChild('option', htmlspecialchars($menus[$i]->name))->addAttribute('value', $menus[$i]->term_id);
            $ids[] = $menus[$i]->term_id;
        }
        
        $this->_value = $this->_form->get($this->_name, $this->_default);
        if(!in_array($this->_value, $ids)){
            $this->_value = $ids[0];
            $this->_form->set($this->_name, $this->_value);
            $a = explode('|*|',$this->parent->_value);
            $a[0] = $this->_value;
            $this->parent->_value = implode('|*|', $a);
        }
        
        $html = parent::fetchElement();
        
        return $html;
    }
    
}