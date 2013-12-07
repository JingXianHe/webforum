<?php
$js = NextendJavascript::getInstance();
$js->addLibraryJsFile('jquery', dirname(__FILE__) . DIRECTORY_SEPARATOR . 'slider.js');

$backgroundimage = $this->_sliderParams->get('simplebackgroundimage', '');
$backgroundimagecss = '';
if ($backgroundimage && $backgroundimage != '-1') $backgroundimagecss = 'background-image: url(' . $backgroundimage . ');';


$flux = (array)NextendParse::parse($this->_sliderParams->get('simplebackgroundanimation', '0|*|bars'));
$flux[0] = $this->_backend ? 0 : intval($flux[0]);
$flux[1] = 'bars';
$flux[1] = (array)$flux[1];
if ($flux[0]) {
    $js->addLibraryJsFile('jquery', dirname(__FILE__) . DIRECTORY_SEPARATOR . 'flux.jquery.js');
}
?>
<script type="text/javascript">
    window['<?php echo $id; ?>-onresize'] = [];
</script>

<div id="<?php echo $id; ?>"
     style="font-size: <?php echo intval($this->_sliderParams->get('globalfontsize', 14)); ?>px;">
    <div class="smart-slider-border1" style="<?php echo $backgroundimagecss . $this->_sliderParams->get('simpleslidercss', ''); ?>">
        <div class="smart-slider-border2">
            <?php if ($flux[0]): ?>
                <div class="nextend-flux">
                    <?php foreach ($this->_slides AS $slide): ?>
                        <?php if ($slide['bg']): ?>
                            <img src="<?php echo $slide['bg']; ?>" class="nextend-slide-bg"<?php if ($slide['first']) echo ' style="z-index:2;position: absolute; top: 0px; left: 0px;" '; ?>/>
                        <?php endif; ?>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>

            <?php foreach ($this->_slides AS $slide): ?>
                <div class="<?php echo $slide['classes']; ?> smart-slider-bg-colored" style="<?php echo $slide['style']; ?>"<?php echo $slide['link']; ?>>
                    <?php if (!$this->_backend && !$flux[0] && $slide['bg']): ?>
                        <img src="<?php echo $slide['bg']; ?>" class="nextend-slide-bg"/>
                    <?php endif; ?>
                    <?php if ($this->_backend && strpos($slide['classes'], 'smart-slider-slide-active') !== false): ?>
                        <img src="<?php echo $slide['bg']; ?>" class="nextend-slide-bg"/>
                    <?php endif; ?>
                    <div class="smart-slider-canvas-inner">
                        <?php echo $slide['slide']; ?>
                    </div>
                    <?php if(nextendIsJoomla()){ ?>
                        <div style="position: absolute; right: 10px; bottom: 10px;z-index: 100000;"><img src="http://www.nextendweb.com/demo/smartslider2/trial/watermark.png" /></div>
                    <?php } ?>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
    <?php
    $widgets->echoRemainder();
    ?>
</div>

<?php
$responsive = NextendParse::parse($this->_sliderParams->get('responsive', '0|*|0'));

$animation = explode('||', 'horizontal');
$animationproperties = NextendParse::parse($this->_sliderParams->get('simpleanimationproperties', '1500|*|0|*|easeInOutQuint|*|0.45'));

$controls = NextendParse::parse($this->_sliderParams->get('controls', '0|*|0'));


?>
<script type="text/javascript">
    njQuery(document).ready(function () {
        njQuery('#<?php echo $id; ?>').smartslider({
            type: 'ssSimpleSlider',
            translate3d: <?php echo intval(NextendSmartSliderSettings::get('translate3d', 1)); ?>,
            playfirstlayer: <?php echo intval($this->_sliderParams->get('playfirstlayer', 0)); ?>,
            mainafterout: <?php echo intval($this->_sliderParams->get('mainafterout', 1)); ?>,
            inaftermain: <?php echo intval($this->_sliderParams->get('inaftermain', 1)); ?>,
            animation: <?php echo json_encode($animation); ?>,
            animationSettings: {
                duration: <?php echo intval($animationproperties[0]); ?>,
                delay: <?php echo intval($animationproperties[1]); ?>,
                easing: '<?php echo $animationproperties[2]; ?>',
                parallax: <?php echo floatval($animationproperties[3]); ?>
            },
            flux: <?php echo json_encode($flux); ?>,
            autoplay: 0,
            autoplayConfig: {
                duration: 0,
                stopautoplay: {
                    click: 0,
                    mouseenter: 0,
                    slideplaying: 0
                },
                resumeautoplay: {
                    mouseleave: 0,
                    slideplayed: 0
                }
            },
            responsive: {
                downscale: <?php echo intval($responsive[0]); ?>,
                upscale: <?php echo intval($responsive[1]); ?>,
                maxwidth: <?php echo intval($this->_sliderParams->get('simpleresponsivemaxwidth', 3000)); ?>
            },
            controls: {
                scroll: <?php echo intval($controls[0]); ?>,
                touch: '<?php echo $controls[1]; ?>'
            },
            blockrightclick: <?php echo intval($this->_sliderParams->get('blockrightclick', 0)); ?>
        });
    });
</script>
<div style="clear: both;"></div>
