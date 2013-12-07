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
$this->loadFragment('firstcol/sliders');
?>

<?php
$this->loadFragment('firstcolend');
?>

<?php
$this->loadFragment('secondcolstart');
?>

<h4><?php echo NextendText::_('Access_to_this_resource_not_allowed'); ?></h4>

<?php
$this->loadFragment('secondcolend');
?>

<?php
$this->loadFragment('footer');
?>