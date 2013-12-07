<?php

nextendimport('nextend.mvc.model');

class NextendSmartsliderAdminModelLayer extends NextendModel {

    function renderForm($data = array()) {

        $css = NextendCss::getInstance();
        $js = NextendJavascript::getInstance();

        $css->addCssLibraryFile('common.css');
        $css->addCssLibraryFile('window.css');
        $css->addCssLibraryFile('configurator.css');

        $configurationXmlFile = dirname(__FILE__) . '/forms/layer.xml';
        $js->loadLibrary('dojo');

        nextendimport('nextend.form.form');
        $form = new NextendForm();
        $form->loadArray($data);

        $form->loadXMLFile($configurationXmlFile);

        echo $form->render('layer');
    }
}

?>