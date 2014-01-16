<?php
include_once('config/config.php');
include_once($libs_dir.'/db.php');
require_once("models/config.php");

$user_id = null;
if(isset($loggedInUser) && $loggedInUser->user_id){
    $user_id = $loggedInUser->user_id;
}
if(!$user_id){
    $result = array("bizCode" => 0, "memo" => "用户未登录", "data"=>array("redirect"=>"login.php"));
    echo json_encode($result);
    exit;
}
if($client_action === "query"){
    $date = $_POST['date'];
    if(!$date){
        $result = array("bizCode" => 0, "memo" => "没有传入日期参数", "data"=>array());
        echo json_encode($result);
        exit;
    }

    $db = new DB($db_name,$db_host,$db_username,$db_password);
    $db->query("SET NAMES 'UTF8'");

    $where = "((user_id=$user_id) and (date like '{$date}%'";
    $where .= '))';

    $query_sold_sql = "select p_id,detail,count,date,order_id,prop from `cashier` where $where ORDER BY date DESC";
    $sold_data = $db->queryManyObject($query_sold_sql);

    $ids = array();
    foreach($sold_data as $k => $v){
        array_push($ids, $v->p_id);
    }
    $ids = array_unique($ids);

    $where = "((user_id=$user_id) and (";
    foreach($ids as $k => $v){
        if($k !== 0){
            $where .= ' or ';
        }
        $where .= "p_id='$v'";
    }
    $where .= '))';

    if(count($ids) === 0){
        $where = "(user_id=$user_id)";
    }

    $query_price_sql = "select p_price,p_id,p_type,p_pic,p_name from `products` where $where ORDER BY p_date DESC";
    $query_price_data = $db->queryManyObject($query_price_sql);
    $operation = array();
    $types = array();
    foreach($sold_data as $kk => $vv){
        foreach($query_price_data as $k => $v){
            if($vv-> p_id == $v -> p_id){
                $t = $v -> p_type;
                $query_type_name_sql = "select name from types where (id=$t)";
                $type = $db->queryObject($query_type_name_sql);

                array_push(
                    $operation,
                    array('p_id' => $v-> p_id, 'detail' => $vv -> detail, 'p_price' => $v->p_price,'date'=>$vv->date, 'type'=>$type->name, 'order_id'=>$vv->order_id, 'prop'=>$vv->prop, 'p_pic'=>$v->p_pic,'p_name'=>$v->p_name)
                );
            }
        }
    }
//    foreach($query_price_data as $k => $v){
//        $t = $v -> p_type;
//        $query_type_name_sql = "select name from types where (id=$t)";
//        $type = $db->queryObject($query_type_name_sql);
//        foreach($sold_data as $kk => $vv){
//            if($v-> p_id == $vv -> p_id){
//                array_push(
//                    $operation,
//                    array('p_id' => $v-> p_id, 'detail' => $vv -> detail, 'p_price' => $v->p_price,'date'=>$vv->date, 'type'=>$type->name, 'order_id'=>$vv->order_id, 'prop'=>$vv->prop, 'p_pic'=>$v->p_pic,'p_name'=>$v->p_name)
//                );
//            }
//        }
//    }
    $db->close();

    $result = array("bizCode" => 1, "memo" => "", "data"=>array("products" => $operation));
    echo json_encode($result);
    exit;
}
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
    <span class="box">商品列表</span>
</header>
<div class="container">
    <div class="plist" id="J-productList">
        <ul>
            <?php if(isset($operation) && count($operation) >= 1): ?>
                <?php
                $html = '';

                foreach($operation as $k => $product){
                    $html .= "<li><div class=\"flexBox touchStatusBtn\" data-id=\"{$product['order_id']}\">".
                        '<div class="imgSkin box">'.
                        "<img src=\"{$product['p_pic']}\" alt=\"{$product['p_name']}\"/>".
                        '</div>'.
                        '<div class="information box">'.
                        "<p class=\"name\">{$product['p_name']}</p>";

                    if(strpos($product['detail'], '|')){
                        $detail = preg_split('/\|/', $product['detail']);
                    }else{
                        $detail = array($product['detail']);
                    }
                    $detailHtml = '';
                    $propHtml = '';
                    $counter = 0;

                    if($product['prop']){
                        if(strpos($product['prop'], '|')){
                            $props = preg_split('/\|/', $product['prop']);
                        }else{
                            $props = array($product['prop']);
                        }
                        foreach($props as $k => $prop){
                            $prop = preg_split("/\:/", $prop);
                            $propHtml .= "<p class=\"prop\">{$prop[0]}: {$prop[1]}</p>";
                        }
                    }

                    foreach($detail as $j => $det){
                        if($det){
                            $det = preg_split('/\*/', $det);
                            if($det[1]){
                                $counter .= $det[1]*1;
                            }

                            $num = $j+1;
                            $sold_price = $det[0]*1;
                            $sold_price_to_2float = number_format($sold_price, 2, '.', ',');
                            $sold_count = $det[1]*1;
                            $detailHtml .= "<p class=\"detail\" data-detailNum=\"{$num}\" data-detail=\"{$sold_price}*{$sold_count}\">".
                                "{$sold_price_to_2float}元 x {$sold_count}个</p>";
                        }
                    }

                    $html .= $propHtml.$detailHtml;
                    $html .= "<p class=\"date\">时间：{$product['date']}</p></div></div>";
                    $html .= "<footer class=\"flexBox\"><a href=\"javascript:void(0)\" class=\"J-refund box\" data-id=\"{$product['order_id']}\">退货</a></footer>";
                    $html .= '</li>';
                }

                echo $html;
                ?>
            <?php else: ?>
                <p style="text-align: center">
                    <?php
                    if(!isset($_GET['date'])){
                        echo "没有传入查询日期";
                    }else if($_GET['date']){
                        echo $_GET['date'].' 没有销售商品记录';
                    }
                    ?>
                </p>
            <?php endif; ?>
        </ul>
    </div>
</div>
</body>
<script>
    seajs.use("productlist.js");
    seajs.use("footer.js");
</script>
</html>