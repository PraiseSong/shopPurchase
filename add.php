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

  $detect = new Mobile_Detect;

  $update = @$_GET['action'];
  $data = null;
//  if($update){
//      $id = @$_GET['id'];
//      $db = new DB($db_name,$db_host,$db_username,$db_password);
//      $db->query("SET NAMES 'UTF8'");
//      $sql = "select * from products where p_id=$id";
//      $data = $db->queryUniqueObject($sql);
//      $db->close();
//  }

  if(!empty($_POST)){
      include_once('libraries/imageResize.php');

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

      $attachments_dir = "attachments";
      $error_msg = "您的访问异常";

      $p_name = @$_POST['name'];
      $p_price = @$_POST['price'];
      $p_count = @$_POST['count'];
      $man = @$_POST['man'];
      $from = @$_POST['from'];
      $props = @$_POST['properties'];
      $p_types = @$_POST['types'];
      $pic = @$_FILES['pic'];
      $pic_link = false;
      $date = date("Y-m-d H:i:s");
      $saved_img_to_base64_error_msg = null;
      $writed_product = false;
      $errors = array();
      $successes = array();

      if(!$from){
          $from = '';
      }
      if(!$man){
          $man = '';
      }
      if(!$p_name || !$p_price || !$p_count || !$pic || !$p_types){
          $errors[] = '没有传入正确的参数';
      }else{
          $query_isExist_sql = "select p_name from products where (p_name='$p_name' and user_id=$user_id and p_type='$p_types')";
          $query_isExist = $db->queryUniqueObject($query_isExist_sql);
          if($query_isExist){
              $errors[] = '商品名称重复';
              $p_name = '';
              $p_count = '';
              $p_price = '';
              $p_types = '';
          }else if($pic){
              $attachment_name = md5($date) . '_' . str_replace(' ', '', $pic["name"]);

              if ($pic["error"] > 0){
                  $errors[] = '商品图片上传出现错误';
              }else{
                  if (file_exists("$attachments_dir/" . $attachment_name)){
                      $errors[] = '商品图片已存在';
                  }else{
                      if(move_uploaded_file($pic["tmp_name"], "$attachments_dir/" . $attachment_name)){
                          $pic_link = "$attachments_dir/" . $attachment_name;
                          $pic_thumb_link = "$attachments_dir/thumb_" . $attachment_name;
                          $saved_thumb = img2thumb($pic_link, $pic_thumb_link, 100, 100, 0, 0);
                      }else{
                          $errors[] = '商品图片保存失败';
                      }
                  }
              }
          }else{
              $errors[] = '请上传商品图片';
          }
          if($pic_link){
              $sql = "insert into products(`user_id`, `p_name`, `p_count`, `p_from`, `p_man`, `p_price`, `p_pic`, `p_props`, `p_date`, ".
                  "`p_type`) values ($user_id, '$p_name', '$p_count', '$from', '$man', '$p_price', '$pic_thumb_link', '$props', '$date', ".
                  "'$p_types')";
              $writed_product = $db->query($sql);
              if($writed_product){
                  $successes[] = "$p_name 录入成功";
                  $p_name = '';
                  $p_count = '';
                  $p_price = '';
                  $p_types = '';
              }

//        $file = '../'.$pic_thumb_link;
//        $type=getimagesize($file);//取得图片的大小，类型等
//        @$fp=fopen($file,"r");
//        if($fp){
//            $file_content=chunk_split(base64_encode(fread($fp,filesize($file))));//base64编码
//            switch($type[2]){//判读图片类型
//                case 1:$img_type="gif";break;
//                case 2:$img_type="jpg";break;
//                case 3:$img_type="png";break;
//            }
//            $img='data:image/'.$img_type.';base64,'.$file_content;//合成图片的base64编码
//            $handle = fopen($file . '.txt', 'w');
//            fwrite($handle, $img);
//            fclose($handle);
//            fclose($fp);
//        }else{
//            $saved_img_to_base64_error_msg = '商品图片缓存失败';
//        }
          }
      }

      $db->close();
  }
?>

<?php
  require_once("models/header.php");
?>

<link rel="stylesheet" href="assets/css/addProduct.css" />
<header class="header">
    <a class="back box touchStatusBtn" href="javascript:void(0)"><img src="assets/imgs/back-icon.png" alt="返回" />返回</a>
    <span class="box">添加商品</span>
</header>
<div class="container">
    <?php
      if(isset($errors) || isset($successes)){
          resultBlock($errors, $successes);
      }
    ?>
<form class="form-default" method="post" action="add.php" enctype="multipart/form-data" novalidate>
        <div class="input-skin first-child">
            <?php
            if(isset($p_name) && $p_name){
                echo "<input autocapitalize=\"off\" id=\"name\" name=\"name\" type=\"text\" value=\"$p_name\" placeholder=\"商品名称\">";
            }else{
                echo '<input autocapitalize="off" id="name" name="name" type="text" placeholder="商品名称">';
            }
            ?>
        </div>

        <div class="input-skin">
            <?php
            if(isset($p_price) && $p_price){
                echo "<input autocapitalize=\"off\" id=\"price\" value=\"$p_price\" name=\"price\" type=\"number\" placeholder=\"商品单价\">";
            }else{
                echo '<input autocapitalize="off" id="price" name="price" type="number" placeholder="商品单价">';
            }
            ?>
        </div>

        <div class="input-skin">
            <?php
            if(isset($p_count) && $p_count){
                echo "<input autocapitalize=\"off\" value=\"$p_count\" id=\"count\" name=\"count\" type=\"tel\" placeholder=\"采购数量\">";
            }else{
                echo '<input autocapitalize="off" id="count" name="count" type="tel" placeholder="采购数量">';
            }
            ?>
        </div>

        <div class="input-skin flexBox typesContainer">
            <p>
                分类：
                <?php
                if(isset($p_types) && $p_types){
                    echo "<input type=\"hidden\" value=\"$p_types\" id=\"J-types-hide\" name=\"types\"/>";
                }else{
                    echo '<input type="hidden" id="J-types-hide" name="types"/>';
                }
                ?>
            </p>
            <div class="typesBox box">
                <div id="J-typesSelector">加载分类...</div>
                <a href="javascript:void(0)" id="J-addType">添加分类</a>
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

    <div class="input-skin flexBox propsBox">
        <p>属性：</p>
        <div class="box propsBox">
            <input type="hidden" id="J-properties-field" name="properties">
            <div id="J-propsHTMLBox">
                暂无商品属性
            </div>
            <a href="javascript:void(0)" id="J-addProps-btn">&#43; 添加属性</a>
        </div>
    </div>


        <div class="input-skin flexBox attachmentBox">
            <div class="J-takePhotoBox box">
                <input type="file" name="pic" id="J-takePhoto-btn"/>
                <a href="javascript:void(0)" class="J-takePhoto-btn-skin" style="display: none;">
                    <?php
                      if ( $detect->isMobile() || $detect->isTablet()) {
                          echo '<span class="camera"></span>拍产品';
                      }else{
                          echo "上传产品照";
                      }
                    ?>
                </a>
            </div>
            <div id="J-photoPreview" class="box">
            </div>
        </div>

        <button type="submit" class="touchStatusBtn btn btn-primary" id="J-addPropduct-btn">确定</button>
</form>
</div>
<script>seajs.use('add.js');</script>
<?php
  include_once('templates/footer.php');
?>