<?php
/**
 * Created by JetBrains PhpStorm.
 * User: praise
 * Date: 10/27/13
 * Time: 1:05 PM
 * To change this template use File | Settings | File Templates.
 */
include_once('../config/config.php');
include_once('../'.$libs_dir.'/db.php');

$db = new DB($db_name,$db_host,$db_username,$db_password);
$db->query("SET NAMES 'UTF8'");

$date = date("Y-m-d H:i:s");

$sql = "select * from rent where(date='$date')";
$data = $db->queryUniqueObject($sql);
$db->close();

echo $data ? $data : false;
?>