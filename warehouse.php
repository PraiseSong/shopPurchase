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

$db = new DB($db_name,$db_host,$db_username,$db_password);
$db->query("SET NAMES 'UTF8'");

$page_num = @$_GET['pageNum'];
if(!$page_num){
    $page_num = 1;
}
$limit_start = 0;
$limit = @$_GET['limit'];
$type = @$_GET['type'];
$count = @$_GET['count'];
$name = @$_GET['name'];
if($count){
    $count_condition = "(p_count <= $count)";
}
if(!$limit){
    $limit = 10;
}
if(!$type){
    $type = 0;
}
$limit_end = (int)$limit;
$limit_start = (int)$limit*((int)$page_num-1);
$where = "(user_id=$user_id)";
if(isset($count_condition)){
    $where .= ' and '.$count_condition;
}

if($name){
    $where .= " and (p_name like '%$name%')";

}
if($type){
    $where .= " and (p_type=$type)";
}
$sql = "select * from `products` where ($where) ORDER BY p_date DESC limit $limit_start,$limit_end";
$data = $db->queryManyObject($sql);
$db->close();

if(isset($_GET['ajax'])){
    $data = array('products' => $data);
    echo json_encode(array("bizCode"=>1, "memo"=>"", "data"=>$data));
    exit;
}
require_once("models/header.php");
?>
<body>
<input type="hidden" id="J-pageNum" value="<?php echo $page_num; ?>">
<input type="hidden" id="J-typeId" value="<?php echo $type; ?>">
<link rel="stylesheet" href="assets/css/warehouse.css" />
<header class="header">
    <a class="back box touchStatusBtn" href="javascript:void(0)"><img src="assets/imgs/back-icon.png" alt="返回" />返回</a>
    <span class="box">仓库</span>
</header>
<div class="queryProductsBox">
    <form action="">
        <select id="J-parentTypes">
            <option value="">商品分类</option>
        </select>
        <!--<select name="" id="">-->
        <!--<option value="0">子分类</option>-->
        <!--</select>-->
        <div class="flexBox">
            <input type="search" placeholder="输入商品名称" autocapitalize="off" class="box" id="J-searchText" />
            <span class="touchStatusBtn" id="J-queryBtn">查询</span>
        </div>
    </form>
    <div class="result">
        <p class="tip" id="J-tip">
            没有您要的商品，现在就<a href="add.php" target="_blank" title="添加商品">添加</a>
        </p>
        <div class="plist" id="J-productList">
            <?php if(isset($data) && count($data) >= 1): ?>
                <ul>
                    <?php
                    $html = '';

                    foreach($data as $k => $product){
                        $price = toFixed2($product->p_price);
                        $html .= "<li data-id=\"{$product->p_id}\"><div class=\"flexBox touchStatusBtn\" data-id=\"{$product->p_id}\">".
                            '<div class="imgSkin box">'.
                            "<img src=\"{$product->p_pic}\" alt=\"{$product->p_name}\"/>".
                            '</div>'.
                            '<div class="information box">'.
                            "<p class=\"name\">{$product->p_name}</p>".
                            "<p class=\"count\">库存：{$product->p_count}</p>".
                            "<p class=\"price\">单价：{$price} 元</p>".
                            ($product->p_from ? "<p class=\"from\">采购地：{$product->p_from}</p>" : "").
                            ($product->p_man ? "<p class=\"man\">采购人：{$product->p_man}</p>" : "");

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
                        $html .= "<p class=\"date\">入库时间：{$product->p_date}</p></div></div>";
                        $html .= "<footer class=\"flexBox\"><a href=\"edit_product.php?id={$product->p_id}&pageNum=$page_num&type=$type\" class=\"J-edit box\" target='_blank' data-id=\"{$product->p_id}\">修改</a></footer>";
                        $html .= '</li>';
                    }

                    echo $html;
                    ?>
                </ul>
                <a class="touchStatusBtn btn btn-default" href="javascript:void(0)" id="J-requestMoreBtn">更多商品</a>
            <?php else: ?>
                <p style="text-align: center">
                    在仓库里没有查询到您要的商品
                </p>
            <?php endif; ?>
        </div>
    </div>
</div>
</body>
<script>
    seajs.use("warehouse.js");
    seajs.use("footer.js");
</script>
</html>