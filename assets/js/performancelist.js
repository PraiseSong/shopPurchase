/**
 * Created by apple on 12/3/13.
 */
define(function (require, exports, module){
    var $ = require("zepto.min.js");
    var IO = require("io.js");
    var utils = require("utils.js");
    var Rent = require("rent.js");

    window.alert = function (msg){
        navigator.notification.alert(
            msg,  // message
            function (){},         // callback
            '小店记账宝',            // title
            '知道了'                  // buttonName
        );
    };

    function initPage(){
        var rents = {};

        function setDate(){
            var today = new Date();
            var y = today.getFullYear();
            var m = utils.to2Num(today.getMonth()+1);
            var d = utils.to2Num(today.getDate());
            var startNode = $('#J-dateStart');
            var endNode = $('#J-dateEnd');
            var date = y+"-"+m+"-"+d;
            startNode.val(date);
            endNode.val(date);
            updateTitle(m+"."+d, m+"."+d);
        }
        function updateTitle(start, end){
            $('.header .title').html(start+"-"+end+" 报表");
        }
        function getStartTIme(){
            var val = $.trim($('#J-dateStart').val());
            if(!val){
                return null;
            }
            return val.replace(/\//g, '-');
        }

        function getEndTIme(){
            var val = $.trim($('#J-dateEnd').val());
            if(!val){
                return null;
            }
            return val.replace(/\//g, '-');
        }
        function queryPerf(){
            if(!getStartTIme()){
                return alert('请选择开始时间');
            }else if(!getEndTIme()){
                return alert('请选择结束时间');
            }
            var start = getStartTIme()['split']('-');
            var end = getEndTIme()['split']('-');
            if(start[0] !== end[0]){
                return alert("暂时不支持跨年度查询");
            }else if((start[0] === end[0]) && (start[1] > end[1])){
                return alert('结束时间小于开始时间');
            }else if((start[0] === end[0]) && (start[1] === end[1]) && (start[2] > end[2])){
                return alert('结束时间小于开始时间');
            }

            queryBtn.unbind();
            $('.tip').show().css({
                color: "inherit"
            }).html("查询中...");
            updateTitle(start[1]+"."+start[2],end[1]+"."+end[2]);
            var perf = require("performance.js");
            perf.io({
                range: true,
                data: "action=query&start="+getStartTIme()+'&end='+getEndTIme(),
                on: {
                    success: function (data){
                        if(data.bizCode !== 1){
                            $('.tip').show().css({
                                color: "#f50"
                            }).html(data.memo);
                            queryBtn.bind('click', queryPerf);
                            return;
                        }else if(data.data.products && data.data.products.length === 0){
                            $('.tip').show().css({
                                color: "#f50"
                            }).html("没有销售记录");
                            data.yye = 0;
                            data.cb = 0;
                        }else{
                            $('.tip').hide();
                        }
                        queryBtn.bind('click', queryPerf);
                        Rent.getRange(getStartTIme(), getEndTIme(), function (rentData){
                            if (data.data.products && data.data.products.length === 0) {
                                data.zj = 0;
                            }
                            if(rentData.data && rentData.data.rents && rentData.data.rents.length >= 1){
                                $.each(rentData.data.rents, function (i, rent){
                                    data.zj += rent.price*1;
                                    rents[rent.date.split(' ')[0]] = rent.price*1;
                                });
                            }
                            data.lr = data.yye - data.cb - data.zj;
                            updatePage(data);
                        });
                    },
                    error: function (){
                        $('.tip').show().css({
                            color: "#f50"
                        }).html("请求发生异常，请重试");
                        queryBtn.bind('click', queryPerf);
                    }
                }
            });
        }

        function updatePage(data){
            $('.perf').show();
            $('.charts').empty().show();
            $('.types').empty().show();

            var zj = data.zj.toFixed(2).split('.');
            var lr = data.lr.toFixed(2).split('.');
            var cb = data.cb.toFixed(2).split('.');
            var yye = data.yye.toFixed(2).split('.');
            $('#J-yye').html(yye[0]+"<small>."+yye[1]+"</small>元");
            $('#J-cb').html(cb[0]+"<small>."+cb[1]+"</small>元");
            $('#J-lr').html(lr[0]+"<small>."+lr[1]+"</small>元");
            $('#J-zj').html(zj[0]+"<small>."+zj[1]+"</small>元");


            var typesHtml = '';
            for(i in data.types){
                if(data.types[i].length >= 1){
                    typesHtml += '<p>'+i+':  '+data.types[i]['length']+' 个</p>';
                }
            }
            $('.types').html(typesHtml);

            var dateTypeHtml = '';
            var lrs = [];
            for(k in data.dateType){
                if(!rents[k]){
                    rents[k] = 0;
                }
                data.dateType[k]['lr'] -= rents[k];
                lrs.push(data.dateType[k]['lr']);
            }
            for(k in data.dateType){
                var date = k.split('-');
                var lr = data.dateType[k]['lr'].toFixed(2).split('.');
                var background = '';
                if(data.dateType[k]['lr'] >= Math.max.apply( Math, lrs)){
                    background = "background: #f50;";
                }
                var w = getWidth(data.dateType[k]['lr']);
                dateTypeHtml += '<li class="chart"><a href="productlist.html?date='+(data.dateType[k][0]['date'].split(' ')[0])+'" class="trigger" target="_blank">'+
                    '<div class="back"></div>'+
                    '<div class="front" style="width: '+w+';'+background+'">'+
                   '     <p>'+(date[1]+"-"+date[2])+'</p>'+
                  '      <p>纯利：'+lr[0]+'<small>.'+lr[1]+'</small> 元</p>'+
                 '   </div></a>'+
                '</li>';
            }
            $('.charts').html(dateTypeHtml);
            function getWidth(w){
                var max = Math.max.apply( Math, lrs);
                var width = 0;
                width = (w / max)*100;
                if(width >= max){
                    width = 100;
                }else if(width <= 35){
                    width = 35*(w / max);
                    if(width < 0){
                        width *= 100;
                    }else if(width > 0 && width < 10){
                        width *= 10;
                    }
                }

                if(width < 35){
                    width = 35;
                }

                if(w <= 0){
                    width = 33.5;
                }

                return width + '%';
            }
        }

        var queryBtn = $('#J-queryBtn');

        $('#J-dateStart').bind('blur', function (){
            if(getStartTIme() && !getEndTIme()){
                $('#J-dateEnd').val(getStartTIme());
            }
        });
        queryBtn.bind('click', queryPerf);
        setDate();
    }

    initPage();
});
