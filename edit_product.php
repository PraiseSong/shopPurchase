<?php
include_once('config/config.php');
include_once("libraries/Mobile_Detect.php");
require_once("models/config.php");
if (!securePage($_SERVER['PHP_SELF'])){die();}

include_once('libraries/db.php');

$user_id = null;
if(isset($loggedInUser) && $loggedInUser->user_id){
    $user_id = $loggedInUser->user_id;
}
if(!$user_id){
    header("Location: login.html");
    exit;
}

$errors = array();
$successes = array();

$id = @$_GET['id'];
$edit = @$_GET['edit'];
$pageNum = @$_GET['pageNum'];
$type = @$_GET['type'];
if(!$id){
    $errors[] = "缺少商品id";
}
if(!$pageNum){
    $pageNum = 1;
}
if(!$type){
    $type = 0;
}
$detect = new Mobile_Detect;
$db = new DB($db_name,$db_host,$db_username,$db_password);
$db->query("SET NAMES 'UTF8'");
if(!$edit && $id){
    $data = null;
    $sql = "select * from products where (p_id=$id and user_id=$user_id)";
    $data = $db->queryUniqueObject($sql);
}else if($id){
    $name = $_GET['name'];
    $price = $_GET['price'];
    $count = $_GET['count'];
    $type = $_GET['type'];

    if(!$count){
        $count = 0;
    }
    if(!$name){
        $errors[] = "缺少商品属性";
    }
    if(!$price){
        $errors[] = "缺少商品单价";
    }
    if(!$type){
        $errors[] = "缺少商品分类";
    }

    $query_exist_sql = "select * from products where (p_id=$id and user_id=$user_id)";
    $exist_data = $db->queryUniqueObject($query_exist_sql);

    if(!$exist_data || !$exist_data->p_id){
        $errors[] = "当前商品已经不存在";
    }else{
        $new_count = ($exist_data -> p_count*1) + ($count*1);
        $update_sql = "update products set p_name='$name',p_count=$new_count,p_type=$type,p_price=$price where (p_id=$id and user_id=$user_id)";
        $result = $db->query($update_sql);
        if($result){
            $successes[] = "更新成功";
            if($name !== $exist_data->p_name){
                $successes[] = "{$exist_data->p_name} 变更为 $name";
            }
            if($price !== $exist_data->p_price){
                $successes[] = "单价：{$exist_data->p_price} 变更为 $price";
            }
            if($new_count*1 !== ($exist_data->p_count*1)){
                $successes[] = "库存：{$exist_data->p_count}个 变更为 $new_count 个";
            }
            if($type !== $exist_data->p_type){
                $successes[] = "商品分类也已更改";
            }
        }else{
            $errors[] = "更新失败";
        }

        $sql = "select * from products where (p_id=$id and user_id=$user_id)";
        $data = $db->queryUniqueObject($sql);
    }
}

$db->close();
?>

