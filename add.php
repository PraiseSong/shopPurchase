<?php
  include_once('controler/config.php');
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta content="initial-scale=1.0,user-scalable=no,maximum-scale=1,width=device-width" name="viewport" />
    <meta content="black" name="apple-mobile-web-app-status-bar-style" />
    <meta content="telephone=no" name="format-detection" />
    <title>添加商品----<?php echo $Product_name; ?></title>
    <link rel="stylesheet" href="static/css/pure-min.css" />
    <link rel="stylesheet" href="static/css/app.css" />
    <script src="static/js/zepto.min.js"></script>
</head>
<body>
<header id="header">
    <a class="back-btn" href="index.php">返回</a>
    <span class="bd">添加商品</span>
</header>
<form class="pure-form addProduct-form" method="post" action="controler/add.php" enctype="multipart/form-data" novalidate>
    <fieldset>
        <div class="pure-control-group filed-group">
            <label for="name">名称</label>
            <input id="name" name="name" type="text" placeholder="商品名称">
        </div>

        <div class="pure-control-group filed-group">
            <label for="price">单价</label>
            <input id="price" name="price" type="number" placeholder="商品单价">
        </div>

        <div class="pure-control-group filed-group">
            <label for="count">数量</label>
            <input id="count" name="count" type="tel" placeholder="采购数量">
        </div>

        <div class="pure-control-group filed-group">
            <label>采购人</label>
            <label class="inline"><input type="radio" checked name="man" value="黄伟丽">黄伟丽</label>
            <label class="inline"><input type="radio" name="man" value="朱琦">朱琦</label>
        </div>

        <div class="pure-control-group filed-group">
            <label>采购源</label>
            <label class="inline"><input type="radio" checked name="from" value="东站">东站</label>
            <label class="inline"><input type="radio" name="from" value="义乌">义乌</label>
        </div>

        <div class="pure-control-group filed-group">
            <label>属性</label>
            <div class="propsBox">
                <input type="hidden" class="J-properties-field" name="properties">
                <div class="J-propsHTMLBox">
                    暂无商品属性
                </div>
                <a href="javascript:void(0)" id="J-addProps-btn">添加属性</a>
            </div>
        </div>

        <div class="pure-control-group filed-group">
            <div class="J-takePhotoBox">
                <input type="file" name="pic" id="J-takePhoto-btn"/>
                <a href="javascript:void(0)" class="pure-button pure-button-secondary">上传商品</a>
            </div>
            <div class="J-photoPreview"></div>
        </div>

        <div class="pure-controls">
            <button type="submit" class="pure-button pure-button-error" id="J-addPropduct-bttn">确定</button>
        </div>
    </fieldset>
</form>
</body>
<script src="static/js/add.js"></script>
</html>