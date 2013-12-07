<?php
$js = NextendJavascript::getInstance();


$accessModuleCreate = $this->canDo('core.create', 'com_modules');
$accessSliderCreate = $this->canDo('slider.create');
$accessSliderEdit = $this->canDo('slider.edit');
$accessSliderDelete = $this->canDo('slider.delete');
$accessSlideCreate = $this->canDo('slide.create');
$accessSlideEdit = $this->canDo('slide.edit');
$accessSlideDelete = $this->canDo('slide.delete');
$accessCore = $this->canDo('core.admin');

$j15 = nextendIsWordPress() || version_compare(JVERSION, '1.6.0', 'ge') ? false : true;

$isJ = nextendIsJoomla();
$isWP = nextendIsWordPress();

if ($accessSliderCreate) :
    ?>
    <div class="smartslider-button-wrap">
        <table style="width: 100%;">
        <tr>
        <td>
        <div class="smartslider-button smartslider-createslider smartslider-button-grey smartslider-button-blue-active smartslider-icon-container <?php echo NextendRequest::getCmd('view') == 'sliders_slider' && NextendRequest::getCmd('action') == 'create' ? 'active' : ''; ?>">
            <a class="smartslider-button-link"
               href="<?php echo $this->route('controller=sliders&view=sliders_slider&action=create'); ?>"><span
                    class="smartslider-icon smartslider-icon-add"></span><?php echo NextendText::_('Create_slider'); ?></a>
        </div>
        </td>
        <td style="width: 80px;">
        <div class="smartslider-button smartslider-import smartslider-button-grey smartslider-button-blue-active smartslider-icon-container <?php echo NextendRequest::getCmd('view') == 'sliders_slider' && NextendRequest::getCmd('action') == 'import' ? 'active' : ''; ?>" style="margin-left: 0;">
            <a class="smartslider-button-link"
               href="<?php echo $this->route('controller=sliders&view=sliders_slider&action=import'); ?>"><span
                    class="smartslider-icon smartslider-icon-import"></span><?php echo NextendText::_('Import'); ?></a>
        </div>
        </td>
        </tr>
        </table>
    </div>
