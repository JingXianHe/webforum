<?php

class NextendSmartsliderAdminViewSliders_Settings extends NextendView {

    var $xml = 'default';

    function layoutAction($tpl) {
        $this->xml = 'layout';
        $this->render($tpl);
    }

    function fontAction($tpl) {
        $this->xml = 'font';        
        $this->render('font');
    }

    function joomlaAction($tpl) {
        $this->xml = 'joomla';
        $this->render($tpl);
    }

}
