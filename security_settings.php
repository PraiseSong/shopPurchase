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
    $password = $_POST["password"];
    $password_new = $_POST["passwordc"];
    $password_confirm = $_POST["passwordcheck"];
    $email = $_POST["email"];

    if(!$password){
        $password = "";
    }

    //Perform some validation
    //Feel free to edit / change as required

    //Confirm the hashes match before updating a users password
    $entered_pass = generateHash($password,$loggedInUser->hash_pw);

//	if (trim($password) == ""){
//		$errors[] = lang("ACCOUNT_SPECIFY_PASSWORD");
//	}
//	else
    if(($password || $password || $password_confirm || $email) && ($entered_pass != $loggedInUser->hash_pw))
    {
        //No match
        $errors[] = lang("ACCOUNT_PASSWORD_INVALID");
    }
    if(!$password && !$password && !$password_confirm && !$email){
        $errors[] = lang("NOTHING_TO_UPDATE");
    }
    if(count($errors) == 0 && $email != $loggedInUser->email)
    {
        if(trim($email) == "")
        {
            $errors[] = lang("ACCOUNT_SPECIFY_EMAIL");
        }
        else if(!isValidEmail($email))
        {
            $errors[] = lang("ACCOUNT_INVALID_EMAIL");
        }
        else if(emailExists($email))
        {
            $errors[] = lang("ACCOUNT_EMAIL_IN_USE", array($email));
        }

        //End data validation
        if(count($errors) == 0){
            $loggedInUser->updateEmail($email);
            $successes[] = lang("ACCOUNT_EMAIL_UPDATED");
        }
    }

    if (count($errors) == 0 && ($password_new != "" OR $password_confirm != ""))
    {
        if(trim($password_new) == "")
        {
            $errors[] = lang("ACCOUNT_SPECIFY_NEW_PASSWORD");
        }
        else if(trim($password_confirm) == "")
        {
            $errors[] = lang("ACCOUNT_SPECIFY_CONFIRM_PASSWORD");
        }
        else if(minMaxRange(8,50,$password_new))
        {
            $errors[] = lang("ACCOUNT_NEW_PASSWORD_LENGTH",array(8,50));
        }
        else if($password_new != $password_confirm)
        {
            $errors[] = lang("ACCOUNT_PASS_MISMATCH");
        }

        //Also prevent updating if someone attempts to update with the same password
        $entered_pass_new = generateHash($password_new,$loggedInUser->hash_pw);

        if($entered_pass_new == $loggedInUser->hash_pw)
        {
            //Don't update, this fool is trying to update with the same password Â¬Â¬
            $errors[] = lang("ACCOUNT_PASSWORD_NOTHING_TO_UPDATE");
        }
        if(count($errors) == 0)
        {
            //This function will create the new hash and update the hash_pw property.
            $loggedInUser->updatePassword($password_new);
            $successes[] = lang("ACCOUNT_PASSWORD_UPDATED");
            $password_successed = true;
        }
    }
    if(count($errors) == 0 AND count($successes) == 0){
        $errors[] = lang("NOTHING_TO_UPDATE");
    }
}

require_once("models/header.php");
?>

<link rel="stylesheet" href="assets/css/security_settings.css" />
<header class="header">
    <a class="back box" href="javascript:void(0)"><img src="assets/imgs/back-icon.png" alt="记账台" />返回</a>
    <span class="box">安全设置</span>
</header>
<div class="container">
    <?php
    resultBlock($errors, $successes);
    ?>
    <form action="<?php echo $_SERVER['PHP_SELF']; ?>" method='post' class="form-default" novalidate="novalidate">
        <div class="input-skin first-child passwordBox">
            <div class="flexBox">
            <p>登录密码</p>
            <input type='password' name='password' class="box" placeholder="当前登录密码" />
            </div>
            <span class="tip">如果你不知道登录密码，请不要填写</span>
        </div>
        <div class="input-skin flexBox">
            <p>邮箱</p>
            <input type='email' name='email' class="box" placeholder="请输入您的新邮箱" value="<?php echo $loggedInUser->email; ?>" />
        </div>
        <div class="input-skin flexBox">
            <p>新登录密码</p>
            <input type='password' name='passwordc' class="box" placeholder="新的登录密码" />
        </div>
        <div class="input-skin flexBox">
            <p>再次输入</p>
            <input type='password' name='passwordcheck' class="box" placeholder="再次输入新登录密码" />
        </div>
        <input type='submit' value='确认更新' class='touchStatusBtn btn btn-primary' />
    </form>
</div>

<?php
  if(isset($password_successed)):
?>
<script>
    alert("登录密码已更新，请重新登录");
    location.href = "logout.php";
</script>
<?php endif; ?>
<script>
    seajs.use("footer.js");
</script>
</body>
</html>
