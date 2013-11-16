<?php
if(!$_POST){
    exit('非法访问');
}

include_once('../config/config.php');
include_once('../'.$libs_dir.'/db.php');
include_once('../'.$libs_dir.'/imageResize.php');

$db = new DB($db_name,$db_host,$db_username,$db_password);
$db->query("SET NAMES 'UTF8'");

$id = @$_POST['id'];
$name = @$_POST['name'];
$price = @$_POST['price'];
$count = @$_POST['count'];
$man = @$_POST['man'];
$from = @$_POST['from'];
$types = @$_POST['types'];

$date = date("Y-m-d H:i:s");

$error_msg = '';
$writed_product = false;

if(!$count){
    $count = 0;
}

if(!$id || !$name || !$price || !$count || !$from || !$man || !$types){
    $error_msg = '没有传入正确的参数';
}else{
    $sql = "update `products` set `p_name`='$name',`p_price`='$price',`p_count`='$count',`p_from`='$from',".
           "`p_type`='$types',`p_man`='$man',`p_date`='$date' where `p_id`='$id'";
    $result = $db->query($sql);
    $db->close();
    if($result){
        $writed_product = true;
    }else{
        $error_msg = "编辑 $name 失败";
    }
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
            echo "$name 更新成功";
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
        echo "<p class=\"tip tip-success\">$name 更新成功</p>";
    }else{
        echo "<p class=\"tip tip-error\">$error_msg</p>";
    }
    ?>
</div>
<aslide class="optional">
    <header>您还可以</header>
    <a href="javascript:history.back();">返回</a>
</aslide>
<?php
include_once('../'.$templates_dir.'/footer.php');
?>
