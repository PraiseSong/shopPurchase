<?php
include_once('config.php');
include_once('db.php');
include_once('imageResize.php');

$db_host = 'localhost';
$db_name = 'rib';
$db_username = 'root';
$db_password = 'ZHUqi@159';

$db = new DB($db_name,$db_host,$db_username,$db_password);
$db->query("SET NAMES 'UTF8'");

$attachments_dir = "attachments";
$error_msg = '访问异常';

$name = @$_POST['name'];
$price = @$_POST['price'];
$count = @$_POST['count'];
$man = @$_POST['man'];
$from = @$_POST['from'];
$props = @$_POST['properties'];
$pic = $_FILES['pic'];
$pic_link = false;
$date = date("Y-m-d h:i:s A");
$attachment_name = md5($date) . '_' . str_replace(' ', '', $pic["name"]);

$writed_product = 0;

if ($pic["error"] > 0){
    $error_msg = '图片上传错误';
}else{
    if (file_exists("../$attachments_dir/" . $attachment_name)){
        $error_msg = '图片已存在';
    }else{
        if(move_uploaded_file($pic["tmp_name"], "../$attachments_dir/" . $attachment_name)){
            $pic_link = "$attachments_dir/" . $attachment_name;
            $pic_thumb_link = "$attachments_dir/thumb_" . $attachment_name;
            $saved_thumb = img2thumb('../'.$pic_link, '../'.$pic_thumb_link, 100, 100, 0, 0);
        }
    }
}
if($pic_link){
    $sql = "insert into products(`p_name`, `p_count`, `p_from`, `p_man`, `p_price`, `p_pic`, `p_props`, `p_date`) ".
        "values ('$name', '$count', '$from', '   $man', '$price', '$pic_thumb_link', '$props', '$date')";
    $writed_product = $db->query($sql);
    $db->close();

    $file = '../'.$pic_thumb_link;
    $type=getimagesize($file);//取得图片的大小，类型等
    @$fp=fopen($file,"r");
    $file_content=chunk_split(base64_encode(fread($fp,filesize($file))));//base64编码
    switch($type[2]){//判读图片类型
        case 1:$img_type="gif";break;
        case 2:$img_type="jpg";break;
        case 3:$img_type="png";break;
    }
    $img='data:image/'.$img_type.';base64,'.$file_content;//合成图片的base64编码
    $handle = fopen($file . '.txt', 'w');
    fwrite($handle, $img);
    fclose($handle);
    fclose($fp);
}
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta content="initial-scale=1.0,user-scalable=no,maximum-scale=1,width=device-width" name="viewport" />
    <meta content="black" name="apple-mobile-web-app-status-bar-style" />
    <meta content="telephone=no" name="format-detection" />
    <title>
        <?php
        if($writed_product){
            echo '添加成功';
        }else{
            echo $error_msg;
        }
        ?>
        ----商品进存系统
    </title>
    <link rel="stylesheet" href="../static/css/pure-min.css" />
    <link rel="stylesheet" href="../static/css/reset.css" />
    <link rel="stylesheet" href="../static/css/app.css" />
    <script src="../static/js/zepto.min.js"></script>
</head>
<body>
<div class="tip-box">
    <?php
    if($writed_product){
        echo '<p class="tip tip-success">商品添加成功</p>';
    }else{
        echo "<p class=\"tip tip-error\">$error_msg</p>";
    }
    ?>
</div>
<aslide class="optional">
    <header>您还可以</header>
    <a href="../add.php">继续添加</a>
    <a href="../index.php">回主页</a>
</aslide>
</body>
</html>
