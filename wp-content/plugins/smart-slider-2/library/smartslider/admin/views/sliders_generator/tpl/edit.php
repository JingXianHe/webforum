<?php
global $smartslidergeneratorslide;

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
$this->loadFragment('firstcol/slide');
?>

<?php
$this->loadFragment('firstcolend');
?>

<?php
$this->loadFragment('secondcolstart');
?>

<form id="smartslider-form" action="" onsubmit="return (parseInt(njQuery('#generateslidesgeneratorgenerateslides_1').val()) == 1 && parseInt(njQuery('#generateslidesgeneratorgenerateslides_2').val()) == 0 ? confirm('\'Generate slides\' without static switch will delete and generate your dynamic slides. Are you sure?') : true)" method="post">
    <?php
    $slidersModel = $this->getModel('sliders');
    $slider = $slidersModel->getSlider(NextendRequest::getInt('sliderid'));

    $smartslidergenerator = (array)json_decode($slider['generator'], true);

    $xml = $slidersModel->editGeneratorForm($smartslidergenerator);

    $smartslidergeneratorslide = (array)json_decode($slider['slide'], true);


    $slidesModel = $this->getModel('slides');
    $slidesModel->editForm($smartslidergeneratorslide);
    ?>
    <input name="sliderid" value="<?php echo NextendRequest::getInt('sliderid'); ?>" type="hidden"/>
    <input name="save" value="1" type="hidden"/>
</form>

<?php
global $ss2sliderafterform;
echo $ss2sliderafterform;
?>

<?php
$css = NextendCss::getInstance();
$js = NextendJavascript::getInstance();

$js->addLibraryJsAssetsFile('dojo', 'form.js');
$js->addLibraryJs('dojo', '
    new NextendForm({
      container: "smartslider-form",
      data: '.($slider['generator'] ? $slider['generator'] : '{}').',
      xml: "'.NextendFilesystem::toLinux(NextendFilesystem::pathToRelativePath($xml)).'",
      control_name: "generator",
      url: "'.NextendUri::ajaxUri('nextend').'",
      loadedJSS: '.json_encode($js->generateArrayJs()).',
      loadedCSS: '.json_encode($css->generateArrayCSS()).'
    });
', true);
?>

<?php
$this->loadFragment('secondcolend');
?>

<?php
$this->loadFragment('footer');
?>