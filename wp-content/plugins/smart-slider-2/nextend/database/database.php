<?php

class NextendDatabaseAbstract {
    
    static function getInstance() {

        static $instance;
        if (!is_object($instance)) {
            $instance = new NextendDatabase();
        }
        return $instance;
    }
}

if (nextendIsJoomla()) {
    nextendimport('nextend.database.joomla');
} elseif (nextendIsWordPress()) {
    nextendimport('nextend.database.wordpress');
}elseif (nextendIsMagento()) {
    nextendimport('nextend.database.magento');
}else{
    nextendimport('nextend.database.default');
}

