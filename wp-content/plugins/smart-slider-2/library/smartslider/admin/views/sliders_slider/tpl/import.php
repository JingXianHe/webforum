<?php
$this->loadFragment('headerstart');
?>
    <div class="smartslider-button smartslider-save" onclick="setTimeout(function(){njQuery('#smartslider-form').submit();}, 300);"><?php echo NextendText::_('Import'); ?></div>
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
<h2>Import slider</h2>

<?php NextendMessage::show(); ?>

<form id="smartslider-form" action="" method="post" enctype="multipart/form-data" style="margin: 15px;">
<label for="file"><h3>Choose the file to import a slider:</h3></label>
    <input type="file" name="file" id="file" />
</form>

<div>
<div style="width: 50%" class="box"><h3>Get more sample sliders</h3><p>Click on the download button and try out our 16 predefined slider from our demo. Just unzip the folder and import the .smart files into your slider.</p>
<a class="button big b" style="margin-top: 10px;" href="http://www.nextendweb.com/the-first-milestone-of-the-smart-slider/" target="_blank">Download</a></div>
</div>

<?php
$this->loadFragment('secondcolend');
?>
<?php
$this->loadFragment('footer');
?>