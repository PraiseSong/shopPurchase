<?php
/**
 * Created by JetBrains PhpStorm.
 * User: praise
 * Date: 9/20/13
 * Time: 6:44 PM
 * To change this template use File | Settings | File Templates.
 */
include_once('db.php');

$db_host = 'localhost';
$db_name = 'rib';
$db_username = 'root';
$db_password = 'ZHUqi@159';

$db = new DB($db_name,$db_host,$db_username,$db_password);
$db->query("SET NAMES 'UTF8'");

$page = @$_POST['page'];
$limit_start = 0;
$limit = @$_POST['limit'];
if(!$page){
    $page = 1;
}
if(!$limit){
    $limit = 10;
}
$limit_end = (int)$limit;
$limit_start = (int)$limit*((int)$page-1);
$sql = "select * from `products` limit $limit_start,$limit_end";
$data = $db->queryManyObject($sql);
$db->close();

$result = array("code" => 1, "products" => $data);
echo json_encode($result);
?>