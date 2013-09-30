<?php
/**
 * Created by JetBrains PhpStorm.
 * User: praise
 * Date: 9/20/13
 * Time: 6:44 PM
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

$date = date("Y-m-d");

$sql = "select p_id,detail from `cashier` where date like '%$date%'";
$data = $db->queryManyObject($sql);

$ids = array();
$price_array = array();
foreach($data as $k => $v){
    array_push($ids, $v->p_id);
}
$ids = array_unique($ids);

$where = '';
foreach($ids as $k => $v){
    if($k !== 0){
        $where .= ' or ';
    }
    $where .= "p_id='$v'";
}

$query_price_sql = "select p_price,p_id from `products` where $where ";
$query_price_data = $db->queryManyObject($query_price_sql);
$db->close();
$todayOperation = array();
foreach($query_price_data as $k => $v){
    foreach($data as $kk => $vv){
        if($v->p_id == $vv -> p_id){
            array_push(
                $todayOperation,
                array('p_id' => $v->p_id, 'detail' => $vv -> detail, 'p_price' => $v->p_price)
            );
        }
    }
}

$result = array("code" => 1, "result" => $todayOperation);
echo json_encode($result);
?>