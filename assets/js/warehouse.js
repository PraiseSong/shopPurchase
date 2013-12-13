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
    $('#J-requestMoreBtn').bind("click", function (){
        queryProducts($(this));
    });
    var pageNum = ($('#J-pageNum').val()*1+1);
    var tipBox = $('#J-tip');
    var productList = $('#J-productList');
    function queryProducts(byMoreBtn, extraData){
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

        if(!extraData){
            extraData = "pageNum="+pageNum+"&ajax=true";
        }

        new IO({
            url: "warehouse.php",
            type: "get",
            data: data+extraData,
            on: {
                start: function (){
                    $('#J-requestMoreBtn').unbind().html("正在查询...");
                    if(byMoreBtn){

                    }else{
                        tipBox.html("正在查询...").show().removeClass("t-f50");
                        productList.hide();
                    }
                },
                success: function (result){
                    $('#J-requestMoreBtn').html("更多商品").bind("click", function (){
                        queryProducts($(this));
                    });
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
                    $('#J-requestMoreBtn').html("发生异常，点击重试").bind("click", function (){
                        queryProducts($(this));
                    });
                    if(byMoreBtn){

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
            data.pageNum = pageNum - 1;
            var tem = "<li data-id=\"{p_id}\"><div class=\"flexBox touchStatusBtn\" data-id=\"{p_id}\">"+
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
            if(data.p_props){
                if(data.p_props.indexOf("|") !== -1){
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
            tem += "<footer class=\"flexBox\"><a href=\"edit_product.php?id={p_id}&pageNum={pageNum}\" class=\"J-edit box\" target='_blank' data-id=\"{p_id}\">修改</a></footer>";
            tem += '</li>';
            html += data2html(tem, data);
        });
        productList.show().find("ul").append(html);
        bindUItoList();
        scrollPosByPID();
    }
    function resetQueryProducts(){
        pageNum = 1;
        productList.find("ul").html("");
        queryProducts();
    }
    function bindUItoList(){
        productList.find("ul .J-edit").unbind().bind('click', function (e){
            var id = $(this).attr("data-id");
            localStorage.setItem("warehousePID", id);
        });
    }
    function scrollPosByPID(){
      if(pid = localStorage.getItem("warehousePID")){
          var lis = productList.find("ul li");
          $.each(lis, function (i, li){
              if($(li).attr("data-id") == pid){
                  window.onload = function (){
                      window.scrollTo(0, $(li).offset().top-30);
                  };
                  $(li).addClass("selected");
                  localStorage.removeItem("warehousePID");
                  return false;
              }
          });
      }
    }
    bindUItoList();
    scrollPosByPID();
});
