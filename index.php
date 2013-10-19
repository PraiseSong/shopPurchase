<?php
  include_once('templates/header.php');
?>


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
<?php
  include_once('templates/footer.php');
?>