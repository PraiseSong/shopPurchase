<?php
include_once('config/config.php');
include_once($libs_dir.'/db.php');
require_once("models/config.php");
if (!securePage($_SERVER['PHP_SELF'])){die();}

$user_id = null;
if(isset($loggedInUser) && $loggedInUser->user_id){
    $user_id = $loggedInUser->user_id;
}
if(!$user_id){
    header("Location: login.html");
    exit;
}
@$date = $_GET['date'];

$db = new DB($db_name,$db_host,$db_username,$db_password);
$db->query("SET NAMES 'UTF8'");

$page_num = @$_GET['pageNum'];
if(!$page_num){
    $page_num = 1;
}
$limit_start = 0;
$limit = @$_GET['limit'];
$type = @$_GET['type'];
$start = @$_GET['start'];
$end = @$_GET['end'];
$countIs0 = @$_GET['countIs0'];
$count_condition = 'p_count>0';
$name = @$_GET['name'];
if($countIs0){
    $count_condition = 'p_count<=0';
}
if(!$limit){
    $limit = 10;
}
$limit_end = (int)$limit;
$limit_start = (int)$limit*((int)$page_num-1);

$sql = "select * from `products` where ($count_condition and user_id=$user_id) limit $limit_start,$limit_end";
if($name){
    $sql = "select * from `products` where ($count_condition and user_id=$user_id and (p_name like '%$name%')) limit $limit_start,$limit_end";
}
if($type){
    $sql = "select p_id,p_name,p_count,p_price,p_pic,p_props from `products` where (p_type=$type and $count_condition and user_id=$user_id) ".
        "limit $limit_start,$limit_end";
    if($name){
        $sql = "select p_id,p_name,p_count,p_price,p_pic,p_props from `products` where (p_type=$type and $count_condition and user_id=$user_id and (p_name like '%$name%')) ".
            "limit $limit_start,$limit_end";
    }
}

$data = $db->queryManyObject($sql);
//$data = array('products' => $data);
$db->close();
?>
<!DOCTYPE html>
<!--<html manifest="cache.manifest">-->
<html xmlns="http://www.w3.org/1999/html">
<head>
    <meta charset="utf-8" />
    <meta content="initial-scale=1.0,user-scalable=no,maximum-scale=1,width=device-width" name="viewport" />
    <meta content="telephone=no" name="format-detection" />
    <meta content="yes" name="apple-mobile-web-app-capable" />
    <meta content="black" name="apple-mobile-web-app-status-bar-style" />
    <meta property="qc:admins" content="20612357606212603" />
    <link href="assets/imgs/logo.png" rel="apple-touch-icon-precomposed" />
    <title>
        小店记账宝
    </title>
    <link rel="stylesheet" href="assets/css/reset.css" />
    <link rel="stylesheet" href="assets/css/common.css" />
    <link rel="stylesheet" href="assets/css/productlist.css" />
    <script src="assets/libs/sea.js"></script>
    <script type="text/javascript">
        seajs.config({
            base: './assets/js/',
            map: [
                [".js", ".js?t=" + new Date().getTime()]
            ]
        });
    </script>
</head>
<body>
<header class="header">
    <a class="back box touchStatusBtn" href="javascript:void(0)"><img src="assets/imgs/back-icon.png" alt="返回" />返回</a>
    <span class="box">仓库</span>
</header>
<div class="container">
    <div class="plist" id="J-productList">
        <ul>
            <?php if(isset($data) && count($data) >= 1): ?>
                <?php
                $html = '';

                foreach($data as $k => $product){
                    $html .= "<li><div class=\"flexBox touchStatusBtn\" data-id=\"{$product->p_id}\">".
                        '<div class="imgSkin box">'.
                        "<img src=\"{$product->p_pic}\" alt=\"{$product->p_name}\"/>".
                        '</div>'.
                        '<div class="information box">'.
                        "<p class=\"name\">{$product->p_name}</p>";

                    if(strpos($product->p_props, '|')){
                        $p_props = preg_split('/\|/', $product->p_props);
                    }else{
                        $p_props = array($product->p_props);
                    }
                    $p_props_html = '';

                    foreach($p_props as $j => $prop){
                        if($prop){
                            $p_props_html .= "<p class=\"prop\">". $prop . "</p>";
                        }
                    }

                    $html .= $p_props_html;
                    $html .= "<p class=\"date\">时间：{$product->p_date}</p></div></div>";
                    $html .= "<footer class=\"flexBox\"><a href=\"edit_product.php?id={$product->p_id}\" class=\"J-edit box\"</a>修改</a></footer>";
                    $html .= '</li>';
                }

                echo $html;
                ?>
            <?php else: ?>
                <p style="text-align: center">
                    在仓库里没有查询到您要的商品
                </p>
            <?php endif; ?>
        </ul>
    </div>
</div>
</body>
<script>
    //seajs.use("warehouse.js");
    seajs.use("footer.js");
</script>
</html>