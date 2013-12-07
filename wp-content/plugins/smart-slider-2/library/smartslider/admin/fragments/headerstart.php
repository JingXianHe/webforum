<?php
nextendimport('nextend.css.css');
nextendimport('nextend.javascript.javascript');
$css = NextendCss::getInstance();
if(nextendIsJoomla()){
    $css->addCssFile(NEXTEND_SMART_SLIDER2_ASSETS . 'admin/css/joomlaclear.css');
}
$css->addCssFile(NEXTEND_SMART_SLIDER2_ASSETS . 'admin/css/common.css');
$css->addCssFile(NEXTEND_SMART_SLIDER2_ASSETS . 'admin/css/icons.css');
$css->addCssFile(NEXTEND_SMART_SLIDER2_ASSETS . 'admin/css/header.css');
$css->addCssFile(NEXTEND_SMART_SLIDER2_ASSETS . 'admin/css/toolbar.css');
nextendimport('nextend.form.form');
NextendForm::loadQtip();

$js = NextendJavascript::getInstance();
$js->loadLibrary('jquery');

nextendimport('nextend.fonts.google');
$fonts = NextendFontsGoogle::getInstance();
$fonts->addFont('Montserrat');
?>

<div id="smartslider-admin" class="nextend-nowindow smartslider-advanced-layers-simple-active ni">

    <div class="smartslider-head">
        <div class="smartslider-logo" style="cursor: pointer;" onclick="location.href='<?php echo $this->route('controller=sliders'); ?>';">
            <div class="smartslider-border"></div>
        </div>
        <div class="smartslider-toolbar smartslider-toolbar-iron">
            <div class="smartslider-toolbar-controllers">
                <div class="smartslider-button smartslider-sliders <?php echo NextendRequest::getCmd('controller') == 'sliders' || NextendRequest::getCmd('controller') == 'slides' ? 'active' : ''; ?>">
                    <a class="smartslider-button-link" href="<?php echo $this->route('controller=sliders'); ?>">
                        <div></div>
                        <?php echo NextendText::_('Sliders'); ?>
                    </a>
                </div>
                <?php if ($this->canDo('core.layout')): ?>
                    <div class="smartslider-button smartslider-layouts <?php echo NextendRequest::getCmd('controller') == 'layouts' ? 'active' : ''; ?>">
                        <a class="smartslider-button-link" href="<?php echo $this->route('controller=layouts'); ?>">
                            <div></div>
                            <?php echo NextendText::_('Layouts'); ?>
                        </a>
                    </div>
                <?php endif; ?>
                <?php if ($this->canDo('core.admin')): ?>
                    <div class="smartslider-button smartslider-settings <?php echo NextendRequest::getCmd('controller') == 'settings' ? 'active' : ''; ?>">
                        <a class="smartslider-button-link" href="<?php echo $this->route('controller=settings'); ?>">
                            <div></div>
                            <?php echo NextendText::_('Settings'); ?>
                        </a>
                    </div>
                <?php endif; ?>
                <?php if (NextendSmartSliderSettings::get('guides', 1)):
                    $css->addCssFile(NEXTEND_SMART_SLIDER2_ASSETS . 'admin/css/joyride.css');
                    $js->addLibraryJsFile('jquery', NEXTEND_SMART_SLIDER2_ASSETS . 'admin/js/jquery.joyride.js');
                    ?>
                    <div id="nextend-play-guide" class="smartslider-button smartslider-support">
                        <a class="smartslider-button-link" onclick="return false;" href="#">
                            <div></div>
                            <?php echo NextendText::_('Play_guide'); ?>
                        </a>
                    </div>
                <?php endif; ?>
                <div class="smartslider-button smartslider-getfull">
                    <a class="smartslider-button-link" href="<?php echo $this->route('controller=sliders&view=sliders_full&action=full'); ?>">
                        <div></div>
                        <?php echo NextendText::_('Get full'); ?>
                    </a>
                </div>
            </div>

            <script type="text/javascript">
                (function (njQuery2) {
                    njQuery2(window).ready(function () {
                            var $act = njQuery('.smartslider-toolbar-actions'),
                                extra = 0;
                            if(typeof window.wp != 'undefined'){
                                extra = 28;
                            }
                            if ($act.children().length > 0) {
                                var $admin = njQuery('#smartslider-admin'),
                                    offset = $admin.offset(),
                                    ow = $admin.outerWidth(),
                                    iw = $act.outerWidth(),
                                    scroll = function () {
                                        var st = njQuery(window).scrollTop()+extra;
                                        if (offset.top < st) {
                                            $act.addClass('scrolled').css({
                                                left: offset.left + ow - iw
                                            });
                                        } else {
                                            $act.removeClass('scrolled');
                                        }
                                    };

                                njQuery(window).scroll(scroll);

                                njQuery(window).on('resize', function () {
                                    offset = $admin.offset();
                                    ow = $admin.outerWidth();
                                    scroll();
                                });
                                scroll();
                            }

                        }
                    )
                    ;
                })(njQuery)
            </script>

            <div class="smartslider-toolbar-actions">