/**
 * Created with JetBrains PhpStorm.
 * User: praise
 * Date: 11/6/13
 * Time: 4:33 PM
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module){
    var $ = require('zepto.min.js');
    var Widgets = require('widgets.js');

    var html = '';
    var pop = null;
    pop = pop || new Widgets.Pop({
        bd: html,
        bindUI: function (){

        },
        styles: {
            width: 260
        }
    });
    pop.render();

    function submitRefund(data, callback){
        var detailNodes = pop.bd.find('.detailsBox p');
        var details = [];
        var checkeds = 0;
        var refundDetail = [];
        var confirm = null;
        $.each(detailNodes, function (i, n){
            if(!$(n).find('input[type=checkbox]').attr('checked')){
                details.push($(n).attr('data-detail'))
            }else{
                checkeds++;
                refundDetail.push($(n).attr('data-detail'))
            }
        });
        if(checkeds === 0){
            return alert('请勾选一个退货商品');
        }
        if(checkeds === detailNodes.length){
            alert("系统将直接删除这条销售记录");
            details = 'null';
            confirm = true;
        }else{
            confirm = window.confirm(data.name+" 退货："+refundDetail.join('和 ').replace(/\*/g, ' x '));
        }
        if(confirm){
            new Widgets.IO({
                url: 'controler/refund.php',
                data: 'id='+data.id+"&details="+(details === 'null' ? details : details.join('|')),
                on: {
                    start: function (){},
                    success: function (data){
                        if(data.bizCode === 1){
                            callback.call(callback, data);
                        }
                    },
                    error: function (){}
                }
            }).send();
        }
    }

    return {
        showPanel: function (data, callback){
            pop.show().hd.html(data.name+" 的退货");
            var detailHtml = '<div class="detailsBox">';
            $.each(data.details, function (i, detail){
                detail = detail.split('*');
                var price = (detail[0]*1).toFixed(2)+'元';
                var count = detail[1]+" 个";
                var checkbox = '<input type="checkbox" />';
                detailHtml += '<p data-detail="'+detail.join('*')+'">'+price+' x '+count+checkbox+'</p>';
            });
            detailHtml + '</div>';
            pop.bd.html(detailHtml);
            pop.ft.find('.btn1').unbind().bind('click', function (e){
                e.preventDefault();
                submitRefund(data, callback);
            });
            pop.syncStyle();
        }
    };
});
