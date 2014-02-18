<?php
/*
UserCake Version: 2.0.2
http://usercake.com
*/
require_once("db-settings.php"); //Require DB connection

ini_set("display_errors", "1");
error_reporting(E_ALL);
date_default_timezone_set('Asia/Shanghai');

//Retrieve settings
$stmt = $mysqli->prepare("SELECT id, name, value
	FROM ".$db_table_prefix."configuration");
$stmt->execute();
$stmt->bind_result($id, $name, $value);

while ($stmt->fetch()){
	$settings[$name] = array('id' => $id, 'name' => $name, 'value' => $value);
}
$stmt->close();

//Set Settings
$emailActivation = $settings['activation']['value'];
$mail_templates_dir = "models/mail-templates/";
$websiteName = $settings['website_name']['value'];
$websiteUrl = $settings['website_url']['value'];
$emailAddress = $settings['email']['value'];
$version = $settings['version']['value'];
$android_version = $settings['android_version']['value'];
$resend_activation_threshold = $settings['resend_activation_threshold']['value'];
$date = date("Y-m-d H:i:s");
$language = $settings['language']['value'];
$template = $settings['template']['value'];

$master_account = -1;

$default_hooks = array("#WEBSITENAME#","#WEBSITEURL#","#DATE#");
$default_replace = array($websiteName,$websiteUrl,$date);

if (!file_exists($language)) {
	$language = "languages/en.php";
}

if(!isset($language)) $language = "languages/en.php";

//Pages to require
require_once($language);
require_once("class.mail.php");
require_once("class.user.php");
require_once("class.newuser.php");
require_once("funcs.php");

session_start();

//Global User Object Var
//loggedInUser can be used globally if constructed
if(isset($_SESSION["userCakeUser"]) && is_object($_SESSION["userCakeUser"]))
{
	$loggedInUser = $_SESSION["userCakeUser"];
}else if(isset($_COOKIE['rib_user_name']) && isset($_COOKIE['rib_user_pw']) && $_COOKIE['rib_user_name'] && $_COOKIE['rib_user_pw']){
    $userdetails = fetchUserDetails($_COOKIE['rib_user_name']);

    if($_COOKIE['rib_user_pw'] === $userdetails["password"]){
        $loggedInUser = logining($userdetails);
    }
}
?>
