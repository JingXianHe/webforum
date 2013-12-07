<?php

nextendimportsmartslider2('nextend.smartslider.settings');
nextendimportsmartslider2('nextend.smartslider.widgets');

class NextendSlider {

    var $_norender = false;
    var $_path;
    var $_backend;
    var $_sliderid;
    var $_identifier = 'nextend-smart-slider';
    var $_instance;
    var $_typePath;
    var $_slider;
    var $_sliderParams;
    var $_generator;
    var $_generatorParams;
    var $_generatorSlideParams;
    var $_slides;
    var $_activeSlide = 0;

    function NextendSlider($path, $backend = false) {

        $this->_path = $path . DIRECTORY_SEPARATOR;
        $this->_backend = $backend;
    }

    function getId() {

        return $this->_identifier . '-' . $this->_instance;
    }

    function loadSlider($sliderid) {
        $this->_sliderid = $sliderid;
        nextendimportsmartslider2('nextend.smartslider.admin.models.sliders');
        $slidersModel = new NextendSmartsliderAdminModelSliders(null);
        $slider = $slidersModel->getSlider($sliderid);
        $this->_slider = new NextendData();
        $this->_slider->loadArray($slider);

        $this->_sliderParams = new NextendData();
        $this->_sliderParams->loadJSON($slider['params']);

        $this->_generatorParams = new NextendData();
        $this->_generatorParams->loadJSON($slider['generator']);

        $this->_generatorSlideParams = new NextendData();
        $this->_generatorSlideParams->loadJSON($slider['slide']);


        if ($this->_backend) {
            $this->_slides = $this->slides();
        } else {
            $cache = NextendParse::parse($this->_sliderParams->get('cache', '0|*|1440'));
            if (intval($cache[0])) {
                nextendimport('nextend.cache.data.data');
                $caching = NextendCacheData::getInstance();
                $this->_slides = $caching->cache('smartslider', $cache[1], array($this, 'slides'));
            } else {
                $this->_slides = $this->slides();
            }
            if($this->_sliderParams->get('randomize', 0)){
                shuffle($this->_slides);
                $this->_activeSlide = 0;
            }
        }
        if (count($this->_slides) === 0) {
            if (NextendSmartSliderSettings::get('debugmessages', 1))
                echo '0 slides available for this slider.';
            $this->_norender = true;
        }
    }

    function slides() {
        return $this->initSlides($this->loadSlides());
    }

    function loadSlides() {
        $slides = array();
        $generateslides = NextendParse::parse($this->_generatorParams->get('generateslides', '0|*|0|*|0'));
        $createslides = intval($generateslides[1]);
        $staticslides = intval($generateslides[2]);
        
        $publishbetween = (array)NextendParse::parse($this->_generatorSlideParams->get('publishdates', '|*|'));
        if(!isset($publishbetween[1])) $publishbetween[1] = '';

        if (!$this->_backend && $this->_generatorParams->get('enabled', 0) && $createslides == 0 && ($publishbetween[0] == '' || strtotime($publishbetween[0]) < time()) && ($publishbetween[1] == '' || strtotime($publishbetween[1]) > time())) {
            nextendimportsmartslider2('nextend.smartslider.generator');
            $this->generator = new NextendSmartsliderGenerator($this->_generatorParams, $this->_generatorSlideParams);
            $slides = $this->generator->generateSlides($this->_sliderid);
        } else {
            nextendimportsmartslider2('nextend.smartslider.admin.models.slides');
            $slidesModel = new NextendSmartsliderAdminModelSlides(null);

            $where = '';
            if ($this->_backend) {
                $where = " AND ((published = 1 AND (publish_up = '0000-00-00 00:00:00' OR publish_up < '".date( 'Y-m-d H:i:s')."') AND (publish_down = '0000-00-00 00:00:00' OR publish_down > '".date( 'Y-m-d H:i:s')."')) OR id = " . NextendRequest::getInt('slideid') . ") ";
            } else {
                $where = " AND published = 1 AND (publish_up = '0000-00-00 00:00:00' OR publish_up < '".date( 'Y-m-d H:i:s')."') AND (publish_down = '0000-00-00 00:00:00' OR publish_down > '".date( 'Y-m-d H:i:s')."') ";
            }

            $slides = $slidesModel->getSlides($this->_sliderid, $where);
            if (!$this->_backend && $createslides && !$staticslides) {
                nextendimportsmartslider2('nextend.smartslider.generator');
                $this->generator = new NextendSmartsliderGenerator($this->_generatorParams, $this->_generatorSlideParams);
                $source = $this->_generatorParams->get('source', '');
                if ($source) {
                    $this->generator->initDatasource($source);
                    for ($i = 0; $i < count($slides); $i++) {
                        if ($slides[$i]['generator'] > 0) {
                            $slides[$i] = $this->generator->makeSlide($slides[$i]);
                        }
                    }
                }
            }
        }
        $this->_activeSlide = 0;
        return $slides;
    }

