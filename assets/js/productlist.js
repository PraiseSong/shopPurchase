/**
 * Created by apple on 12/4/13.
 */
define(function (require, exports, module){
    var $ = require('zepto.min.js');
//    var IO = require('io.js');
    var Utils = require("utils.js");
    var Refund = require('refund.js');

//    var productlist = localStorage.getItem("productlist");

//    if(productlist){
//        productlist = JSON.parse(productlist);
//        console.log(productlist);
//        $('#J-productList ul').html(productlistData2html(productlist));
//
//        function productlistData2html(data){
//            var data2html = require("template.js");
//            var html = '';
//            $.each(data, function (i, product){
//                var tem = '<li><div class="flexBox touchStatusBtn" data-id="{order_id}">'+
//                    '<div class="imgSkin box">'+
//                    '<img src="{p_pic}" alt="{p_name}"/>'+
//                    '</div>'+
//                    '<div class="information box">'+
//                    '<p class="name">{p_name}</p>';
//
//                var detail = product.detail.split('|');
//                var detailHtml = '';
//                var propHtml = '';
//                var counter = 0;
//                $.each(detail, function (j, _det){
//                    if(_det){
//                        _det = _det.split('*');
//                        if(_det[1]){
//                            counter += _det[1]*1;
//                        }
//                        detailHtml += '<p class="detail" data-detailNum="'+(j+1)+'" data-detail="'+(_det[0]*1)+'*'+(_det[1]*1)+'">'+(_det[0]*1).toFixed(2)+'元 x '+_det[1]*1+'个</p>';
//                    }
//                });
//                if(product.prop){
//                    var props = Utils.props2Array(product.prop);
//                    $.each(props, function (k, prop){
//                        propHtml += '<p class="prop">'+k+': '+(prop.join("、"))+'</p>';
//                    });
//                }
//                tem += propHtml+detailHtml+'</div></div><footer class="flexBox"><a href="javascript:void(0)" class="J-refund box" data-id="{order_id}">退货</a></footer></li>';
//                html += data2html(tem, product);
//            });
//
//            return html;
//        }
//    }

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
                if(data.bizCode === 0){
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

    bindUItoList();
});
