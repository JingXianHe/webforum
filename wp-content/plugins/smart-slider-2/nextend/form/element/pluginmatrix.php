<?php
nextendimport('nextend.form.element.list');

class NextendElementPluginMatrix extends NextendElementList {
    
    var $_list = null;
    
    function fetchElement() {
        
        $css = NextendCss::getInstance();
        $css->addCssLibraryFile('element/pluginmatrix.css');
        $html = "<div id='nextend-pluginmatrix-".$this->_id."'>";
        
        $widgetTypes = $this->getOptions();
        
        $html.="<div class='nextend-pluginmatrix-views nextend-button-grey clearfix'>";
        $active = 'active ';
        foreach($widgetTypes AS $type => $v){
            $html.="<div class='".$active."nextend-button-grey nextend-button-blue-active nextend-pluginmatrix-view nextend-pluginmatrix-view-".$type."'>
                <div class='nextend-border'>";
            $html.=$v[0];
            $html.="</div></div>";
            $active = '';
        }
        $html.="</div>";
        
        $html.="<div class='nextend-pluginmatrix-panes clearfix'>";
        $active = 'active ';
        foreach($widgetTypes AS $type => $v){
            $html.="<div class='".$active."nextend-pluginmatrix-pane nextend-pluginmatrix-pane-".$type."'>";
            
            $GLOBALS['nextendbuffer'] = '';
            $form = new NextendForm();
            $form->_data = &$this->_form->_data;

            $form->loadXMLFile($v[1].'config.xml');

            ob_start();
            $form->render($this->control_name);
            $html.= ob_get_clean();
        
            $html.= $GLOBALS['nextendbuffer'];
            
            $html.="</div>";
            $active = '';
        }
        $html.="</div>";
        
        $html.="</div>";
        
        $js = NextendJavascript::getInstance();
        $js->addLibraryJs('jquery', '
            (function(){
                var parent = $("#nextend-pluginmatrix-'.$this->_id.'"),
                    views = parent.find("> .nextend-pluginmatrix-views > .nextend-pluginmatrix-view"),
                    panes = parent.find("> .nextend-pluginmatrix-panes > .nextend-pluginmatrix-pane");
                views.on("click", function(){
                    views.not(this).removeClass("active");
                    panes.removeClass("active");
                    var i = views.index(this);
                    views.eq(i).addClass("active");
                    panes.eq(i).addClass("active");
                    njQuery(window).trigger("resize");
                });
            })();
        ');
 
        return $html;
    }
    
    function getOptions(){
        if($this->_list == null){
            $this->_list = array();
            NextendPlugin::callPlugin('nextendsliderwidget', 'onNextendSliderWidgetList', array(&$this->_list));
        }
        uasort($this->_list, array($this, 'sort'));
        return $this->_list;
    }

    function sort($a, $b){
        if(!isset($a[2])) $a[2] = 10000;
        if(!isset($b[2])) $b[2] = 10000;
        return $a[2] - $b[2];
    }
}