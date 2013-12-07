<?php
nextendimport('nextend.data.data');

class NextendPluginBase{
    
    var $params = null;
    
    function __construct(){
        $this->params = new NextendData();
        $this->loadConfig();
    }
    
    function loadConfig(){
        $this->params->loadArray(get_option(get_class($this)));
    }
}

class NextendPlugin extends NextendPluginAbstract{

}

add_action('admin_menu', 'nextend_add_plugin_settings');

function nextend_add_plugin_settings() {
    foreach(NextendPlugin::$classes AS $groupName => $group){
        foreach($group AS $class){
            if(is_object($class)){
                $reflector = new ReflectionClass($class);
                $dir = dirname($reflector->getFileName()).'/';
                $configuration = $dir.'configuration.xml';
                if(NextendFilesystem::fileexists($configuration)){
                    add_submenu_page('nextend-smart-slider2', 'Nextend Smart Slider 2 plugin settings', ucfirst($class->_group) . ' settings', 'manage_options', 'nextend-plugin/'.$groupName.'/'.$reflector->getName(), 'nextend_plugin_configuration');
                }
            }
        }
    }
}

function nextend_plugin_configuration(){
    $page = explode('/', $_GET['page']);
    $obj = null;
    foreach(NextendPlugin::$classes[$page[1]] AS $class){
        if(is_object($class) && get_class($class) == $page[2]){
            $obj = $class;
        }
    }
    if(is_object($obj)){
        $class = get_class($obj);
        $reflector = new ReflectionClass($obj);
        $dir = dirname($reflector->getFileName()).'/';
        $configurationXmlFile = $dir.'configuration.xml';
        if (NextendFilesystem::fileexists($configurationXmlFile)) {
    
            $control_name = 'jformparamsconfig';
        
            if(isset($_POST[$control_name])){
                
                $_POST[$control_name] = stripslashes_deep( $_POST[$control_name] );
                if(!add_option($class, $_POST[$control_name], '', 'yes')){
                    update_option($class, $_POST[$control_name]);
                    $obj->loadConfig();
                }
            }
        ?>
        
        <div id="nextend_configuration" class="postbox" style="margin: 20px 20px 0 0;">
            <form method="post" id="nextend-plugin-settings" action="<?php echo admin_url("admin.php?page=".$_GET['page']); ?>">
            
            <?php
            nextendimport('nextend.css.css');
            nextendimport('nextend.javascript.javascript');
    
            $css = NextendCss::getInstance();
            $js = NextendJavascript::getInstance();
            $css->addCssLibraryFile('wordpress/removeslug.css');
            $css->addCssLibraryFile('common.css');
            $css->addCssLibraryFile('window.css');
            $css->addCssLibraryFile('configurator.css');
            $js->loadLibrary('dojo');
    
            $js->addLibraryJsLibraryFile('dojo', 'dojo/window.js');
            $js->addLibraryJsAssetsFile('dojo', 'window.js');
    
            nextendimport('nextend.form.form');
    
            $form = new NextendForm();
            $data = get_option($class);
            $form->loadArray($data);
    
            $form->loadXMLFile($configurationXmlFile);
    
            ?>
            <div id="nextend-configurator-wp" class="smartslider">
                <div class="gk_hack nextend-topbar"><div class="gk_hack nextend-topbar-logo"></div>
                    <?php
                    $manual = 'http://www.nextendweb.com/wiki/';
                    if ($manual != "") {
                        ?>
                        <a href="<?php echo $manual; ?>" target="_blank" class="gk_hack nextend-topbar-button nextend-topbar-manual">Manual</a>
                        <?php
                    }
    
    
                    $support = 'http://www.nextendweb.com/smart-slider/#support';
                    if ($support != "") {
                        ?>
                        <a href="<?php echo $support; ?>" target="_blank" class="gk_hack nextend-topbar-button nextend-topbar-support">Support</a>
                        <?php
                    }
                    ?>
                    
                    <div id="nextend-configurator-save" onclick="njQuery('#nextend-plugin-settings').submit();" class="nextend-window-save"><div class="NextendWindowSave">SAVE</div></div>
                </div>
                <?php
                
                $form->render($control_name);
    
                $js->addLibraryJsAssetsFile('dojo', 'form.js');
                $js->addLibraryJs('dojo', '
                    new NextendForm({
                      container: "nextend-configurator-wp",
                      data: ' . json_encode($form->_data) . ',
                      xml: "' . NextendFilesystem::toLinux(NextendFilesystem::pathToRelativePath($configurationXmlFile)) . '",
                      control_name: "' . $control_name . '",
                      url: "' . site_url('/wp-admin/admin-ajax.php?action=nextend') . '",
                      loadedJSS: ' . json_encode($js->generateArrayJs()) . ',
                      loadedCSS: ' . json_encode($css->generateArrayCSS()) . '
                    });
                ', true);
                ?>
            </div>
            </form>
          </div>
        <?php
        }
    }
}