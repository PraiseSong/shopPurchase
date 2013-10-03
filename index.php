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
    <link href="static/imgs/logo.png" rel="apple-touch-icon-precomposed" />
    <title><?php echo $Product_name; ?></title>
    <link rel="stylesheet" href="static/css/pure-min.css" />
    <link rel="stylesheet" href="static/css/reset.css" />
    <link rel="stylesheet" href="static/css/app.css" />
    <script src="static/js/zepto.min.js"></script>
    <script src="static/js/widgets.js"></script>
</head>
<body>
  <header id="header">
      <span class="bd">商品进存管理</span>
      <a class="btn btn-info" href="add.php">&#43; 新增</a>
  </header>
  <div class="todayOperation">
      <header>今日运营情况</header>
      <section class="bd">
          <p>营业额： &yen; <span class="yye">0</span></p>
          <p>利润： &yen; <span class="lr">0</span></p>
          <p>成本： &yen; <span class="cb">0</span></p>
      </section>
  </div>
  <div class="dataList-box">
      <ul class="J-dataList"></ul>
      <button class="btn btn-ok" id="J-loadMore-btn">加载更多</button>
  </div>
</body>
<script src="static/js/index.js"></script>
</html>