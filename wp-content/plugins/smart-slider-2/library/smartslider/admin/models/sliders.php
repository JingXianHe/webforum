<?php

nextendimport('nextend.mvc.model');
nextendimport('nextend.database.database');
nextendimport('nextend.parse.parse');

class NextendSmartsliderAdminModelSliders extends NextendModel {

    function getSlider($id) {
        if ($id === -1) return $this->getLayoutSlider();
        $db = NextendDatabase::getInstance();
        $db->setQuery('SELECT * FROM #__nextend_smartslider_sliders WHERE id = ' . $db->quote($id));
        return $db->loadAssoc();
    }

    function getLayoutSlider() {
        return array(
            'id' => -1,
            'title' => 'Test',
            'type' => 'simple',
            'generator' => null,
            'slide' => null,
            'params' => '{"size":"' . NextendSmartSliderLayoutSettings::get('size', '700|*|300') . '|*|1","responsive":"0|*|0","globalfontsize":"14","margin":"0|*|0|*|0|*|0|*|px","accordionhorizontalskins":"","accordionhorizontalborder":"6|*|3E3E3Eff|*|6|*|222222ff","accordionhorizontalborderradius":"6|*|6|*|6|*|6","accordionhorizontaltabbg":"3E3E3E","accordionhorizontaltabbgactive":"87B801","accordionhorizontalthemeclass":"dark","accordionhorizontaltabfont":"{\"firsttab\":\"Text\",\"Text\":{\"color\":\"e4eaeeff\",\"size\":\"112||%\",\"tshadow\":\"0|*|1|*|0|*|000000FF\",\"afont\":\"google(@import url(http:\/\/fonts.googleapis.com\/css?family=Montserrat);),Arial\",\"lineheight\":\"normal\",\"bold\":1,\"italic\":0,\"underline\":0,\"align\":\"right\",\"paddingleft\":0},\"Active\":{\"paddingleft\":0,\"color\":\"222222ff\",\"tshadow\":\"0|*|1|*|0|*|ffffff3d\"},\"Link\":{\"paddingleft\":0},\"Hover\":{\"paddingleft\":0,\"color\":\"222222ff\",\"tshadow\":\"0|*|1|*|0|*|ffffffff\"},\"firsttab\":\"Text\"}","accordionhorizontalduration":"1000","accordionhorizontaleasing":"easeInCubic","mainafterout":"1","inaftermain":"1","controls":"0|*|0","cache":"0|*|1440","autoplay":"0|*|5000","stopautoplay":"1|*|1|*|1","resumeautoplay":"0|*|1","widgetarrow":"image","widgetarrowdisplay":"0|*|always","previousposition":"left|*|0|*|%|*|top|*|50|*|%","previous":"","nextposition":"right|*|0|*|%|*|top|*|50|*|%","next":"","widgetbullet":"text","widgetbulletdisplay":"0|*|always","bulletposition":"left|*|0|*|%|*|bottom|*|5|*|%","bulletalign":"center","bullet":"","bulletbackground":"00000060","bulletbackgroundhover":"7670C7ff","fontclassnumber":"sliderfont7","bulletbar":"none","bulletshadow":"none","bulletbarcolor":"00000060","bullethumbnail":"0|*|top","thumbnailsizebullet":"100|*|60","bulletthumbnail":"00000060","widgetautoplay":"image","widgetautoplaydisplay":"0|*|always","autoplayimageposition":"left|*|0|*|%|*|top|*|50|*|%","autoplayimage":"","widgetindicator":"pie","widgetindicatordisplay":"0|*|always","indicatorposition":"right|*|5|*|%|*|top|*|5|*|%","indicatorskin":"plugins\/nextendsliderwidgetindicator\/pie\/pie\/pie\/default.png","indicatorcolor":"ffffffff|*|00000080","indicatorsize":"25","indicatorthickness":"0.5","indicatorlinecap":"butt","widgetbar":"gradient","widgetbardisplay":"0|*|always","bargradientposition":"left|*|0|*|%|*|top|*|50|*|%","bargradient":"","bargradientheight":"35","bargradienttitlefont":"sliderfont7","bargradientdescriptionfont":"sliderfont7","widgetthumbnail":"horizontal","widgetthumbnaildisplay":"0|*|always","thumbnailposition":"left|*|0|*|%|*|bottom|*|0|*|px","thumbnailsize":"100|*|60","thumbnailperpage":"2","thumbnailanimation":"700","thumbnail":"","thumbnailactivebackground":"00000080","widgetshadow":"shadow1","widgetshadowdisplay":"0|*|always","shadowposition":"left|*|0|*|%|*|bottom|*|-5|*|%","shadowcss":""}'
        );
    }

