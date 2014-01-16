<?php
/**
 * Created by PhpStorm.
 * User: apple
 * Date: 11/26/13
 * Time: 10:17 PM
 */
include_once('config/config.php');
include_once($libs_dir.'/db.php');
require_once("models/config.php");

if($client_action === "update"){
    $password = $_POST['password'];

    if(!$password || ($loggedInUser -> hash_pw !== $password)){
        $data = array("bizCode"=>0,"memo"=>"验证不通过，用户未登录","data"=>array());
        exit(json_encode($data));
    }
    if(isset($loggedInUser) && $loggedInUser->user_id){
        $data = array("bizCode"=>1,"memo"=>"","data"=>array("user" => $loggedInUser));
        exit(json_encode($data));
    }else{
        $data = array("bizCode"=>0,"memo"=>"验证不通过，用户未登录","data"=>array());
        exit(json_encode($data));
    }
}
?>