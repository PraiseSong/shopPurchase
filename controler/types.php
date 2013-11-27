<?php
/**
 * Created by JetBrains PhpStorm.
 * User: praise
 * Date: 10/7/13
 * Time: 11:59 AM
 * To change this template use File | Settings | File Templates.
 */
include_once('../config/config.php');
include_once('../'.$libs_dir.'/db.php');
require_once("../models/config.php");

$user_id = null;
if(isset($loggedInUser) && $loggedInUser->user_id){
    $user_id = $loggedInUser->user_id;
}
if(!$user_id){
    $result = array("bizCode" => 0, "memo" => "用户未登录", "data"=>array("redirect"=>"login.php"));
    echo json_encode($result);
    exit;
}

$db = new DB($db_name,$db_host,$db_username,$db_password);
$db->query("SET NAMES 'UTF8'");

$action = @$_POST['action'];

if(!$action){
    exit(json_encode(array("code" => 0, "memo" => "缺少参数")));
}

switch($action){
    case "query":
        $sql = "select id,name from types where (user_id = $user_id)";
        $data = $db->queryManyObject($sql);
        break;
    case "add":
        $name = @$_POST['name'];
        if(!$name){
            exit(json_encode(array("code" => 0, "memo" => "缺少分类名称")));
        }
        $sql = "insert into types(`user_id`, `name`) values($user_id, '$name')";
        $data = $db->query($sql);
        break;
}

echo json_encode(array("bizCode" => 1, "data" => array('types' => $data)));
?>