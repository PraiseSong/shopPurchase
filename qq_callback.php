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

if(!$uinfo['nickname'] || !isset($uinfo['nickname'])){
    echo '<!DOCTYPE html>
<!--<html manifest="cache.manifest">-->
<html xmlns="http://www.w3.org/1999/html">
<head>
    <meta charset="utf-8" />
    <meta content="initial-scale=1.0,user-scalable=no,maximum-scale=1,width=device-width" name="viewport" />
    <meta content="telephone=no" name="format-detection" />
    <meta content="yes" name="apple-mobile-web-app-capable" />
    <meta content="black" name="apple-mobile-web-app-status-bar-style" />
    <meta property="qc:admins" content="20612357606212603" />
    <link href="assets/imgs/logo.png" rel="apple-touch-icon-precomposed" />
    <link rel="stylesheet" href="assets/css/reset.css" />
    <link rel="stylesheet" href="assets/css/common.css" />
    <title>
        '.$websiteName.'QQ登录认证
    </title>
</head>
<body>';
echo "<p style='text-align: center; margin: 100px 10px 0;line-height:23px;font-size: 16px;font-weight: 700;'>QQ认证登录时，无法获取认证信息，请<a href=\"qq_login.php\">  重试 </a></p>";
echo '</body></html>';

    exit;
}

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
    $loggedInUser = logining($userdetails);

    if(!$loggedInUser->email || !$loggedInUser->displayname){
        header("Location: user_settings.php");
    }else{
        header("Location: cashier.html");
    }
    die();
}

function request_register(){
    global $uinfo,$userdetails;
    $errors = array();
    $successes = array();
    $user = new User($uinfo['nickname'],$uinfo['nickname']."的小店","","",'qq');

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