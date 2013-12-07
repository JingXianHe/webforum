<?php

nextendimportsmartslider2('nextend.smartslider.plugin.slideritem');

class plgNextendSliderItemImage extends plgNextendSliderItemAbstract {

    var $_identifier = 'image';

    var $_title = 'Image - full';

    function getTemplate() {
        return "
          <div>
              Only in full version!
          </div>
        ";
    }

    function getValues() {
        return array(
            'image' => NextendSmartSliderSettings::get('placeholder'),
            'size' => 'auto|*|',
            'link' => '#|*|_self',
            'url' => '',
            'target' => '_self',
            'width' => 'auto',
            'height' => 'auto',
            'css' => '',
            'alt' => 'Image not available',
            'onclick' => ''
        );
    }

    function getPath() {
        return dirname(__FILE__) . DIRECTORY_SEPARATOR . $this->_identifier . DIRECTORY_SEPARATOR;
    }
}

NextendPlugin::addPlugin('nextendslideritem', 'plgNextendSliderItemImage');