    function getSliders() {
        $db = NextendDatabase::getInstance();
        $db->setQuery('SELECT * FROM #__nextend_smartslider_sliders');
        return $db->loadAssocList();
    }

    function renderAddForm($data = array()) {
        NextendSmartSliderFontSettings::initAdminFonts();
        return $this->editForm($data);
    }

    function renderEditForm($id = 0) {
        if ($id == 0)
            $this->redirectToCreate();

        $slider = $this->getSlider($id);
        if ($slider === null)
            $this->redirectToCreate();

        $data = json_decode($slider['params'], true);
        if ($data == null)
            $data = array();
        $data['title'] = $slider['title'];
        $data['type'] = $slider['type'];
        NextendSmartSliderFontSettings::initAdminFonts($id);
        return $this->editForm($data);
    }

    function editForm($data = array()) {

        $css = NextendCss::getInstance();
        $js = NextendJavascript::getInstance();

        $css->addCssLibraryFile('common.css');
        $css->addCssLibraryFile('window.css');
        $css->addCssLibraryFile('configurator.css');

        $configurationXmlFile = dirname(__FILE__) . '/forms/slider.xml';
        $js->loadLibrary('dojo');

        nextendimport('nextend.form.form');
        $form = new NextendForm();
        $form->set('class', 'nextend-smart-slider-admin');
        $form->set('manual', 'http://www.nextendweb.com/wiki/smart-slider-documentation/');
        $form->set('support', 'http://www.nextendweb.com/smart-slider#support');
        $form->loadArray($data);

        $form->loadXMLFile($configurationXmlFile);

        echo $form->render('slider');
        return array($data, $configurationXmlFile, 'slider');
    }

    function create($slider) {
        if (!isset($slider['title']))
            return false;
        if ($slider['title'] == '')
            $slider['title'] = 'New slider';

        $db = NextendDatabase::getInstance();

        $query = 'INSERT INTO #__nextend_smartslider_sliders (title, type, params) VALUES (';

        $query .= $db->quote($slider['title']);
        unset($slider['title']);
        $query .= ',' . $db->quote($slider['type']);
        unset($slider['type']);
        $query .= ',' . $db->quote(json_encode($slider));
        $query .= ');';
        $db->setQuery($query);
        $db->query();
        return $db->insertid();
    }

    function import($slider) {
        if (!isset($slider['title']))
            return false;
        if ($slider['title'] == '')
            $slider['title'] = 'New slider';

        $db = NextendDatabase::getInstance();

        $query = 'INSERT INTO #__nextend_smartslider_sliders (title, type, generator, slide, params) VALUES (';

        $query .= $db->quote($slider['title']);
        $query .= ',' . $db->quote($slider['type']);
        $query .= ',' . $db->quote($slider['generator']);
        $query .= ',' . $db->quote($slider['slide']);
        $query .= ',' . $db->quote($slider['params']);
        $query .= ');';
        $db->setQuery($query);
        $db->query();
        return $db->insertid();
    }

    function save($id, $slider) {
        if (!isset($slider['title']) || $id <= 0)
            return false;
        if ($slider['title'] == '')
            $slider['title'] = 'New slider';

        $db = NextendDatabase::getInstance();

        $query = 'UPDATE #__nextend_smartslider_sliders SET ';

        $query .= ' title=' . $db->quote($slider['title']);
        unset($slider['title']);

        $query .= ',type=' . $db->quote($slider['type']);
        unset($slider['type']);

        $query .= ',params=' . $db->quote(json_encode($slider));

        $query .= ' WHERE id = ' . $db->quote($id);
        $db->setQuery($query);
        $db->query();

        return $id;
    }

    function editGeneratorForm($data = array()) {

        $css = NextendCss::getInstance();
        $js = NextendJavascript::getInstance();

        $css->addCssLibraryFile('common.css');
        $css->addCssLibraryFile('window.css');
        $css->addCssLibraryFile('configurator.css');

        $configurationXmlFile = dirname(__FILE__) . '/forms/generator.xml';
        $js->loadLibrary('dojo');

        nextendimport('nextend.form.form');
        $form = new NextendForm();
        $form->set('class', 'nextend-smart-slider-admin');
        $form->set('manual', 'http://www.nextendweb.com/wiki/smart-slider-documentation/');
        $form->set('support', 'http://www.nextendweb.com/smart-slider#support');
        $form->loadArray($data);

        $form->loadXMLFile($configurationXmlFile);

        echo $form->render('generator');
        return $configurationXmlFile;
    }

