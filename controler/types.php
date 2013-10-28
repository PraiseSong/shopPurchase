<?php
/**
 * Created by JetBrains PhpStorm.
 * User: praise
 * Date: 10/7/13
 * Time: 11:59 AM
 * To change this template use File | Settings | File Templates.
 */
if(!$_POST){
    exit('非法访问');
}
include_once('../config/config.php');
include_once('../'.$libs_dir.'/db.php');

$db = new DB($db_name,$db_host,$db_username,$db_password);
$db->query("SET NAMES 'UTF8'");

$action = @$_POST['action'];

if(!$action){
    exit(json_encode(array("code" => 0, "memo" => "缺少参数")));
}

switch($action){
    case "query":
        $sql = "select id,name from types";
        $data = $db->queryManyObject($sql);
        break;
    case "add":
        $name = @$_POST['name'];
        if(!$name){
            exit(json_encode(array("code" => 0, "memo" => "缺少分类名称")));
        }
        $sql = "insert into types(`name`) values('$name')";
        $data = $db->query($sql);
        break;
}

echo json_encode(array("code" => 1, "data" => $data));
?>