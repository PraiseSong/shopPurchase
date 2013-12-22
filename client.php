<?php
/**
 * Created by PhpStorm.
 * User: apple
 * Date: 12/21/13
 * Time: 10:36 AM
 */
require_once("models/config.php");
header("Access-Control-Allow-Origin: *");

$extra_data = null;

if(!empty($_POST)){
    $extra_data = $_POST;
}else{
    exit(json_encode(array("bizCode" => 0, "memo" => "请使用POST调用", "data" => array())));
}

$client_api = @$_POST['api'];
$client_action = @$_POST['action'];
$client_data = @$_POST['data'];
$client_username = @$_POST['username'];

if(!$client_username){
    exit(json_encode(array("bizCode" => 0, "memo" => "$client_api : 没有username参数", "data" => array())));
}
if(!$client_action){
    exit(json_encode(array("bizCode" => 0, "memo" => "$client_api : 没有action参数", "data" => array())));
}
if(!$client_api){
    exit(json_encode(array("bizCode" => 0, "memo" => "没有api参数", "data" => array())));
}

$loggedInUser = logining(fetchUserDetails($client_username));

require_once("controlers/$client_api");
?>