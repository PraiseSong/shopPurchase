<?php
/**
 * User: praise
 * Date: 10/27/13
 * Time: 1:05 PM
 * To change this template use File | Settings | File Templates.
 */
if(!$_POST){
    exit('非法访问');
}
include_once('../config/config.php');
include_once('../'.$libs_dir.'/db.php');

$db = new DB($db_name,$db_host,$db_username,$db_password);
$db->query("SET NAMES 'UTF8'");

$date = date("Y-m-d");
$action = $_POST['action'];
$price = @$_POST['price'];
$data = null;
$result = array();

if(!$action || !$price){
    $result['code'] = 0;
    $result['data'] = "缺少参数";
}else{
    switch($action){
      case "query":
        $sql = "select * from rent where date like '%$date%'";
        $data = $db->queryUniqueObject($sql);
        if(!$data){
            $result['code'] = 0;
            $result['data'] = null;
        }else{
            $result['code'] = 1;
            $result['data'] = $data;
        }
        break;
      case "add":
        if(!$price){
            $result['code'] = 0;
            $result['data'] = null;
            $result['memo'] = '没有传入价格参数';
        }else{
            $date = date("Y-m-d H:i:s");
            $q_sql = "insert into rent(`price`, `date`) values ('$price', '$date')";
            $db->query($q_sql);
            $lastId = $db->lastInsertedId();
            if($lastId){
                $lastInsertData = $db->queryUniqueObject("select * from rent where(id='$lastId')");
                $result['code'] = 1;
                $result['data'] = $lastInsertData;
            }else{
                $result['code'] = 0;
                $result['data'] = null;
            }
        }
        break;
    }
$db->close();
}

echo json_encode($result);
?>