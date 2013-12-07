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
?>
<div style="width: 100%; overflow: auto;">
    <?php 
    $sliderid = NextendRequest::getInt('sliderid', 0);
    
    if($sliderid){
        nextendimportsmartslider2('nextend.smartslider.joomla.slider');
        
        $slider = new NextendSliderJoomla($sliderid, $sliderid, dirname(__FILE__));
        $slider->render();
    }else{
    ?>
    <h4><?php echo NextendText::_('Access_to_this_resource_not_allowed'); ?></h4>
    <?php } ?>
</div>
<?php
$this->loadFragment('secondcolend');
?>

<?php
$this->loadFragment('footer');
?>