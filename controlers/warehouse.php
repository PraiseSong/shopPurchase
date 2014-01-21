<?php
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

if($client_action === "query"){
    $page_num = @$_POST['pageNum'];
    if(!$page_num){
        $page_num = 1;
    }
    $limit_start = 0;
    $limit = @$_POST['limit'];
    $type = @$_POST['type'];
    $count = @$_POST['count'];
    $name = @$_POST['name'];
    if($count){
        $count_condition = "(p_count <= $count)";
    }
    if(!$limit){
        $limit = 10;
    }
    if(!$type){
        $type = 0;
    }
    $limit_end = (int)$limit;
    $limit_start = (int)$limit*((int)$page_num-1);
    $where = "((p_status=1 or p_status is null) and user_id=$user_id)";
    if(isset($count_condition)){
        $where .= ' and '.$count_condition;
    }

    if($name){
        $where .= " and (p_name like '%$name%')";

    }
    if($type){
        $where .= " and (p_type=$type)";
    }
    $sql = "select * from `products` where ($where) ORDER BY p_date DESC limit $limit_start,$limit_end";
    $data = $db->queryManyObject($sql);
    $db->close();

    if(isset($_POST['ajax'])){
        $data = array('products' => $data);
        echo json_encode(array("bizCode"=>1, "memo"=>"", "data"=>$data));
        exit;
    }else{
        echo json_encode(array("bizCode"=>0, "memo"=>"非ajax请求", "data"=>array()));
        exit;
    }
}
?>