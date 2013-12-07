<?php
  //Constant Contact Form

  if ( !isset( $_POST['url'] ) ) exit();

  $share_url = $_POST['url'];

  if ( $res = file_get_contents( $share_url ) ) {

  $res = preg_replace('/\r\n|\s\s+/','', $res);

  $res = preg_replace('/<div[^>]+>|<\/div>|<span[^>]+>|<\/span>|<span>|<fieldset>|<\/fieldset>/','', $res);
  $res = preg_replace('/<p>.*<\/p>/','', $res);
  $res = preg_replace('/\/manage\/optin\?/','http://visitor.r20.constantcontact.com/manage/optin?', $res);

  preg_match('/<form[^>]+>.*<\/form>/', $res, $m);

  if ( count($m) > 0 ) {

  echo $m[0];

  }
  } else echo '0';

?>