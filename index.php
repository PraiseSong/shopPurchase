<?php
  include_once('templates/header.php');
?>
<header id="header">
    <a href="javascript:void(0)" class="btn filter" id="J-filter-btn">筛选</a>
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
      <p class="loading">
          <img src="static/imgs/ajax-loader.gif" alt="loading..."/>加载中...
      </p>
      <div class="init-loading">
          <img src="static/imgs/ajax-loader.gif" alt="loading..."/>
          数据初始化
      </div>
      <ul class="J-dataList"></ul>
      <button class="btn btn-ok" id="J-loadMore-btn">加载更多</button>
  </div>
<script>
    seajs.use('index.js');
</script>
<div class="shortMenu">
    <div class="mainMenu">
        <span class="lt"></span>
        <span class="rt"></span>
        <span class="lb"></span>
        <span class="rb"></span>
    </div>
</div>
<div class="shortFullMenu">
    <div class="bd">
        <div class="t">上</div>
        <div class="r">右</div>
        <div class="b">下</div>
        <div class="l">左</div>
    </div>
</div>
<?php
  include_once('templates/footer.php');
?>