<?php endif; ?>
<div style="clear: both;"></div>
<?php
$slidersModel = $this->getModel('sliders');
$sliders = $slidersModel->getSliders();
?>
<dl class="smartslider-list smartslider-sliders-list">
    <?php
    $sliderid = NextendRequest::getInt('sliderid');
    $i = 0;
    foreach ($sliders AS $slider):
        $c = $i % 2 ? 'even' : 'odd';
        $i++;
        $active = $sliderid == $slider['id'];

        $generator = json_decode($slider['generator'], true);
        if ($generator && isset($generator['enabled']) && $generator['enabled']) {
            $generator = true;
        }else{
            $generator = false;
        }

        ?>
        <dt class="<?php echo $c; ?> smartslider-button-blue-active smartslider-icon-container <?php echo $active ? 'subactive' : ''; ?> <?php echo $active && NextendRequest::getCmd('controller') == 'sliders' ? 'active' : ''; ?>">
            <a class="smartslider-button-link"
               href="<?php echo $this->route('controller=sliders&view=sliders_slider&action=edit&sliderid=' . $slider['id']); ?>"><?php echo $slider['title']; ?></a>
               
            <div class="tooltip-actions" style="display: none;">
                <ul class="sidebar-tooltip-menu">

                    <?php if ($accessSliderEdit): ?>
                        <li class="smartslider-icon-container">
                            <a href="<?php echo $this->route('controller=sliders&view=sliders_slider&action=edit&sliderid=' . $slider['id']); ?>">
                                <span class="smartslider-qtip-icon create_slider"></span>
                                <?php echo NextendText::_('Edit slider'); ?>
                            </a>
                        </li>
                    <?php endif; ?>
                    
                    <?php if (!$j15 && $accessSliderEdit): ?>
                        <li class="smartslider-icon-container">
                            <a href="<?php echo $this->route('controller=sliders&view=sliders_generator&action=generator&sliderid=' . $slider['id']); ?>">
                                <span class="smartslider-qtip-icon generator"></span>
                                <?php echo NextendText::_('Generator'); ?>
                                <?php if ($generator): ?>
                                    <span class="smartslider-qtip-icon activegreen"></span>
                                <?php endif; ?>
                            </a>
                        </li>
                    <?php endif; ?>
                    
                    <?php if ($accessCore): ?>
                        <li class="smartslider-icon-container">
                            <a href="<?php echo $this->route('controller=settings&view=sliders_settings&action=font&sliderid=' . $slider['id']); ?>">
                                <span class="smartslider-qtip-icon fontsettings"></span>
                                <?php echo NextendText::_('Slider fonts'); ?>
                                <?php if (NextendSmartSliderStorage::get('font'.$slider['id'])): ?>
                                    <span class="smartslider-qtip-icon activegreen"></span>
                                <?php endif; ?>
                            </a>
                        </li>
                    <?php endif; ?>
                    
                    <?php if ($accessModuleCreate): ?>
                        <?php if($isWP): ?>
                            <li class="smartslider-icon-container">
                                <a href="" onclick="var w = window.open(',', 'popup', 'toolbar = no, status = no,width=600,height=200'); w.document.write('Posts and Pages:<?php echo htmlspecialchars('<br>[smartslider2 slider="'.$slider['id'].'"]')."<br /><br />PHP:<br>".htmlspecialchars('echo do_shortcode(""[smartslider2 slider="'.$slider['id'].'"]"");'); ?>'.replace(/&quot;&quot;/g, '\'')); return false;">
                                    <span class="smartslider-qtip-icon shortcode"></span>
                                    <?php echo NextendText::_('Get Shortcode'); ?>
                                </a>
                            </li>
                        <?php else: ?>						
                            <li class="smartslider-icon-container">
                                <a href="<?php echo $this->route('controller=sliders&view=sliders_generator&action=createmodule&sliderid=' . $slider['id']); ?>">
                                    <span class="smartslider-qtip-icon shortcode"></span>
                                    <?php echo NextendText::_('Create_module'); ?>
                                </a>
                            </li>
                        <?php endif; ?>
                    <?php endif; ?>
                    <?php if ($accessSliderCreate): ?>
                        <li class="smartslider-icon-container">
                            <a href="<?php echo $this->route('controller=sliders&view=sliders_slider&action=duplicate&sliderid=' . $slider['id']); ?>">
                                <span class="smartslider-qtip-icon duplicate"></span>
                                <?php echo NextendText::_('Duplicate'); ?>
                            </a>
                        </li>
                    <?php endif; ?>
                    <?php if ($accessSliderEdit): ?>
                        <li class="smartslider-icon-container">
                            <a href="<?php echo $this->route('controller=sliders&view=sliders_slider&action=export&sliderid=' . $slider['id']); ?>">
                                <span class="smartslider-qtip-icon export"></span>
                                <?php echo NextendText::_('Export'); ?>
                            </a>
                        </li>
                    <?php endif; ?>
                    <?php if ($accessSlideDelete): ?>
                        <li class="smartslider-icon-container">
                            <a onclick="return confirm('Are you sure that you want to delete all the slides of this slider?')" href="<?php echo $this->route('controller=sliders&view=sliders_slider&action=deleteslides&sliderid=' . $slider['id']); ?>">
                                <span class="smartslider-qtip-icon subdelete"></span>
                                <?php echo NextendText::_('Delete slides'); ?>
                            </a>
                        </li>
                    <?php endif; ?>
                    <?php if ($accessSliderEdit): ?>
                        <li class="smartslider-icon-container">
                            <a onclick="return confirm('Are you sure that you want to delete the this slider?')" href="<?php echo $this->route('controller=sliders&view=sliders_slider&action=delete&sliderid=' . $slider['id']); ?>">
                                <span class="smartslider-qtip-icon delete"></span>
                                <?php echo NextendText::_('Delete'); ?>
                            </a>
                        </li>
                    <?php endif; ?>
                </ul>
            </div>

            <?php if ($active && NextendRequest::getCmd('controller') != 'sliders'): ?>
                <span class="smartslider-arrowdown-border"></span>
                <span class="smartslider-arrowdown"></span>
            <?php endif; ?>
        </dt>
        <dd class="<?php echo $active ? 'active' : ''; ?>">
            <?php if ($sliderid == $slider['id']): ?>
                <?php
                $js->addLibraryJsLibraryFile('jquery', 'ui/jquery.ui.core.min.js');
                $js->addLibraryJsLibraryFile('jquery', 'ui/jquery.ui.widget.min.js');
                $js->addLibraryJsLibraryFile('jquery', 'ui/jquery.ui.mouse.min.js');
                $js->addLibraryJsLibraryFile('jquery', 'ui/jquery.ui.sortable.min.js');
                $js->addLibraryJsFile('jquery', NEXTEND_SMART_SLIDER2_ASSETS . 'admin/js/slideordering.js');

                $js->addInlineJs('njQuery(document).ready(function() { '
                . 'window.smartSliderSlideOrdering.init("' . $this->route('controller=slides&view=sliders_slides&action=order&sliderid=' . $slider['id']) . '"); '
                . '});');

                $js->addInlineJs('njQuery(document).ready(function() { '
                . ' '
                . '});');
                ?>
                <ul class="smartslider-slides-list">
                    <?php if ($accessSlideCreate) : ?>
                        <li class="smartslider-button-grey smartslider-button-blue-active smartslider-icon-container <?php echo NextendRequest::getCmd('view') == 'sliders_slides' && NextendRequest::getCmd('action') == 'create' ? 'active' : ''; ?>">
                            <a class="smartslider-button-link"
                               href="<?php echo $this->route('controller=slides&view=sliders_slides&action=create&sliderid=' . $sliderid); ?>">
                                <span class="smartslider-icon smartslider-icon-smalladd"></span>
                                <?php echo NextendText::_('Create_slide'); ?>
                            </a>
                        </li>
                    <?php endif; ?>

                    <?php
                    $slidesModel = $this->getModel('slides');
                    $slides = $slidesModel->getSlides($sliderid);
                    $slideid = NextendRequest::getInt('slideid');
                    foreach ($slides AS $slide):
                        $activeslide = $slideid == $slide['id'];
                        ?>
                        <li id="slideorder_<?php echo $slide['id']; ?>"
                            class="smartslider-slide smartslider-icon-container smartslider-button-blue-active <?php echo $activeslide ? 'active' : ''; ?>">
                            <a class="smartslider-button-link"
                               href="<?php echo $this->route('controller=slides&view=sliders_slides&action=edit&sliderid=' . $slider['id'] . '&slideid=' . $slide['id']); ?>">
                                <span class="smartslider-icon smartslider-icon-ordering"></span>
                                <?php echo $slide['title']; ?>
                            </a>
                            <div class="tooltip-actions" style="display: none;">
                                <ul class="sidebar-tooltip-menu">
                                    <?php if ($accessSlideEdit): ?>
                                        <li class="smartslider-icon-container">
                                            <a href="<?php echo $this->route('controller=slides&view=sliders_slides&action=duplicate&sliderid=' . $slider['id'] . '&slideid=' . $slide['id']); ?>">
                                                <span class="smartslider-qtip-icon duplicate"></span>
                                                <?php echo NextendText::_('Duplicate'); ?>
                                            </a>
                                        </li>
                                    <?php endif; ?>
                                    <?php if ($accessSlideDelete): ?>
                                        <li class="smartslider-icon-container">
                                            <a onclick="return confirm('Are you sure that you want to delete the slide?')" href="<?php echo $this->route('controller=slides&view=sliders_slides&action=delete&sliderid=' . $slider['id'] . '&slideid=' . $slide['id']); ?>">
                                                <span class="smartslider-qtip-icon subdelete"></span>
                                                <?php echo NextendText::_('Delete'); ?>
                                            </a>
                                        </li>
                                    <?php endif; ?>
                                </ul>
                            </div>
                            <?php if ($accessSlideEdit) : ?>
                                <?php if ($slide['first']): ?>
                                    <a class="smartslider-icon smartslider-icon-starred nextend-element-hastip"
                                       title="<?php echo NextendText::_('First_slide'); ?>"
                                       href="<?php echo $this->route('controller=slides&view=sliders_slides&action=first&sliderid=' . $slider['id'] . '&slideid=' . $slide['id']); ?>">First
                                        slide</a>
                                <?php else: ?>
                                    <a class="smartslider-icon smartslider-icon-star nextend-element-hastip"
                                       title="<?php echo NextendText::_('Click_to_set_first'); ?>"
                                       href="<?php echo $this->route('controller=slides&view=sliders_slides&action=first&sliderid=' . $slider['id'] . '&slideid=' . $slide['id']); ?>">Set
                                        first slide</a>
                                <?php endif; ?>
                                <?php if ($slide['published']): ?>
                                    <a class="smartslider-icon smartslider-icon-published nextend-element-hastip"
                                       title="<?php echo NextendText::_('Published__click_to_unpublish'); ?>"
                                       href="<?php echo $this->route('controller=slides&view=sliders_slides&action=unpublish&sliderid=' . $slider['id'] . '&slideid=' . $slide['id']); ?>">Click
                                        to unpublish slide</a>
                                <?php else: ?>
                                    <a class="smartslider-icon smartslider-icon-unpublished nextend-element-hastip"
                                       title="<?php echo NextendText::_('Unpublished__click_to_publish'); ?>"
                                       href="<?php echo $this->route('controller=slides&view=sliders_slides&action=publish&sliderid=' . $slider['id'] . '&slideid=' . $slide['id']); ?>">Click
                                        to publish slide</a>
                                <?php endif; ?>
                            <?php endif; ?>
                        </li>
                    <?php
                    endforeach;
                    ?>
                </ul>

            <?php endif; ?>
        </dd>
    <?php
    endforeach;
    ?>
</dl>
<script type="text/javascript">
njQuery(window).ready(function(){
    var lis = njQuery('.smartslider-sliders-list > dt, .smartslider-slides-list > li');
    
    lis.each(function(){
        njQuery(this).qtip({
            position: {
                container: njQuery('#smartslider-admin'),
                my: "left top",
                at: "right center",
                adjust: {
                    y: -6
                }
            },
            content: {
                text: njQuery(this).find('.tooltip-actions') 
            },
            show: {
                solo: true
            },
            hide: {
                fixed: true,
                delay: 400/*,
                event: false*/
            },
            style: {
                classes: 'qtip-nextend',
                tip: {
                    mimic: 'left center',
                    width: 12,
                    height: 6,
                    offset: 10
                }
            }
        });
    });
});
</script>