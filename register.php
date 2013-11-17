<?php
/*
UserCake Version: 2.0.2
http://usercake.com
*/

require_once("models/config.php");
if (!securePage($_SERVER['PHP_SELF'])){die();}

//Prevent the user visiting the logged in page if he/she is already logged in
if(isUserLoggedIn()) { header("Location: account.php"); die(); }

//Forms posted
if(!empty($_POST))
{
	$errors = array();
	$email = trim($_POST["email"]);
	$username = trim($_POST["username"]);
	$displayname = trim($_POST["displayname"]);
	$password = trim($_POST["password"]);
	$confirm_pass = trim($_POST["passwordc"]);
	$captcha = md5($_POST["captcha"]);
	
	
	if ($captcha != $_SESSION['captcha'])
	{
		$errors[] = lang("CAPTCHA_FAIL");
	}
	if(minMaxRange(5,25,$username))
	{
		$errors[] = lang("ACCOUNT_USER_CHAR_LIMIT",array(5,25));
	}
	if(!ctype_alnum($username)){
		$errors[] = lang("ACCOUNT_USER_INVALID_CHARACTERS");
	}
	if(minMaxRange(5,25,$displayname))
	{
		$errors[] = lang("ACCOUNT_DISPLAY_CHAR_LIMIT",array(5,25));
	}
	if(minMaxRange(8,50,$password) && minMaxRange(8,50,$confirm_pass))
	{
		$errors[] = lang("ACCOUNT_PASS_CHAR_LIMIT",array(8,50));
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
	}
	if(count($errors) == 0) {
		$successes[] = $user->success;
	}
}

require_once("models/header.php");
echo "
<body>
<link rel=\"stylesheet\" href=\"static/css/register.css\" />
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
<form name='newUser' action='".$_SERVER['PHP_SELF']."' method='post'>

<p>
<label>用户名:</label>
<input type='text' name='username' placeholder=\"5-20位英文或数字\" />
</p>
<p>
<label>小店名:</label>
<input type='text' name='displayname' placeholder=\"5-20位字符\" />
</p>
<p>
<label>登录密码:</label>
<input type='password' name='password' placeholder=\"8-50位英文或数字\" />
</p>
<p>
<label>再次输入登录密码:</label>
<input type='password' name='passwordc' placeholder=\"与前面的登录密码一致\" />
</p>
<p>
<label>邮箱:</label>
<input type='text' name='email' placeholder=\"您的QQ邮箱或其它常用邮箱\" />
</p>
<p>
<label>验证码:</label>
<img src='models/captcha.php'>
</p>
<input name='captcha' type='text' placeholder=\"输入验证码\" />
</p>
<label>&nbsp;<br>
<input type='submit' value='确认注册'/>
</p>

</form>
</div>

</div>
</div>
</body>
</html>";
?>
