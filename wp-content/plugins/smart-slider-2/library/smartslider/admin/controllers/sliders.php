<?php

class NextendSmartsliderAdminControllerSliders extends NextendSmartsliderAdminController {

    function defaultAction() {

        $this->display('default', 'default');
    }

    function createAction() {
        if ($this->canDo('slider.create')) {
            if (NextendRequest::getInt('save')) {
                $slidersModel = $this->getModel('sliders');
                if ($sliderid = $slidersModel->create(NextendRequest::getVar('slider'))) {
                    header('LOCATION: ' . $this->route('controller=sliders&view=sliders_slider&action=edit&sliderid=' . $sliderid));
                    exit;
                }
            }
            $this->display('default', 'create');
        } else {
            $this->noaccess();
        };
    }

    function editAction() {
        if ($this->canDo('slider.edit')) {
            $slidersModel = $this->getModel('sliders');
            if (!$slidersModel->getSlider(NextendRequest::getInt('sliderid'))) {
                header('LOCATION: ' . $this->route('controller=sliders&view=sliders_slider'));
                exit;
            }

            if (NextendRequest::getInt('save')) {
                if ($sliderid = $slidersModel->save(NextendRequest::getInt('sliderid'), NextendRequest::getVar('slider'))) {
                    header('LOCATION: ' . $this->route('controller=sliders&view=sliders_slider&action=edit&sliderid=' . $sliderid));
                    exit;
                }
            }
            $this->display('default', 'edit');
        } else {
            $this->noaccess();
        }
    }

    function deleteAction() {
        if ($this->canDo('slider.delete')) {
            if ($sliderid = NextendRequest::getInt('sliderid')) {
                $slidersModel = $this->getModel('sliders');
                $slidersModel->delete($sliderid);
                header('LOCATION: ' . $_SERVER["HTTP_REFERER"]);
                exit;
            }
            header('LOCATION: ' . $this->route('controller=sliders&view=sliders_slider'));
            exit;
        } else {
            $this->noaccess();
        };
    }

    function deleteslidesAction() {
        if ($this->canDo('slide.delete')) {
            if ($sliderid = NextendRequest::getInt('sliderid')) {
                $slidersModel = $this->getModel('sliders');
                $slidersModel->deleteslides($sliderid);
                header('LOCATION: ' . $_SERVER["HTTP_REFERER"]);
                exit;
            }
            header('LOCATION: ' . $this->route('controller=sliders&view=sliders_slider'));
            exit;
        } else {
            $this->noaccess();
        };
    }

    function duplicateAction() {
        if ($this->canDo('slider.create')) {
            if ($this->canDo('slider.create') && $sliderid = NextendRequest::getInt('sliderid')) {
                $slidersModel = $this->getModel('sliders');
                $newsliderid = $slidersModel->duplicate($sliderid);
                header('LOCATION: ' . $this->route('controller=sliders&view=sliders_slider&action=edit&sliderid=' . $newsliderid));
                exit;
            }
            header('LOCATION: ' . $this->route('controller=sliders&view=sliders_slider'));
            exit;
        } else {
            $this->noaccess();
        };
    }

    function generatorAction() {
        if ($this->canDo('slider.edit')) {
            $slidersModel = $this->getModel('sliders');
            if (!$slidersModel->getSlider(NextendRequest::getInt('sliderid'))) {
                header('LOCATION: ' . $this->route('controller=sliders&view=sliders_slider'));
                exit;
            }

            if (NextendRequest::getInt('save')) {
                if ($sliderid = $slidersModel->saveGenerator(NextendRequest::getInt('sliderid'), NextendRequest::getVar('generator', ''), NextendRequest::getVar('slide', ''))) {
                    header('LOCATION: ' . $this->route('controller=sliders&view=sliders_generator&action=generator&sliderid=' . $sliderid));
                    exit;
                }
            }

            $this->display('edit', 'edit');
        } else {
            $this->noaccess();
        }
    }

