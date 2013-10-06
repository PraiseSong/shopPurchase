<?php
  include_once('templates/header.php');
?>
  <header id="header">
      <span class="bd"><?php echo constant("PRODUCT_NAME"); ?></span>
      <a class="btn btn-info" href="add.php">&#43; 入库</a>
  </header>
  <div class="todayOperation">
      <header>今日运营情况</header>
      <section class="bd">
          <p>营业额： &yen; <span class="yye">0</span> 元</p>
          <p>利润： &yen; <span class="lr">0</span> 元</p>
          <p>成本： &yen; <span class="cb">0</span> 元</p>
      </section>
  </div>
  <div class="dataList-box">
      <div class="init-loading">
          <img src="static/imgs/ajax-loader.gif" alt="loading..."/>
          数据初始化
      </div>
      <ul class="J-dataList"></ul>
      <button class="btn btn-ok" id="J-loadMore-btn">加载更多</button>
  </div>
<script src="static/js/index.js"></script>
<?php
  include_once('templates/footer.php');
?>