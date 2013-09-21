<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta content="initial-scale=1.0,user-scalable=no,maximum-scale=1,width=device-width" name="viewport" />
    <meta content="black" name="apple-mobile-web-app-status-bar-style" />
    <meta content="telephone=no" name="format-detection" />
    <title>添加商品----商品进存系统</title>
    <link rel="stylesheet" href="static/css/pure-min.css" />
    <link rel="stylesheet" href="static/css/app.css" />
    <script src="static/js/zepto.min.js"></script>
</head>
<body>

<?php
include_once('db.php');
include_once('config.php');

$db_host = 'localhost';
$db_name = 'rib';
$db_username = 'root';
$db_password = '';

$db = new DB($db_name,$db_host,$db_username,$db_password);
$db->query("SET NAMES 'UTF8'");

$attachments_dir = "attachments";

$name = @$_POST['name'];
$price = @$_POST['price'];
$count = @$_POST['count'];
$man = @$_POST['man'];
$from = @$_POST['from'];
$props = @$_POST['properties'];
$pic = @$_FILES['pic'];
$pic_link = false;
$date = date("Y-m-d h:i:s A");
$attachment_name = md5($date) . '_' . str_replace(' ', '', $pic["name"]);

$error_msg = false;
$writed_product = 0;

if ($pic["error"] > 0){
    $error_msg = '图片上传错误';
}else{
    if (file_exists("../$attachments_dir/" . $attachment_name)){
        $error_msg = '图片已存在';
    }else{
        if(move_uploaded_file($pic["tmp_name"], "../$attachments_dir/" . $attachment_name)){
            $pic_link = "$attachments_dir/" . $attachment_name;
        }
    }
}
if($pic_link){
    $sql = "insert into products(`p_name`, `p_count`, `p_from`, `p_man`, `p_price`, `p_pic`, `p_props`, `p_date`) ".
        "values ('$name', '$count', '$from', '   $man', '$price', '$pic_link', '$props', '$date')";
    $writed_product = $db->query($sql);
    $db->close();
}

if($writed_product){
  echo '添加成功';
}else{
    echo $error_msg;
}
?>

</body>
</html>
