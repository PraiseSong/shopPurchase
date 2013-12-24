<?php
/**
 * Created by PhpStorm.
 * User: apple
 * Date: 12/24/13
 * Time: 10:53 PM
 */
include_once('../config/config.php');
include_once("../".$libs_dir.'/db.php');
require_once("../models/config.php");

include_once("../$libs_dir/imageResize.php");

$user_id = null;
if(isset($loggedInUser) && $loggedInUser->user_id){
    $user_id = $loggedInUser->user_id;
}

$action = @$_GET['action'];
if(!$user_id){
    if($action === 'phonegap'){
        exit;
    }
    $result = array("bizCode" => 0, "memo" => "用户未登录", "data"=>array("redirect"=>"login.php"));
    echo json_encode($result);
    exit;
}

$db = new DB($db_name,$db_host,$db_username,$db_password);
$db->query("SET NAMES 'UTF8'");

$pic = $_FILES["file"];

if(!$pic){
    if($action === 'phonegap'){
        exit;
    }
    $result = array("bizCode" => 0, "memo" => "没有接收到文件", "data"=>array());
    echo json_encode($result);
    exit;
}

$attachments_dir = "../attachments";
$date = date("Y-m-d H:i:s");
$attachment_name = md5($date) . '_' . str_replace(' ', '', $pic["name"]);

if ($pic["error"] > 0){
    if($action === 'phonegap'){
        exit;
    }
    $result = array("bizCode" => 0, "memo" => "商品图片上传出现错误", "data"=>array());
    echo json_encode($result);
    exit;
}

$user_attachments_dir = $attachments_dir."/$loggedInUser->username";
if(!is_dir($user_attachments_dir)){
    mkdir($user_attachments_dir);
}

if(is_dir($user_attachments_dir)){
    if (file_exists("$user_attachments_dir/" . $attachment_name)){
        if($action === 'phonegap'){
            exit;
        }
        $result = array("bizCode" => 0, "memo" => "商品图片已存在", "data"=>array());
        echo json_encode($result);
        exit;
    }else{
        if(move_uploaded_file($pic["tmp_name"], "$user_attachments_dir/" . $attachment_name)){
            $pic_link = "$user_attachments_dir/" . $attachment_name;
            $pic_thumb_link = "$user_attachments_dir/thumb_" . $attachment_name;
            img2thumb($pic_link, $pic_thumb_link, 100, 100, 0, 0);
            if($action === 'phonegap'){
                exit($pic_thumb_link);
            }
            $result = array("bizCode" =>1, "memo" => "", "data"=>array("pic" => $pic_thumb_link));
            echo json_encode($result);
            exit;
        }else{
            if($action === 'phonegap'){
                exit;
            }
            $result = array("bizCode" => 0, "memo" => "商品图片保存失败", "data"=>array());
            echo json_encode($result);
            exit;
        }
    }
}else{
    if($action === 'phonegap'){
        exit;
    }
    $result = array("bizCode" => 0, "memo" => "没有 $loggedInUser->username 的文件目录", "data"=>array());
    echo json_encode($result);
    exit;
}
?>