/**
 * Created with JetBrains PhpStorm.
 * User: praise
 * Date: 11/2/13
 * Time: 11:16 AM
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module){
    var $ = require('zepto.min.js');
    var IO = require('io.js');

    var api = 'types.php';

    function addType(name, callback, timeoutcallback){
        var self = this;
        var io = new IO({
            url: api,
            data: "action=add&name="+encodeURI(name),
            timeoutcallback: function (){
                navigator.notification.alert(
                    "处理超时，请重试",  // message
                    function () {
                        timeoutcallback && timeoutcallback.call(this);
                    },         // callback
                    '添加分类',            // title
                    '知道了'                  // buttonName
                );
            },
            on: {
                success: function (data){
			       if(data.bizCode === 1 && data.data && data.data.id){
			         localStorage.removeItem("types");
                   }else{
                       navigator.notification.alert(
                           data.memo,  // message
                           function () {
                           },         // callback
                           '添加分类',            // title
                           '知道了'                  // buttonName
                       );
                   }
				   callback && callback.call(callback, data);
                },
                error: function (data){
                    navigator.notification.alert(
                        data.memo,  // message
                        function () {
                        },         // callback
                        '添加分类',            // title
                        '知道了'                  // buttonName
                    );
                }
            }
        });
        io.send();
        return io;
    }

    function queryTypes(callback, timeoutcallback){
        if(types = localStorage.getItem("types")){
            types = JSON.parse(types);
            callback && callback.call(callback, types);
            return false;
        }
        new IO({
            url: api,
            data: "action=query",
            timeoutcallback: function (){
                timeoutcallback && timeoutcallback.call(this);
            },
            on: {
                success: function (data){
                    if(data.bizCode === 1 && data.data && data.data.types.length >= 1){
                        sava2local(data);
                    }
                    callback && callback.call(callback, data);
                    return false;
                }
            }
        }).send();
    }

    function sava2local(data){
        localStorage.setItem("types", JSON.stringify(data));
    }

    return {
        add: addType,
        query: queryTypes,
        clear: function(){
            localStorage.removeItem("types");
        }
    };
});