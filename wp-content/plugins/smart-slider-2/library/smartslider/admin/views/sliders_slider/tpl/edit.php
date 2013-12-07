<?php
$this->loadFragment('headerstart');
?>
    <div class="smartslider-button smartslider-save" onclick="setTimeout(function(){njQuery('#smartslider-form').submit();}, 300);"><?php echo NextendText::_('Save'); ?></div>
<?php
$this->loadFragment('headerend');
?>

<?php
$this->loadFragment('firstcolstart');
?>

<?php
$this->loadFragment('firstcolend');
?>

<?php
$this->loadFragment('secondcolstart');
?>

<form id="smartslider-form" action="" method="post">
    <?php
    $slidersModel = $this->getModel('sliders');
    $form = $slidersModel->renderEditForm(NextendRequest::getInt('sliderid'));
    ?>
    <input name="save" value="1" type="hidden" />
</form>

<?php
$css = NextendCss::getInstance();
$js = NextendJavascript::getInstance();

$js->addLibraryJsAssetsFile('dojo', 'form.js');
$js->addLibraryJs('dojo', '
    new NextendForm({
      container: "smartslider-form",
      data: '.json_encode($form[0]).',
      xml: "'.NextendFilesystem::toLinux(NextendFilesystem::pathToRelativePath($form[1])).'",
      control_name: "'.$form[2].'",
      url: "'.NextendUri::ajaxUri('nextend').'",
      loadedJSS: '.json_encode($js->generateArrayJs()).',
      loadedCSS: '.json_encode($css->generateArrayCSS()).'
    });
', true);
?>

<?php if(NextendSmartSliderSettings::get('guides', 1) ): ?>
<ol id="nextend-guide-default" style="display: none;">
  <li data-id="slidertitle-lbl" data-text="Next"  data-my="right center" data-at="left center">
    <h2><?php echo NextendText::_('Name'); ?></h2>
    <p><?php echo NextendText::_('Name_your_slider_it_will_help_you_to_find_it_in_the_future'); ?></p>
  </li>
  <li data-id="slidersize-lbl" data-button="Next" data-my="right center" data-at="left center">
    <h2><?php echo NextendText::_('Size'); ?></h2>
    <p><?php echo NextendText::_('Set_up_the_sliders_dimension_brbrbCanvas_size_disabledb_values_define_the_outer_dimensions_of_the_sliderbrbCanvas_size_enabledb_values_define_the_slide_canvas_dimension'); ?></p>
  </li>
  <li data-id="slidertype-lbl" data-button="Next" data-my="right center" data-at="left center">
    <h2><?php echo NextendText::_('Slider_type'); ?></h2>
    <p><?php echo NextendText::_('You_can_choose_the_design_of_the_slider_If_you_hit_the_configure_button_you_will_see_the_type_specific_settings'); ?></p>
  </li>
  <li data-id="nextend-pluginmatrix-sliderwidgets" data-button="Next" data-at="top center" data-my="bottom center">
    <h2><?php echo NextendText::_('Widgets'); ?></h2>
    <p><?php echo NextendText::_('Widgets_help_you_customize_the_slider_for_your_needs_You_can_place_different_arrows_bullets_and_other_widgets_which_decorate_your_slider_You_just_need_to_set_display_to_enabled_and_choose_the_perfect_position'); ?></p>
  </li>
  <li data-class="smartslider-save" data-button="Next" data-at="bottom center" data-my="top right">
    <h2><?php echo NextendText::_('Save'); ?></h2>
    <p><?php echo NextendText::_('When_you_finished_do_NOT_forget_to_save_the_settings'); ?></p>
  </li>
  <li data-class="smartslider-firstcol" data-button="Close" data-my="bottom center" data-at="top center">
    <h2><?php echo NextendText::_('Slides'); ?></h2>
    <p><?php echo NextendText::_('Here_you_can_create_slides_for_this_slider_and_you_can_edit_the_existing_slides'); ?></p>
  </li>
</ol>

<script type="text/javascript">
njQuery(window).ready(function($){
    $('#nextend-play-guide').on('click', function(){
        $('#nextend-guide-default').joyride({
          autoStart: true,
          modal: false,
          expose: false
        });
    });
});
</script>

<?php endif; ?>

<?php
$this->loadFragment('secondcolend');
?>

<?php
$this->loadFragment('footer');
?>