    function initSlides($slides) {
        if ($this->_backend) {
            if (NextendRequest::getCmd('action') == 'create') {
                array_unshift($slides, array(
                    'id' => 0,
                    'title' => '{_slidetitle}',
                    'slider' => NextendRequest::getInt('sliderid'),
                    'publish_up' => '0000-00-00 00:00:00',
                    'publish_down' => '0000-00-00 00:00:00',
                    'published' => 1,
                    'first' => 0,
                    'slide' => '',
                    'params' => '',
                    'thumbnail' => '',
                    'background' => 'ffffff00|*|',
                    'description' => 'Description',
                    'ordering' => count($slides)
                ));
            }

            if (NextendRequest::getCmd('action') == 'generator') {
                global $smartslidergeneratorslide;
                if (!$smartslidergeneratorslide) $smartslidergeneratorslide = array();
                array_unshift($slides, array_merge(array(
                    'id' => 0,
                    'title' => '{_slidetitle}',
                    'slider' => NextendRequest::getInt('sliderid'),
                    'publish_up' => '0000-00-00 00:00:00',
                    'publish_down' => '0000-00-00 00:00:00',
                    'published' => 1,
                    'first' => 0,
                    'slide' => '',
                    'params' => '',
                    'thumbnail' => '',
                    'background' => 'ffffff00|*|',
                    'description' => 'Description',
                    'ordering' => count($slides)
                ), $smartslidergeneratorslide));
            } else if (NextendRequest::getCmd('controller') == 'layouts' && NextendRequest::getCmd('action') == 'edit') {
                global $smartsliderlayout;
                if (!$smartsliderlayout) $smartsliderlayout = '';
                array_unshift($slides, array(
                    'id' => 0,
                    'title' => '{_slidetitle}',
                    'slide' => $smartsliderlayout,
                    'params' => ''
                ));
            } else if (NextendRequest::getCmd('controller') == 'slides') {
                $currentlyedited = NextendRequest::getInt('slideid');
                for ($i = 0; $i < count($slides); $i++) {
                    if ($slides[$i]['id'] == $currentlyedited) {
                        $this->_activeSlide = $i;
                        break;
                    }
                }
            }
        } else {
            for ($i = 0; $i < count($slides); $i++) {
                if ($slides[$i]['first'] == 1) {
                    $this->_activeSlide = $i;
                    break;
                }
            }
        }
        nextendimport('nextend.image.color');
        for ($i = 0; $i < count($slides); $i++) {
        
            $params = new NextendData();
            $params->loadJSON($slides[$i]['params']);
            $slides[$i]['params'] = $params;
            
            $slides[$i]['classes'] = 'smart-slider-canvas';
            if (!isset($slides[$i]['background'])) $slides[$i]['background'] = 'ffffff00|*|';
            $bg = (array)NextendParse::parse($slides[$i]['background']);
            $style = '';
            if (isset($bg[0]) && strlen($bg[0]) == 8) {
                if (substr($bg[0], 6, 2) != '00') {
                    $style .= 'background-color: #' . substr($bg[0], 0, 6) . ';';
                    $rgba = NextendColor::hex2rgba($bg[0]);
                    $style .= 'background-color: RGBA(' . $rgba[0] . ',' . $rgba[1] . ',' . $rgba[2] . ',' . round($rgba[3] / 127, 2) . ');';
                }
            }
            $slides[$i]['style'] = $style;
            $slides[$i]['bg'] = false;
            if (isset($bg[1]) && $bg[1] != '') {
                    $slides[$i]['bg'] = $bg[1];
            }
            
            $link = $params->get('link', '');
            if(!$this->_backend && $link){
                $slides[$i]['link'] = ' onclick="'.htmlspecialchars(strpos($link, 'javascript:') === 0 ? $link : 'window.location=\''.(nextendIsJoomla() ? JRoute::_($link, false) : $link).'\'').'" ';
                $slides[$i]['style'].='cursor:pointer;';
            }else{
                $slides[$i]['link'] = '';
            }
            
        }

        return $slides;
    }

