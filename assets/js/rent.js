/**
 * 录入租金模块
 * User: praise
 * Date: 10/27/13
 * Time: 1:47 PM
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module) {
    var $ = require("zepto.min.js");
    var IO = require("io.js");
    var Prompt = require("prompt.js");

    var promptObj = null;
    var ioType = "post";
    var url = 'rent.php';

    function add(callback) {
        if(!promptObj){
            promptObj = new Prompt({
                hd: "请输入当日租金",
                type: "number",
                placeholder: "租金",
                callback: function (){
                    if(rent = this.val()){
                        if (rent.indexOf(".") <= 0 && !/^\d+$/.test(rent)) {
                            navigator.notification.alert(
                                "租金输入错误",  // message
                                function () {
                                },         // callback
                                '小店记账宝',            // title
                                '知道了'                  // buttonName
                            );
                            return;
                        } else if (rent.indexOf(".") !== -1 && !/^\d+\.?\d+$/.test(rent)) {
                            navigator.notification.alert(
                                "租金输入错误",  // message
                                function () {
                                },         // callback
                                '小店记账宝',            // title
                                '知道了'                  // buttonName
                            );
                            return;
                        }
                        rent = rent * 1;
                        new IO({
                            url: url,
                            data: 'action=add&price=' + rent,
                            on: {
                                success: function (data) {
                                    callback && callback.call(callback, data);
                                }
                            }
                        }).send();
                    }
                }
            });
        }
        promptObj.render().show().syncStyle();
    }

    return {
        getRange: function (start, end, callback) {
            callback || (callback = function () {
            });
            if (start && end) {
                new IO({
                    url: url,
                    data: "action=query&start=" + start + "&end=" + end + "",
                    on: {
                        success: function (data) {
                            callback.call(callback, data);
                        }
                    }
                }).send();
            }
        },
        add: add
    };
});
