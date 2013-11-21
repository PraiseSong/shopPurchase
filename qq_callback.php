<?php
/**
 * Created by PhpStorm.
 * User: apple
 * Date: 11/20/13
 * Time: 5:44 PM
 */
require_once("qqConnect2.0/API/qqConnectAPI.php");
require_once("models/config.php");
if (!securePage($_SERVER['PHP_SELF'])){die();}

$qc = new QC();
$acs = $qc->qq_callback();
$oid = $qc->get_openid();
@$qc = new QC($acs, $oid);
$uinfo = $qc->get_user_info();

//如果前面有用户登录，就自动退出
if(isUserLoggedIn())
{
    $loggedInUser->userLogOut();
}

$userdetails = fetchUserDetails($uinfo['nickname']);

//如果没有获取到用户信息
if(!$userdetails){
    request_register();
}else{
    request_login($userdetails);
}

function request_login($userdetails){
    //Construct a new logged in user object
    //Transfer some db data to the session object
    $loggedInUser = new loggedInUser();
    $loggedInUser->email = $userdetails["email"];
    $loggedInUser->user_id = $userdetails["id"];
    $loggedInUser->hash_pw = $userdetails["password"];
    $loggedInUser->title = $userdetails["title"];
    $loggedInUser->displayname = $userdetails["display_name"];
    $loggedInUser->username = $userdetails["user_name"];

    //Update last sign in
    $loggedInUser->updateLastSignIn();
    $_SESSION["userCakeUser"] = $loggedInUser;
    setcookie("rib_user_name", $loggedInUser->username, time()+3600*24);
    $_SESSION['LAST_ACTIVITY'] = time(); // update last activity time stamp

    if(!$loggedInUser->email || !$loggedInUser->displayname){
        header("Location: user_settings.php");
    }else{
        header("Location: cashier.php");
    }
    die();
}

function request_register(){
    global $uinfo,$userdetails;
    $errors = array();
    $successes = array();
    $user = new User($uinfo['nickname'],$uinfo['nickname']."的小店","","");

    //Checking this flag tells us whether there were any errors such as possible data duplication occured
    if(!$user->status)
    {
        request_login($userdetails);
        die();
    }
    else
    {
        //Attempt to add the user to the database, carry out finishing  tasks like emailing the user (if required)
        if(!$user->userCakeAddUser())
        {
            if($user->sql_failure)  $errors[] = lang("SQL_ERROR");
        }
    }

    if(count($errors) == 0) {
        $successes[] = $user->success;
    }

    //resultBlock($errors,$successes);

    $userdetails = fetchUserDetails($uinfo['nickname']);
    request_login($userdetails);
}
?>