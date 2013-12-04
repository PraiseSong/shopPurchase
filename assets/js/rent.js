/**
 * 录入租金模块
 * User: praise
 * Date: 10/27/13
 * Time: 1:47 PM
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module){
    var $ = require("zepto.min.js");
    var Util = require('utils.js');

    var promptTitle = '请设定今日租金';
    var defaultPrice = 70;
    var ioType = "post";
    var url = 'controler/rent.php';

    function query(){
        if(localRent = getLocalRent()){
            var date = new Date();
            var m = date.getMonth()+1;
            var d = date.getDate();

            date = date.getFullYear()+'-'+Util.to2Num(m)+'-'+Util.to2Num(d);
            //如果本地没有今日租金的记录
            if(localRent.date.indexOf(date) < 0){
                request();
            }
        }else{
            request();
        }

        function request(){
            $.ajax({
                type: ioType,
                url: url,
                dataType: "json",
                data: "action=query",
                success: function (data){
                    if(data.bizCode !== 1){
                        add();
                    }else if(data.bizCode === 1 && data.data && data.data.id){
                        saveToLocal(data.data);
                    }
                }
            });
        }
    }
    function add(){
        var rent = window.prompt(promptTitle, defaultPrice);
        if(rent){
            $.ajax({
                type: ioType,
                url: url,
                dataType: "json",
                data: 'action=add&price='+rent,
                success: function (data){
                    if(data.bizCode === 1 && data.data && data.data.id){
                        saveToLocal(data.data);
                    }
                }
            });
        }
    }
    function saveToLocal(data){
        localStorage.setItem('currentRent',JSON.stringify(data));
    }
    function getLocalRent(){
        var rent = localStorage.getItem('currentRent');
        rent && (rent = JSON.parse(rent));
        return rent;
    }
//    query();

    return {
        getRange: function (start, end, callback){
            callback || (callback = function (){});
            if(start && end){
                $.ajax({
                    type: ioType,
                    url: url,
                    dataType: "json",
                    data: "action=query&start="+start+"&end="+end+"",
                    success: function (data){
                        callback.call(callback, data);
                    }
                });
            }
        }
    };
});
