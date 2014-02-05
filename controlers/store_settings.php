<?php
/**
 * Created by JetBrains PhpStorm.
 * User: praise
 * Date: 9/20/13
 * Time: 6:44 PM
 * To change this template use File | Settings | File Templates.
 */
require_once("models/config.php");

switch($client_action){
    case "query":
        exit(json_encode(array("bizCode" => 1, "memo" => "", "data" => fetchUserStoreSettings($client_username))));
        break;
    case "update":
        $role = @$_POST['role'];
        $status = @$_POST['status'];
        $store_settings = array();
        if(!$role || !$status){
            exit(json_encode(array("bizCode" => 0, "memo" => "缺少role或status参数", "data" => array())));
        }
        $exist_store_settings = fetchUserStoreSettings($client_username);
        if(!$exist_store_settings){
            $store_settings = array($role => $status);
        }else{
            $store_settings = json_decode($exist_store_settings);
        }
        if($store_settings -> $role === $status){
            exit(json_encode(array("bizCode" => 1, "memo" => "未执行任何操作", "data" => array("status" => $store_settings -> $role))));
        }else{
            $store_settings -> $role = $status;
        }
        $store_settings = json_encode($store_settings);
        $stmt = $mysqli->prepare("UPDATE ".$db_table_prefix."users
		SET store_settings = ?
		WHERE
		id = ?
		LIMIT 1
		");
        $stmt->bind_param("si", $store_settings, $loggedInUser->user_id);
        $result = $stmt->execute();
        $stmt->close();
        if($result){
            exit(json_encode(array("bizCode" => 1, "memo" => "", "data" => array("status" => $status))));
        }else{
            exit(json_encode(array("bizCode" => 0, "memo" => "操作失败", "data" => array())));
        }
        break;
    default:
        exit(json_encode(array("bizCode" => 0, "memo" => "没有action参数", "data" => array())));
        break;
}
?>