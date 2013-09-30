<?php
/**
 * Created by JetBrains PhpStorm.
 * User: praise
 * Date: 9/26/13
 * Time: 9:46 PM
 * To change this template use File | Settings | File Templates.
 */
include_once('config.php');
include_once('db.php');

$db_host = 'localhost';
$db_name = 'rib';
$db_username = 'root';
$db_password = 'ZHUqi@159';

$db = new DB($db_name,$db_host,$db_username,$db_password);
$db->query("SET NAMES 'UTF8'");

$id = @$_POST['id'];
$count = @$_POST['count'];
$detail = @$_POST['detail'];
$man = @$_POST['man'];
$date = date("Y-m-d h:i:s A");

if(!$man){
    $man = '';
}

$sql = "insert into cashier(`p_id`, `count`, `detail`, `man`, `date`) values('$id', $count, '$detail', '$man', '$date')";
$data = $db->query($sql);

$query_kc_sql = "select p_count from `products` where `p_id` = '$id'";
$kc_data = $db->queryObject($query_kc_sql);
$new_count = $kc_data-> p_count - $count;
$update_kb_sql = "update `products` set `p_count` = $new_count where `p_id` = '$id'";
$updated_result = $db->query($update_kb_sql);
$db->close();

$result = array("code" => $updated_result);
echo json_encode($result);
?>