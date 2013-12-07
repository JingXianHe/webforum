<?php
nextendimport('nextend.form.element.radio');

class NextendElementImagelist extends NextendElementRadio {
    
    function fetchElement() {
        $this->setfolder();
        $files = NextendFilesystem::files($this->_folder);
        $this->_xml->addChild('option', NextendText::_('No_image'))->addAttribute('value', -1);
        for($i = 0; $i < count($files); $i++){
            $ext = pathinfo($files[$i], PATHINFO_EXTENSION);
            if($ext == 'jpg' || $ext == 'jpeg' || $ext == 'png' ){
                $this->_xml->addChild('option', htmlspecialchars(ucfirst($files[$i])))->addAttribute('value', NextendFilesystem::toLinux(NextendFilesystem::pathToRelativePath($this->_folder.$files[$i])));
            }
        }
        
        if(nextendIsWordPress()){
            $wpfolder = get_template_directory().'/'.NextendXmlGetAttribute($this->_xml, 'folder').'/';
            if(isset($_GET['nextendpath'])) echo $wpfolder."<br />";
            if(NextendFilesystem::existsFolder($wpfolder)){
                $files = NextendFilesystem::files($wpfolder);
                for($i = 0; $i < count($files); $i++){
                    $ext = pathinfo($files[$i], PATHINFO_EXTENSION);
                    if($ext == 'jpg' || $ext == 'jpeg' || $ext == 'png' ){
                        $this->_xml->addChild('option', htmlspecialchars(ucfirst($files[$i])))->addAttribute('value', NextendFilesystem::toLinux(NextendFilesystem::pathToRelativePath($wpfolder.$files[$i])));
                    }
                }
            }
        }
        
        $css = NextendCss::getInstance();
        $css->addCssLibraryFile('element/imagelist.css');
        
        $html = "<div class='nextend-imagelist' style='".NextendXmlGetAttribute($this->_xml, 'style')."'>";
        $html.= parent::fetchElement();
        $html.= '</div>';
        
        return $html;
    }
    
    function generateOptions(&$xml) {

        $this->_values = array();
        $html = '';
        foreach($xml->option AS $option) {
            $v = NextendXmlGetAttribute($option, 'value');
            $this->_values[] = $v;
            if($v != -1){
                $html.= '<div class="nextend-radio-option nextend-imagelist-option' . $this->isSelected($v) . '"><img src="'.NextendUri::pathToUri($v).'" alt="'.(string)$option.'" /></div>';
            }else{
                $html.= '<div class="nextend-radio-option' . $this->isSelected($v) . '">' . ((string)$option) . '</div>';
            }
        }
        return $html;
    }
    
    function setfolder(){
        $assetsdir = NextendXmlGetAttribute($this->_xml, 'assetsdir');
        $this->_folder = str_replace(DIRECTORY_SEPARATOR, '/', (defined($assetsdir) ? constant($assetsdir) : NEXTENDLIBRARYASSETS)).NextendXmlGetAttribute($this->_xml, 'folder').'/';
    }
}
