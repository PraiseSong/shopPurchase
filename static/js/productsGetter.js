/**
 * Created with JetBrains PhpStorm.
 * User: praise
 * Date: 10/26/13
 * Time: 9:39 AM
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module){
    var $ = require('zepto.min.js');
    var Widgets = require('widgets.js');

    var pop = null;

    var noData = function (){
        $.Alert('没有更新的数据');
    };

    var productList = {
        send: function (){
            productList.dl = productList.dl || new Widgets.DataList({
                container: productList.container,
                template: productList.tem,
                ajaxCfg: {
                    url: productList.url,
                    data: productList.data
                },
                on: {
                    noData: noData,
                    start: function (){
                        if(productList.callbacks && productList.callbacks.start){
                            productList.callbacks.start.call(this);
                        }
                    },
                    success: function (data){
                        if(productList.callbacks && productList.callbacks.success){
                            productList.callbacks.success.call(this, data);
                        }
                    },
                    failure: function (data){
                        if(productList.callbacks && productList.callbacks.failure){
                            productList.callbacks.failure.call(this, data);
                        }
                    },
                    error: function (){
                        if(productList.callbacks && productList.callbacks.error){
                            productList.callbacks.error.call(this);
                        }
                    },
                    filter: function (data){
                        if(productList.callbacks && productList.callbacks.filter){
                            return productList.callbacks.filter.call(this, data);
                        }
                    },
                    bindUI: function (){
                        if(productList.callbacks && productList.callbacks.bindUI){
                            return productList.callbacks.bindUI.call(this);
                        }
                    }
                }
            });
            productList.dl.send();
        }
    };

    return productList;
});
