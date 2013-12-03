/**
 * Created by apple on 12/3/13.
 */
define(function (require, exports, module){
    var $ = require("zepto.min.js");
    var IO = require("io.js");
    var utils = require("utils.js");

    new IO({
        url: "controler/userAuth.php",
        on: {
            success: function (data){
                if(data.data && data.data.user && data.data.user.user_id){
                    initPage();
                    return ;
                }
            },
            error: function (){
                alert("获取用户信息时发生异常，请重新登录");
                location.href = "login.html";
            }
        }
    }).send();

    function initPage(){
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
            $('.header .box').html(start+"-"+end+" 报表");
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
            queryBtn.unbind();
            $('.tip').show().css({
                color: "inherit"
            }).html("查询中...");
            var perf = require("performance.js");
            perf.io({
                range: true,
                data: "start="+getStartTIme()+'&end='+getEndTIme(),
                on: {
                    success: function (data){
                        $('.tip').hide();
                        queryBtn.bind('click', queryPerf);
                        console.log(data);
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

        var queryBtn = $('#J-queryBtn');

        $('#J-dateStart').bind('blur', function (){
            if(getStartTIme() && !getEndTIme()){
                $('#J-dateEnd').val(getStartTIme());
            }
        });
        queryBtn.bind('click', queryPerf);
        setDate();
    }
});
