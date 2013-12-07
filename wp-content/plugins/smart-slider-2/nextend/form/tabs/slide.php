<?php
nextendimport('nextend.form.tab');

class NextendTabSlide extends NextendTab {

    function decorateTitle() {
        echo "<div class='nextend-tab'>";
        if ($this->_hidetitle != 1)
            echo "<h3>" . NextendText::_(NextendXmlGetAttribute($this->_xml, 'label')) . "</h3>";
        ?>
        <div class="smartslider-advanced-layers smartslider-greybar">
            <div class="smartslider-toolbar-simple smartslider-toolbar-options smartslider-button-grey first">
                <div><?php echo NextendText::_('Simple_mode'); ?></div>
            </div>
            <div class="smartslider-toolbar-advanced smartslider-toolbar-options smartslider-button-grey last">
                <div><?php echo NextendText::_('Advanced_mode'); ?></div>
            </div>
        </div>
        <div class="smartslider-toolbar-play"><?php echo NextendText::_('PLAY'); ?></div>
        <div class="smartslider-slide-console"></div>
    <?php
    }

    function decorateGroupStart() {

    }

    function decorateGroupEnd() {

        echo "</div>";
    }

    function decorateElement(&$el, $out, $i) {

        echo $out[1];
    }
}