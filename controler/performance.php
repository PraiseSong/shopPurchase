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

if(!$start || !$end){
    $result = array("bizCode" => 0, "memo" => "缺少开始时间和结束时间参数", "data"=>array());
    echo json_encode($result);
    exit;
}

$date = date("Y-m-d");
$start = preg_split("/\-/", $start);
$end = preg_split("/\-/", $end);
$start_y = $start[0];
$start_m = $start[1];
$start_d = $start[2];
$end_y = $end[0];
$end_m = $end[1];
$end_d = $end[2];

if(
($end_y < $start_y)
||
(($end_y === $start_y) && ($end_m < $start_m))
||
(($end_y === $start_y) && ($end_m === $start_m) && ($end_d < $start_d))
){
    $result = array("bizCode" => 0, "memo" => "结束时间小于开始时间", "data"=>array());
    echo json_encode($result);
    exit;
}

$where = "((user_id=$user_id) and (date like '%{$_POST['start']}%'";
if($start_y === $end_y){
    if($start_m === $end_m){
        for(;($start_d++) < $end_d;){
            if($start_d < 10){
                $start_d = '0'.$start_d;
            }
            $where .= " or date like '%$start_y-$start_m-$start_d%'";
        }
    }else if($start_m < $end_m){
        $months = array();
        for($i = $start_m*1; $i < $end_m+1; $i++){
            array_push($months, $i);
        }
        foreach($months as $k => $m){
            if($m < 10){
                $m = '0'.$m;
            }
            if($k === 0){
                for($k = ($start_d*1)+1; $k < 32; $k++){
                    if($k < 10){
                        $k = '0'.$k;
                    }
                    $where .= " or date like '%$start_y-$m-$k%'";

                }
            }else if($k !== (count($months)-1)){
                for($k = 1; $k < 32; $k++){
                    if($k < 10){
                        $k = '0'.$k;
                    }
                    $where .= " or date like '%$start_y-$m-$k%'";

                }
            }else{
                for($k = 1; $k < $end_d+1; $k++){
                    if($k < 10){
                        $k = '0'.$k;
                    }
                    $where .= " or date like '%$end_y-$m-$k%'";

                }
            }
        }
    }
}else if($end_y > $start_y){
    $result = array("bizCode" => 0, "memo" => "暂时不支持跨年度查询", "data"=>array());
    echo json_encode($result);
    exit;
}
$where .= '))';

$query_sold_sql = "select p_id,detail,count,date from `cashier` where $where";var_dump($query_sold_sql);
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

if(count($ids) === 0){
    $where = "(user_id=$user_id)";
}

if(!$where){
    $result = array('bizCode' => 0, 'memo' => '服务端发生异常，请重试', 'data' => array());
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

$result = array("bizCode" => 1, "data" => array("products"=>$operation));
echo json_encode($result);
?>