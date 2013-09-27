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
    <title><?php echo $Product_name; ?></title>
    <link rel="stylesheet" href="static/css/pure-min.css" />
    <link rel="stylesheet" href="static/css/reset.css" />
    <link rel="stylesheet" href="static/css/app.css" />
    <script src="static/js/zepto.min.js"></script>
    <script type="text/javascript" src="static/js/widgets.js"></script>
</head>
<body>
  <header id="header">
      <span class="bd">商品进存管理</span>
      <a class="pure-button btn" href="add.php">新增</a>
  </header>
  <ul class="J-dataList"></ul>
  <button class="pure-button" id="J-loadMore-btn">加载更多</button>
</body>
<script src="static/js/index.js"></script>
</html>