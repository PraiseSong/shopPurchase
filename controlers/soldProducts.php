<?php
include_once('config/config.php');
include_once($libs_dir.'/db.php');
require_once("models/config.php");

$user_id = null;
if(isset($loggedInUser) && $loggedInUser->user_id){
    $user_id = $loggedInUser->user_id;
}
if(!$user_id){
    $result = array("bizCode" => 0, "memo" => "用户未登录", "data"=>array("redirect"=>"login.html"));
    echo json_encode($result);
    exit;
}
if($client_action === "query"){
    $date = $_POST['date'];
    if(!$date){
        $result = array("bizCode" => 0, "memo" => "没有传入日期参数", "data"=>array());
        echo json_encode($result);
        exit;
    }

    $db = new DB($db_name,$db_host,$db_username,$db_password);
    $db->query("SET NAMES 'UTF8'");

    $where = "((user_id=$user_id) and (date like '{$date}%'";
    $where .= '))';

    $query_sold_sql = "select p_id,detail,count,date,order_id,prop from `cashier` where $where ORDER BY date DESC";
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

    $query_price_sql = "select p_price,p_id,p_type,p_pic,p_name from `products` where $where ORDER BY p_date DESC";
    $query_price_data = $db->queryManyObject($query_price_sql);
    $operation = array();
    $types = array();
    foreach($sold_data as $kk => $vv){
        foreach($query_price_data as $k => $v){
            if($vv-> p_id == $v -> p_id){
                $t = $v -> p_type;
                $query_type_name_sql = "select name from types where (id=$t)";
                $type = $db->queryObject($query_type_name_sql);

                array_push(
                    $operation,
                    array('p_id' => $v-> p_id, 'detail' => $vv -> detail, 'p_price' => $v->p_price,'date'=>$vv->date, 'type'=>$type->name, 'order_id'=>$vv->order_id, 'prop'=>$vv->prop, 'p_pic'=>$v->p_pic,'p_name'=>$v->p_name)
                );
            }
        }
    }
    $db->close();

    $result = array("bizCode" => 1, "memo" => "", "data"=>array("products" => $operation));
    echo json_encode($result);
    exit;
}
?>