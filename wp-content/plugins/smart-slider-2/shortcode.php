<?php

function smart_slider2_shortcode($atts) {
    extract(shortcode_atts(array(
        'id' => md5(time()),
        'slider' => 0,
                    ), $atts));

    if ($slider == 0)
        return '';

    $params = array();
    nextendimportsmartslider2('nextend.smartslider.wordpress.slider');
    $sl = new NextendSliderWordpress(intval($slider), $params, dirname(__FILE__));
    
    
    ob_start();
    $sl->render();
    return ob_get_clean();
}

add_shortcode('smartslider2', 'smart_slider2_shortcode');
?>
