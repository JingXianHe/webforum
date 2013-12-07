<?php

nextendimportsmartslider2('nextend.smartslider.plugin.slideritem');

class plgNextendSliderItemHeading extends plgNextendSliderItemAbstract {

    var $_identifier = 'heading';
    var $_title = 'Heading';

    function getTemplate() {
        return "
            <h{priority} class='{fontclass} {class}' style='{fontsizer}{fontcolorr}{css}'>
                <a href='{url}' target='{target}' style='{fontcolorr}'>
                  {heading}
                </a>
            </h{priority}>
        ";
    }

    function getValues() {
        return array(
            'fontsizer' => '',
            'fontcolorr' => '',
            'priority' => '1',
            'heading' => 'Heading',
            'link' => '#|*|_self',
            'url' => '',
            'target' => '_self',
            'fontclass' => 'sliderfont2',
            'class' => '',
            'css' => 'padding: 0;
                      margin: 0;
                      background: none;
                      box-shadow: none;'
        );
    }

    function getPath() {
        return dirname(__FILE__) . DIRECTORY_SEPARATOR . $this->_identifier . DIRECTORY_SEPARATOR;
    }

}

NextendPlugin::addPlugin('nextendslideritem', 'plgNextendSliderItemHeading');