    function render() {
        if ($this->_norender) return;

        $id = $this->getId();
        $data = & $this->_data;

        $this->addJs();

        $jquery = NextendSmartSliderSettings::get('jquery', 1);
        if(!$jquery && !$this->_backend){
            $js = NextendJavascript::getInstance();
            $js->_loadedLibraries['jquery']->removeJsLibraryFile('jQuery.js');
        }
        
        $widgets = new NextendSliderWidgets($this, $id);
        
        if (isset($this->_slides[$this->_activeSlide]))
            $this->_slides[$this->_activeSlide]['classes'] .= ' smart-slider-slide-active';

        $fadeonload = (array)NextendParse::parse($this->_sliderParams->get('fadeonload', '1|*|0'));
        if(!isset($fadeonload[1])){
            $fadeonload[1] = 0;
        }else if($fadeonload[1]){
            $fadeonload[0] = 1;
        }
                
        $sliderClasses = (!$this->_backend && $fadeonload[0] ? 'nextend-slider-fadeload ' : '');

        ob_start();
        if(!$this->_backend && $fadeonload[0]){
            echo '<style type="text/css">div#'.$id.'.nextend-slider-fadeload{position: absolute; opacity: 0;}</style>';
        }
        include($this->_typePath . 'slider.php');
        $slider = ob_get_clean();
        
        
        if(!$this->_backend){
            NextendPlugin::callPlugin('nextendslideritem', 'onNextendSliderRender', array(&$slider, $id));
            
            $slider = preg_replace( '/data-itemvalues=".*?"/', '', $slider ); // Remove unnecessary attributes...
            $slider = preg_replace( '/data-item=".*?"/', '', $slider ); // Remove unnecessary attributes...
            $slider = preg_replace( '/data-leave=""/', '', $slider ); // Remove unnecessary attributes...
            $slider = preg_replace( '/data-enter=""/', '', $slider ); // Remove unnecessary attributes...
            $slider = preg_replace( '/data-click=""/', '', $slider ); // Remove unnecessary attributes...
        
            if(nextendIsJoomla()){
                if(version_compare(JVERSION, '1.6.0', 'ge')){
                    $dispatcher = JDispatcher::getInstance();
          			     JPluginHelper::importPlugin('content');
                    $article = new stdClass();
                    $article->text = $slider;
                    $_p = array();
                    $dispatcher->trigger('onContentPrepare', array('com_smartslider2', &$article, &$_p, 0));
                    if(!empty($article->text)) $slider = $article->text;
                }
            }elseif(nextendIsWordPress()){
                $slider = do_shortcode($slider);
            }
        }

        $slider = str_replace(array('{{id}}', 'nextend-smart-slider-0'), $this->getId(), $slider);

        if(!$this->_backend){
            $translateurl = (array)NextendParse::parse(NextendSmartSliderSettings::get('translateurl', ''));
            if(isset($translateurl[0]) && isset($translateurl[1])){
                $slider = str_replace($translateurl[0], $translateurl[1], $slider);
            }
        }
        
        echo $this->parseSlider($slider);

        $size = $this->addCSS();
        $responsive = (array)NextendParse::parse($this->_sliderParams->get('responsive', '0|*|0'));
        
        if( !$this->_backend && $fadeonload[0] && ((isset($responsive[0]) && $responsive[0]) || (isset($responsive[1]) && $responsive[1]))){
            if($size[0]+$size[3] > 0 && $size[1] > 0 && function_exists('imagecreatetruecolor')){
                echo '<div id="'.$id.'-placeholder" >';
                
                $im = imagecreatetruecolor($size[0]+$size[3], $size[1]);
                imagesavealpha($im, true);
                imagealphablending($im, false);
                $trans = imagecolorallocatealpha($im, 255, 0, 0, 127);
                imagefilledrectangle($im, 0, 0, $size[0]+$size[3], $size[1], $trans);
                ob_start();
                imagepng($im);
                imagedestroy($im);
                $img = base64_encode(ob_get_clean());
                echo '<img style="width:100%; max-width: '.(intval($this->_sliderParams->get('simpleresponsivemaxwidth', 30000))+$size[3]).'px;" src="data:image/png;base64, '.$img.'" />';
                
                if($size[2] > 0){
                    $im = imagecreatetruecolor($size[0]+$size[3], $size[2]);
                    imagesavealpha($im, true);
                    imagealphablending($im, false);
                    $trans = imagecolorallocatealpha($im, 255, 0, 0, 127);
                    imagefilledrectangle($im, 0, 0, $size[0]+$size[3], $size[2], $trans);
                    ob_start();
                    imagepng($im);
                    imagedestroy($im);
                    $img = base64_encode(ob_get_clean());
                    echo '<img style="width:100%;" src="data:image/png;base64, '.$img.'" />';
                }
                
                echo '</div>';
            }else{
                echo '<style>#'.$id.' .nextend-slider-fadeload{position: static !important;}</style>';
            }
        }else{
            echo '<style>#'.$id.'.nextend-slider-fadeload{position: static !important;}</style>';
        }
    }
    
