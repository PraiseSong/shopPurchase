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
    var defaultPrice = 0;
    var ioType = "post";
    var url = 'controler/rent.php';

    function add(callback){
        var rent = window.prompt(promptTitle, defaultPrice);
        if(rent){
            if(rent.indexOf(".") <= 0 && !/^\d+$/.test(rent)){
                return alert("租金输入错误");
            }else if(rent.indexOf(".") !== -1 && !/^\d+\.?\d+$/.test(rent)){
                return alert("租金输入错误");
            }
            rent = rent*1;
            $.ajax({
                type: ioType,
                url: url,
                dataType: "json",
                data: 'action=add&price='+rent,
                success: function (data){
                    callback && callback.call(callback, data);
                }
            });
        }
    }

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
        },
        add: add
    };
});
