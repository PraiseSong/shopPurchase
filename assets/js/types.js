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
        new IO({
            url: api,
            data: "action=query",
            on: {
                success: function (data){
                    callback && callback.call(callback, data);
                    return false;
                }
            }
        }).send();
    }

    return {
        add: addType,
        query: queryTypes
    };
});