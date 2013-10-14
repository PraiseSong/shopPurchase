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

$page = @$_POST['page'];
$limit_start = 0;
$limit = @$_POST['limit'];
$type = @$_POST['type'];
if(!$page){
    $page = 1;
}
if(!$limit){
    $limit = 10;
}
$limit_end = (int)$limit;
$limit_start = (int)$limit*((int)$page-1);
$custom = @$_POST['action'];
$sql = "select p_id,p_name,p_count,p_price,p_pic from `products` where p_count>0 limit $limit_start,$limit_end";
if($type){
    $sql = "select p_id,p_name,p_count,p_price,p_pic from `products` where (p_type=$type and p_count>0) limit $limit_start,$limit_end";
}
if($custom){
    $start = @$_POST['start'];
    $end = @$_POST['end'];
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

    $sql = "select p_id,detail,order_id from `cashier` where $where";
    $data = $db->queryManyObject($sql);
    $ids = array();
    $products = array('products'=>array());
    foreach($data as $k => $v){
        array_push($ids, $v->p_id);
        if(!isset($products['products'][$v->p_id])){
            $products['products'][$v->p_id] = array();
        }
        array_push($products['products'][$v->p_id], $v);
    }

    $ids = array_unique($ids);
    foreach($ids as $k => $id){
        $sql = "select p_name,p_price,p_pic,p_id from `products` where `p_id` = '$id'";
        $data = $db->queryManyObject($sql);
        if(!isset($products[$id])){
            $products[$id] = array();
        }
        $products[$id] = $data;
    }
    $db->close();
    $data = $products;
}else{
    $data = $db->queryManyObject($sql);
    $db->close();
}

$result = array("code" => 1, "products" => $data);
echo json_encode($result);
?>