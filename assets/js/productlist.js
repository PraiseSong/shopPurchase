/**
 * Created by apple on 12/4/13.
 */
define(function (require, exports, module){
    var $ = require('zepto.min.js');
    var IO = require('io.js');
    var Utils = require("utils.js");
    var Refund = require('refund.js');

    window.alert = function (msg) {
        navigator.notification.alert(
            msg,  // message
            function () {
            },         // callback
            '小店记账宝',            // title
            '知道了'                  // buttonName
        );
    };

    var productlistBox = $('#J-productList');
    var queryString = Utils.queryString2Obj();
    var date = null;
    if(queryString){
        date = queryString.date;
    }

    function sendIO(){
        new IO({
            url: "soldProducts.php",
            data: "action=query&date="+date,
            timeoutcallback: function (){
                productlistBox.find('ul').html('<p style="text-align: center;color: #f50;">查询超时，<a href="javascript:void(0)" id="J-again">请重试</a></p>');
                $('#J-again').unbind().bind("click", sendIO);
            },
            on: {
                start: function (){
                    productlistBox.find('ul').html('<p style="text-align: center;">查询中...</p>');
                },
                success: function (data){
                    if(data.bizCode !== 1){
                        return productlistBox.find('ul').html('<p style="text-align: center;color: #f50;">'+data.memo+'</p>');
                    }else if(data.data && data.data.products.length < 1){
                        return productlistBox.find('ul').html('<p style="text-align: center;color: #f50;">没有查找到'+ date +'的销售记录</p>');
                    }

                    rendProducts(data.data.products);
                },
                error: function (){
                    productlistBox.find('ul').html('<p style="text-align: center;color: #f50;">查询'+ date +'售出商品时出现异常</p>');
                }
            }
        }).send();
    }
    if(date){
        sendIO();
    }

    function rendProducts(data){
        var html = '';

        $.each(data, function (k, product){
            if(product.p_pic.indexOf("attachments") !== -1){
                product.p_pic = "http://115.29.39.106/"+product.p_pic;
            }

            if(product.p_pic.indexOf("base64") < 0 && product.p_pic.indexOf("attachments") < 0){
                var user = JSON.parse(localStorage.getItem("user"));
                product.p_pic = "http://115.29.39.106/attachments/"+user.attachmentsDir + "/thumb_"+product.p_pic;
            }
            html += "<li><div class=\"flexBox touchStatusBtn\" data-id="+product.order_id+">"+
            '<div class="imgSkin box">'+
            "<img src="+product.p_pic+" alt="+product.p_name+"/>"+
            '</div>'+
            '<div class="information box">'+
            "<p class=\"name\">"+product.p_name+"</p>";

            var detail = null;
            var detailHtml = '';
            var propHtml = '';
            var counter = 0;
            var props = null;

            if(product.detail.indexOf('|') !== -1){
                detail = product.detail.split('|');
            }else{
                detail = [product.detail];
            }

            if(product['prop']){
                if(product.prop.indexOf('|') !== -1){
                    props = product.prop.split('|');
                }else{
                    props = [product['prop']];
                }
                $.each(props, function (j, prop){
                    var prop = prop.split(':');
                    propHtml += "<p class=\"prop\">"+prop[0]+": "+prop[1]+"</p>";
                });
            }

            $.each(detail, function (i, det){
                if(det){
                    det = det.split('*');
                    if(det[1]){
                        counter += det[1]*1;
                    }

                    var num = i+1;
                    var sold_price = det[0]*1;
                    var sold_price_to_2float = sold_price.toFixed(2);
                    var sold_count = det[1]*1;
                    detailHtml += "<p class=\"detail\" data-detailNum="+num+" data-detail="+sold_price+"*"+sold_count+">"+
                    ""+sold_price_to_2float+"元 x "+sold_count+"个</p>";
                }
            });

            html += propHtml+detailHtml;
            html += "<p class=\"date\">时间："+product.date+"</p></div></div>";
            html += "<footer class=\"flexBox\"><a href=\"javascript:void(0)\" class=\"J-refund box\" data-id="+product.order_id+">退货</a></footer>";
            html += '</li>';
        });
        productlistBox.find('ul').html(html);
        bindUItoList();
    }

    function bindUItoList(){
        $('#J-productList ul .J-refund').unbind().bind('click', function (e){
            e.preventDefault();
            var id = $(this).attr('data-id');
            var detailNodes = $(this).parent().parent().find('.detail');
            var details = [];
            $.each(detailNodes, function (i, n){
                details.push($(n).attr('data-detail'));
            });

            var data = {
                name: $(this).parent().parent().find('.name').html(),
                id: id,
                details: details
            };
            Refund.showPanel(data, function (data){
                if(data.bizCode !== 1){
                    return alert(data.memo);
                }
                if(data.data.deleted){
                    alert("销售记录已删除");
                    location.reload();
                }else if(data.data.sold){
                    alert("退货成功");
                    location.reload();
                }else{
                    alert(data.memo)
                    location.reload();
                }
            });
        });
    }
});
