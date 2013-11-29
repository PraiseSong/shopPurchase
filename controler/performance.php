<?php
/**
 * Created by JetBrains PhpStorm.
 * User: praise
 * Date: 9/20/13
 * Time: 6:44 PM
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

$start = @$_POST['start'];
$end = @$_POST['end'];

$date = date("Y-m-d");
$query_sold_sql = "select p_id,detail from `cashier` where ((user_id=$user_id) and (date like '%$date%'))";
if($start && $end){
    $where = "((user_id=$user_id) and (date like '%$start%'";
    $start = preg_split("/\-/", $start);
    $end = preg_split("/\-/", $end);
    $start_y = $start[0];
    $start_m = $start[1];
    $start_d = $start[2];
    $end_y = $end[0];
    $end_m = $end[1];
    $end_d = $end[2];
    if($start_y === $end_y){
        if($start_m === $end_m){
            for(;($start_d++) < $end_d;){
                if($start_d < 10){
                    $start_d = '0'.$start_d;
                }
                $where .= " or date like '%$start_y-$start_m-$start_d%'";
            }
        }
    }
    $where .= '))';

    $query_sold_sql = "select p_id,detail,count,date from `cashier` where $where";
}
$sold_data = $db->queryManyObject($query_sold_sql);

$ids = array();
foreach($sold_data as $k => $v){
    array_push($ids, $v->p_id);
}
$ids = array_unique($ids);

$where = "((user_id=$user_id) and (";
foreach($ids as $k => $v){
    if($k !== 0){
        $where .= ' or ';
    }
    $where .= "p_id='$v'";
}

$where .= '))';

if(!$where){
    $result = array('bizCode' => 0, 'result' => array());
    echo json_encode($result);
    exit;
}
$query_price_sql = "select p_price,p_id from `products` where $where ";
$query_price_data = $db->queryManyObject($query_price_sql);
$db->close();
$operation = array();
foreach($query_price_data as $k => $v){
    foreach($sold_data as $kk => $vv){
        if($v-> p_id == $vv -> p_id){
            array_push(
                $operation,
                array('p_id' => $v-> p_id, 'detail' => $vv -> detail, 'p_price' => $v->p_price)
            );
        }
    }
}

$result = array("bizCode" => 1, "data" => $operation);
echo json_encode($result);
?>