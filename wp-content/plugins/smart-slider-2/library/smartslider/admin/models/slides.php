<?php

nextendimport('nextend.mvc.model');
nextendimport('nextend.database.database');

class NextendSmartsliderAdminModelSlides extends NextendModel {

    function getSlide($id) {
        $db = NextendDatabase::getInstance();
        $db->setQuery('SELECT * FROM #__nextend_smartslider_slides WHERE id = '.$db->quote($id));
        return $db->loadAssoc();
    }

    function getSlides($sliderid = 0, $where = '') {
        $db = NextendDatabase::getInstance();
        $db->setQuery('SELECT * FROM #__nextend_smartslider_slides WHERE slider = '.$db->quote($sliderid).' '.$where.' ORDER BY ordering');
        return $db->loadAssocList();
    }

    function getMaxOrdering($sliderid = 0) {
        $db = NextendDatabase::getInstance();
        $db->setQuery('SELECT MAX(ordering) AS ordering FROM #__nextend_smartslider_slides WHERE slider = '.$db->quote($sliderid));
        $result = $db->loadAssoc();
        if(isset($result['ordering'])) return $result['ordering'];
        return 0;
    }
    
    function renderAddForm($data = array()) {
        $this->editForm($data);
    }

    function renderEditForm($id = 0) {
        if ($id == 0) $this->redirectToCreate();

        $slide = $this->getSlide($id);
        if($slide === null) $this->redirectToCreate();
        
        $data = json_decode($slide['params'], true);
        if($data == null) $data = array();
        $data += $slide;
        $data['sliderid'] = $slide['slider'];
        $this->editForm($data);
        echo '<input name="slide[generator]" value="'.$slide['generator'].'" type="hidden" />';
    }

    function editForm($data = array()) {
        
        $css = NextendCss::getInstance();
        $js = NextendJavascript::getInstance();

        $css->addCssLibraryFile('common.css');
        $css->addCssLibraryFile('window.css');
        $css->addCssLibraryFile('configurator.css');

        $configurationXmlFile = dirname(__FILE__) . '/forms/slide.xml';
        $js->loadLibrary('dojo');

        nextendimport('nextend.form.form');
        $form = new NextendForm();
        
        $data['publishdates'] = isset($data['publishdates']) ? $data['publishdates'] : ((isset($data['publish_up']) ? $data['publish_up'] : '').'|*|'.(isset($data['publish_down']) ? $data['publish_down'] : ''));
        $form->loadArray($data);

        $form->loadXMLFile($configurationXmlFile);

        echo $form->render('slide');
    }

    function create($sliderid, $slide, $base64 = true) {
        if (!isset($slide['title']))
            return false;
        if($slide['title'] == '') $slide['title'] = 'New slide';

        $db = NextendDatabase::getInstance();

        $query = 'INSERT INTO #__nextend_smartslider_slides (title, slide, description, thumbnail, background, published, publish_up, publish_down, first, generator, params, slider, ordering) VALUES (';

        $query.=$db->quote($slide['title']);
        $query.=','.$db->quote($base64 ? base64_decode($slide['slide']) : $slide['slide']);
        $query.=','.$db->quote($slide['description']);
        $query.=','.$db->quote($slide['thumbnail']);
        $query.=','.$db->quote($slide['background']);
        $query.=','.$db->quote(isset($slide['published']) ? $slide['published'] : 0);
        
        if(isset($slide['publishdates'])){
            $date = explode('|*|',$slide['publishdates']);
            $query.=','.$db->quote(isset($date[0]) ? $date[0] : '');
            $query.=','.$db->quote(isset($date[1]) ? $date[1] : '');
        }else{
            $query.=','.$db->quote($slide['publish_up']);
            $query.=','.$db->quote($slide['publish_down']);
        }
        
        $query.=','.$db->quote(isset($slide['first']) ? $slide['first'] : 0);
        $query.=','.$db->quote(isset($slide['generator']) ? $slide['generator'] : 0);
        
        
        unset($slide['title']);
        unset($slide['slide']);
        unset($slide['description']);
        unset($slide['thumbnail']);
        unset($slide['background']);
        unset($slide['published']);
        unset($slide['first']);
        unset($slide['generator']);
        unset($slide['publishdates']);
        
        
        $query.=','.$db->quote(json_encode($slide));
        
        $query.=',' . $db->quote($sliderid);
        $query.=',' . ($this->getMaxOrdering($sliderid)+1);
        $query.=');';
        $db->setQuery($query);
        $db->query();
        return $db->insertid();
    }
    
