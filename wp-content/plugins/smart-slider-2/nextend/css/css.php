<?php

class NextendCss {

    var $_css;

    var $_cssFiles;

    var $_cssFilesGroup;

    var $_cacheenabled;

    var $_cache;

    var $_cacheGroup;

    var $_lesscache;

    var $_lesscacheGroup;

    var $_echo;

    function NextendCss() {

        $this->_css = '';
        $this->_cssFiles = array();
        $this->_cssFilesGroup = array();
        $this->_cacheGroup = array();
        $this->_cacheenabled = 1;
        $this->_lesscache = false;
        $this->_lesscacheGroup = array();
        $this->_echo = false;
        if ($this->_cacheenabled) {
            nextendimport('nextend.cache.css');
            $this->_cache = new NextendCacheCss();
        }
    }

    static function getInstance() {

        static $instance;
        if (!is_object($instance)) {
            if (nextendIsJoomla()) {
                nextendimport('nextend.css.joomla');
                $instance = new NextendCssJoomla();
            } elseif (nextendIsWordPress()) {
                nextendimport('nextend.css.wordpress');
                $instance = new NextendCssWordPress();
            } elseif (nextendIsMagento()) {
                nextendimport('nextend.css.magento');
                $instance = new NextendCssMagento();
            }
        }
        return $instance;
    }

    function createGroup($name) {
        $this->_cssFilesGroup[$name] = array();
        if ($this->_cacheenabled) {
            nextendimport('nextend.cache.css');
            $this->_cacheGroup[$name] = new NextendCacheCss();
        }
    }

    function enableLess($group = null) {
        nextendimport('nextend.cache.less');
        if (!$group)
            $this->_lesscache = new NextendCacheLess();
        else
            $this->_lesscacheGroup[$group] = new NextendCacheLess();
    }

    function addLessImportDir($dir, $group = null) {
        if (!$group)
            $this->_lesscache->_less->addImportDir($dir);
        else
            $this->_lesscacheGroup[$group]->_less->addImportDir($dir);
    }

    function addCss($css) {

        $this->_css .= $css . PHP_EOL;
    }


    function addCssFile($file, $group = null, $first = false) {
        if (is_string($file)) {
            if (!$group){
                if($first){
                    $this->_cssFiles = array($file => $file) + $this->_cssFiles;
                }else{
                    $this->_cssFiles[$file] = $file;
                }
            }else{
                if($first){
                    $this->_cssFilesGroup[$group] = array($file => $file) + $this->_cssFilesGroup[$group];
                }else{
                    $this->_cssFilesGroup[$group][$file] = $file;
                }
            }
        } else if (is_array($file)) {
            if (!$group){
                $this->_cssFiles[$file[0]] = $file;
            }else{
                $this->_cssFilesGroup[$group][$file[0]] = $file;
            }
        }
    }

    function addCssLibraryFile($file, $group = null) {

        $this->addCssFile(NEXTENDLIBRARYASSETS . 'css' . DIRECTORY_SEPARATOR . $file, $group);
    }

    function generateCSS($group = null) {
        if (!$group && class_exists('NextendFontsGoogle')) {
            $fonts = NextendFontsGoogle::getInstance();
            $fonts->generateFonts();
        }
        $cssfiles = !$group ? $this->_cssFiles : $this->_cssFilesGroup[$group];
        $cache = !$group ? $this->_cache : $this->_cacheGroup[$group];
        $lesscache = !$group ? $this->_lesscache : $this->_lesscacheGroup[$group];
        if (count($cssfiles)) {
            foreach ($cssfiles AS $file) {
                if (is_array($file)) { // LESS
                    $lesscache->addContext($file[1], $file[2]);
                } else if (substr($file, 0, 4) == 'http') {
                    $this->serveCSSFile($file);
                } else {
                    if ($this->_cacheenabled) {
                        $cache->addFile($file);
                    } else {
                        $url = NextendFilesystem::pathToAbsoluteURL($file);
                        $this->serveCSSFile($url);
                    }
                }
            }
        }

        $filename = null;

        if ($this->_cacheenabled) {
            if ($lesscache) {
                $cache->addFile(NextendFilesystem::absoluteURLToPath($lesscache->getCache()));
            }
            $this->serveCSSFile($filename = $cache->getCache());
        } else {
            if ($lesscache) {
                $this->serveCSSFile($filename = $lesscache->getCache());
            }
        }
        $this->serveCSS(true, $group);
        return $filename;
    }

    /*
    * Abstract, must redeclare
    * This one only for testing purpose!
    */

    function serveCSS($clear = true, $group = null) {
        if (!$group && $this->_css != '') {
            echo "<style type='text/css'>";
            echo $this->_css;
            echo "</style>";
            if ($clear) $this->_css = '';
        }
    }

    /*
    * Abstract, must redeclare
    * This one only for testing purpose!
    */

    function serveCSSFile($url) {

        echo '<link rel="stylesheet" href="' . $url . '" type="text/css" />';
    }

    function generateAjaxCSS($loadedCSS) {
        $css = '';
        if (count($this->_cssFiles)) {
            foreach ($this->_cssFiles AS $file) {
                if (!in_array($file, $loadedCSS)) {
                    $css .= preg_replace('#url\([\'"]([^"\'\)]+)[\'"]\)#', 'url(' . NextendFilesystem::pathToAbsoluteURL(dirname($file)) . '/$1)', NextendFilesystem::readFile($file));
                }
            }
        }
        $css .= $this->_css;
        return $css;
    }

    function generateArrayCSS() {
        $css = array();
        $css = array_merge($css, $this->_cssFiles);
        return $css;
    }
}
