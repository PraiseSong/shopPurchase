<?php
/*
UserCake Version: 2.0.2
http://usercake.com
*/

require_once("models/config.php");
if (!securePage($_SERVER['PHP_SELF'])){die();}

//Prevent the user visiting the logged in page if he is not logged in
if(!isUserLoggedIn()) { header("Location: login.html"); die(); }

if(!empty($_POST))
{
	$errors = array();
	$successes = array();

    $displayname = trim($_POST['displayname']);
    $email = trim($_POST['email']);

	if($displayname)
	{
		if($displayname === $loggedInUser->displayname)
		{
			$errors[] = lang("ACCOUNT_DISPLAY_NOTHING");
		}else if(minMaxRange(5,25,$displayname))
        {
            $errors[] = lang("ACCOUNT_DISPLAY_CHAR_LIMIT",array(5,25));
        }else if(displayNameExists($displayname)){
            $errors[] = lang("ACCOUNT_DISPLAYNAME_IN_USE", array($displayname));
        }else{
            $loggedInUser->updateDisplayName($displayname);
            $origin_displayname = $loggedInUser->displayname;
            $successes[] = lang("ACCOUNT_DISPLAYNAME_UPDATED", array($displayname));
        }
	}else{
        $errors[] = lang("ACCOUNT_DISPLAY_CHAR_LIMIT",array(5,25));
    }

    if($email){
        if($email !== $loggedInUser->email)
        {
            if(!isValidEmail($email))
            {
                $errors[] = lang("ACCOUNT_INVALID_EMAIL");
            }
            else if(emailExists($email))
            {
                $errors[] = lang("ACCOUNT_EMAIL_IN_USE", array($email));
            }else{
                $loggedInUser->updateEmail($email);
                $origin_email = $loggedInUser->email;
                $successes[] = lang("ACCOUNT_EMAIL_UPDATED");
            }
        }else{
            $errors[] = lang("ACCOUNT_EMAIL_NOTHING");
        }
    }else{
        $errors[] = lang("ACCOUNT_SPECIFY_EMAIL");
    }

    if(!isset($origin_email)){
        $origin_email = $email;
    }
    if(!isset($origin_displayname)){
        $origin_displayname = $displayname;
    }
}else{
    $origin_displayname = $loggedInUser->displayname ? $loggedInUser->displayname : "";
    $origin_email = $loggedInUser->email ? $loggedInUser->email : "";
}

require_once("models/header.php");
//echo "
//<body>
//<link rel=\"stylesheet\" href=\"static/css/user_settings.css\" />
//<div id='wrapper'>
//<div id='content'>
//<div id='portal'>";
//include("portal.php");
//
//echo "
//</div>
//<div id='main'>";
//
//echo resultBlock($errors,$successes);
//
//echo "
//<div id='regbox'>
//<form name='updateAccount' action='".$_SERVER['PHP_SELF']."' method='post'>
//<p>
//<label>小店名:</label>
//<input type='text' name='displayname' value=\"$origin_displayname\" />
//</p>
//<p>
//<input type='submit' value='更新' class='submit' />
//</p>
//</form>
//</div>
//</div>
//</div>
//</body>
//</html>";
?>
<body>
<link rel="stylesheet" href="assets/css/user_settings.css" />
<header class="header">
    <a class="back box" data-norouting="true" href="cashier.html"><img src="assets/imgs/back-icon.png" alt="记账台" />记账台</a>
    <span class="box">用户设置</span>
</header>
<div class="container">
    <?php
      resultBlock($errors, $successes);
    ?>
    <form class="form-default" action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post" novalidate="novalidate">
        <div class="input-skin first-child flexBox">
            <p>小店名</p>
            <input type='text' name='displayname' class="box" value="<?php echo $origin_displayname; ?>" placeholder="您的小店名" />
        </div>
        <div class="input-skin flexBox">
            <p>常用邮箱</p>
            <input type='email' name='email' class="box" value="<?php echo $origin_email; ?>" placeholder="建议使用QQ邮箱" />
        </div>
        <input type='submit' value='确认' class="touchStatusBtn btn btn-primary" />
    </form>
</div>
<script>
    seajs.use("footer.js");
</script>
</body>
</html>
