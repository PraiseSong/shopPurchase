<?php
if(!$_POST){
    exit('非法访问');
}
include_once('../config/config.php');
include_once('../'.$libs_dir.'/db.php');

$db = new DB($db_name,$db_host,$db_username,$db_password);
$db->query("SET NAMES 'UTF8'");

$date = date("Y-m-d H:i:s");

$sql = "select * from rent where(date='$date')";
$data = $db->queryUniqueObject($sql);
$db->close();

echo $data ? json_encode(array('code' => 1, 'data' => $data))
           : json_encode(array('code' => 0, 'memo' => '没有当日租金数据'));
?>