    function parseSlider($slider){
        return $slider;
    }

    function addCSS() {
        $id = $this->getId();

        nextendimport('nextend.css.css');
        $css = NextendCss::getInstance();
        $css->createGroup($id);
        $css->enableLess($id);
        $css->addLessImportDir(NEXTEND_SMART_SLIDER2_ASSETS . 'less' . DIRECTORY_SEPARATOR, $id);
        $data = & $this->_data;
        $slider = & $this->_slider;
        $sliderParams = & $this->_sliderParams;
        $size = NextendParse::parse($sliderParams->get('size'));
        $context = array(
            'id' => '~"#' . $this->getId() . '"',
            'width' => $size[0] . 'px',
            'height' => $size[1] . 'px',
            'canvas' => intval($size[2]),
            'count' => count($this->_slides),
            'margin' => NextendParse::parseUnit($sliderParams->get('margin'), ' ')
        );
        
        if($this->_backend){
            $context['margin'] = '0px 0px 0px 0px';
        }

        nextendimport('nextend.parse.font');
        $fonts = 0;
        foreach (NextendSmartSliderFontSettings::getAll($this->_sliderid) AS $k => $v) {
            preg_match('/sliderfont(custom)?([0-9]*)$/', $k, $matches);
            if (count($matches)) {
                $context['font' . $fonts] = '~".' . $matches[0] . '"';
                
                if(json_decode($v)===null) $v = base64_decode($v);
                
                $font = new NextendParseFont($v);
                $context['font' . $fonts . 'text'] = '";' . $font->printTab() . '"';
                $font->mixinTab('Link');
                $context['font' . $fonts . 'link'] = '";' . $font->printTab('Link') . '"';
                $font->mixinTab('Link:Hover', 'Link');
                $context['font' . $fonts . 'hover'] = '";' . $font->printTab('Link:Hover') . '"';
                $fonts++;
            }
        }
        $context['fonts'] = $fonts;

        include($this->_typePath . 'context.php');
        $css->addCssFile(array(
            $this->getId(),
            $this->_typePath . 'style.less',
            $context
        ), $this->getId());
        $css->generateCSS($this->getId());
        
        if(strpos($context['margin'], '%')){
			$m = explode('% ', $context['margin']);
			$m[1] = $m[1]/100*intval($context['width']);
			$m[3] = $m[3]/100*intval($context['width']);
			$m[0] = $m[0]/100*intval($context['height']);
			$m[2] = $m[2]/100*intval($context['height']);
		}else{
			$m = explode('px ', $context['margin']);
		}
		
		$addcss = (array)NextendParse::parse(NextendSmartSliderSettings::get('externalcssfile'));
		if($this->_backend && count($addcss)){
			foreach($addcss as $cssfile)
			{
				$css->addCssFile($cssfile);
			}
		}
		
        return array(intval($context['width']),intval($context['height']), $m[0]+$m[2], $m[1]+$m[3]);
    }

