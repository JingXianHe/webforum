<?php

class NextendSmartSlider2Widget extends WP_Widget {

    function NextendSmartSlider2Widget() {
        $widget_ops = array('classname' => 'NextendSmartSlider2Widget', 'description' => 'Displays a Smart Slider');
        $this->WP_Widget('NextendSmartSlider2Widget', 'Nextend Smart Slider 2', $widget_ops);
    }

    function form($instance) {
        global $wpdb;
        $instance = wp_parse_args((array) $instance, array('title' => ''));
        $title = $instance['title'];
        ?>
        <p>
            <label for="<?php echo $this->get_field_id('title'); ?>">
                Title: 
                <input class="widefat" id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo esc_attr($title); ?>" />
            </label>
        </p>

        <p>
            <label for="<?php echo $this->get_field_id('smartslider2'); ?>">
                Smart Slider: 
                <select class="widefat" id="<?php echo $this->get_field_id('smartslider2'); ?>" name="<?php echo $this->get_field_name('smartslider2'); ?>">
                    <?php
                    $smartslider2 = $instance['smartslider2'];
                    
                    $res = $wpdb->get_results( 'SELECT id, title FROM '.$wpdb->prefix.'nextend_smartslider_sliders' );
                    foreach ($res AS $r) {
                        ?>
                        <option <?php if ($r->id == $smartslider2) { ?>selected="selected" <?php } ?>value="<?php echo $r->id; ?>"><?php echo $r->title; ?></option>
                        <?php
                    }
                    ?>
                </select>
            </label>
        </p>
        <p>You can create Sliders in the left sidebar.</p>
        <?php
    }

    function update($new_instance, $old_instance) {
        $instance = $old_instance;
        $instance['title'] = $new_instance['title'];
        $instance['smartslider2'] = $new_instance['smartslider2'];
        return $instance;
    }

    function widget($args, $instance) {

        $title = apply_filters( 'widget_title', $instance['title'] );

    		echo $args['before_widget'];
    		if ( ! empty( $title ) )
    			echo $args['before_title'] . $title . $args['after_title'];

        $params = array();
        nextendimportsmartslider2('nextend.smartslider.wordpress.slider');
        $sl = new NextendSliderWordpress(intval($instance['smartslider2']), $params, dirname(__FILE__));
        $sl->render();

        echo $args['after_widget'];
    }

}
add_action('widgets_init', create_function('', 'return register_widget("NextendSmartSlider2Widget");'));
?>