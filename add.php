<?php
  $page_name = '入库';
?>
<?php
  include_once('templates/header.php');

  $detect = new Mobile_Detect;
?>
<header id="header">
    <a class="back-btn" href="index.php">&lt; 返回</a>
    <span class="bd">添加商品</span>
</header>
<form class="addProduct-form" method="post" action="controler/add.php" enctype="multipart/form-data" novalidate>
    <fieldset>
        <div class="filed-group">
            <label for="name">名称</label>
            <input id="name" name="name" type="text" placeholder="商品名称">
        </div>

        <div class="filed-group">
            <label for="price">单价</label>
            <input id="price" name="price" type="number" placeholder="商品单价">
        </div>

        <div class="filed-group">
            <label for="count">数量</label>
            <input id="count" name="count" type="tel" placeholder="采购数量">
        </div>

        <div class="filed-group">
            <label>采购人</label>
            <label class="inline"><input type="radio" checked name="man" value="黄伟丽">黄伟丽</label>
            <label class="inline"><input type="radio" name="man" value="朱琦">朱琦</label>
        </div>

        <div class="filed-group">
            <label>采购源</label>
            <label class="inline"><input type="radio" checked name="from" value="东站">东站</label>
            <label class="inline"><input type="radio" name="from" value="义乌">义乌</label>
        </div>

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

        <div class="filed-group">
            <div class="J-takePhotoBox">
                <input type="file" name="pic" id="J-takePhoto-btn"/>
                <a href="javascript:void(0)" class="pure-button pure-button-secondary J-takePhoto-btn-skin">
                    <?php
                      if ( $detect->isMobile() || $detect->isTablet()) {
                          echo "拍产品";
                      }else{
                          echo "上传产品照";
                      }
                    ?>
                </a>
            </div>
            <div class="J-photoPreview"></div>
        </div>

        <button type="submit" class="btn btn-ok" id="J-addPropduct-btn">确定</button>
    </fieldset>
</form>
<script src="static/js/add.js"></script>
<?php
  include_once('templates/footer.php');
?>