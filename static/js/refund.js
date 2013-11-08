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
        var detailNodes = pop.bd.find('.detailsBox .detail');
        var details = [];
        var checkeds = 0;
        var refundDetail = [];
        var confirm = null;

        var selectCountMax = 0;
        var selectCount = 0;
        $.each(detailNodes, function (i, n){
            var select = $(n).find('.J-counter');

            if(!$(n).find('input[type=checkbox]').attr('checked')){
                details.push($(n).attr('data-detail'))
            }else if($(n).find('input[type=checkbox]').attr('checked')
                && select.get(0)
                && (select.val() !== select.attr('data-max'))
                ){
                refundDetail.push($(n).attr('data-detail'));
                details.push(select.attr('data-price')+'*'+(select.attr('data-max')-select.val()))
                checkeds++;
            }else{
                checkeds++;
                refundDetail.push($(n).attr('data-detail'))
            }

            if(select.get(0)){
                selectCount++;
            }
            if(select.get(0) && select.val() === select.attr('data-max')){
                selectCountMax++;
            }
        });
        if(checkeds === 0){
            return alert('请勾选一个退货商品');
        }
        if(checkeds === detailNodes.length && selectCountMax === selectCount){
            confirm = window.confirm("系统将直接删除这条销售记录");
            details = 'null';
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

    function bindUItoPop(){
        pop.bd.find('.J-counter').unbind().bind('change', function (){
            var max = $(this).attr('data-max');
            var val = $(this).val();
            var price = $(this).attr('data-price');
            if($(this).parent().find('input[type=checkbox]').attr('checked')){
                $(this).parent().attr('data-detail', price+'*'+val);
            }
        });

        pop.bd.find('.detail input[type=checkbox]').unbind().bind('click', function (e){
            var select = $(this).parent().find('.J-counter');
            if(select.get(0)){
                if($(this).attr('checked')){
                    $(this).parent().attr('data-detail', select.attr('data-price')+"*"+select.val());
                }else{
                    $(this).parent().attr('data-detail', select.attr('data-price')+"*"+select.attr('data-max'));
                }
            }
        });
    }

    return {
        showPanel: function (data, callback){
            pop.show().hd.html(data.name+" 的退货");
            var detailHtml = '<div class="detailsBox">';
            $.each(data.details, function (i, detail){
                detail = detail.split('*');
                var uPrice = detail[0];
                var uCount = detail[1];
                var price = (detail[0]*1).toFixed(2)+'元';
                if(detail[1] < 2){
                    var count = detail[1]+"";
                }else{
                    count = '<select class="J-counter" data-max="'+detail[1]+'" data-price="'+(detail[0]*1)+'">';
                    for(var j= 1; j<=detail[1]; j++){
                        var selected = '';
                        if(j === uCount){
                            selected = 'selected';
                        }
                        count += '<option value="'+j+'" selected>'+j+'</option>';
                    }
                    count += '</select>';
                }
                count += ' 个';
                var checkbox = '<input type="checkbox" />';
                detailHtml += '<div class="detail" data-detail="'+uPrice+'*'+uCount+'">'+price+' x '+count+checkbox+'</div>';
            });
            detailHtml + '</div>';
            pop.bd.html(detailHtml);
            bindUItoPop();
            pop.ft.find('.btn1').unbind().bind('click', function (e){
                e.preventDefault();
                submitRefund(data, callback);
            });
            pop.syncStyle();
        }
    };
});
