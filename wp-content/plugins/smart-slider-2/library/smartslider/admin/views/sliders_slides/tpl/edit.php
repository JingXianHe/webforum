<?php
$this->loadFragment('headerstart');
?>
    <div class="smartslider-button smartslider-save" onclick="setTimeout(function(){njQuery('#smartslider-form').submit();}, 300);"><?php echo NextendText::_('Save'); ?></div>
    <div class="smartslider-button smartslider-cancel" onclick="window.nextendsave=true;location.href='<?php echo $this->route('controller=sliders&view=sliders_slider&action=edit&sliderid=' . NextendRequest::getInt('sliderid')); ?>';"><?php echo NextendText::_('Cancel'); ?></div>
<?php
$this->loadFragment('headerend');
?>

<?php
$this->loadFragment('firstcolstart');
?>

<?php
$this->loadFragment('firstcol/slide');
?>

<?php
$this->loadFragment('firstcolend');
?>

<?php
$this->loadFragment('secondcolstart');
?>

<form id="smartslider-form" action="" method="post">
    <?php
    $slidesModel = $this->getModel('slides');
    $slidesModel->renderEditForm(NextendRequest::getInt('slideid'));
    ?>
    <input name="save" value="1" type="hidden" />
</form>

<?php
global $ss2sliderafterform;
echo $ss2sliderafterform;
?>

