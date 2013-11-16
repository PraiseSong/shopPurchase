<?php
include_once('templates/header.php');
?>
<header id="header">
    <a class="back-btn" href="cashier.php"><img src="static/imgs/back-icon.png" width="36" height="36" alt="返回" /></a>
    <span class="bd">历史业绩</span>
</header>
    <div class="operationBox">
        <div class="webkit-box date-controler-box">
            <input type="date" id="J-date-start" placeholder="选择开始日期"/>
            <span class="separator">到</span>
            <input type="date" id="J-date-end" placeholder="选择结束日期"/>
            <span class="btn btn-ok" id="J-queryBtn">查询</span>
        </div>
    </div>
    <div class="todayOperation">
        <header> <span class="dateName"></span>历史运营摘要<img src="static/imgs/ajax-loader.gif" alt="loading" class="hide loadingImg" /> </header>
        <section class="bd">
            <p>纯利润：&yen;<span class="clr">0</span>元</p>
            <p>营业额： &yen; <span class="yye">0</span> 元</p>
            <p>利润： &yen; <span class="lr">0</span> 元</p>
            <p>成本： &yen; <span class="cb">0</span> 元</p>
            <p>租金：&yen; <span class="zj">0</span>元</p>
        </section>
    </div>
    <div class="selled-products-box productList">
        <a href="javascript:void(0)" id="J-show-selled-products">查看<span class="dateName">当天</span>销售的所有商品</a>
    </div>
    <script>
        seajs.use('queryAllOperations.js');
    </script>
<?php
include_once('templates/footer.php');
?>