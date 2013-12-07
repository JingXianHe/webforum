<?php
nextendimport('nextend.form.tab');

class NextendTabTabbed extends NextendTab {

    var $_tabs;
    
    function NextendTabTabbed(&$form, &$xml) {
        $css = NextendCss::getInstance();
        $css->addCssLibraryFile('tabs/tabbed.css');
        parent::NextendTab($form, $xml);
    }
    
    function initTabs() {
        if (count($this->_tabs) == 0) {
            foreach($this->_xml->params as $tab) {
                $type = NextendXmlGetAttribute($tab, 'type');
                if($type == '') $type = 'default';
                nextendimport('nextend.form.tabs.'.$type);
                $class = 'NextendTab' . ucfirst($type);
                
                $this->_tabs[NextendXmlGetAttribute($tab, 'name') ] = new $class($this->_form, $tab);
            }
        }
    }
    
    function render($control_name) {
        $this->initTabs();
        $count = count($this->_tabs);
        $id = 'nextend-tabbed-'.$this->_name;
        $active = intval(NextendXmlGetAttribute($this->_xml, 'active'));
        $active = $active > 0 ? $active-1 : 0;
        echo "<div class='nextend-tab nextend-tab-tabbed clearfix'>";
        
        echo '<div class="smartslider-greybar smartslider-button-grey">';
        $i = 0;
        foreach($this->_tabs AS $tabname => $tab) {
            echo '<div onclick="njQuery(this).parent().children().removeClass(\'active\');njQuery(this).addClass(\'active\');njQuery(\'#'.$id.'\').css(\'marginLeft\', \''.(-$i*100).'%\')" class="smartslider-toolbar-options smartslider-button-grey'.($i == $active ? ' active' : '').($i == 0 ? ' first' : '').($i == $count-1 ? ' last' : '').'"><div>'.NextendXmlGetAttribute($tab->_xml, 'label').'</div></div>';
            $i++;
        }
        echo '</div>';
        
            echo "<div id='".$id."' class='nextend-tab-tabbed-panes clearfix' style='width: ".($count*100)."%; margin-left: ".(-$active*100)."%;'>";
            foreach($this->_tabs AS $tabname => $tab) {
                echo "<div class='nextend-tab-tabbed-pane' style='width: ".(100/$count)."%;'>";
                $tab->render($control_name);
                echo "</div>";
            }
            echo "</div>";
        echo "</div>";
    }
}