<?php if(NextendSmartSliderSettings::get('guides', 1) ): ?>
<ol id="nextend-guide-default" style="display: none;">
  
  <li data-id="slidetitle-lbl" data-text="Next"  data-my="right center" data-at="left center">
    <h2><?php echo NextendText::_('Name'); ?></h2>
    <p><?php echo NextendText::_('Name_your_slide_it_will_help_you_to_find_it_in_the_future_and_also_shows_in_some_slider_types_and_widgets'); ?></p>
  </li>
  <li data-id="slidedescription-lbl" data-text="Next"  data-my="right center" data-at="left center">
    <h2><?php echo NextendText::_('Description'); ?></h2>
    <p><?php echo NextendText::_('Used_in_some_widgets'); ?></p>
  </li>
  <li data-id="slidethumbnail-lbl" data-text="Next"  data-my="right center" data-at="left center">
    <h2><?php echo NextendText::_('Thumbnail'); ?></h2>
    <p><?php echo NextendText::_('Used_in_some_widgets_like_dots_with_enabled_thumbnail_preview'); ?></p>
  </li>
  <li data-id="slidebackground-lbl" data-text="Next"  data-my="right center" data-at="left center">
    <h2><?php echo NextendText::_('Background'); ?></h2>
    <p><?php echo NextendText::_('This_field_only_applies_on_the_preview_after_save'); ?></p>
    <p><?php echo NextendText::_('bColorb_defines_a_simple_coloralpha_values_supported_which_will_be_used_as_a_background_color_of_this_slides'); ?></p>
    <p><?php echo NextendText::_('bImageb_will_be_used_as_a_background_image_of_this_slides'); ?></p>
  </li>
  
  <li data-class="smartslider-slide-console" data-text="Next"  data-my="bottom center" data-at="top center">
    <h2><?php echo NextendText::_('Message_bar'); ?></h2>
    <p><?php echo NextendText::_('While_you_are_working_on_the_slide_this_bar_will_show_you_some_guides_what_action_will_you_do_with_the_mouse'); ?></p>
  </li>
  <li data-id="smartslider-adjust-height" data-button="Next" data-my="bottom center" data-at="top center">
    <h2><?php echo NextendText::_('Live_editor'); ?></h2>
    <p><?php echo NextendText::_('Here_you_can_see_how_your_slider_and_the_currently_edited_slide_look_like_also_here_you_can_add_layers_and_items_through_your_work'); ?></p>
    <p><?php echo NextendText::_('Note_Widgets_are_disabled_in_this_view_and_you_cant_switch_to_other_slide'); ?></p>
  </li>
  
  <li data-class="smartslider-toolbar-list" data-button="Next" data-my="bottom left" data-at="top center">
    <h2><?php echo NextendText::_('Slider_and_slide_list'); ?></h2>
    <p><?php echo NextendText::_('You_can_see_the_slide_list_anytime_you_need'); ?></p>
    <p><?php echo NextendText::_('Try_it_click_on_LIST_button_and_then_hit_next'); ?></p>
  </li>
  <li data-class="smartslider-toolbar-edit" data-button="Next" data-my="bottom left" data-at="top center">
    <h2><?php echo NextendText::_('Edit'); ?></h2>
    <p><?php echo NextendText::_('Now_switch_back_to_EDIT_view'); ?></p>
  </li>
  
  <li data-class="smartslider-slide-views-layout" data-button="Next" data-my="bottom left" data-at="top center">
    <h2><?php echo NextendText::_('Layout'); ?></h2>
    <p><?php echo NextendText::_('Hit_the_Layout_tab'); ?></p>
    <p><?php echo NextendText::_('Here_you_can_load_predefined_layouts_and_also_your_custom_layouts'); ?></p>
  </li>
  <li data-class="smartslider-slide-layout-default" data-button="Next" data-my="left center" data-at="right center">
    <h2><?php echo NextendText::_('Layout'); ?></h2>
    <p><?php echo NextendText::_('You_can_click_on_them_and_your_slide_content_will_be_replaced_with_the_choosed_layout'); ?></p>
  </li>
  <li data-class="text-image" data-button="Next" data-my="left center" data-at="right center">
    <h2><?php echo NextendText::_('Two_column_template_with_image'); ?></h2>
    <p><?php echo NextendText::_('Lets_choose_this_layout_Click_on_it'); ?></p>
  </li>
  
  <li data-id="smartslider-adjust-height" data-button="Next" data-my="bottom center" data-at="top center">
    <h2><?php echo NextendText::_('Live_editor'); ?></h2>
    <p><?php echo NextendText::_('You_can_see_that_the_template_loaded_into_the_live_editor'); ?></p>
    <p><?php echo NextendText::_('Lets_move_your_mouse_into_the_slider_You_will_see_blue_borders_and_blue_buttons_and_also_purple_overlays'); ?></p>
    <p><?php echo NextendText::_('bBlueb_always_mean_that_the_function_related_with_blayersb'); ?></p>
    <p><?php echo NextendText::_('bPurpleb_overlay_and_bgreyb_buttons_always_mean_that_the_function_related_with_bitemsb'); ?></p>
  </li>
  
  <li data-id="smartslider-adjust-height" data-button="Next" data-my="bottom center" data-at="top center">
    <h2><?php echo NextendText::_('Layers'); ?></h2>
    <p><?php echo NextendText::_('Anytime_you_click_on_a_blue_control_that_layer_will_be_active_and_the_left_column_will_show_the_settings_of_that_layer'); ?></p>
    <p><?php echo NextendText::_('bBlue_bordersb_you_can_resize_the_layer_by_dragging_them'); ?></p>
    <p><?php echo NextendText::_('bBlue_move_iconb_you_can_move_the_layer_anywhere_on_the_slide_You_just_need_to_click_on_this_icon_and_hold_while_positioning_when_you_ready_release_the_mouse_button'); ?></p>
    <p><?php echo NextendText::_('bBlue_up_and_down_icon_and_numberb_zindex_of_the_layer_Higher_is_more_visible'); ?></p>
    <p><?php echo NextendText::_('bBlue_delete_iconb_It_will_delete_the_layer_and_every_associated_items'); ?></p>
    <p><?php echo NextendText::_('Now_take_some_time_to_play_with_the_layers_and_when_you_finished_click_on_the_next'); ?></p>
  </li>
  <li data-class="smartslider-slide-views-layer" data-button="Next" data-my="bottom left" data-at="top center">
    <h2><?php echo NextendText::_('Layer'); ?></h2>
    <p><?php echo NextendText::_('Hit_the_Layer_tab'); ?></p>
    <p><?php echo NextendText::_('Here_you_can_create_new_layers_and_configure_the_active_layer'); ?></p>
  </li>
  <li data-id="layerlayer_select" data-button="Next" data-my="bottom left" data-at="top center">
    <h2><?php echo NextendText::_('Active_layer'); ?></h2>
    <p><?php echo NextendText::_('You_can_choose_the_active_layer_with_this_selector'); ?></p>
    <p><?php echo NextendText::_('Note_if_you_click_on_a_layer_in_the_editor_that_will_be_the_active_layer'); ?></p>
    <p><?php echo NextendText::_('Please_choose_a_layer_to_make_that_active'); ?></p>
  </li>
  <li data-id="layeranimationin_select" data-button="Next" data-my="left center" data-at="right center">
    <h2><?php echo NextendText::_('Layer_animations'); ?></h2>
    <p><?php echo NextendText::_('You_can_set_up_animation_for_the_active_layer_Lets_choose_one'); ?></p>
  </li>
  <li data-class="smartslider-toolbar-play" data-button="Next" data-my="right center" data-at="left center">
    <h2><?php echo NextendText::_('Play_layer_animations'); ?></h2>
    <p><?php echo NextendText::_('You_can_play_the_layer_animation_by_this_button_It_will_first_play_the_IN_animations_and_then_the_OUT_animations'); ?></p>
    <p><?php echo NextendText::_('Note_you_cant_continue_editing_the_slide_while_the_animations_not_finished_You_will_see_informations_on_the_message_bar'); ?></p>
  </li>
  <li data-class="smartslider-slide-views-item" data-button="Next" data-my="bottom left" data-at="top center">
    <h2><?php echo NextendText::_('Item'); ?></h2>
    <p><?php echo NextendText::_('Hit_the_Item_tab'); ?></p>
    <p><?php echo NextendText::_('Here_you_can_create_new_items_and_configure_the_active_item'); ?></p>
  </li>
  <li data-id="draggableitems" data-button="Next" data-my="bottom left" data-at="top center">
    <h2><?php echo NextendText::_('New_items'); ?></h2>
    <p><?php echo NextendText::_('You_can_add_items_by_dragging_them_into_a_layer_on_the_slide_Purple_stripe_is_showing_when_you_can_release_the_item_into_the_layer'); ?></p>
    <p><?php echo NextendText::_('Lets_try_it_with_a_paragraph_item'); ?></p>
  </li>
  <li data-id="draggableitems" data-button="Next" data-my="bottom left" data-at="bottom center">
    <h2><?php echo NextendText::_('Paragraph_item'); ?></h2>
    <p><?php echo NextendText::_('Now_you_can_change_the_settings_of_the_newly_created_paragraph_item'); ?></p>
  </li>
  <li data-id="item_paragraphfontclass_select" data-button="Next" data-my="bottom left" data-at="top center">
    <h2><?php echo NextendText::_('Fonts'); ?></h2>
    <p><?php echo NextendText::_('Smart_Slider_contains_a_lot_of_predefined_fonts_but_if_you_need_more_you_can_create_customs_Font_settings_are_located_in_the_top_menu_Settings_on_the_Font_tab'); ?></p>
    <p><?php echo NextendText::_('Lets_choose_one_for_your_paragraph'); ?></p>
  </li>
  <li data-id="smartslider-adjust-height" data-button="Next" data-my="bottom center" data-at="top center">
    <h2><?php echo NextendText::_('Move_items'); ?></h2>
    <p><?php echo NextendText::_('Anytime_you_are_in_the_item_view_in_the_first_column_the_Item_tab_purple_you_can_move_the_item_from_one_layer_to_another_Drag_the_grey_move_icon_and_reposition_your_item'); ?></p>
    
    <p><?php echo NextendText::_('bGrey_delete_iconb_It_will_delete_the_item_Note_watch_for_the_color_as_blue_deletes_the_layer'); ?></p>
    <p><?php echo NextendText::_('Now_take_some_time_to_play_with_the_items_and_when_you_finished_click_on_the_next'); ?></p>
  </li>
  
  <li data-class="smartslider-save" data-button="Next" data-at="bottom center" data-my="top right">
    <h2><?php echo NextendText::_('Save'); ?></h2>
    <p><?php echo NextendText::_('When_you_finished_do_NOT_forget_to_save_the_slide'); ?></p>
  </li>
  <li data-id="smartslider-adjust-height" data-button="Close" data-my="bottom center" data-at="top center">
    <h2><?php echo NextendText::_('Thanks_for_taking_part_in_this_guide'); ?></h2>
    <p><?php echo NextendText::_('Now_you_understand_the_basic_aspect_of_Smart_Slider_2_and_you_are_ready_to_experiment_with_Smart_Slider_2'); ?></p>
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