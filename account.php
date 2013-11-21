<?php
/*
UserCake Version: 2.0.2
http://usercake.com
*/
require_once("models/config.php");
if (!securePage($_SERVER['PHP_SELF'])){die();}
require_once("models/header.php");

echo "
<body>
<link rel=\"stylesheet\" href=\"static/css/account.css\" />
<div id='wrapper'>
<div id='content'>
<div id='portal'>";

include("portal.php");

echo "
</div>
<div id='main'>
Hey, $loggedInUser->username. This is an example secure page designed to demonstrate some of the basic features of UserCake. Just so you know, your title at the moment is $loggedInUser->title, and that can be changed in the admin panel. You registered this account on " . date("M d, Y", $loggedInUser->signupTimeStamp()) . ".
</div>
</div>
</body>
</html>";
var_dump($loggedInUser);
?>
