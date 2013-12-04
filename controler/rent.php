<?php
/**
 * User: praise
 * Date: 10/27/13
 * Time: 1:05 PM
 * To change this template use File | Settings | File Templates.
 */
include_once('../config/config.php');
include_once('../'.$libs_dir.'/db.php');
include_once('../'.$utils_dir.'/utils.php');
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

$action = $_POST['action'];
$start = @$_POST['start'];
$end = @$_POST['end'];
$data = null;
$result = array();

if(!$action){
    $result = array("bizCode" => 0, "memo" => "缺少action参数", "data"=>array());
    echo json_encode($result);
    exit;
}else{
    switch($action){
      case "query":
        if($start && $end){
            $dates = getDateRange($start, $end);
            if(is_string($dates)){
                $result = array("bizCode" => 0, "memo" => "$dates", "data"=>array());
                echo json_encode($result);
                exit;
            }
            $where = "((user_id=$user_id) and (date like '{$dates[0]}%'";
            for($i=1; $i < count($dates); $i++){
                $where .= " or date like '{$dates[$i]}%'";
            }
            $where .= '))';
            $sql = "select * from rent where $where";
        }

        $data = $db->queryManyObject($sql);
        if(!$data){
            $result = array("bizCode" => 0, "memo" => "没有相关租金记录", "data"=>array());
            echo json_encode($result);
            exit;
        }else{
            $result = array("bizCode" => 1, "memo" => "", "data"=>array("rents" => $data));
            echo json_encode($result);
            exit;
        }
        break;
      case "add":
        $price = @$_POST['price'];
        if(!$price){
            $result['bizCode'] = 0;
            $result['data'] = null;
            $result['memo'] = '没有传入价格参数';
        }else{
            $date = date("Y-m-d H:i:s");
            $q_sql = "insert into rent(`user_id`, `price`, `date`) values ($user_id, '$price', '$date')";
            $db->query($q_sql);
            $lastId = $db->lastInsertedId();
            if($lastId){
                $lastInsertData = $db->queryUniqueObject("select * from rent where(id='$lastId' and user_id=$user_id)");
                $result['bizCode'] = 1;
                $result['data'] = $lastInsertData;
            }else{
                $result['bizCode'] = 0;
                $result['data'] = null;
            }
        }
        break;
    }
$db->close();
}

echo json_encode($result);
?>