    function addJs() {

        nextendimport('nextend.javascript.javascript');
        nextendimport('nextend.css.css');
        $data = & $this->_data;
        $js = NextendJavascript::getInstance();
        $css = NextendCss::getInstance();

        $js->loadLibrary('modernizr');
        $js->addJsAssetsFile('class.js');
        $js->loadLibrary('jquery');
        
        $js->addLibraryJsLibraryFile('jquery', 'jquery.waitforimages.js');

        $controls = NextendParse::parse($this->_sliderParams->get('controls', '0|*|0'));

        if($controls[0]){
            $js->addLibraryJsLibraryFile('jquery', 'jquery.mousewheel.js');
        }
        if($controls[1]){
            $js->addLibraryJsLibraryFile('jquery', 'jquery.touchSwipe.js');
        }
        $js->addLibraryJsLibraryFile('jquery', 'easing.js');
        $js->addLibraryJsLibraryFile('jquery', 'jquery.transit.js');


        $js->addLibraryJsFile('jquery', NEXTEND_SMART_SLIDER2_ASSETS . 'js' . DIRECTORY_SEPARATOR . 'animationbase.js');
        $js->addLibraryJsFile('jquery', NEXTEND_SMART_SLIDER2_ASSETS . 'js' . DIRECTORY_SEPARATOR . 'smartsliderbase.js');
        $js->addLibraryJsFile('jquery', NEXTEND_SMART_SLIDER2_ASSETS . 'js' . DIRECTORY_SEPARATOR . 'mainslider.js');
        $js->addLibraryJsFile('jquery', NEXTEND_SMART_SLIDER2_ASSETS . 'js' . DIRECTORY_SEPARATOR . 'layers.js');

        $js->addLibraryJsFile('jquery', NEXTEND_SMART_SLIDER2_ASSETS . 'js' . DIRECTORY_SEPARATOR . 'motions' . DIRECTORY_SEPARATOR . 'no.js');
        $js->addLibraryJsFile('jquery', NEXTEND_SMART_SLIDER2_ASSETS . 'js' . DIRECTORY_SEPARATOR . 'motions' . DIRECTORY_SEPARATOR . 'fade.js');

        $js->addLibraryJsFile('jquery', NEXTEND_SMART_SLIDER2_ASSETS . 'js' . DIRECTORY_SEPARATOR . 'motions' . DIRECTORY_SEPARATOR . 'slide.js');

        $js->addLibraryJsFile('jquery', NEXTEND_SMART_SLIDER2_ASSETS .  'js' . DIRECTORY_SEPARATOR . 'motions' . DIRECTORY_SEPARATOR . 'transit.js');
    }

}