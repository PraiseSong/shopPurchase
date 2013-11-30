/**
 * Created with JetBrains PhpStorm.
 * User: praise
 * Date: 10/19/13
 * Time: 11:41 PM
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module){
    var $ = require('zepto.min.js');
    var IO = require("io.js");
    var Utils = require("utils.js");
    require("userAuth.js");

    $('#J-showPerfBtn').on("click", function (){
        showPerf();
    });
    $('#J-perf .close').on("click", function (){
        hidePerf();
    });
    $('#J-queryProductsBtn').on('click', function (e){
        e.preventDefault();
        gotoQueryProducts();
    });
    $('#J-backToCashierBtn').on("click", function (e){
        e.preventDefault();
        gotoCashier();
    });
    $('#J-addPriceBtn').on("click", function (){
        addPrice();
    });
    $('#J-soldCount').on("blur", function (){
        changePricesSelect();
    });
    $('#J-queryBtn').on("click", function (){
        if($('#J-parentTypes').val() || $.trim($('#J-searchText').val())){
            resetQueryProducts();
        }
    });
    $('#J-requestMoreBtn').on("click", function (){
        queryProducts($(this));
    });
    setTimeout(function (){
        var type = require("types.js");
        type.query(function (data){
            if(data.bizCode === 1 && data.data && data.data.types.length >= 1){
                var options = '<option value="">商品分类</option>';
                $.each(data.data.types, function (i, type){
                    options += '<option value="'+type.id+'">'+type.name+'</option>';
                });
                $('#J-parentTypes').html(options);
                $('#J-parentTypes').unbind().bind("change", function (){
                    if($('#J-parentTypes').val()){
                        resetQueryProducts();
                    }
                });
            }
        });
    }, 2000);
    $('#J-cashierBtn').on("click", selling);

    function gotoCashier(){
        //window.scrollTo(0, 0);
        $('#J-cashierContainer').show();
        $('#J-queryProductsContainer').hide();
    }
    function gotoQueryProducts(){
        window.scrollTo(0, 0);
        $('#J-cashierContainer').hide();
        $('#J-queryProductsContainer').show();
    }
    function addPrice(){
        var count = getCount();
        if(!count){
            return ;
        }else if(count === 1){
            return alert('当前销售数量为1，不能增加其它价格');
        }
        var selects = $('#J-prices select');
        var selectedCount = 0;
        var options = '';
        $.each(selects, function (i, select){
            var val = $(select).val();
            if($.trim(val) && /^\d+$/.test(val*1)){
                selectedCount+=val*1;
            }
        });
        for(var i=1;i<count+1;i++){
            var selected = '';
            if(i === (count-selectedCount)){
                selected = "selected";
            }
            options += '<option value="'+i+'" '+selected+'>'+i+'</option>';
        }
        var html = '<li class="flexBox">'+
            '<input type="number" autocapitalize="off" class="box" />'+
            '<span>&Chi;</span>'+
            '<select class="box">'+
            options+
            '</select>'+
            '<span class="box J-del">删除</span>'+
        '</li>';
        $('#J-prices').append(html);
        $('#J-prices .J-del').unbind().bind("click", function (e){
            $(this).parent().remove();
        });
    }
    function showPerf(){
        $('#J-perf').show();
        $('#J-showPerfBtn').hide();
    }
    function hidePerf(){
        $('#J-showPerfBtn').show();
        $('#J-perf').hide();
    }
    function changePricesSelect(){
        var count = getCount();
        if(count){
            var selects = $('#J-prices select');
            var options = '';
            for(var i=1;i<count+1;i++){
                var selected = '';
                if(i === count){
                    selected = "selected";
                }
                options += '<option value="'+i+'" '+selected+'>'+i+'</option>';
            }
            $.each(selects, function (i, select){
                $(select).html(options);
            });
        }
    }
    function getCount(){
        var count = $.trim($('#J-soldCount').val());
        if(!count){
            alert("请填写销售数量");
            return false;
        }else if(count*1 === 0){
            alert("销售数量不能为0");
            return false;
        }else if(!/^\d+$/.test(count)){
            alert("销售数量必须是整数");
            return false;
        }
        count = count*1;
        return count;
    }
    var pageNum = 1;
    var tipBox = $('#J-tip');
    var productList = $('#J-productList');
    function queryProducts(byMoreBtn){
        var parentType = $.trim($('#J-parentTypes').val());
        var searchText = $.trim($('#J-searchText').val());
        var data = '';
        if(parentType){
            data+="type="+parentType;
        }
        if(searchText){
            if(data){
                data+='&name='+encodeURI(searchText);
            }else{
                data+='name='+encodeURI(searchText);
            }
        }

        $('#J-requestMoreBtn').html("更多商品");

        if(data){
            new IO({
                url: "controler/queryProducts.php",
                data: data+"&pageNum="+pageNum,
                on: {
                    start: function (){
                        if(byMoreBtn){
                            byMoreBtn.html("正在查询...");
                        }else{
                            tipBox.html("正在查询...").show().removeClass("t-f50");
                            productList.hide();
                        }
                    },
                    success: function (result){
                        if(byMoreBtn){
                            byMoreBtn.html("更多商品");
                        }
                        if(result.bizCode === 1){
                            if(result.data.products.length >= 1){
                                pageNum++;
                                renderProducts(result.data.products);
                            }else{
                                if(byMoreBtn){
                                    byMoreBtn.html("没有了");
                                }else{
                                    noData(data);
                                }
                            }
                        }
                    },
                    error: function (){
                        if(byMoreBtn){
                            byMoreBtn.html("发生异常，点击重试");
                        }else{
                            tipBox.html("查询商品发生异常").show().addClass("t-f50");
                            productList.hide();
                        }
                    }
                }
            }).send();
        }
    }
    function noData(data){
        tipBox.html("没有查询到相关商品").show();
        productList.hide();
    }
    function renderProducts(data){
        tipBox.hide();
        var data2html = require("template.js?t=1");
        var html = '';
        var tem = '<li class="flexBox touchStatusBtn" data-id="{p_id}">'+
            '<input type="hidden" value="{p_props}">'+
            '<div class="imgSkin box">'+
            '<img src="{p_pic}" alt=""/>'+
            '</div>'+
            '<div class="information box">'+
            '<p class="name">{p_name}</p>'+
            '<p class="pprice">单价：{int}<small>.{float}</small>元</p>'+
            '<p class="count">库存：<span class="J-count">{p_count}</span>个</p>'+
            '</div>'+
            '</li>';
        $.each(data, function (i, d){
            var price = (d.p_price*1).toFixed(2);
            price = price.split(".");
            d.p_price = price;
            d.int = price[0];
            d.float = price[1];
            html += data2html(tem, d);
        });
        productList.show().find("ul").append(html);
        bindUItoPlist();
    }
    function bindUItoPlist(){
        var preview = $('#J-cashierProductPreview');
        productList.find("li").unbind().bind("click", function (){
            var props = $.trim($(this).find("input[type=hidden]").val());
            preview.html($(this).html()).attr("data-id", $(this).attr("data-id"));
            $('#J-cashierTable').find(".product-property").remove();
            if(props){
                insertProps(Utils.props2Array(props));
            }
            gotoCashier();
            window.scrollTo(0, preview.offset().top);
        });
    }
    function resetQueryProducts(){
        pageNum = 1;
        productList.find("ul").html("");
        queryProducts();
    }
    function insertProps(data){
        var html = '';
        for(name in data){
            var content = '';
            $.each(data[name], function (i, v){
                content += '<label>'+
                             '<input type="radio" name="'+name+'" value="'+v+'"/>'+
                              v+
                           '</label>';
            });
            html += '<tr class="product-property">'+
                '<td><span class="J-propName">'+name+'</span>：</td>'+
                '<td>'+
                content+
                '</td>'+
            '</tr>';
        }
        $('#J-cashierTable').append(html);
        var props = $('#J-cashierTable .product-property');
        $.each(props, function (j, prop){
            $(prop).find('label').unbind().bind("click", function (){
                $(prop).find('label').removeClass("selected").find("input[type=radio]").attr("checked", "");
                $(this).addClass("selected").find("input[type=radio]").attr("checked", true);
            });
        });
    }
    var tradeData = {};
    function selling(){
        tradeData = {};
        if(validate()){
            var confirm = window.confirm("确认记账？");
            if(confirm){
                new IO({
                    url: "controler/sellRecord.php",
                    data: "count="+tradeData.count+"&detail="+tradeData.detail+"&props="+tradeData.props+"&id="+tradeData.id,
                    on: {
                        start: function (){
                            Utils.loading.show("正在收银...");
                        },
                        success: function (data){
                            if(data.bizCode === 1){
                                Utils.loading.warn("收银成功");
                                updateCount(data.data);
                                updateCashier();
                                setTimeout(function (){
                                    Utils.loading.hide();
                                }, 3000);
                            }else{
                                Utils.loading.error(data.memo);
                                setTimeout(function (){
                                    Utils.loading.hide();
                                }, 3000);
                            }
                        },
                        error: function (){
                            Utils.loading.error("收银发生异常，请重试");
                            setTimeout(function (){
                                Utils.loading.hide();
                            }, 3000);
                        }
                    }
                }).send();
            }
        }
    }
    function validate(){
        var result = true;
        var props = $('#J-cashierTable .product-property');
        var pricesNode = $('#J-prices li');
        var detail = [];

        if(!$('#J-cashierProductPreview').attr("data-id")){
            result = false;
            alert("请先选择一个商品");
        }else if(!getCount()){
            result = false;
        }else if(getCount() > ($.trim($('#J-cashierProductPreview .J-count').html())*1)){
            result = false;
            return alert("销售数量大于当前商品的库存！");
        }else if(pricesNode.length >= 1){
            var totalCount = 0;
            $.each(pricesNode, function (i, pn){
                var price = $.trim($(pn).find("input[type=number]").val())*1;
                var count = $.trim($(pn).find("select").val())*1;
                totalCount += count;
                if(!price){
                    alert("第 "+(i+1)+" 种销售价格不能为空");
                    result = false;
                    return false;
                }else if(!/^\d+\.?\d{0,2}$/.test(price)){
                    result = false;
                    alert("第 "+(i+1)+" 种销售价格不正确");
                    return false;
                }else if(!count){
                    alert("第 "+(i+1)+" 种销售数量不能为空");
                    result = false;
                    return false;
                }else if((count <=0) || (!/^\d+$/.test(count))){
                    result = false;
                    alert("第 "+(i+1)+" 种销售数量不正确");
                    return false;
                }
            });

            if(result && (totalCount !== getCount())){
                result = false;
                alert("总销售量与"+pricesNode.length+"种价格的销售量不相等");
            }
            $.each(pricesNode, function (i, pn){
                var price = $.trim($(pn).find("input[type=number]").val())*1;
                var count = $.trim($(pn).find("select").val())*1;
                detail.push(''+price+'*'+count+'');
            });
        }
        if(result && props.length >= 1){
            $.each(props, function (j, prop){
                var name = $.trim($(prop).find(".J-propName").html());
                var radios = $(prop).find("input[type=radio]");
                var checked = 0;
                $.each(radios, function (k, radio){
                    if($(radio).attr("checked")){
                        checked++;
                        return false;
                    }
                });
                if(checked <= 0){
                    alert("请选择 "+name+" 的属性");
                    result = false;
                    return false;
                }
            });
        }

        if(result){
            tradeData.count = getCount();
            tradeData.id = $('#J-cashierProductPreview').attr("data-id");
        }

        tradeData.detail = detail.join("|");
        if(result && props.length >= 1){
            var propsData = [];
            $.each(props, function (j, prop){
                var name = $.trim($(prop).find(".J-propName").html());
                var radios = $(prop).find("input[type=radio]");
                $.each(radios, function (k, radio){
                    if($(radio).attr("checked")){
                        propsData.push(''+name+':'+$.trim($(radio).val())+'');
                    }
                });
            });
            tradeData.props = propsData.join('|');
        }

        return result;
    }
    function updateCount(count){
        $('.J-count').html(count);
    }
    function updateCashier(){

    }
});