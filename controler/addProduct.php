<?php
include_once('../config/config.php');
include_once('../'.$libs_dir.'/db.php');
include_once('../'.$libs_dir.'/imageResize.php');

$db = new DB($db_name,$db_host,$db_username,$db_password);
$db->query("SET NAMES 'UTF8'");

$attachments_dir = "attachments";
$error_msg = null;

$name = @$_POST['name'];
$price = @$_POST['price'];
$count = @$_POST['count'];
$man = @$_POST['man'];
$from = @$_POST['from'];
$props = @$_POST['properties'];
$types = @$_POST['types'];
$pic = @$_FILES['pic'];
$pic_link = false;
$date = date("Y-m-d H:i:s");
$saved_img_to_base64_error_msg = null;
$writed_product = false;

$query_isExist_sql = "select p_name from products where p_name='$name'";
$query_isExist = $db->queryUniqueObject($query_isExist_sql);
if($query_isExist){
    $error_msg = '商品名称重复';
}else if($pic){
  $attachment_name = md5($date) . '_' . str_replace(' ', '', $pic["name"]);

  if ($pic["error"] > 0){
    $error_msg = '商品图片上传出现错误';
  }else{
    if (file_exists("../$attachments_dir/" . $attachment_name)){
        $error_msg = '商品图片已存在';
    }else{
        if(move_uploaded_file($pic["tmp_name"], "../$attachments_dir/" . $attachment_name)){
            $pic_link = "$attachments_dir/" . $attachment_name;
            $pic_thumb_link = "$attachments_dir/thumb_" . $attachment_name;
            $saved_thumb = img2thumb('../'.$pic_link, '../'.$pic_thumb_link, 100, 100, 0, 0);
        }else{
            $error_msg = '商品图片保存失败';
        }
    }
  }
}else{
    $error_msg = '请上传商品图片';
}
if($pic_link){
    $sql = "insert into products(`p_name`, `p_count`, `p_from`, `p_man`, `p_price`, `p_pic`, `p_props`, `p_date`, ".
           "`p_type`) values ('$name', '$count', '$from', '   $man', '$price', '$pic_thumb_link', '$props', '$date', ".
           "'$types')";
    $writed_product = $db->query($sql);

    $file = '../'.$pic_thumb_link;
    $type=getimagesize($file);//取得图片的大小，类型等
    @$fp=fopen($file,"r");
    if($fp){
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
    }else{
        $saved_img_to_base64_error_msg = '商品图片缓存失败';
    }
}

$db->close();
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
            echo $name.' 录入成功';
        }else{
            echo $error_msg;
        }
        ?>
        ----<?php echo constant("PRODUCT_NAME"); ?>
    </title>
    <link rel="stylesheet" href="../static/css/pure-min.css" />
    <link rel="stylesheet" href="../static/css/reset.css" />
    <link rel="stylesheet" href="../static/css/app.css" />
</head>
<body>
<div class="tip-box">
    <?php
    if($writed_product){
        echo '<p class="tip tip-success">'.$name.'录入成功</p>';
        if($saved_img_to_base64_error_msg){
            echo "<p class=\"tip tip-error\">$saved_img_to_base64_error_msg</p>";
        }
    }else{
        echo "<p class=\"tip tip-error\">$error_msg</p>";
    }
    ?>
</div>
<aslide class="optional">
    <header>您还可以</header>
    <a href="javascript:history.back();">返回</a>
    <a href="../add.php">继续录入商品</a>
</aslide>
<?php
  include_once('../'.$templates_dir.'/footer.php');
?>
