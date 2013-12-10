<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<!-- 
  File Name: insertUsersProgramatically.php
  Authors: Armagan Tekdoner and JingXuan He
  Website: webforum.grifare.com
  URI: http://webforum.grifare.com/code-archive/insertUsersProgramatically.php
  File Description:
	This file creates as many dummy users as desired.
    Displays user names along with plain text passwords for 10 seconds and then redirects to the members page
-->
<title>Dummy User Creation File</title>
</head>

<body>
	<?php
    
    require "wp-includes/pluggable.php";
    // connection string
    
    $wpDB_Connection = mysqli_connect("localhost","grifare_php","php11","grifare_wForum");
    /*  the order in which credentials are written
    1 localhost for grifare.info
    2 grifare_php is the user
    3 php11 is the password
    4 grifare_wForum is db name
    */
    
           // Check the connection created
           if (mysqli_connect_errno($wpDB_Connection)) 
             {
             echo "Failed to connect to MySQL: " . mysqli_connect_error();
             }
    
    
    // define repetitive text patterns
    $part1 = "fake_contributor";
    $emailDomain = "@fakemail.com";
    $displayName = "smart_ass";
       
        // programatically-created dummy users
        foreach (range(0, 3) as $numberOfDummyContributors) {
            // store the plain text for reusability
            $plainPassword = mt_rand();
            // show the list of passwords and users
            echo "$part1$numberOfDummyContributors &emsp; $plainPassword<br />";
            // MD5 the plain text
            $password = MD5($plainPassword);	
        // write sql command to insert
        $createDummyUsers = "INSERT INTO wp_users(user_login, user_pass, user_nicename, user_email, display_name)	
        VALUES ('$part1$numberOfDummyContributors', '$password', '$part1$numberOfDummyContributors', '$part1$numberOfDummyContributors$emailDomain', '$displayName$numberOfDummyContributors');";	
        // execute the query above
        mysqli_query($wpDB_Connection,$createDummyUsers) or die('The trick failed');
        
        }
       
    // close the db connection
    mysqli_close($wpDB_Connection);  
    // redirect  
    //header('Location: http://webforum.grifare.com/list-of-members/');
    ?>
<!--redirect the user in 10 seconds-->
<meta http-equiv="refresh" content="10;url=http://webforum.grifare.com/list-of-members/">

</body>
</html>