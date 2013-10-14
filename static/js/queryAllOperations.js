/**
 * Created with JetBrains PhpStorm.
 * User: praise
 * Date: 10/11/13
 * Time: 8:41 PM
 * To change this template use File | Settings | File Templates.
 */
$(function (){
    var btn = $('#J-queryBtn');
    var startDate = $('#J-date-start');
    var endDate = $('#J-date-end');
    var api = 'controler/queryTodayOperation.php';
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
        if(getStartTIme()){
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
                if(data.code*1 === 1){
                    if(data.products){
                        renderSelledProducts(data.products);
                    }
                }
            },
            dataType: "json"
        });
    }

    function getAttachment(id){
        var attachments = localStorage.getItem('attachments');
        if(attachments){
            attachments = JSON.parse(attachments);
        }else{
            return null;
        }

        return attachments[id];
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
            var p_pic = getAttachment(p.p_id);
            $.each(pdata, function (i, prod){
                var detail = prod.detail.split('|');
                var counter = 0;
                $.each(detail, function (j, _det){
                    _det = _det.split('*');
                    if(_det[1]){
                        counter += _det[1]*1;
                    }
                });
                html += '<li data-id="'+prod.order_id+'">'+
                    '<div class="imgBox"><img src="'+p_pic+'" /></div>'+
                    '<div class="info">'+
                    '<p class="pName">'+p_name+'</p>'+
                    '<div class="extra">'+
                    '<p class="kcBox">销售量：<span>'+counter+'</span> 个</p>'+
                    '</div>'+
                    '</li>';
            });
        }
        html += '</ul>';
        $('.selled-products-box').append(html);
    }

    function beforeQuery(){
        dateName.html(getStartTIme()+' 到 '+getEndTIme()+'  ');
        loadingImg.show();
    }

    function queryOperation(){
        beforeQuery();
        $.ajax({
            url: api,
            dataType: "json",
            data: "start="+getStartTIme()+'&end='+getEndTIme(),
            type: "POST",
            success: function (data){
                loadingImg.hide();
                if(data.code){
                    renderOperation(data.result);
                }
            }
        });

        function renderOperation(data){
            var cb = 0;
            var lr = 0;
            var yye = 0;
            $.each(data, function (i, o){
                var price = o.p_price * 1;
                var detail = o.detail.split('|');
                $.each(detail, function (j, d){
                    if(d){
                        var de = d.split('*');
                        var selledPrice = de[0];
                        var selledCount = de[1];
                        yye += selledPrice * selledCount;
                        cb += price * selledCount;
                    }
                });
            });

            yyeNode.html(yye);
            cbNode.html(cb);
            lrNode.html((yye-cb).toFixed(2));
        }
    }
});
