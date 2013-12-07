<?php

class NextendSmartsliderAdminControllerSlides extends NextendSmartsliderAdminController {

    function defaultAction() {

        $this->display('default', 'default');
    }

    function createAction() {
        if ($this->canDo('slide.create')) {
            if (NextendRequest::getInt('save')) {
                $slidesModel = $this->getModel('slides');
                if ($slideid = $slidesModel->create(NextendRequest::getInt('sliderid'), NextendRequest::getVar('slide'))) {
                    header('LOCATION: ' . $this->route('controller=slides&view=sliders_slide&action=edit&sliderid=' . NextendRequest::getInt('sliderid') . '&slideid=' . $slideid));
                    exit;
                }
            }
            $this->display('edit', 'create');
        } else {
            $this->noaccess();
        };
    }

    function editAction() {
        if ($this->canDo('slide.edit')) {
            $slidesModel = $this->getModel('slides');
            if (!$slidesModel->getSlide(NextendRequest::getInt('slideid'))) {
                header('LOCATION: ' . $this->route('controller=sliders&view=sliders_slider'));
                exit;
            }

            if (NextendRequest::getInt('save')) {
                if ($slideid = $slidesModel->save(NextendRequest::getInt('slideid'), NextendRequest::getVar('slide'))) {
                    header('LOCATION: ' . $this->route('controller=slides&view=sliders_slides&action=edit&sliderid=' . NextendRequest::getInt('sliderid') . '&slideid=' . $slideid));
                    exit;
                }
            }
            $this->display('edit', 'edit');
        } else {
            $this->noaccess();
        };
    }

    function deleteAction() {
        if ($this->canDo('slide.delete')) {
            if ($slideid = NextendRequest::getInt('slideid')) {
                $slidesModel = $this->getModel('slides');
                $slidesModel->delete($slideid);
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
        if ($this->canDo('slide.create')) {
            if ($slideid = NextendRequest::getInt('slideid')) {
                $slidesModel = $this->getModel('slides');
                $newslideid = $slidesModel->duplicate($slideid);
                header('LOCATION: ' . $this->route('controller=slides&view=sliders_slides&action=edit&sliderid=' . NextendRequest::getInt('sliderid') . '&slideid=' . $newslideid));
                exit;
            }
            header('LOCATION: ' . $this->route('controller=sliders&view=sliders_slider'));
            exit;
        } else {
            $this->noaccess();
        };
    }

    function firstAction() {
        if ($this->canDo('slide.edit')) {
            if (($slideid = NextendRequest::getInt('slideid')) && ($sliderid = NextendRequest::getInt('sliderid'))) {
                $slidesModel = $this->getModel('slides');
                $slidesModel->first($sliderid, $slideid);
                header('LOCATION: ' . $_SERVER["HTTP_REFERER"]);
                exit;
            }
            header('LOCATION: ' . $this->route('controller=sliders&view=sliders_slider'));
            exit;
        } else {
            $this->noaccess();
        };
    }

    function publishAction() {
        if ($this->canDo('slide.edit')) {
            if ($slideid = NextendRequest::getInt('slideid')) {
                $slidesModel = $this->getModel('slides');
                $slidesModel->publish($slideid);
                header('LOCATION: ' . $_SERVER["HTTP_REFERER"]);
                exit;
            }
            header('LOCATION: ' . $this->route('controller=sliders&view=sliders_slider'));
            exit;
        } else {
            $this->noaccess();
        };
    }

    function unpublishAction() {
        if ($this->canDo('slide.edit')) {
            if ($slideid = NextendRequest::getInt('slideid')) {
                $slidesModel = $this->getModel('slides');
                $slidesModel->unpublish($slideid);
                header('LOCATION: ' . $_SERVER["HTTP_REFERER"]);
                exit;
            }
            header('LOCATION: ' . $this->route('controller=sliders&view=sliders_slider'));
            exit;
        } else {
            $this->noaccess();
        };
    }

    function orderAction() {
        if ($this->canDo('slide.edit')) {
            if ($sliderid = NextendRequest::getInt('sliderid')) {
                $slidesModel = $this->getModel('slides');
                $slidesModel->order($sliderid, NextendRequest::getVar('slideorder'));
            }
            exit;
        } else {
            $this->noaccess();
        };
    }
}