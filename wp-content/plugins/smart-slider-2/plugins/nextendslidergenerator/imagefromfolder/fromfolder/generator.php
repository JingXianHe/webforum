<?php

nextendimportsmartslider2('nextend.smartslider.generator_abstract');

class NextendGeneratorImagefromfolder_fromfolder extends NextendGeneratorAbstract {

    function NextendGeneratorImagefromfolder_fromfolder($data) {
        parent::__construct($data);
        $this->_variables = array(
            'image_url' => 'Url to the image',
            'file_name' => 'Name of the image file'
        );
    }

    function getData($number) {

        $data = array();

        $folder = $this->_data->get('sourcefolder', '');
        $files = NextendFilesystem::files($folder);
        $j = 0;
        for ($i = 0; $i < count($files) && $j < $number; $i++){
            $ext = pathinfo($files[$i], PATHINFO_EXTENSION);
            if ($ext == 'jpg' || $ext == 'jpeg' || $ext == 'png') {
                $data[$j] = array();
                $data[$j]['image_url'] = NextendUri::pathToUri($folder.$files[$i]);
                $data[$j]['file_name'] = $files[$i];
                $j++;
            }
        }

        return $data;
    }
}