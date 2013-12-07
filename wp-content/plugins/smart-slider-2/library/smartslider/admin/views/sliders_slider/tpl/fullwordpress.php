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

  .nextend-tab .doc{     padding: 10px 20px 20px;     background-color: #EEF3F8;     border-bottom: 1px solid rgba(0, 0, 0, 0.1);   } 
  .nextend-tab .doc{
      font-family: 'Montserrat',Arial,sans-serif;  
      color: #6C7581; 
      text-shadow: 0 1px 1px #FFFFFF;
  }
  .nextend-tab .doc p{
      font-size: 13px;
      margin: 10px 0;
      line-height: 1.4;
  }   
  .nextend-tab ul{
      margin: 0;
      padding-left: 20px;
      list-style: disc outside none;
  }   
  .nextend-tab ul li{
      font-size: 13px;
      line-height: 1.4;
  }
  .nextend-tab h4{
      font-size: 16px;
      font-weight: normal;
      margin: 20px 0 5px;
      text-transform: uppercase;
  }
  #buynowlink{
      font-size: 14px; padding: 7px 10px;
      box-shadow: 0 1px 1px RGBA(0,0,0,0.2);
      -webkit-border-radius: 2px;
      -moz-border-radius: 2px;
      border-radius: 2px;              
      background: #69A914;
      text-transform: uppercase;
      text-shadow: 0 1px 0 rgba(0, 0, 0, 0.74);
      text-decoration: none;
      color: white;
      display: block;
      width: 94px;
  }
  #buynowlink:HOVER{
      background: #73b719;
  }
  </style>     
  <div class="nextend-form">                    
    <div class="nextend-tab"><h3>Buy full version</h3>             
      <div class="doc">
      <p>We are very happy that you tried out our trial version of Smart Slider 2. We hope you have enjoyed the possibilities through your trial period and also you are convinced how good is Smart Slider 2. To honor the effort that you tried out our extension, we would like to give you  a 10% off coupon for Smart Slider 2:</p>
      <h4>10% off coupon code: TRIAL</h4>
      
<p>
<a id="buynowlink" target="_blank" href="http://www.nextendweb.com/smart-slider/#pricing">Buy it now!</a>
</p>


<h4>Why should I upgrade to full version? Because you get all:</h4>
<ul>
	<li>4 slider types</li>
	<li>extra main and background animations</li>
	<li>20 layer animations</li>
	<li>12 items to build better sliders</li>
	<li>8 widgets to create thumbnails, galleries, bars etc.</li>
	<li>12 items to build better sliders</li>
	<li>10 slider generators</li>
	<li>also a lot of extra feature and option</li>
	<li>and last but not least personal support!</li>
</ul>
</p>

<h4>Slider features and limitations in trial version</h4>

<p>With this trial version your will be able to create new responsive sliders with simple slider type. The created slider main animation is limited to the horizontal animation, but also one special background animation is available for testing. The autoplay function of the Smart Slider 2 is only available in the full version. Trial version will allow you to use arrow and bullet widgets on your slider, the arrows are limited(3 different arrows available in trial, the full contains more than 35 different colorizable arrows), the bullets are not limited in trial.</p>

<h4>Slide features and limitations in trial version</h4>

<p>This is the most important part of the Smart Slider 2, so we have not limit any action which related to the user interaction on the backend. You can change the title of your slides and also you can add slide background images and thumbnail images. In layer mode, with the trial version you can use two layer animations (Slide down and Roll in, the full version contains more than 20 layer animations) and every other layer related setting is available. In item mode, with the trial version you can use two items (Heading and Button items allowed in trial mode), which give you some experience with the live slide editor. Also in trial mode, every slide contains our logo on the bottom left.</p>

<h4>Generator features and limitations in trial version</h4>

<p>The trial version comes with the image from folder generator. You will need to select source folder which contains your images and Smart Slider 2 will automatically create the slides for you. The full version comes with other integrations ( WordPress posts ) and also with social generators ( Facebook, Twitter, Instagram, Flickr, YouTube ).</p>

<h4>What comes with trial version?</h4>

<p>If you are trying the trial version, you get access to our top-notch support. If you experience any kind of problem, feel free to <a href="http://www.nextendweb.com/smart-slider#support" target="_blank">contact with our support staff</a>. We will try to resolve your problem as soon as possible.</p>
<p>
You can get 20% off coupon code for the full Smart Slider 2, if you find a problem and report us. The "todo" list to get the coupon code:
<ul>
	<li>Describe the bug to <a href="http://www.nextendweb.com/smart-slider#support" target="_blank">the support staff</a></li>
	<li>Cooperate in the resolution of the problem</li>
</ul>
</p>

<h4>Just to know</h4>
<p>
"Smart Slider 2 trial" is a trial/demo version for our commercial "Smart Slider 2". <strong>"Smart Slider 2 trial" is NOT made to use on production site, it is tech demo, which allows you to try most (but not all) of the features of "Smart Slider 2".</strong> This trial version helps you to try it on your system and see how it works and see how much possibilities are in the full version of "Smart Slider 2".
</p> 
<p>
"Smart Slider 2 trial" does 
<ul>
	<li>NOT create home calls</li>
	<li>NOT track anything on your site</li>
	<li>NOT mess up your site</li>
	<li>what this documentation page describes, nothing more and nothing less. For full functionality you will still need the commercial <a href="http://www.nextendweb.com/smart-slider/#pricing">Smart Slider 2</a>.</li>
</ul>
</p>

      
      </div>                             
    </div>     
</form>

<?php
$this->loadFragment('secondcolend');
?>
<?php
$this->loadFragment('footer');
?>