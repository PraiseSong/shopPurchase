/**
 * Created with Praise Song(http://labs.cross.hk).
 * User: Praise
 * Date: 13-9-7
 * Time: 下午1:23
 */
//query product
define(function (require, exports, module){
    var Widgets = require('widgets.js');
    var $ = require('zepto.min.js');
    var Util = require('util.js');
    var productList = require('productsGetter.js');
    var Operation = require("operation.js");
    var Cashier = require('cashier.js');
    require('rent.js');

    productList.url = 'controler/queryProducts.php';
    productList.data = "limit=10&attachmentsType=base64";
    productList.container = $('.J-dataList');
    productList.tem = '<li data-id="{id}">'+
        '<div class="imgBox">'+
        '<img data-src="{attachment}"  data-id="{id}" /></div>'+
        '<div class="info">'+
        '<p class="pName">{name}</p>'+
        '<div class="extra">'+
        '<p class="kcBox">库存：<span class="kc">{count}</span> 个</p>'+
        '<p class="cbBox">成本：&yen; <span class="cb">{price}</span>元</p>'+
        '<a href="add.php?action=update&id={id}" class="rk">入库</a>'+
        '</div>'+
        '</li>';
    productList.callbacks = {
        start: function (){
            productList.container.find('.loading').show();
        },
        success: function (data){
            this.renderData(data.data.products);
            Util.queryBase64(productList.container.find('.imgBox img'));
            $('#J-loadMore-btn').click(ioByBtn).html("加载更多商品");
            $('.init-loading').remove();
            productList.container.find('.loading').hide();
        },
        error: function (){
        },
        failure: function (data){
        },
        filter: function (data){
            return {
                id: data.p_id,
                name: data.p_name,
                frome: data.p_from,
                man: data.p_man,
                count: data.p_count,
                price: data.p_price,
                attachment: data.p_pic
            };
        },
        bindUI: function (){
            var fn = function (e){
                productList.container.find("li").removeClass("active");
                $(this).addClass("active");
                Cashier.show({
                    product: $(this),
                    success: function (){
                        var newCount = Cashier.currentProduct.find(".kc").html()*1 - Cashier.sellCount;
                        Cashier.currentProduct.find(".kc").html(newCount);
                        queryTodayOperation();
                    }
                });
            };
            productList.container.find("li").unbind().bind('click', fn);
        }
    };

    productList.send();

    function ioByBtn(e){
        e.preventDefault();
        $('#J-loadMore-btn').html('请求中...').unbind().bind(function (e){
            e.preventDefault();
        });
        var data = "limit=10&attachmentsType=base64";
        if(productList.type){
            data = "limit=10&attachmentsType=base64&type="+productList.type+""
        }
        productList.data = data;
        productList.send();
    }
    $('#J-loadMore-btn').click(ioByBtn);



    //商品分类
    function bindUIToFilter(){
        var btn = $('#J-filter-btn');
        var body = $('body');
        var api = 'controler/types.php';
        btn.bind("click", showTypes);

        function showTypes(){
            $('body').append('<div class="overlay-container" style="padding: 10px;">加载中...</div>');
            body.find('.overlay-container').css({
                left: btn.offset().left + 24,
                top: btn.offset().top + 24
            });
            new Widgets.IO({
                url: api,
                data: "action=query",
                on: {
                    success: function (data){
                        if(data.bizCode === 1){
                            if(data.data.types.length >= 1){
                                renderTypes(data.data.types);
                            }
                        }
                    }
                }
            }).send();
        }

        function renderTypes(data){
            var html = '<ul class="overlay-container">';
            $.each(data, function (i, type){
                html += '<li><a href="javascript:void(0)" data-id="'+type.id+'">'+type.name+'</a></li>';
            });
            html += '<li><a href="javascript:void(0)" data-id="all">查看全部商品</a></li></ul>';
            if(body.find('.overlay-container').get(0)){
                body.find('.overlay-container').remove();
            }
            body.append(html);
            body.find('.overlay-container').css({
                left: btn.offset().left + 24,
                top: btn.offset().top + 24
            });
            bindUI();
        }

        function bindUI(){
            var container = $('.overlay-container');
            container.find("a").unbind().bind('click', function (e){
                e.preventDefault();
                container.hide();
                var typeId = $(this).attr('data-id');
                if(typeId === 'all'){
                    typeId = null;
                }
                productList.dl.cleaner();
                productList.dl.start();
                productList.type = typeId;
                productList.dl.ajaxCfg.data = "limit=10&attachmentsType=base64&type="+(typeId ? typeId : '')+"";
                productList.send();
            });
        }
    }

    bindUIToFilter();

    /**
     * 查询今日运营情况
     */
    function queryTodayOperation(){
        var today = $('.todayOperation');
        var yyeNode = today.find('.yye'),
            lrNode = today.find('.lr'),
            cbNode = today.find('.cb');

        Operation.io({
            on: {
                success: function (data){
                    yyeNode.html(data.yye.toFixed(2));
                    cbNode.html(data.cb.toFixed(2));
                    lrNode.html((data.yye-data.cb).toFixed(2));
                }
            }
        });
    }
    queryTodayOperation();

    $(window).on("load", function (){
        setTimeout(function (){
            window.scrollTo(0, 0);
        }, 1);
    });
});
