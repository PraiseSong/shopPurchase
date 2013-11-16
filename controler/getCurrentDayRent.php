<?php
include_once('../config/config.php');
include_once('../'.$libs_dir.'/db.php');
require_once("../models/config.php");

$user_id = null;
if(isset($loggedInUser) && $loggedInUser->user_id){
    $user_id = $loggedInUser->user_id;
}
if(!$user_id){
    $result = array("bizCode" => 0, "memo" => "用户未登", "data"=>array("status" => 100));
    echo json_encode($result);
    exit;
}

$db = new DB($db_name,$db_host,$db_username,$db_password);
$db->query("SET NAMES 'UTF8'");

$date = date("Y-m-d H:i:s");

$sql = "select * from rent where(date='$date' and user_id=$user_id)";
$data = $db->queryUniqueObject($sql);
$db->close();

echo $data ? json_encode(array('code' => 1, 'data' => $data))
           : json_encode(array('code' => 0, 'memo' => '没有当日租金数据'));
?>