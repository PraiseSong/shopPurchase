/**
 * Created with JetBrains PhpStorm.
 * User: praise
 * Date: 10/31/13
 * Time: 2:06 PM
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module){
    var Widgets = require('widgets.js');
    var $ = require('zepto.min.js');

    var api = 'controler/querySold.php';
    var cb = 0;//成本
    var lr = 0;//利润
    var yye = 0;//营业额

    function success(data){
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
    }

    return {
        io: function (cfg){
                var defaultCfg = {
                    range: false,//是否按范围获取
                    data: null,
                    on: {
                        success: function (data){},
                        error: function (data){}
                    }
                };
                cfg.on && $.extend(defaultCfg.on, cfg.on);
                if(cfg.data){
                    defaultCfg.data = cfg.data;
                }
                new Widgets.IO({
                    data: defaultCfg.data,
                    url: api,
                    on: {
                        success: function (data){
                            if(data.bizCode){
                                if(cfg.range){
                                    var cb = 0;
                                    var lr = 0;
                                    var yye = 0;
                                    $.each(data.data, function (i, o){
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
                                        defaultCfg.on.success.call(this, {
                                            cb: cb,
                                            lr: lr,
                                            yye: yye
                                        });
                                    });
                                }else{
                                    success(data.data);
                                    defaultCfg.on.success.call(this, {
                                        cb: cb,
                                        lr: lr,
                                        yye: yye
                                    });
                                }
                            }
                        },
                        error: function (data){
                            defaultCfg.on.error.call(this, data);
                        }
                    }
                }).send();
        }
    };
});
