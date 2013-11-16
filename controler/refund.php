<?php
/**
 * Created by JetBrains PhpStorm.
 * User: praise
 * Date: 11/6/13
 * Time: 5:20 PM
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
    $result = array("bizCode" => 0, "memo" => "用户未登", "data"=>array("status" => 100));
    echo json_encode($result);
    exit;
}

$db = new DB($db_name,$db_host,$db_username,$db_password);
$db->query("SET NAMES 'UTF8'");

$id = @$_POST['id'];
$details = @$_POST['details'];
$result = array();
if(!$id || !$details){
    $result['bizCode'] = 0;
    $result['memo'] = '缺少参数';
}else if($details === 'null'){
    $sql = "delete from cashier where (user_id=$user_id and order_id='$id')";
    $data = $db->query($sql);
    if($data){
        $result['bizCode'] = 1;
        $result['data'] = array('deleted'=>true);
        $result['memo'] = '删除成功';
    }
}else{
    $sql = "update cashier set detail='$details' where (user_id=$user_id and order_id='$id')";
    $data = $db->query($sql);
    if($data){
        $last_data = $db->queryUniqueObject("select * from cashier where (user_id=$user_id and order_id='$id')");
        $result['bizCode'] = 1;
        $result['deleted'] = false;
        $result['data'] = array('sold'=>$last_data);
        $result['memo'] = '删除成功';
    }
}
$db->close();

echo json_encode($result);
?>