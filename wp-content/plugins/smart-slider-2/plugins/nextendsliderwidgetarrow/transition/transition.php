<?php

nextendimport('nextend.image.color');

class plgNextendSliderWidgetArrowTransition extends NextendPluginBase {

    var $_name = 'transition';

    function onNextendarrowList(&$list) {
        $list[$this->_name] = $this->getPath();
    }

    function getPath() {
        return dirname(__FILE__) . DIRECTORY_SEPARATOR . 'transition' . DIRECTORY_SEPARATOR;
    }

    static function render($slider, $id, $params) {

        $html = '';

        $previous = $params->get('previous', false);

        $next = $params->get('next', false);

        $enabled = $previous && $previous != -1 && $next && $next != -1;

        if ($enabled) {

            $display = NextendParse::parse($params->get('widgetarrowdisplay', '0|*|always'));

            $displayclass = 'nextend-widget-' . $display[1] . ' ';

            $color = $params->get('arrowbackground', '00ff00ff');
            $rgba = NextendColor::hex2rgba($color);
            $rgbacss = 'RGBA(' . $rgba[0] . ',' . $rgba[1] . ',' . $rgba[2] . ',' . round($rgba[3] / 127, 2) . ')';
            $colorhex = substr($color, 0, 6);

            $colorhover = $params->get('arrowbackgroundhover', '000000ff');
            $rgbahover = NextendColor::hex2rgba($colorhover);
            $rgbacsshover = 'RGBA(' . $rgbahover[0] . ',' . $rgbahover[1] . ',' . $rgbahover[2] . ',' . round($rgbahover[3] / 127, 2) . ')';
            $colorhexhover = substr($colorhover, 0, 6);

            if ($previous && $previous != -1) {

                $css = NextendCss::getInstance();
                $css->addCssFile(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'transition' . DIRECTORY_SEPARATOR . 'style.css');

                $style = 'position: absolute;';
                $previousposition = NextendParse::parse($params->get('previousposition', ''));
                if (count($previousposition)) {
                    $style .= $previousposition[0] . ':' . $previousposition[1] . $previousposition[2] . ';';
                    $style .= $previousposition[3] . ':' . $previousposition[4] . $previousposition[5] . ';';
                }
                $info = pathinfo($previous);
                $class = 'nextend-transition nextend-transition-previous nextend-transition-previous-' . basename($previous, '.' . $info['extension']);
                $html .= '<div onclick="njQuery(\'#' . $id . '\').smartslider(\'previous\');" class="' . $displayclass . $class . '" style="' . $style . '"><div class="outer"></div><div class="inner"></div></div>';
            }

            if ($next && $next != -1) {

                $css = NextendCss::getInstance();
                $css->addCssFile(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'transition' . DIRECTORY_SEPARATOR . 'style.css');

                $style = 'position: absolute;';
                $nextposition = NextendParse::parse($params->get('nextposition', ''));
                if (count($nextposition)) {
                    $style .= $nextposition[0] . ':' . $nextposition[1] . $nextposition[2] . ';';
                    $style .= $nextposition[3] . ':' . $nextposition[4] . $nextposition[5] . ';';
                }
                $info = pathinfo($next);
                $class = 'nextend-transition nextend-transition-next nextend-transition-next-' . basename($next, '.' . $info['extension']);
                $html .= '<div onclick="njQuery(\'#' . $id . '\').smartslider(\'next\');" class="' . $displayclass . $class . '" style="' . $style . '"><div class="outer"></div><div class="inner"></div></div>
                  <style>
                   .nextend-transition.nextend-transition-previous .outer,
                   .nextend-transition.nextend-transition-next .outer{
                    background-color:' . $rgbacss . ';
                  }
                   .nextend-transition.nextend-transition-previous .inner,
                   .nextend-transition.nextend-transition-next .inner{
                    background-color:' . $rgbacsshover . ';
                  }
                </style>
                ';
            }
        }

        return $html;
    }

}
NextendPlugin::addPlugin('nextendsliderwidgetarrow', 'plgNextendSliderWidgetArrowTransition');