<?php
require_once("models/header.php");
?>

    <link rel="stylesheet" href="assets/css/editProduct.css" />
    <header class="header">
        <a class="back box touchStatusBtn" href="warehouse.php?pageNum=<?php echo $pageNum;?>&id=<?php echo $id;?>&type=<?php echo $type; ?>" data-norouting="true"><img src="assets/imgs/back-icon.png" alt="返回" />返回</a>
        <span class="box">
            <?php
            if(isset($data) && $data->p_id){
                echo "编辑 ".$data->p_name;
            }
            ?>
        </span>
    </header>
    <div class="container">
        <?php
        if(isset($errors) || isset($successes)){
            resultBlock($errors, $successes);
        }
        ?>
        <form class="form-default" method="get" action="edit_product.php" enctype="multipart/form-data" novalidate>
            <input type="hidden" name="edit" value="edit" />
            <div class="input-skin first-child">
                <?php if(isset($data) && $data->p_id): ?>
                    <input id="id" name="id" type="hidden" value="<?php echo $data->p_id; ?>">
                    <input autocapitalize="off" id="name" name="name" type="text" value="<?php echo $data->p_name; ?>" placeholder="商品名称">
                <?php endif; ?>
            </div>

            <div class="input-skin">
                <?php if(isset($data) && $data->p_id): ?>
                    <input autocapitalize="off" id="price" name="price" type="number" value="<?php echo $data->p_price; ?>" placeholder="商品单价">
                <?php endif; ?>
            </div>

            <div class="input-skin flexBox">
                <?php if(isset($data) && $data->p_id): ?>
                    <input autocapitalize="off" id="count" name="count" type="tel" class="box" placeholder="本次采购数量" />
                    <p class="box"><strong>当前库存为：<small class="kc"><?php echo $data->p_count; ?></small>个</strong></p>
                <?php endif; ?>
            </div>

            <div class="input-skin flexBox typesContainer">
                <p>分类：
                    <?php if(isset($data) && $data->p_id): ?>
                        <input type="hidden" id="J-types-hide" name="type" value="<?php echo $data->p_type; ?>" />
                    <?php endif; ?>
                </p>
                <div class="typesBox box">
                    <div id="J-typesSelector">加载分类...</div>
                </div>
            </div>

            <!--        <div class="input-skin flexBox">-->
            <!--            <p>采购人：</p>-->
            <!--            <div class="box">-->
            <!--                --><?php //if($data): ?>
            <?php
            //                    $man = trim($data->p_man);
            //                    if($man == '朱琦'){
            //                        echo '<label class="inline"><input type="radio" name="man" value="朱琦" checked>朱琦</label>';
            //                        echo '<label class="inline"><input type="radio"  name="man" value="黄伟丽">黄伟丽</label>';
            //                    }else if($man == '黄伟丽'){
            //                        echo '<label class="inline"><input type="radio" checked name="man" value="黄伟丽">黄伟丽</label>';
            //                        echo '<label class="inline"><input type="radio" name="man" value="朱琦">朱琦</label>';
            //                    }
            //                    ?>
            <?php /*else:*/ ?>
            <!--                    <label class="inline"><input type="radio" checked name="man" value="黄伟丽">黄伟丽</label>-->
            <!--                    <label class="inline"><input type="radio" name="man" value="朱琦">朱琦</label>-->
            <!--                --><?php //endif; ?>
            <!--            </div>-->
            <!--        </div>-->

            <!--        <div class="input-skin flexBox">-->
            <!--            <p>采购源：</p>-->
            <!--            <div class="box">-->
            <!--                --><?php //if($data): ?>
            <?php
            //                    $from = trim($data->p_from);
            //                    if($from == '义乌'){
            //                        echo '<label class="inline"><input type="radio" name="from" value="义乌" checked>义乌</label>';
            //                        echo '<label class="inline"><input type="radio" name="from" value="东站">东站</label>';
            //                    }else if($from == '东站'){
            //                        echo '<label class="inline"><input type="radio" checked name="from" value="东站">东站</label>';
            //                        echo '<label class="inline"><input type="radio" name="from" value="义乌">义乌</label>';
            //                    }
            //                    ?>
            <?php /*else:*/ ?>
            <!--                    <label class="inline"><input type="radio" checked name="from" value="东站">东站</label>-->
            <!--                    <label class="inline"><input type="radio" name="from" value="义乌">义乌</label>-->
            <!--                --><?php //endif; ?>
            <!--            </div>-->
            <!--        </div>-->

<!--            --><?php //if($data): ?>
<!--                <input type="hidden" id="J-properties-field" name="properties" value="--><?php //echo $data->props; ?><!--" />-->
            <?php /*else:*/ ?>
<!--                <div class="input-skin flexBox propsBox">-->
<!--                    <p>属性：</p>-->
<!--                    <div class="box propsBox">-->
<!--                        <input type="hidden" id="J-properties-field" name="properties">-->
<!--                        <div id="J-propsHTMLBox">-->
<!--                            暂无商品属性-->
<!--                        </div>-->
<!--                        <a href="javascript:void(0)" id="J-addProps-btn">&#43; 添加属性</a>-->
<!--                    </div>-->
<!--                </div>-->
<!--            --><?php //endif; ?>


<!--            <div class="input-skin flexBox attachmentBox">-->
<!--                --><?php //if($data): ?>
<!--                    <img src="--><?php ///*echo $data->p_pic;*/ ?><!--" alt=""/>-->
                <?php /*else:*/ ?>
<!--                    <div class="J-takePhotoBox box">-->
<!--                        <input type="file" name="pic" id="J-takePhoto-btn"/>-->
<!--                        <a href="javascript:void(0)" class="J-takePhoto-btn-skin" style="display: none;">-->
<!--                            --><?php
//                            if ( $detect->isMobile() || $detect->isTablet()) {
//                                echo '<span class="camera"></span>拍产品';
//                            }else{
//                                echo "上传产品照";
//                            }
//                            ?>
<!--                        </a>-->
<!--                    </div>-->
<!--                    <div id="J-photoPreview" class="box">-->
<!--                    </div>-->
<!--                --><?php //endif; ?>
<!--            </div>-->

            <button type="submit" class="touchStatusBtn btn btn-primary" id="J-editProduct-btn">确定</button>
        </form>
    </div>
    <script>
        seajs.use('updateProduct.js');
    </script>
<?php
include_once('templates/footer.php');
?>