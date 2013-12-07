<?php

class plgNextendSliderGeneratorImageFromFolder extends NextendPluginBase {

    var $_group = 'imagefromfolder';

    function onNextendSliderGeneratorList(&$group, &$list) {
        $group[$this->_group] = 'Image';

        if (!isset($list[$this->_group])) $list[$this->_group] = array();
        $list[$this->_group][$this->_group . '_fromfolder'] = array('From folder', $this->getPath() . 'fromfolder' . DIRECTORY_SEPARATOR);
    }

    function getPath() {
        return dirname(__FILE__) . DIRECTORY_SEPARATOR;
    }
}

NextendPlugin::addPlugin('nextendslidergenerator', 'plgNextendSliderGeneratorImageFromFolder');