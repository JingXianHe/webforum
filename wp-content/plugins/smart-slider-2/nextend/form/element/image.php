<?php

nextendimport('nextend.form.element.text');

class NextendElementImage extends NextendElementText {

    function fetchElement() {
        $html = parent::fetchElement();
        if (nextendIsJoomla()) {
            JHtml::_('behavior.modal');
            $user = JFactory::getUser();
            $link = 'index.php?option=com_media&amp;view=images&amp;tmpl=component&amp;e_name=com_smartslider2&amp;author=' . $user->id;
            $html .= '<div class="button2-left" style="margin: 2px 0 2px 10px; float: left;">
                    <div class="image">
                        <a onclick="window.jInsertEditorText = function(tag, editor){njQuery(\'#' . $this->_id . '\').val(\'' . NextendUri::getBaseUri() . '\'+njQuery(tag).attr(\'src\')); NfireEvent(document.getElementById(\'' . $this->_id . '\'),\'change\'); };return false;" rel="{handler: \'iframe\', size: {x: 900, y: 520}}" href="' . $link . '" title="Image" class="modal btn modal-button"><i class="icon-picture"></i> Image</a>
                    </div>
                  </div>';
        }else if (nextendIsWordPress()) {
            add_thickbox();
			      wp_enqueue_script('media-upload');
            wp_print_styles('editor-buttons'); 
            $html .= '
              <div class="wp-media-buttons" style="float: left; margint-top:1px;">
                <a title="Add Media" onclick="window.send_to_editor = function(html){var inp = njQuery(\'#'.$this->_id.'\'); setFromWPLibrary(html, inp); };tb_show(\'\', \''.admin_url('media-upload.php?type=image&TB_iframe=true&width=800&height=800').'\');return false;" data-editor="content" class="button insert-media add_media" href="#"><span class="wp-media-buttons-icon"></span> Add Media</a>
              </div>
              <script>
                  function setFromWPLibrary(html, el){
                      if( Object.prototype.toString.call( html) === \'[object Array]\' ) {
                          el.val(html[0]);
                      }else{
                          var html = jQuery(html);
                          var img = html;
                          if(html[0].tagName != \'IMG\'){
                        		img = jQuery(\'img\',html);
                      		}
                      		el.val(img.attr(\'src\'));
                      }
                      NfireEvent(el[0], \'change\');
                      
                  		tb_remove();
                  }
              </script>
              ';
        }
        return $html;
    }
}