    function createmoduleAction() {
        if ($this->canDo('core.create', 'com_modules')) {
            $id = NextendRequest::getInt('sliderid', 0);
            if ($id) {
                $slidersModel = $this->getModel('sliders');
                $slider = $slidersModel->getSlider($id);
                if ($slider) {
                    $title = $slider['title'];
                    if (version_compare(JVERSION, '1.6.0', 'ge')) {
                        $param = '{"config":{"slider":"' . $id . '","showtablet":"1","showcustomtablet":"0|*|","showmobile":"1","showcustommobile":"0|*|"},"moduleclass_sfx":"","cache":"0","cache_time":"900","cachemode":"itemid"}';
                        $db = JFactory::getDBO();
                        $date = JFactory::getDate();
                        $sql = "INSERT INTO #__modules (title, module, ordering, published, access, params, language) VALUES (" . $db->quote($title . " created on " . $date->format('Y-m-d H:i:s', true)) . ", 'mod_smartslider2', 0, 1, 1, '" . $param . "', '*')";
                        $db->setQuery($sql);
                        $db->query();
                        $moduleid = $db->insertid();
                        $sql = "INSERT INTO #__modules_menu (moduleid, menuid) VALUES (" . $moduleid . ",0)";
                        $db->setQuery($sql);
                        $db->query();
                        header('LOCATION: ' . JRoute::_('index.php?option=com_modules&filter_position=none&filter_search=' . urlencode($title), false));
                    } else { // Joomla 1.5
                        $db = JFactory::getDBO();
                        $sql = "INSERT INTO `#__modules` (`title`, `content`, `ordering`, `position`, `published`, `module`, `numnews`, `access`, `showtitle`, `params`, `iscore`, `client_id`, `control`) VALUES
                                                      ('Smart Slider 2', '', 0, '', 1, 'mod_smartslider2', 0, 0, 1, 'slider=" . $id . "\\nshowtablet=1\\nshowcustomtablet=0\\\\|*\\\\|0\\nshowmobile=1\\nshowcustommobile=0\\\\|*\\\\|0\\ncache=0\\nmoduleclass_sfx=\\n\\n', 0, 0, '');";
                        $db->setQuery($sql);
                        $db->query();
                        $moduleid = $db->insertid();
                        $sql = "INSERT INTO #__modules_menu (moduleid, menuid) VALUES (" . $moduleid . ",0)";
                        $db->setQuery($sql);
                        $db->query();
                        header('LOCATION: ' . JRoute::_('index.php?option=com_modules&client=0&task=edit&id=' . $moduleid, false));
                    }
                    exit;
                }
            }
            header('LOCATION: ' . $this->route('controller=sliders&view=sliders_slider'));
            exit;
        } else {
            $this->noaccess();
        }
    }
    
    function fullAction() {
        if(nextendIsJoomla()){
            $this->display('default', 'full');
        }else if(nextendIsWordpress()){
            $this->display('default', 'fullwordpress');
        }
    }
    
    function exportAction() {
        if ($this->canDo('slider.edit')) {
            $id = NextendRequest::getInt('sliderid', 0);
            if ($id) {
                $slidersModel = $this->getModel('sliders');
				ob_clean();
                $file = $slidersModel->exportSlider($id);
                
                header('Content-Description: Smart Slider 2 Export');
                header('Content-Type: application/octet-stream');
                header('Content-Disposition: attachment; filename="'.basename($file[0]).'"'); //<<< Note the " " surrounding the file name
                header('Content-Transfer-Encoding: binary');
                header('Connection: Keep-Alive');
                header('Expires: 0');
                header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
                header('Pragma: public');
                if (function_exists('mb_strlen')) {
                    header('Content-Length: ' . mb_strlen($file[1], '8bit'));
                } else {
                    header('Content-Length: ' . strlen($file[1]));
                }
                echo $file[1];
                exit;
            }
        } else {
            $this->noaccess();
        }
    }
    
    function importAction() {
        if ($this->canDo('slider.edit')) {
            if(isset($_FILES['file'])){
                $zip = new ZipArchive;
                if(is_file($_FILES['file']['tmp_name'])){
                    $res = $zip->open($_FILES['file']['tmp_name']);
                    if ($res === TRUE) {
                        $slider = $zip->getFromName('slider.ss2');
                        if($slider){
                        
                            $slidersModel = $this->getModel('sliders');
                            $sliderid = $slidersModel->import(unserialize($slider));
                            NextendMessage::success('Success', '1 Slider imported!');
                            if($sliderid){
                                $slides = $zip->getFromName('slides.ss2');
                                if($slides){
                                    $slidesModel = $this->getModel('slides');
                                    $slides = unserialize($slides);
                                    foreach($slides AS $slide){
                                        $slide['slider'] = $sliderid;
                                        $slidesModel->create($sliderid, $slide, false);
                                    }
                                    NextendMessage::success('Success', count($slides).' Slide(s) imported!');
                                }
                                $fonts = $zip->getFromName('fonts.ss2');
                                if($fonts){
                                    NextendSmartSliderStorage::set('font'.$sliderid, json_encode(unserialize($fonts)));
                                    NextendMessage::success('Success', '1 font set imported!');
                                }
                            }
                        }
                    }else{
                        NextendMessage::error('Error', 'There was an error in the uploaded file');
                    }
                }else{
                    NextendMessage::error('Error', 'There was an error in the uploaded file');
                }
            }
            $this->display('default','import');
        } else {
            $this->noaccess();
        }
    }

}

?>
