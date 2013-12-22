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
require_once("models/config.php");

$user_id = null;
if(isset($loggedInUser) && $loggedInUser->user_id){
    $user_id = $loggedInUser->user_id;
}

if(!$user_id){
    $result = array("bizCode" => 0, "memo" => "用户未登录", "data"=>array("redirect"=>"login.html"));
    exit(json_encode($result));
}

$db = new DB($db_name,$db_host,$db_username,$db_password);
$db->query("SET NAMES 'UTF8'");

if($client_action === "query"){
    $page_num = @$_POST['pageNum'];
    if(!$page_num){
        $page_num = 1;
    }
    $limit_start = 0;
    $limit = @$_POST['limit'];
    $type = @$_POST['type'];
    $start = @$_POST['start'];
    $end = @$_POST['end'];
    $countIs0 = @$_POST['countIs0'];
    $count_condition = 'p_count>0';
    $name = @$_POST['name'];
    if($countIs0){
        $count_condition = 'p_count<=0';
    }
    if(!$limit){
        $limit = 10;
    }
    $limit_end = (int)$limit;
    $limit_start = (int)$limit*((int)$page_num-1);

    $sql = "select p_id,p_name,p_count,p_price,p_pic,p_props from `products` where ($count_condition and user_id=$user_id) ORDER BY p_date DESC limit $limit_start,$limit_end";
    if($name){
        $sql = "select p_id,p_name,p_count,p_price,p_pic,p_props from `products` where ($count_condition and user_id=$user_id and (p_name like '%$name%')) ORDER BY p_date DESC limit $limit_start,$limit_end";
    }
    if($type){
        $sql = "select p_id,p_name,p_count,p_price,p_pic,p_props from `products` where (p_type=$type and $count_condition and user_id=$user_id) ORDER BY p_date DESC ".
            "limit $limit_start,$limit_end";
        if($name){
            $sql = "select p_id,p_name,p_count,p_price,p_pic,p_props from `products` where (p_type=$type and $count_condition and user_id=$user_id and (p_name like '%$name%')) ORDER BY p_date DESC ".
                "limit $limit_start,$limit_end";
        }
    }

    $data = $db->queryManyObject($sql);
    $data = array('products' => $data);
    $db->close();

    $result = array("bizCode" => 1, "", "data" => $data);
    echo json_encode($result);
}
?>