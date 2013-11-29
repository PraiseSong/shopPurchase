<?php
/**
 * Created by PhpStorm.
 * User: apple
 * Date: 11/26/13
 * Time: 10:17 PM
 */
include_once('../config/config.php');
include_once('../'.$libs_dir.'/db.php');
require_once("../models/config.php");

$user_id = null;
if(isset($loggedInUser) && $loggedInUser->user_id){
    $user_id = $loggedInUser->user_id;
    $data = array("bizCode"=>1,"memo"=>"","data"=>$loggedInUser);
    echo json_encode($data);
}
if(!$user_id){
    $result = array("bizCode" => 0, "memo" => "用户未登录", "data"=>array("redirect"=>"login.html"));
    echo json_encode($result);
    exit;
}
?>