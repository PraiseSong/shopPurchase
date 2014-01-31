/**
 * Created by apple on 12/4/13.
 */
define(function (require, exports, module){
    var $ = require('zepto.min.js');
    var IO = require('io.js');
    var Utils = require("utils.js");

    var queryString = Utils.queryString2Obj();
    var pageNum = 1;

    if(queryString && queryString.pageNum){
        pageNum = queryString.pageNum;
        var queryStringPID = queryString.id;
        var typeID = queryString.type;

        if(pageNum && queryStringPID && typeID){
            $('#J-typeId').val(typeID);
            $('#J-parentTypes').val(typeID);
        }
    }

    var type = require("types.js");
    type.query(function (data){
        var options = '<option value="">商品分类</option>';
        if(data.bizCode === 1 && data.data && data.data.types.length >= 1){
            var typeId = $.trim($('#J-typeId').val());
            $.each(data.data.types, function (i, type){
                var selected = "";
                if(typeId && typeId == type.id){
                    selected = "selected=selected";
                }
                options += '<option value="'+type.id+'" '+selected+'>'+type.name+'</option>';
            });

            $('#J-parentTypes').unbind().bind("change", function (){
                if($('#J-parentTypes').val()){
                    resetQueryProducts();
                }
            });
        }else{
            options = '<option value="">无商品分类</option>';
        }
        $('#J-parentTypes').html(options);
    });
    $('#J-queryBtn').on("click", function (){
        if($('#J-parentTypes').val() || $.trim($('#J-searchText').val())){
            resetQueryProducts();
        }
    });
    $('#J-requestMoreBtn').bind("click", function (){
        queryProducts($(this));
    });
    var tipBox = $('#J-tip');
    var productList = $('#J-productList');
    var queryProductsIO = null;
    function queryProducts(byMoreBtn, extraData){
        var parentType = $.trim($('#J-parentTypes').val());
        var searchText = $.trim($('#J-searchText').val());
        var data = '';
        if(parentType){
            data+="type="+parentType+'&';
        }
        if(searchText){
            if(data){
                data+='&name='+encodeURI(searchText)+'&';
            }else{
                data+='name='+encodeURI(searchText)+'&';
            }
        }

        if(!extraData){
            extraData = "pageNum="+pageNum+"&ajax=true";
        }

        if(queryProductsIO){
            queryProductsIO.ajaxObj.abort();
        }

        queryProductsIO = new IO({
            url: "warehouse.php",
            data: data+extraData+"&action=query",
            timeoutcallback: function (){
                $('#J-requestMoreBtn').html("更多商品").unbind().bind("click", function (){
                    queryProducts($(this));
                });
                if(byMoreBtn){

                }else{
                    tipBox.html("查询商品超时，请重试").show().addClass("t-f50");
                    productList.hide();
                }
            },
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
                    $('#J-requestMoreBtn').show().html("更多商品").bind("click", function (){
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
                    }else{
                        tipBox.html(result.memo).show().addClass("t-f50");
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
        });
        queryProductsIO.send();
    }
    function noData(data){
        tipBox.html('没有您要的商品，现在就<a href="add.html" target="_blank" title="添加商品">添加</a>').show();
        productList.hide();
    }
    function renderProducts(products){
        tipBox.hide();
        var data2html = require("template.js");
        var html = '';
        var parentType = $.trim($('#J-parentTypes').val());
        $.each(products, function (j, data){
            if(data.p_pic.indexOf("attachments") !== -1){
                data.p_pic = "http://jzb.rib.hk/"+data.p_pic;
            }

            if(data.p_pic.indexOf("base64") < 0 && data.p_pic.indexOf("attachments") < 0){
                var user = JSON.parse(localStorage.getItem("user"));
                data.p_pic = "http://jzb.rib.hk/attachments/"+user.attachmentsDir + "/thumb_"+data.p_pic;
            }

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

            if(parentType){
                data.parentType = parentType;
            }else{
                data.parentType = 0;
            }
            tem += p_props_html;
            tem += "<p class=\"date\">入库时间：{p_date}</p></div></div>";
            tem += "<footer class=\"flexBox\"><a href=\"edit_product.html?id={p_id}&pageNum={pageNum}&type={parentType}\" class=\"J-edit box\" target='_blank' data-id=\"{p_id}\">修改</a><a href=\"javascript:void(0)\" class=\"J-del box\" data-id=\"{p_id}\" data-name=\"{p_name}\" style=\"background:red;color:#fff;\">删除</a></footer>"; 
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
        productList.find("ul .J-del").unbind().bind('click', function (e){
            var id = $(this).attr("data-id");
            var name = $(this).attr('data-name');
            navigator.notification.confirm(
              "确认删除 "+name+"！",  // message
              function (which){
                  if(which === 2){
                    return;
                  }
                  new IO({
                      url: "products.php",
                      data: "action=delete&id="+id,
                      timeoutcallback: function (){
                          Utils.loading.error("删除商品超时！请重试");
                          setTimeout(function () {
                              Utils.loading.hide();
                          }, 1500);
                      },
                      on: {
                          start: function (){
                              Utils.loading.show("正在删除 "+name+"");
                          },
                          error: function (data){
                              Utils.loading.error("删除 "+name+" 失败！请重试");
                              setTimeout(function () {
                                  Utils.loading.hide();
                              }, 1500);
                          },
                          success: function (data){
                              if (data.bizCode === 1) {
                                  Utils.loading.warn("成功删除 "+name+"");
                                  setTimeout(function () {
                                      Utils.loading.hide();
                                  }, 1500);
                                  var lis = productList.find("ul li");
                                  $.each(lis, function (i, li){
                                      if($(li).attr("data-id") == id){
                                          $(li).remove();
                                      }
                                  });
                              } else {
                                  Utils.loading.error(data.memo);
                                  setTimeout(function () {
                                      Utils.loading.hide();
                                  }, 1500);
                              }
                          }
                      }
                  }).send();
              },         // callback
              '仓库',            // title
              '确认,取消'                  // buttonName
            );
        });
    }
    function scrollPosByPID(){
      if(pid = localStorage.getItem("warehousePID")){
          var lis = productList.find("ul li");
          $.each(lis, function (i, li){
              if($(li).attr("data-id") == pid){
                  //window.onload = function (){
                      window.scrollTo(0, $(li).offset().top-30);
                  //};
                  $(li).addClass("selected");
                  localStorage.removeItem("warehousePID");
                  return false;
              }
          });
      }
    }

    if(pageNum && queryStringPID && typeID){
        queryProducts(null, "pageNum="+pageNum+"&ajax=true");
    }
});
