<?php
nextendimport('nextend.form.element.list');

class NextendElementFontmatrix extends NextendElementHidden {
    
    var $_tooltip = true;
    
    function fetchElement() {
        
        $css = NextendCss::getInstance();
        $css->addCssLibraryFile('element/subform.css');
        $html = "<div class='nextend-subform ".$this->_form->get('class','')."' style='".NextendXmlGetAttribute($this->_xml, 'style')."'>";
        
        $this->_value = $this->_form->get($this->_name, $this->_default);
        
        
        $html.= parent::fetchElement();
        
        $js = NextendJavascript::getInstance();
            
        $js->addLibraryJsLibraryFile('dojo', 'dojo/window.js');
        $js->addLibraryJsAssetsFile('dojo', 'window.js');
        
        $js->addLibraryJs('dojo', '
            
            var a = new NextendWindow({
              button: dojo.byId("'.$this->_id.'nextend-'.$this->_name.'-button"),
              node: dojo.byId("'.$this->_id.'nextend-'.$this->_name.'-lightbox"),
              save: dojo.byId("'.$this->_id.'nextend-'.$this->_name.'-save")
            });
        ');
        
        $html.= '<div id="'.$this->_id.'nextend-'.$this->_name.'-lightbox" class="gk_hack nextend-window">';
        $html.= '<div class="gk_hack nextend-window-container">';
        $html.= '<div class="gk_hack nextend-topbar"><div class="gk_hack nextend-topbar-logo"></div>';
        
        $manual = $this->_form->get('manual');
        if($manual != ""){
          $html.= '<a href="'.$manual.'" target="_blank" class="gk_hack nextend-topbar-button nextend-topbar-manual">Manual</a>';
        }
        
        $support = $this->_form->get('support');
        if($support != ""){
          $html.= '<a href="'.$support.'" target="_blank" class="gk_hack nextend-topbar-button nextend-topbar-support">Support</a>';
        }

        $html.= '<div id="'.$this->_id.'nextend-'.$this->_name.'-save" class="nextend-window-save"><div class="NextendWindowSave">APPLY</div></div>';
        $html.= '</div>';
        
        $html.= '<div class="gk_hack nextend-window-container-inner">';
        
        $html.= '<fieldset id="nextend-'.$this->_name.'-panels" class="gk_hack panelform">';
        $html.= '<div id="nextend-'.$this->_name.'-panel" class="gk_hack pane-sliders">';
        
        $html.= $this->renderForm();
        
        $html.= '</div>';
        $html.= '</fieldset>';
        $html.= '</div>';
        
        $html.= '</div>';
        $html.= '</div>';
            
        $html.= '<a id="'.$this->_id.'nextend-'.$this->_name.'-button" class="nextend-configurator-button" href="#">Configure</a>';
        $html.= '</div>';
        return $html;
    }
    
    function getOptions(){
        return NextendFilesystem::folders($this->getSubFormfolder(''));
    }
    
    function initAjax($control_name){
        $this->control_name = $control_name;
        $this->_default = '';
        $this->_name = NextendXmlGetAttribute($this->_xml, 'name');
        $this->_id = $this->generateId($control_name . $this->_name);
        $this->_inputname = $control_name . '[' . $this->_name . ']';
    }
    
    function renderForm(){        
        $file = NextendXmlGetAttribute($this->_xml, 'file');
        
        $form = new NextendForm();
        $form->_data = &$this->_form->_data;
        
        $this->_value = $this->_form->get($this->_name, $this->_default);
        $form->setXML($this->_xml);
        
        ob_start();
        $form->render($this->control_name);
        return ob_get_clean();
    }
    
    function getSubFormfolder($value){
        if($value != '') $value.=DIRECTORY_SEPARATOR;
        return $this->_form->_root.NextendXmlGetAttribute($this->_xml, 'folder').DIRECTORY_SEPARATOR.$value;
    }
}