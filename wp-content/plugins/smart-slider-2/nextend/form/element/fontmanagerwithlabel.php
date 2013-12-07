<?php
nextendimport('nextend.form.element.fontmanager');
nextendimport('nextend.form.element.hidden');

class NextendElementFontmanagerWithLabel extends NextendElementFontmanager {
    
    function fetchElement() {
        $element = new SimpleXMLElement('<param type="hidden" label="' . NextendText::_($this->_label) . '" default="' . NextendText::_($this->_label) . '" name="' . $this->_name . 'customlabel" />');
        $customlabel = new NextendElementHidden($this->_form, $this, $element);
        $h = $customlabel->render($this->control_name, false);
        return $h[1].parent::fetchElement();
    }
    
}