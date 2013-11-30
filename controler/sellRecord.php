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

if(!$man){
    $man = '';
}

if(!$id){
    json_encode(array("bizCode" => 0, 'memo' => "缺少商品id"));
    exit;
}else if(!$detail){
    json_encode(array("bizCode" => 0, 'memo' => "缺少销售价格"));
    exit;
}

$query_kc_sql = "select p_count from `products` where (`user_id`=$user_id and `p_id` = '$id')";
$kc_data = $db->queryObject($query_kc_sql);
if(!$kc_data){
    echo json_encode(array("bizCode"=>0, "memo" => "该商品不存"));
    exit;
}else if($kc_data->p_count <= 0){
    echo json_encode(array("bizCode"=>0, "memo" => "该商品的库存为 0"));
    exit;
}

$sql = "insert into cashier(`user_id`, `p_id`, `count`, `prop`, `detail`, `man`, `date`) values($user_id, '$id', $count, '$props', '$detail', '$man', '$date')";
$insert_to_cashier_result = $db->query($sql);


$new_count = $kc_data-> p_count - $count;
if($new_count <= 0){
    $new_count = 0;
}

if($insert_to_cashier_result){
    $update_kc_sql = "update `products` set `p_count` = $new_count where (`user_id`=$user_id and `p_id` = '$id')";
    $updated_kc_result = $db->query($update_kc_sql);
}else{
    echo json_encode(array("bizCode"=>0, "memo" => "记账失败，请重试"));
    exit;
}

if($updated_kc_result){
    echo json_encode(array("bizCode"=>1, "memo" => "记账成功", "data" => $new_count));

    $db->close();
    exit;
}
?>