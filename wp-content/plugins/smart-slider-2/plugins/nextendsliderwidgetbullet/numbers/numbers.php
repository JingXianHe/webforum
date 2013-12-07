<?php

nextendimport('nextend.image.color');

class plgNextendSliderWidgetBulletNumbers extends NextendPluginBase {

    var $_name = 'numbers';

    function onNextendbulletList(&$list) {
        $list[$this->_name] = $this->getPath();
    }

    function getPath() {
        return dirname(__FILE__) . DIRECTORY_SEPARATOR . 'numbers' . DIRECTORY_SEPARATOR;
    }

    static function render($slider, $id, $params) {

        $html = '';
        
        $bullet = $params->get('bullet', false);
        if ($bullet && $bullet != -1) {

            $display = NextendParse::parse($params->get('widgetbulletdisplay', '0|*|always'));

            $displayclass = 'nextend-widget-' . $display[1] . ' ';

            $css = NextendCss::getInstance();
            $css->addCssFile(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'numbers' . DIRECTORY_SEPARATOR . 'style.css');

            $color = $params->get('bulletbackground', '00000060');
            $rgba = NextendColor::hex2rgba($color);
            $rgbacss = 'RGBA('.$rgba[0].','.$rgba[1].','.$rgba[2].','.round($rgba[3]/127, 2).')';
            $colorhex = substr($color, 0,6);

            $colorhover = $params->get('bulletbackgroundhover', '7670C7ff');
            $rgbahover = NextendColor::hex2rgba($colorhover);
            $rgbacsshover = 'RGBA('.$rgbahover[0].','.$rgbahover[1].','.$rgbahover[2].','.round($rgbahover[3]/127, 2).')';
            $colorhexhover = substr($colorhover, 0,6);

            $colorborderbar = $params->get('bulletbarcolor', '00000060');
            $rgbaborderbar = NextendColor::hex2rgba($colorborderbar);
            $rgbacssborderbar = 'RGBA('.$rgbaborderbar[0].','.$rgbaborderbar[1].','.$rgbaborderbar[2].','.round($rgbaborderbar[3]/127, 2).')';
            $colorhexborderbar = substr($colorborderbar, 0,6);

            $colorthumbnail = $params->get('bulletthumbnail', '00000060');
            $rgbathumbnail = NextendColor::hex2rgba($colorthumbnail);
            $rgbacssthumbnail = 'RGBA('.$rgbathumbnail[0].','.$rgbathumbnail[1].','.$rgbathumbnail[2].','.round($rgbathumbnail[3]/127, 2).')';
            $colorhexthumbnail = substr($colorthumbnail, 0,6);

            $style = 'position: absolute; width: 100%; visibility: hidden;z-index:10;';
            $bulletposition = NextendParse::parse($params->get('bulletposition', ''));
            if (count($bulletposition)) {
                $style .= $bulletposition[0] . ':' . $bulletposition[1] . $bulletposition[2] . ';';
                $style .= $bulletposition[3] . ':' . $bulletposition[4] . $bulletposition[5] . ';';
            }

            $bulletalign = $params->get('bulletalign', 'center');
            if ($bulletalign) {
                $style.= 'text-align:'.$bulletalign.';';
            }

            $info = pathinfo($bullet);
            $class = 'nextend-bullet nextend-bullet-numbers nextend-bullet-numbers-' . basename($bullet, '.' . $info['extension']);
            
            $class.= ' nextend-bullet-'.$params->get('bulletorientation', 'horizontal');
        
            $shadow = $params->get('bulletshadow', 'none');
            switch($shadow){
              case 'inner':                
                $class.=' bullet-shadow-inner';
                break;
              case 'outer':                
                $class.=' bullet-shadow-outer';
                break;
            }   

            $bar = $params->get('bulletbar', 'none');
            switch($bar){
              case 'simplerounded':                
                $class.=' bullet-bar-simple-rounded';
                break;
              case 'elegantrounded':                
                $class.=' bullet-bar-elegant-rounded';
                break;
              case 'simple':                
                $class.=' bullet-bar-simple';
                break;
              case 'elegant':                
                $class.=' bullet-bar-elegant';
                break;
            }
            
            $html .= '<div style="' . $style . '" class="'.$displayclass.'"><div class="nextend-bullet-container ' . $class . '">';
            $i = 0;
            foreach ($slider->_slides AS $slide) {
                $html .= '<div onclick="njQuery(\'#'.$id.'\').smartslider(\'goto\','.$i.',false);" data-thumbnail="'.$slide['thumbnail'].'"  class="' . $class . ($slide['first'] ? ' active' : ''). '"><span class="'.$params->get('fontclassnumber', 'sliderfont7').'">
                ' .($i+1). '
                </span></div>';
                $i++;
            }
            
            

            $bullethumbnail = NextendParse::parse($params->get('bullethumbnail', false), '0|*|top');
            $thumbnailsize = NextendParse::parse($params->get('thumbnailsizebullet', false), '100|*|60');

            if($bullethumbnail[0]){
                $css = NextendCss::getInstance();
                $js = NextendJavascript::getInstance();
                $css->addCssLibraryFile('jquery.qtip.min.css');
                $js->loadLibrary('jquery');
                $js->addLibraryJsAssetsFile('jquery', 'jquery.qtip.min.js');
                $my = '';
                $at = '';
                $y = 0;
                $x = 0;
                switch($bullethumbnail[1]){
                    case 'right':
                        $my = 'left center';
                        $at = 'right center';
                        $x = 3;
                        break;
                    case 'bottom':
                        $my = 'top center';
                        $at = 'bottom center';
                        $y = 3;
                        break;
                    case 'left':
                        $my = 'right center';
                        $at = 'left center';
                        $x = -3;
                        break;
                    default:
                        $my = 'bottom center';
                        $at = 'top center';
                        $y = -3;
                }

                $js->addLibraryJs('jquery', '$("#'.$id.' .nextend-bullet-container .nextend-bullet:not([data-thumbnail=\"\"])").qtip({
                        position: {
                            my: "'.$my.'",
                            at: "'.$at.'",
                            adjust: {
                              x: '.$x.',
                              y: '.$y.'
                            }
                        },
                        prerender: true,
                        style: {
                            tip: {
                                width: 12,
                                height: 6
                            },
                            classes: "nextend-bullet-numbers-thumbnail"
                        },
                        content: {
                            text: function(e, api) {
                                var img = $(this).attr("data-thumbnail");
                                return "<img src=\'" + img + "\' style=\'width:100%;\' />";
                            }
                        }
                    });
                ');
            }

            $html .= '</div></div>
              <style>
              .nextend-bullet-container .nextend-bullet-numbers.nextend-bullet{                
                background:'.$rgbacss.';
              }
              .nextend-bullet-container .nextend-bullet-numbers.nextend-bullet.active,
              .nextend-bullet-container .nextend-bullet-numbers.nextend-bullet:HOVER{
                background:'.$rgbacsshover.';
              }
              .nextend-bullet-container.nextend-bullet.nextend-bullet-numbers.bullet-bar-simple-rounded,              
              .nextend-bullet-container.nextend-bullet.nextend-bullet-numbers.bullet-bar-elegant-rounded,
              .nextend-bullet-container.nextend-bullet.nextend-bullet-numbers.bullet-bar-simple,              
              .nextend-bullet-container.nextend-bullet.nextend-bullet-numbers.bullet-bar-elegant{              
                background:'.$rgbacssborderbar.';
              }
              .nextend-bullet-numbers-thumbnail .qtip-content{
                width:'.$thumbnailsize[0].'px;                
                height:'.$thumbnailsize[1].'px;
                padding: 4px;
              }         
              .nextend-bullet-numbers-thumbnail .qtip-content img{
                box-shadow: 0 0px 0px 1px RGBA(255,255,255,.2);
              }
              .nextend-bullet-numbers-thumbnail{
                background: '.$rgbacssthumbnail.';
              }     
              </style>
            ';
        }

        return $html;
    }

}
NextendPlugin::addPlugin('nextendsliderwidgetbullet', 'plgNextendSliderWidgetBulletNumbers');