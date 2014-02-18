<?php
/**
 * Created by JetBrains PhpStorm.
 * User: praise
 * Date: 11/6/13
 * Time: 5:20 PM
 * To change this template use File | Settings | File Templates.
 */
include_once('config/config.php');
include_once($libs_dir.'/db.php');
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

if($client_action === 'refund'){
    $id = @$_POST['id'];
    $details = @$_POST['details'];
    $result = array();
    if(!$id || !$details){
        $result = array("bizCode" => 0, "memo" => "缺少参数", "data"=>array());
        echo json_encode($result);
        exit;
    }

    $query_exist_sql = "select order_id,detail,count,p_id from cashier where (user_id=$user_id and order_id='$id')";
    $query_exist_data = $db -> queryUniqueObject($query_exist_sql);
    if(!$query_exist_data || !$query_exist_data->order_id){
        $result = array("bizCode" => 0, "memo" => "这条销售记录不存在或者全部退货", "data"=>array());
        echo json_encode($result);
        exit;
    }
    $query_exist_detail = $query_exist_data->detail;
    $p_id = $query_exist_data -> p_id;
    $refund_count = 0;
    if(!$query_exist_detail){
        $result = array("bizCode" => 0, "memo" => "这条销售记录存在异常，请刷新页面", "data"=>array());
        echo json_encode($result);
        exit;
    }
    if($details === 'null'){
        $sql = "delete from cashier where (user_id=$user_id and order_id='$id')";
        $data = $db->query($sql);
        if($data){
            $refund_count = $query_exist_data->count;
            $query_kc_sql = "select p_count from `products` where (`user_id`=$user_id and `p_id` = '$p_id')";
            $kc_data = $db->queryObject($query_kc_sql);
            if(!$kc_data){
                echo json_encode(array("bizCode"=>1, "memo" => "删除销售记录完成，但是更新仓库失败", "data"=>array('deleted'=>true)));
                exit;
            }else{
                $new_warehouse_count = $kc_data -> p_count + $refund_count;
                $update_kc_sql = "update `products` set `p_count` = $new_warehouse_count where (`user_id`=$user_id and `p_id` = '$p_id')";
                $updated_kc_result = $db->query($update_kc_sql);
                if($updated_kc_result){
                    echo json_encode(array("bizCode"=>1, "memo" => "删除销售记录完成并且更新商品库存成功", "data"=>array('deleted'=>true)));
                    exit;
                }
                echo json_encode($result);
                exit;
            }
        }else{
            $result = array("bizCode" => 0, "memo" => "删除销售记录失败，请重试", "data"=>array());
            echo json_encode($result);
            exit;
        }
    }
    if(strpos($query_exist_detail, '|')){
        $query_exist_detail = preg_split("/\|/", $query_exist_detail);
    }else{
        $query_exist_detail = array($query_exist_detail);
    }
    $details = json_decode($details);
    $new_detail = array();
    foreach($query_exist_detail as $k => $del){
        $index =(String) ($k+1);
        $del = preg_split('/\*/', $del);

        if(count($del) > 1){
            $exist_max = $del[1];
            if(!property_exists($details, $index)){
                array_push($new_detail, implode('*', $del));
                continue;
            }
            $extra = $details -> $index;
            $extra = preg_split('/\,/', $extra[0]);
            if($extra[0] !== $exist_max){
                $result = array("bizCode" => 0, "memo" => "退货发生异常，请刷新页面", "data"=>array());
                echo json_encode($result);
                break;
                exit;
            }
            $new_count = $exist_max - $extra[1];
            if($new_count < 0){
                $result = array("bizCode" => 0, "memo" => "退货数量大于销售时的数量", "data"=>array());
                echo json_encode($result);
                break;
                exit;
            }
            if($new_count > 0){
                array_push($new_detail, $del[0].'*'.$new_count);
            }
            $refund_count += $extra[1];
        }
    }
    $new_detail = implode('|', $new_detail);
    $new_total_count = $query_exist_data->count - $refund_count;
    if($new_detail){
        $sql = "update cashier set detail='$new_detail',count=$new_total_count where (user_id=$user_id and order_id='$id')";
        $data = $db->query($sql);
        if($data){
            $result = array("bizCode" => 1, "memo" => "退货成功", "data"=>array('sold'=>true));
            $query_kc_sql = "select p_count from `products` where (`user_id`=$user_id and `p_id` = '$p_id')";
            $kc_data = $db->queryObject($query_kc_sql);
            if(!$kc_data){
                echo json_encode(array("bizCode"=>1, "memo" => "退货成功，但是更新仓库失败", "data"=>array()));
                exit;
            }else{
                $new_warehouse_count = $kc_data -> p_count + $refund_count;
                $update_kc_sql = "update `products` set `p_count` = $new_warehouse_count where (`user_id`=$user_id and `p_id` = '$p_id')";
                $updated_kc_result = $db->query($update_kc_sql);
                if($updated_kc_result){
                    echo json_encode(array("bizCode"=>1, "memo" => "退货完成并且更新商品库存成功", "data"=>array()));
                    exit;
                }
                echo json_encode($result);
                exit;
            }
        }
    }else{
        $result = array("bizCode" => 0, "memo" => "重新计算销售记录时发生异常，请重试", "data"=>array());
        echo json_encode($result);
        exit;
    }
    $db->close();

    echo json_encode($result);
}
?>