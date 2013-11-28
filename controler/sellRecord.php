<?php
/**
 * Created by JetBrains PhpStorm.
 * User: praise
 * Date: 9/26/13
 * Time: 9:46 PM
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

$id = @$_POST['id'];
$count = @$_POST['count'];
$detail = @$_POST['detail'];
$man = @$_POST['man'];
$props = @$_POST['props'];
$date = date("Y-m-d H:i:s");

if(!$detail || !$count){
    json_encode(array("bizCode" => 0, 'memo' => "缺少参数"));
    exit;
}

if(!$man){
    $man = '';
}

$sql = "insert into cashier(`user_id`, `p_id`, `count`, `prop`, `detail`, `man`, `date`) values($user_id, '$id', $count, '$props', '$detail', '$man', '$date')";
$data = $db->query($sql);

$query_kc_sql = "select p_count from `products` where (`user_id`=$user_id and `p_id` = '$id')";
$kc_data = $db->queryObject($query_kc_sql);
$new_count = $kc_data-> p_count - $count;
$update_kb_sql = "update `products` set `p_count` = $new_count where (`user_id`=$user_id and `p_id` = '$id')";
$updated_result = $db->query($update_kb_sql);
$db->close();

$result = $updated_result ? array("bizCode" => 1) : array("bizCode" => 0);
echo json_encode($result);
?>