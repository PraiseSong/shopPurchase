<?php
/**
 * Created by JetBrains PhpStorm.
 * User: praise
 * Date: 10/27/13
 * Time: 1:05 PM
 * To change this template use File | Settings | File Templates.
 */
include_once('../config/config.php');
include_once('../'.$libs_dir.'/db.php');

$db = new DB($db_name,$db_host,$db_username,$db_password);
$db->query("SET NAMES 'UTF8'");

$date = date("Y-m-d");
$action = $_POST['action'];
$price = @$_POST['price'];
$data = null;
$result = array();

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
        break;
}
$db->close();


echo json_encode($result);
?>