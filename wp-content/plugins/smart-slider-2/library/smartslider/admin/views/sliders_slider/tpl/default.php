<?php
$this->loadFragment('headerstart');
?>
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
$css = NextendCss::getInstance();
$css->addCssLibraryFile('form.css');
?>
<form method="post" action="" id="smartslider-form">           
  <style>  
  span.platform {
      background: none repeat scroll 0 0 #845CA5;
      border-radius: 2px 2px 2px 2px;
      color: #FFFFFF;
      font-size: 10px;
      font-weight: 600;
      line-height: 14px;
      padding: 0 5px 1px;
      text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);
      text-transform: uppercase;
      vertical-align: 1px;
  }
  span.wordpress {
      background: none repeat scroll 0 0 #2F7799;
      border-radius: 2px 2px 2px 2px;
      color: #FFFFFF;
      font-size: 10px;
      font-weight: 600;
      line-height: 14px;
      padding: 0 5px 1px;
      text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);
      text-transform: uppercase;
      vertical-align: 1px;
  }
  .nextend-element .nextend-text span{     color: #6C7581;     font-size: 12px;     font-weight: normal;     line-height: 11px;     text-shadow: 0 1px 1px white;   }     .nextend-element .nextend-text span a{     color: #6C7581;     font-size: 12px;     font-weight: normal;     line-height: 11px;     text-shadow: 0 1px 1px white;     text-decoration: none;   }   .nextend-element .nextend-text span a:HOVER{     color: #2485E3;   }   .nextend-tab .doc{     padding: 10px 20px 20px;     background-color: #EEF3F8;     border-bottom: 1px solid rgba(0, 0, 0, 0.1);   }   .nextend-tab .tutorial-videos{     padding: 20px;     background-color: #EEF3F8;     border-bottom: 1px solid rgba(0, 0, 0, 0.1);   }   .nextend-tab .tutorial-videos iframe{   }     .nextend-tab .tutorial-videos .video{     float: left;     margin: 0 50px 20px 0;   }   .nextend-tab .tutorial-videos span{       color: #6C7581;     font-size: 16px;     font-weight: normal;     line-height: 11px;     text-shadow: 0 1px 1px white;     text-align: center;     display: block;     margin-bottom: 10px;     font-family: 'Montserrat',Arial,sans-serif;   }     .nextend-tab .doc .categorycontainer .left,   .nextend-tab .doc .categorycontainer .right{     width: 48%;     float: left;     margin-left: 15px;     }    .nextend-tab .doc .categorycontainer{       color: #6C7581;     font-size: 12px;     font-weight: normal;     text-shadow: 0 1px 1px white;     font-family: 'Montserrat',Arial,sans-serif;   }   .nextend-tab .doc .categorycontainer dt{     font-size: 16px;     margin: 15px 0 5px;     font-weight: normal;   }     .nextend-tab .doc .categorycontainer dd,     .nextend-tab .doc .categorycontainer dl{     margin: 0;   }     .nextend-tab .doc .categorycontainer ul{     padding-left: 10px;   }   .nextend-tab .doc .categorycontainer li{     line-height: 20px;   }   .nextend-tab .doc .categorycontainer li a{         color: #738AA2;     font-size: 13px;     text-decoration: none;     text-shadow: 0 1px 1px white;   }   .nextend-tab .doc .categorycontainer li a:HOVER,     .nextend-tab .doc .categorycontainer li:HOVER{     color: #2485E3;   }      
  </style>     
  <div class="nextend-form">         
    <div class="nextend-tab"><h3>General information</h3>             
      <table>                 
        <tbody>                                
          <tr class="odd">                         
            <td class="nextend-label">                             
              <label for="slidertitle" id="slidertitle-lbl">Version Number               
              </label>                           </td>                         
            <td class="nextend-element">                             
              <div style="" class="nextend-text">                                 
                <span>
<?php
                if(nextendIsJoomla()){
                    preg_match('/<version>(.*?)<\\/version>/', file_get_contents(JPATH_ADMINISTRATOR.'/components/com_smartslider2/smartslider2.xml'),$out);
                    echo $out[1];
                }else if(nextendIsWordpress()){
                    $plg = get_plugin_data( NEXTEND_SMART_SLIDER2.basename(NEXTEND_SMART_SLIDER2).'.php');
                    echo $plg['Version'];
                }
                                                    ?>                
                </span>                             
              </div>            </td>                     
          </tr>                                       
          <tr class="even">                         
            <td class="nextend-label">                             
              <label for="slidertitle" id="slidertitle-lbl">Documentation               
              </label>                           </td>                         
            <td class="nextend-element">                             
              <div style="" class="nextend-text">                                 
                <span>                  
                  <a href="http://www.nextendweb.com/wiki/smart-slider-documentation/">Read the documentation!</a>                
                </span>                             
              </div>            </td>                     
          </tr>                                       
          <tr class="odd">                         
            <td class="nextend-label">                             
              <label for="slidertitle" id="slidertitle-lbl">Support               
              </label>                           </td>                         
            <td class="nextend-element">                             
              <div style="" class="nextend-text">                                 
                <span>                  
                  <a href="http://www.nextendweb.com/smart-slider#support">Write a support ticket!</a>                
                </span>                             
              </div>            </td>                     
          </tr>                          
        </tbody>             
      </table>         
    </div>              
    <div class="nextend-tab"><h3>Documentation</h3>             
      <div class="doc">                 
        <div class='categorycontainer clearfix'>              
          <div class="left">            
            <dl>              
              <dt>    <i></i>                
                <span>Installation &amp; General                 
                </span>                 
              </dt>              
              <dd>                
                <ul>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/installation-on-joomla/">Install instruction for Joomla                      
                    <span class="platform">Joomla                     
                    </span></a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/how-to-create-a-smart-slider-2-module/">How to create a Smart Slider 2 module                     
                    <span class="platform">Joomla                     
                    </span></a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/installation-wordpress/">Install instruction for WordPress                     
                    <span class="wordpress">WordPress                     
                    </span></a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/system-requirements/">System requirements (PHP, SQL, etc.)</a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/download-section/">Download section (cancel subscription)</a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/changelog">Changelog for Smart Slider 2</a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/known-problems/">Known problems</a>                  
                  </li>                
                </ul>              
              </dd>            
            </dl>            
            <dl>              
              <dt>                     
                <span>Usage                 
                </span>                 
              </dt>              
              <dd>                
                <ul>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/basics/">Basics</a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/slider-and-widgets/">Slider and widgets</a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/slide-layers-and-items/">Slide – layers and items</a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/layer-animation/">Slide – layer animation</a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/layouts/">Layout</a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/generator/">Generator</a>                  
                  </li>                
                </ul>              
              </dd>            
            </dl>            
            <dl>              
              <dt>                     
                <span>Settings in-depth                 
                </span>                 
              </dt>              
              <dd>                
                <ul>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/global-settings/">Global settings</a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/fonts/">Fonts</a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/slider-settings/">Slider settings</a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/slide-settings/">Slide settings</a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/layout-settings/">Layout settings</a>                  
                  </li>                
                </ul>              
              </dd>            
            </dl>            
            <dl>              
              <dt>                     
                <span>Slider types                 
                </span>                 
              </dt>              
              <dd>                
                <ul>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/simple-slider-type/">Simple slider type</a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/full-page-slider-type/">Full page type</a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/horizontal-accordion-slider-type/">Horizontal accordion slider type</a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/vertical-accordion-slider-type/">Vertical accordion slider type</a>                  
                  </li>                
                </ul>              
              </dd>            
            </dl>            
            <dl>              
              <dt>                     
                <span>Slider widgets                 
                </span>                 
              </dt>              
              <dd>                
                <ul>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/widgets/">More about widgets</a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/arrows/">Arrows</a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/bullets">Bullets</a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/autoplay-button/">Autoplay (button)</a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/indicator-autoplay">Indicator (autoplay)</a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/bar">Bar</a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/thumbnails">Thumbnails</a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/shadows">Shadows</a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/html">HTML</a>                  
                  </li>                
                </ul>              
              </dd>            
            </dl>          
          </div>          
          <div class="right">            
            <dl>              
              <dt>                     
                <span>Items                 
                </span>                 
              </dt>              
              <dd>                
                <ul>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/button/">Button</a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/caption/">Caption</a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/fade/">Fade</a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/flipper/">Flipper</a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/heading/">Heading</a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/html-item/">HTML</a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/iframe/">Iframe</a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/paragraph/">Paragraph</a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/special/">Special</a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/tag/">Tag</a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/youtube/">YouTube</a>                  
                  </li>                
                </ul>              
              </dd>            
            </dl>            
            <dl>              
              <dt>                     
                <span>Generators                 
                </span>                 
              </dt>              
              <dd>                
                <ul>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/facebook-generator/">Facebook</a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/flickr-generator/">Flickr</a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/instagram-generator/">Instagram</a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/youtube-generator/">YouTube</a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/twitter-generator/">Twitter</a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/image-from-folder-joomla-generator/">Image from folder                      
                    <span class="platform">Joomla                     
                    </span></a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/joomla-content-generator/">Joomla content                      
                    <span class="platform">Joomla                     
                    </span></a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/k2-items-generator/">K2 items                      
                    <span class="platform">Joomla                     
                    </span></a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/cobalt-cck-generator/">Cobalt CCK                       
                    <span class="platform">Joomla                     
                    </span></a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/ignite-gallery-generator/">Ignite Gallery                      
                    <span class="platform">Joomla                     
                    </span></a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/phoca-gallery-generator/">Phoca Gallery                      
                    <span class="platform">Joomla                     
                    </span></a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/virtuemart2-generator/">Virtuemart 2                      
                    <span class="platform">Joomla                     
                    </span></a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/redshop-generator/">redSHOP                      
                    <span class="platform">Joomla                     
                    </span></a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/joomshopping-generator/">JoomShopping                      
                    <span class="platform">Joomla                     
                    </span></a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/image-from-folder-wordpress-generator/">Image from folder                      
                    <span class="wordpress">WordPress                     
                    </span></a>                  
                  </li>                  
                  <li>                  
                  <a target="_blank"  href="http://www.nextendweb.com/wiki/smart-slider-documentation/posts-generator/">Posts                      
                    <span class="wordpress">WordPress                     
                    </span></a>                  
                  </li>                
                </ul>              
              </dd>            
            </dl>            
            <dl>              
              <dt>                     
                <span>Extra features                 
                </span>                 
              </dt>              
              <dd>                
                <ul>                  
                  <li>                  
                  <a href="http://www.nextendweb.com/wiki/smart-slider-documentation/javascript-api/">JavaScript API</a>                  
                  </li>                  
                  <li>                  
                  <a href="http://www.nextendweb.com/wiki/smart-slider-documentation/advanced-generator-functions/">Advanced generator functions</a>                  
                  </li>                
                </ul>              
              </dd>            
            </dl>          
          </div>          
          <div style="clear:both;">          
          </div>                          
        </div>           
      </div>                
      <div class="nextend-tab"><h3>Tutorial videos</h3>               
        <div class="tutorial-videos clearfix">                   
          <div class="video">                       
            <span>How to start             
            </span>                       
            <iframe width="300" height="225" src="//www.youtube.com/embed/_2jVG9Cihxs" frameborder="0" allowfullscreen>            
            </iframe>                   
          </div>                        
          <div class="video">                       
            <span>Items             
            </span>                       
            <iframe width="300" height="225" src="//www.youtube.com/embed/Q2OwYjtm1h0" frameborder="0" allowfullscreen>            
            </iframe>                      
          </div>                       
          <div class="video">                       
            <span>Widgets             
            </span>                       
            <iframe width="300" height="225" src="//www.youtube.com/embed/17iWpboc9JU" frameborder="0" allowfullscreen>            
            </iframe>                      
          </div>               
        </div>           
      </div>               
    </div>     
</form>
<?php if(NextendSmartSliderSettings::get('guides', 1) ): ?>
<ol id="nextend-guide-default" style="display: none;">     
  <li data-class="smartslider-toolbar-controllers" data-text="Next" >    <h2>Main navigation</h2>         
    <p>Currently you are on the Sliders page     
    </p>     
  </li>     
  <li data-id="nextend-play-guide" data-button="Next">    <h2>Play guide</h2>         
    <p>Every view in Smart Slider contain one or more guides, which can be played anytime you need help     
    </p>     
  </li>     
  <li data-class="smartslider-createslider" data-button="Next" data-at="right center" data-my="left center">    <h2>Create your first slider</h2>         
    <p>To use Smart Slider, the basic step is creating a new slider     
    </p>     
  </li>     
  <li data-class="smartslider-sliders-list" data-button="Next" data-at="right center" data-my="left center">    <h2>Sliders</h2>         
    <p>Here you can find a list of your sliders. If you click on a row, you will see the slider's setting and also the list of the slides.     
    </p>     
  </li>     
  <li data-class="smartslider-settings " data-button="Close">    <h2>Global settings</h2>         
    <p>If you would like to disable the guides completely or adjust the Smart Slider's global settings, you can do this in this view.     
    </p>     
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