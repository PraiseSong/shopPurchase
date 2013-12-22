<?php
/**
 * Created by JetBrains PhpStorm.
 * User: praise
 * Date: 9/20/13
 * Time: 6:44 PM
 * To change this template use File | Settings | File Templates.
 */
include_once('config/config.php');
include_once($libs_dir.'/db.php');
include_once($utils_dir.'/utils.php');
require_once("models/config.php");

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

if($client_action === "query"){
    $start = @$_POST['start'];
    $end = @$_POST['end'];

    if(!$start || !$end){
        $result = array("bizCode" => 0, "memo" => "缺少开始时间和结束时间参数", "data"=>array());
        echo json_encode($result);
        exit;
    }

    $date = date("Y-m-d");
    $dates = getDateRange($start, $end);

    if(
    is_string($dates)
    ){
        $result = array("bizCode" => 0, "memo" => "$dates", "data"=>array());
        echo json_encode($result);
        exit;
    }

    $where = "((user_id=$user_id) and (date like '{$dates[0]}%'";
    for($i=1;$i<count($dates);$i++){
        $where .= " or date like '{$dates[$i]}%'";
    }
    $where .= '))';

    $query_sold_sql = "select p_id,detail,count,date,order_id,prop from `cashier` where $where";
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
    $query_price_sql = "select p_price,p_id,p_type,p_pic,p_name from `products` where $where ";
    $query_price_data = $db->queryManyObject($query_price_sql);
    $operation = array();
    $types = array();
    foreach($query_price_data as $k => $v){
        $t = $v -> p_type;
        $query_type_name_sql = "select name from types where (id=$t)";
        $type = $db->queryObject($query_type_name_sql);
        foreach($sold_data as $kk => $vv){
            if($v-> p_id == $vv -> p_id){
                array_push(
                    $operation,
                    array('p_id' => $v-> p_id, 'detail' => $vv -> detail, 'p_price' => $v->p_price,'date'=>$vv->date, 'type'=>$type->name, 'order_id'=>$vv->order_id, 'prop'=>$vv->prop, 'p_pic'=>$v->p_pic,'p_name'=>$v->p_name,'p_count'=>$vv->count)
                );
            }
        }
    }
    $db->close();

    $result = array("bizCode" => 1, "memo" => "", "data" => array("products"=>$operation));
    echo json_encode($result);
}
?>