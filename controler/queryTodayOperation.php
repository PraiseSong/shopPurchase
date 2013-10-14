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

$db = new DB($db_name,$db_host,$db_username,$db_password);
$db->query("SET NAMES 'UTF8'");

$start = @$_POST['start'];
$end = @$_POST['end'];

$date = date("Y-m-d");
$query_today_sell_sql = "select p_id,detail from `cashier` where date like '%$date%'";
if($start){
    $where = "(date like '%$start%'";
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
    $where .= ')';

    $query_today_sell_sql = "select p_id,detail,count,date from `cashier` where $where";
}
$today_sell_data = $db->queryManyObject($query_today_sell_sql);

$ids = array();
foreach($today_sell_data as $k => $v){
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

if(!$where){
    $result = array('code' => 0, 'result' => array());
    echo json_encode($result);
    exit;
}
$query_price_sql = "select p_price,p_id from `products` where $where ";
$query_price_data = $db->queryManyObject($query_price_sql);
$db->close();
$todayOperation = array();
foreach($query_price_data as $k => $v){
    foreach($today_sell_data as $kk => $vv){
        if($v-> p_id == $vv -> p_id){
            array_push(
                $todayOperation,
                array('p_id' => $v-> p_id, 'detail' => $vv -> detail, 'p_price' => $v->p_price)
            );
        }
    }
}

$result = array("code" => 1, "result" => $todayOperation);
echo json_encode($result);
?>