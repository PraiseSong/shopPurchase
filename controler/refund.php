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

$db = new DB($db_name,$db_host,$db_username,$db_password);
$db->query("SET NAMES 'UTF8'");

$id = @$_POST['id'];
$details = @$_POST['details'];
$result = array();
if(!$id || !$details){
    $result['bizCode'] = 0;
    $result['memo'] = '缺少参数';
}else if($details === 'null'){
    $sql = "delete from cashier where order_id='$id'";
    $data = $db->query($sql);
    if($data){
        $result['bizCode'] = 1;
        $result['data'] = array('deleted'=>true);
        $result['memo'] = '删除成功';
    }
}else{
    $sql = "update cashier set detail='$details' where order_id='$id'";
    $data = $db->query($sql);
    if($data){
        $last_data = $db->queryUniqueObject("select * from cashier where order_id='$id'");
        $result['bizCode'] = 1;
        $result['deleted'] = false;
        $result['data'] = array('sold'=>$last_data);
        $result['memo'] = '删除成功';
    }
}
$db->close();

echo json_encode($result);
?>