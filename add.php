<?php
  $page_name = '入库';
?>
<?php
  include_once('templates/header.php');
  include_once($libs_dir.'/db.php');
  include_once($libs_dir.'/imageResize.php');

  $detect = new Mobile_Detect;

  $update = @$_GET['action'];
  $data = null;
  if($update){
      $id = @$_GET['id'];
      $db = new DB($db_name,$db_host,$db_username,$db_password);
      $db->query("SET NAMES 'UTF8'");
      $sql = "select * from products where p_id=$id";
      $data = $db->queryUniqueObject($sql);
      $db->close();
  }
?>
<header id="header">
    <a class="back-btn" href="index.php">&lt; 返回</a>
    <span class="bd">添加商品</span>
</header>
<?php
  if($data){
      $action = 'update.php';
  }else{
      $action = 'add.php';
  }
?>
<form class="addProduct-form" method="post" action="controler/<?php echo $action; ?>" enctype="multipart/form-data" novalidate>
    <fieldset>
        <div class="filed-group">
            <label for="name">名称</label>
            <?php if($data): ?>
                <input id="id" name="id" type="hidden" value="<?php echo $data->p_id; ?>">
                <input id="name" name="name" type="text" value="<?php echo $data->p_name; ?>">
            <?php else: ?>
                <input id="name" name="name" type="text" placeholder="商品名称">
            <?php endif; ?>
        </div>

        <div class="filed-group">
            <label for="price">单价</label>
            <?php if($data): ?>
                <input id="price" name="price" type="number" value="<?php echo $data->p_price; ?>">
            <?php else: ?>
                <input id="price" name="price" type="number" placeholder="商品单价">
            <?php endif; ?>
        </div>

        <div class="filed-group">
            <label for="count">数量</label>
            <?php if($data): ?>
                <input id="count" name="count" type="tel" value="<?php echo $data->p_count; ?>">
            <?php else: ?>
                <input id="count" name="count" type="tel" placeholder="采购数量">
            <?php endif; ?>

        </div>

        <div class="filed-group">
            <label for="count">分类
                <?php if($data): ?>
                    <input type="hidden" id="J-types-hide" name="types" value="<?php echo $data->p_type; ?>" />
                <?php else: ?>
                    <input type="hidden" id="J-types-hide" name="types"/>
                <?php endif; ?>
            </label>
            <div class="typesBox">
                <img src="static/imgs/ajax-loader.gif" alt="loading"/>
            </div>
        </div>

        <div class="filed-group">
            <label>采购人</label>
            <?php if($data): ?>
                <?php
                  $man = trim($data->p_man);
                  if($man == '朱琦'){
                      echo '<label class="inline"><input type="radio" name="man" value="朱琦" checked>朱琦</label>';
                      echo '<label class="inline"><input type="radio"  name="man" value="黄伟丽">黄伟丽</label>';
                  }else if($man == '黄伟丽'){
                      echo '<label class="inline"><input type="radio" checked name="man" value="黄伟丽">黄伟丽</label>';
                      echo '<label class="inline"><input type="radio" name="man" value="朱琦">朱琦</label>';
                  }
                ?>
            <?php else: ?>
                <label class="inline"><input type="radio" checked name="man" value="黄伟丽">黄伟丽</label>
                <label class="inline"><input type="radio" name="man" value="朱琦">朱琦</label>
            <?php endif; ?>
        </div>

        <div class="filed-group">
            <label>采购源</label>
            <?php if($data): ?>
                <?php
                $from = trim($data->p_from);
                if($from == '义乌'){
                    echo '<label class="inline"><input type="radio" name="from" value="义乌" checked>义乌</label>';
                    echo '<label class="inline"><input type="radio" name="from" value="东站">东站</label>';
                }else if($from == '东站'){
                    echo '<label class="inline"><input type="radio" checked name="from" value="东站">东站</label>';
                    echo '<label class="inline"><input type="radio" name="from" value="义乌">义乌</label>';
                }
                ?>
            <?php else: ?>
                <label class="inline"><input type="radio" checked name="from" value="东站">东站</label>
                <label class="inline"><input type="radio" name="from" value="义乌">义乌</label>
            <?php endif; ?>
        </div>

<?php if($data): ?>
    <input type="hidden" class="J-properties-field" name="properties" value="<?php echo $data->props; ?>" />
<?php else: ?>
    <div class="filed-group">
        <label>属性</label>
        <div class="propsBox">
            <input type="hidden" class="J-properties-field" name="properties">
            <div class="J-propsHTMLBox">
                暂无商品属性
            </div>
            <a href="javascript:void(0)" id="J-addProps-btn">&#43; 添加属性</a>
        </div>
    </div>
<?php endif; ?>


        <div class="filed-group">
            <?php if($data): ?>
                <img src="<?php echo $data->p_pic; ?>" alt=""/>
            <?php else: ?>
            <div class="J-takePhotoBox">
                <input type="file" name="pic" id="J-takePhoto-btn"/>
                <a href="javascript:void(0)" class="J-takePhoto-btn-skin">
                    <?php
                      if ( $detect->isMobile() || $detect->isTablet()) {
                          echo '<span class="camera"></span>拍产品';
                      }else{
                          echo "上传产品照";
                      }
                    ?>
                </a>
            </div>
            <div class="J-photoPreview">
            </div>
            <?php endif; ?>
        </div>

        <button type="submit" class="btn btn-ok" id="J-addPropduct-btn">确定</button>
    </fieldset>
</form>
<script src="static/js/add.js"></script>
<?php
  include_once('templates/footer.php');
?>