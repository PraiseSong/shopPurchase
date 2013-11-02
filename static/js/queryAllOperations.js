/**
 * Created with JetBrains PhpStorm.
 * User: praise
 * Date: 10/11/13
 * Time: 8:41 PM
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module){
    var $ = require('zepto.min.js');
    var Widgets = require('widgets.js');
    var Operation = require("operation.js");
    var Util = require('util.js');

    var btn = $('#J-queryBtn');
    var startDate = $('#J-date-start');
    var endDate = $('#J-date-end');
    var loadingImg = $('.loadingImg');
    var dateName = $('.dateName');

    var yyeNode = $('.yye'),
        lrNode = $('.lr'),
        cbNode = $('.cb');

    function getStartTIme(){
        var val = $.trim(startDate.val());
        if(!val){
            return null;
        }
        return val.replace(/\//g, '-');
    }

    function getEndTIme(){
        var val = $.trim(endDate.val());
        if(!val){
            return null;
        }
        return val.replace(/\//g, '-');
    }

    startDate.bind('change', function (){
        if(getStartTIme() && !getEndTIme()){
            endDate.val(getStartTIme());
        }
    });

    btn.bind('click', function (e){
        e.preventDefault();
        if(!getStartTIme()){
            return alert('请选择开始时间');
        }else if(!getEndTIme()){
            return alert('请选择结束时间');
        }
        queryOperation();
    });

    $('#J-show-selled-products').bind('click', function (e){
        e.preventDefault();
        if(!getStartTIme()){
            return alert('请选择开始时间');
        }else if(!getEndTIme()){
            return alert('请选择结束时间');
        }
        queryProducts();
    });

    function queryProducts(){
        var api = 'controler/queryProducts.php';
        $.ajax({
            url: api,
            type: 'post',
            data: 'action=custom&'+"start="+getStartTIme()+'&end='+getEndTIme(),
            success: function (data){
                if(data.bizCode*1 === 1){
                    if(data.data.products){
                        renderSelledProducts(data.data);
                    }
                }
            },
            dataType: "json"
        });
    }

    function renderSelledProducts(data){
        var html = '<ul>';
        for(d in data.products){
            var pdata = data.products[d];
            var p = data[d][0];
            if(!p){
                continue;
            }
            var p_price = p.p_price*1;
            var p_name = p.p_name;
            var orderId = [];
            var counter = 0;
            $.each(pdata, function (i, prod){
                var detail = prod.detail.split('|');
                $.each(detail, function (j, _det){
                    _det = _det.split('*');
                    if(_det[1]){
                        counter += _det[1]*1;
                    }
                });
                orderId.push(prod.order_id);
            });
            html += '<li data-id="'+orderId.join(',')+'">'+
                '<div class="imgBox"><img data-src="'+ p.p_pic+'" / data-id="'+ p.p_id+'"></div>'+
                '<div class="info">'+
                '<p class="pName">'+p_name+'</p>'+
                '<div class="extra">'+
                '<p class="kcBox">销售量：<span>'+counter+'</span> 个</p>'+
                '</div>'+
                '</li>';
        }
        html += '</ul>';
        $('.selled-products-box').find('ul').remove();
        $('.selled-products-box').append(html);
        Util.queryBase64($('.selled-products-box').find('.imgBox img'));
    }

    function beforeQuery(){
        dateName.html(getStartTIme()+' 到 '+getEndTIme()+'  ');
        loadingImg.show();
    }

    function queryOperation(){
        beforeQuery();

        Operation.io({
            range: true,
            data: "start="+getStartTIme()+'&end='+getEndTIme(),
            on: {
                success: function (data){
                    loadingImg.hide();
                    renderOperation(data);
                },
                error: function (){

                }
            }
        });

        function renderOperation(data){
            yyeNode.html(data.yye.toFixed(2));
            cbNode.html(data.cb.toFixed(2));
            lrNode.html((data.yye-data.cb).toFixed(2));
        }
    }
});
