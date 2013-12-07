<?php
  //Wysija Integration
  require_once( '../../../wp-load.php' );
  
  if ( !defined('WYSIJA') ) die();
  
  if ( isset($_POST['wysija_list_id']) && $wy_id = esc_html($_POST['wysija_list_id']) )
  {   
      
      $data=array(
        'user' => array(
          'email'=> esc_html( $_POST['email'] ),
          'firstname' => 'Firstname',
          'lastname' => 'Lastname'
        ),
        'user_list' => array('list_ids'=> array( $wy_id ))
      );
   
      $userHelper=&WYSIJA::get('user','helper');
      $userHelper->addSubscriber($data);
      
      exit();
  }
?>