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

    function beforeQuery(){
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
