<?php

nextendimport('nextend.mvc.model');
nextendimport('nextend.database.database');

class NextendSmartsliderAdminModelSettings extends NextendModel {

    function form($xml) {

        $css = NextendCss::getInstance();
        $js = NextendJavascript::getInstance();

        $css->addCssLibraryFile('common.css');
        $css->addCssLibraryFile('window.css');
        $css->addCssLibraryFile('configurator.css');

        $configurationXmlFile = dirname(__FILE__) . '/forms/settings/' . $xml . '.xml';
        $js->loadLibrary('dojo');

        nextendimport('nextend.form.form');
        $form = new NextendForm();

        switch ($xml) {
            case 'layout':
                $form->loadArray(NextendSmartSliderLayoutSettings::getAll());
                break;
            case 'font':
                $form->loadArray(NextendSmartSliderFontSettings::getAll(NextendRequest::getInt('sliderid')));
                break;
            case 'joomla':
                $form->loadArray(NextendSmartSliderJoomlaSettings::getAll());
                break;
            default:
                $form->loadArray(NextendSmartSliderSettings::getAll());
                break;
        }

        $form->loadXMLFile($configurationXmlFile);
        echo $form->render('settings');
    }

    function save() {
        $namespace = NextendRequest::getCmd('namespace', 'default');
        if (isset($_REQUEST['namespace']) && isset($_REQUEST['settings'])) {
            if ($namespace == 'default')
                $namespace = 'settings';
            if($namespace == 'font' && NextendRequest::getInt('sliderid')) $namespace.= NextendRequest::getInt('sliderid');
            NextendSmartSliderStorage::set($namespace, json_encode($_REQUEST['settings']));
        }
    }

    function loadglobalfonts($sliderid) {
        $this->clearfonts($sliderid);
        if($sliderid) NextendSmartSliderStorage::set('font'.$sliderid, NextendSmartSliderStorage::get('font'));
        return true;
    }

    function clearfonts($sliderid) {
        if($sliderid) NextendSmartSliderStorage::delete('font'.$sliderid);
        return true;
    }

}