    function save($id, $slide, $base64 = true){
        if (!isset($slide['title']) || $id <= 0)
            return false;
        if($slide['title'] == '') $slide['title'] = 'New slide';
        $db = NextendDatabase::getInstance();
        
        $query = 'UPDATE #__nextend_smartslider_slides SET ';
        
        $query.=' title='.$db->quote($slide['title']);
        $query.=',slide='.$db->quote($base64 ? base64_decode($slide['slide']) : $slide['slide']);
        $query.=',description='.$db->quote($slide['description']);
        $query.=',thumbnail='.$db->quote($slide['thumbnail']);
        $query.=',background='.$db->quote($slide['background']);
        $query.=',published='.$db->quote($slide['published']);
        $date = explode('|*|',$slide['publishdates']);
        $query.=',publish_up='.$db->quote(isset($date[0]) ? $date[0] : '');
        $query.=',publish_down='.$db->quote(isset($date[1]) ? $date[1] : '');
        unset($slide['title']);
        unset($slide['slide']);
        unset($slide['description']);
        unset($slide['thumbnail']);
        unset($slide['published']);
        unset($slide['background']);
        unset($slide['publishdates']);
        unset($slide['generator']);
        
        $query.=',params='.$db->quote(json_encode($slide));
        
        $query.=' WHERE id = '.$db->quote($id);
        $db->setQuery($query);
        $db->query();
        return $id;
    }
    
    function delete($id){
        $db = NextendDatabase::getInstance();
        $db->setQuery('DELETE FROM #__nextend_smartslider_slides WHERE id='.$db->quote($id));
        $db->query();
    }

    function duplicate($id, $sliderid = null){
        $slide = $this->getSlide($id);
        unset($slide['id']);
        $slide['published'] = 0;
        $slide['title'].= ' - copy';
        return $this->create($slide['slider'], $slide, false);
    }
    
    function first($sliderid, $id){
        $db = NextendDatabase::getInstance();
        $db->setQuery('UPDATE #__nextend_smartslider_slides SET first = 0 WHERE slider='.$db->quote($sliderid));
        $db->query();
        
        $db->setQuery('UPDATE #__nextend_smartslider_slides SET first = 1 WHERE id='.$db->quote($id));
        $db->query();
    }
    
    function publish($id){
        $db = NextendDatabase::getInstance();
        $db->setQuery('UPDATE #__nextend_smartslider_slides SET published = 1 WHERE id='.$db->quote($id));
        $db->query();
    }
    
    function unpublish($id){
        $db = NextendDatabase::getInstance();
        $db->setQuery('UPDATE #__nextend_smartslider_slides SET published = 0 WHERE id='.$db->quote($id));
        $db->query();
    }
    
    function deleteBySlider($sliderid){
        $db = NextendDatabase::getInstance();
        $db->setQuery('DELETE FROM #__nextend_smartslider_slides WHERE slider = '.$db->quote($sliderid));
        $db->query();
    }

    function deleteGeneratedBySlider($sliderid){
        $db = NextendDatabase::getInstance();
        $db->setQuery('DELETE FROM #__nextend_smartslider_slides WHERE generator > 0 AND slider = '.$db->quote($sliderid));
        $db->query();
    }
    
    function order($sliderid, $ids){
        if(is_array($ids) && count($ids) > 0){
            $db = NextendDatabase::getInstance();
            $i = 0;
            foreach($ids AS $id){
                $id = intval($id);
                if($id > 0){
                    $query = 'UPDATE #__nextend_smartslider_slides SET ';

                    $query.=' ordering='.$db->quote($i);

                    $query.=' WHERE id = '.$db->quote($id). ' AND slider = '.$db->quote($sliderid);
                    $db->setQuery($query);
                    $db->query();
                    $i++;
                }
            }
            return $i;
        }
        return false;
    }
}