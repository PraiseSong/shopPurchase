<?php
/**
 * Created by JetBrains PhpStorm.
 * User: praise
 * Date: 9/20/13
 * Time: 6:44 PM
 * To change this template use File | Settings | File Templates.
 */
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

switch($client_action){
    case "query":
        $start = @$_POST['start'];
        $end = @$_POST['end'];

        if(!$start || !$end){
            $result = array("bizCode" => 0, "memo" => "缺少开始时间和结束时间参数", "data"=>array());
            echo json_encode($result);
            exit;
        }

        if($start === $end){
            $end_split = preg_split("/\-/", $end);
            $end = $end_split[0].'-'.$end_split[1].'-'.($end_split[2]+1);
        }

        $sold_data = array();

        $where = "(";
        $where .= "(user_id=?) and (date BETWEEN ? and ?)";
        $where .= ')';

        $stmt = $mysqli->prepare("select p_id,detail,count,date,order_id,prop from `cashier` where $where");
        $stmt->bind_param("iss", $user_id, $start, $end);
        $stmt->execute();
        $stmt->bind_result($p_id, $detail, $count, $date, $order_id, $prop);
        while ($stmt->fetch()){
            $object = new stdClass();
            $object->p_id = $p_id;
            $object->detail = $detail;
            $object->count = $count;
            $object->date = $date;
            $object->order_id = $order_id;
            $object->prop = $prop;
            array_push($sold_data, $object);
        }
        $stmt->close();

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
        $query_p_detail_sql = "select p_price,p_id,p_type,p_name from `products` where $where ";
        $query_p_detail_data = array();
        $stmt = $mysqli->prepare($query_p_detail_sql);
        $stmt->execute();
        $stmt->bind_result($p_price, $p_id, $p_type, $p_name);
        while ($stmt->fetch()){
            $object = new stdClass();
            $object->p_price = $p_price;
            $object->p_id = $p_id;
            $object->p_type = $p_type;
            $object->p_name = $p_name;
            array_push($query_p_detail_data, $object);
        }
        $stmt->close();

        $operation = array();
        $types = array();
        if($query_p_detail_data){
            foreach($query_p_detail_data as $k => $v){
                foreach($sold_data as $kk => $vv){
                    if($v-> p_id == $vv -> p_id){
                        array_push(
                            $operation,
                            array('p_id' => $v-> p_id, 'detail' => $vv -> detail, 'p_price' => $v->p_price,
                                'date'=>$vv->date, 'type'=>$v->p_type, 'order_id'=>$vv->order_id, 'prop'=>$vv->prop,
                                'p_name'=>$v->p_name, 'p_count'=>$vv->count)
                        );
                    }
                }
            }
        }

        $result = array("bizCode" => 1, "memo" => "", "data" => array("products"=>$operation));
        echo json_encode($result);
        break;
    default:
        exit(json_encode(array("bizCode" => 0, "memo" => "没有action参数", "data" => array())));
        break;
}
?>