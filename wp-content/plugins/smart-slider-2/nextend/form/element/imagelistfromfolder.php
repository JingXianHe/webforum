<?php
nextendimport('nextend.form.element.imagelist');

class NextendElementImagelistFromfolder extends NextendElementImagelist {
    
    function setfolder(){
        $this->_folder = str_replace(DIRECTORY_SEPARATOR, '/', dirname($this->_form->_xmlfile)).'/'.NextendXmlGetAttribute($this->_xml, 'folder').'/';
    }
}
