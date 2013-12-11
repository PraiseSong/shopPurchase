/**
 * Created by apple on 12/4/13.
 */
define(function (require, exports, module){
    var $ = require('zepto.min.js');
    var IO = require('io.js');
    var Rent = require("rent.js");

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
    }, 1000);
    $('#J-queryBtn').on("click", function (){
        if($('#J-parentTypes').val() || $.trim($('#J-searchText').val())){
            resetQueryProducts();
        }
    });
    $('#J-requestMoreBtn').on("click", function (){
        queryProducts($(this));
    });
    var pageNum = 2;
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
            new IO({
                url: "warehouse.php",
                type: "get",
                data: data+"&pageNum="+pageNum+"&ajax=true",
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
    function noData(data){
        tipBox.html("没有查询到相关商品").show();
        productList.hide();
    }
    function renderProducts(products){
        tipBox.hide();
        var data2html = require("template.js");
        var html = '';
        $.each(products, function (j, data){
            var price = (data.p_price*1).toFixed(2).split('.');
            data.price = "<span>"+price[0]+"</span>"+".<small>"+price[1]+"</small>";
            var tem = "<li><div class=\"flexBox touchStatusBtn\" data-id=\"{p_id}\">"+
                '<div class="imgSkin box">'+
                "<img src=\"{p_pic}\" alt=\"{p_name}\"/>"+
                '</div>'+
                '<div class="information box">'+
                "<p class=\"name\">{p_name}</p>"+
                "<p class=\"count\">库存：{p_count}</p>"+
                "<p class=\"price\">单价：{price} 元</p>"+
                (data.p_from ? "<p class=\"from\">采购地：{p_from}</p>" : "")+
                (data.p_man ? "<p class=\"man\">采购人：{p_man}</p>" : "");

            var p_props = [];
            var p_props_html = '';
            if(data.props){
                if(data.props.indexOf("|") !== -1){
                    p_props = data.p_props.split('|');
                }else{
                    p_props = [data.p_props];
                }
            }

            $.each(p_props, function (i, prop){
                if(prop){
                    p_props_html += "<p class=\"prop\">"+ prop + "</p>";
                }
            });

            tem += p_props_html;
            tem += "<p class=\"date\">入库时间：{p_date}</p></div></div>";
            tem += "<footer class=\"flexBox\"><a href=\"edit_product.php?id={p_id}\" class=\"J-edit box\" target='_blank'>修改</a></footer>";
            tem += '</li>';
            html += data2html(tem, data);
        });
        productList.show().find("ul").append(html);
    }
    function resetQueryProducts(){
        pageNum = 1;
        productList.find("ul").html("");
        queryProducts();
    }
});