    function saveGenerator($id, $generator, $slide) {

        $db = NextendDatabase::getInstance();

        $query = 'UPDATE #__nextend_smartslider_sliders SET ';

        $query .= 'generator=' . $db->quote(json_encode($generator));
        $slide['slide'] = base64_decode($slide['slide']);
        $query .= ',slide=' . $db->quote(json_encode($slide));

        $query .= ' WHERE id = ' . $db->quote($id);
        $db->setQuery($query);
        $db->query();

        $generatorParams = new NextendData();
        $generatorParams->loadArray($generator);

        $generateslides = NextendParse::parse($generatorParams->get('generateslides', '0|*|0|*|0'));
        $createslides = intval($generateslides[1]);
        if($generatorParams->get('enabled', 0) && $createslides === 1){

            nextendimportsmartslider2('nextend.smartslider.generator');

            $slidesModel = $this->getModel('slides');
            //$slidesModel->deleteBySlider($id);

            $staticslides = intval($generateslides[2]);

            $generatorSlideParams = new NextendData();
            $generatorSlideParams->loadArray($slide);


            $generator = new NextendSmartsliderGenerator($generatorParams, $generatorSlideParams);

            if($staticslides){
                $slides = $generator->generateSlides($id);
                foreach($slides AS $slide){
                    unset($slide['id']);
                    $slidesModel->create($id, $slide, false);
                }
            }else{
                $slides = $generator->generateSlides($id, false);
                $slidesModel->deleteGeneratedBySlider($id);
                foreach($slides AS $k => $slide){
                    unset($slide['id']);
                    $slide['generator'] = $k+1;
                    $slidesModel->create($id, $slide, false);
                }
            }
        }

        return $id;
    }

    function delete($id) {
        $slidesModel = $this->getModel('slides');
        $slidesModel->deleteBySlider($id);

        $db = NextendDatabase::getInstance();
        $db->setQuery('DELETE FROM #__nextend_smartslider_sliders WHERE id=' . $db->quote($id));
        $db->query();
    }

    function deleteslides($id) {
        $slidesModel = $this->getModel('slides');
        $slidesModel->deleteBySlider($id);
    }    

    function duplicate($id) {

        $db = NextendDatabase::getInstance();

        $slider = $this->getSlider($id);
        unset($slider['id']);

        $slider['title'] .= ' - copy';

        $query = 'INSERT INTO #__nextend_smartslider_sliders ( ';

        foreach ($slider AS $k => $v) {
            $query .= $db->quoteName($k) . ',';
        }
        $query = rtrim($query, ",");

        $query .= ') VALUES (';

        foreach ($slider AS $k => $v) {
            $query .= $db->quote($v) . ',';
        }
        $query = rtrim($query, ",");
        $query .= ');';
        $db->setQuery($query);
        $db->query();

        $newsliderid = $db->insertid();
        if(!$newsliderid) return false;

        $slidesModel = $this->getModel('slides');

        foreach($slidesModel->getSlides($id) AS $slide){
            unset($slide['id']);
            $slide['slider'] = $newsliderid;
            $slidesModel->create($newsliderid, $slide, false);
        }
        
        $font = NextendSmartSliderStorage::get('font'.$id);
        if($font){
            NextendSmartSliderStorage::set('font'.$newsliderid, $font);
        }

        return $newsliderid;

    }

    function redirectToCreate() {
        header('LOCATION: ' . $this->route('controller=sliders&view=sliders_slider&action=create'));
        exit;
    }
    
    function exportSlider($id){
        nextendimport('nextend.externals.zip_lib');
        $zip = new NextendZipFile();
        $slider = $this->getSlider($id);
        $title = preg_replace('/[^a-zA-Z0-9]/', '_', $slider['title']).'.smart';
        unset($slider['id']);
        $zip->addFile(serialize($slider), 'slider.ss2');
        
        $slidesModel = $this->getModel('slides');
        $slides = $slidesModel->getSlides($id);
        for($i = 0; $i < count($slides); $i++){
            unset($slides[$i]['id']);
            unset($slides[$i]['slider']);
        }
        $zip->addFile(serialize($slides), 'slides.ss2');
        
        $fonts = NextendSmartSliderFontSettings::getAll($id);
        $zip->addFile(serialize($fonts), 'fonts.ss2');
        
        return array($title, $zip->file());
    }

}

?>
