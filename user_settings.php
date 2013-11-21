<?php
/*
UserCake Version: 2.0.2
http://usercake.com
*/

require_once("models/config.php");
if (!securePage($_SERVER['PHP_SELF'])){die();}

//Prevent the user visiting the logged in page if he is not logged in
if(!isUserLoggedIn()) { header("Location: login.php"); die(); }

$origin_displayname = $loggedInUser->displayname ? $loggedInUser->displayname : "";

if(!empty($_POST))
{
	$errors = array();
	$successes = array();

    $displayname = trim($_POST['displayname']);

	if($displayname)
	{
		if($displayname == $origin_displayname)
		{
			$errors[] = lang("ACCOUNT_DISPLAY_NOTHING");
		}else if(minMaxRange(5,25,$displayname))
        {
            $errors[] = lang("ACCOUNT_DISPLAY_CHAR_LIMIT",array(5,25));
        }else if(displayNameExists($displayname)){
            $errors[] = lang("ACCOUNT_DISPLAYNAME_IN_USE");
        }
		
		//End data validation
		if(count($errors) == 0)
		{
			$loggedInUser->updateDisplayName($displayname);
			$successes[] = lang("ACCOUNT_DISPLAYNAME_UPDATED", array($displayname));
            $origin_displayname = $displayname;
		}
	}else{
        $errors[] = lang("ACCOUNT_DISPLAY_CHAR_LIMIT",array(5,25));
    }
}

require_once("models/header.php");
echo "
<body>
<link rel=\"stylesheet\" href=\"static/css/user_settings.css\" />
<div id='wrapper'>
<div id='content'>
<div id='portal'>";
include("portal.php");

echo "
</div>
<div id='main'>";

echo resultBlock($errors,$successes);

echo "
<div id='regbox'>
<form name='updateAccount' action='".$_SERVER['PHP_SELF']."' method='post'>
<p>
<label>小店名:</label>
<input type='text' name='displayname' value=\"$origin_displayname\" />
</p>
<p>
<input type='submit' value='更新' class='submit' />
</p>
</form>
</div>
</div>
</div>
</body>
</html>";

?>
