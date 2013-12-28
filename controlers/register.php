<?php
/*
UserCake Version: 2.0.2
http://usercake.com
*/

require_once("models/config.php");

//Forms posted
if(!empty($_POST))
{
    $email = "";
    $username = "";
    $displayname = "";

	$errors = array();
	$email = trim($_POST["email"]);
	$username = sanitize(trim($_POST["username"]));
	//$displayname = trim($_POST["displayname"]);
	$password = trim($_POST["password"]);
	$confirm_pass = trim($_POST["passwordc"]);
	//$captcha = md5($_POST["captcha"]);
	
	
//	if ($captcha != $_SESSION['captcha'])
//	{
//		$errors[] = lang("CAPTCHA_FAIL");
//	}
	if(minMaxRange(2,25,$username))
	{
		$errors[] = lang("ACCOUNT_USER_CHAR_LIMIT",array(2,25));
	}
//	if(!ctype_alnum($username)){
//		$errors[] = lang("ACCOUNT_USER_INVALID_CHARACTERS");
//	}
//	if(minMaxRange(5,25,$displayname))
//	{
//		$errors[] = lang("ACCOUNT_DISPLAY_CHAR_LIMIT",array(5,25));
//	}else if(displayNameExists($displayname)){
//        $errors[] = lang("ACCOUNT_DISPLAYNAME_IN_USE", array($displayname));
//    }
	if(minMaxRange(6,50,$password) && minMaxRange(6,50,$confirm_pass))
	{
		$errors[] = lang("ACCOUNT_PASS_CHAR_LIMIT",array(6,50));
	}
	else if($password != $confirm_pass)
	{
		$errors[] = lang("ACCOUNT_PASS_MISMATCH");
	}
	if(!isValidEmail($email))
	{
		$errors[] = lang("ACCOUNT_INVALID_EMAIL");
	}

	//End data validation
	if(count($errors) == 0)
	{
        $displayname = $username."的小店";
		//Construct a user object
		$user = new User($username,$displayname,$password,$email);

		//Checking this flag tells us whether there were any errors such as possible data duplication occured
		if(!$user->status)
		{
			if($user->username_taken) $errors[] = lang("ACCOUNT_USERNAME_IN_USE",array($username));
			if($user->displayname_taken) $errors[] = lang("ACCOUNT_DISPLAYNAME_IN_USE",array($displayname));
			if($user->email_taken) 	  $errors[] = lang("ACCOUNT_EMAIL_IN_USE",array($email));
		}
		else
		{
			//Attempt to add the user to the database, carry out finishing  tasks like emailing the user (if required)
			if(!$user->userCakeAddUser())
			{
				if($user->mail_failure) $errors[] = lang("MAIL_ERROR", array($websiteName));
				if($user->sql_failure)  $errors[] = lang("SQL_ERROR");
			}
		}

        if(count($errors) > 0){
            $result = array("bizCode" => 0, "memo" => "注册失败", "data"=>array("msg"=>$errors));
            echo json_encode($result);
        }else{
            $result = array("bizCode" => 1, "memo" => "注册成功", "data"=>array("redirect" => "login.html"));
            echo json_encode($result);
            exit;
        }
	}else{
        $result = array("bizCode" => 0, "memo" => "注册失败", "data"=>array("msg"=>$errors));
        echo json_encode($result);
        exit;
    }
}else{
    $result = array("bizCode" => 0, "memo" => "只支持POST注册", "data" => array());
    echo json_encode($result);
    exit;
}
?>
