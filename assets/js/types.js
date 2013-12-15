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

    var api = 'controler/types.php';

    function addType(name, callback){
        var self = this;
        new IO({
            url: api,
            data: "action=add&name="+encodeURI(name),
            on: {
                success: function (data){
                    callback && callback.call(callback, data);
                }
            }
        }).send();
    }

    function queryTypes(callback){
        if(types = localStorage.getItem("types")){
            types = JSON.parse(types);
            callback && callback.call(callback, types);
            return false;
        }
        new IO({
            url: api,
            data: "action=query",
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
        //localStorage.setItem("types", JSON.stringify(data));
    }

    return {
        add: addType,
        query: queryTypes
    };
});