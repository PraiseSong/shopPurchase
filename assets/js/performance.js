/**
 * Created with JetBrains PhpStorm.
 * User: praise
 * Date: 10/31/13
 * Time: 2:06 PM
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module) {
    var $ = require('zepto.min.js');
    var IO = require('io.js');

    var api = 'performance.php';

    return {
        io: function (cfg) {
            var defaultCfg = {
                range: true,//是否按范围获取
                data: null,
                on: {
                    success: function (data) {
                    },
                    error: function (data) {
                    }
                }
            };
            cfg.on && $.extend(defaultCfg.on, cfg.on);
            if (cfg.data) {
                defaultCfg.data = cfg.data;
            }
            new IO({
                data: defaultCfg.data,
                url: api,
                on: {
                    success: function (data) {
                        var cb = 0;
                        var lr = 0;
                        var yye = 0;
                        var zj = 0;
                        var dateType = {};
                        var types = {};

                        if (data.bizCode === 1 && data.data.products && data.data.products.length >= 1) {
                            var typesData = JSON.parse(localStorage.getItem("types"));
                            typesData = typesData.data.types;
				   
                            $.each(data.data.products, function (i, o) {
                                $.each(typesData, function (k, td) {
                                    if (td.id == o.type) {
                                        o.type = td.name;
                                        return false; 
                                    }
                                });
                                var price = o.p_price * 1;
                                var detail = o.detail.split('|');
                                var type = o.type;
                                var date = o.date.split(' ');

                                !dateType[date[0]] && (dateType[date[0]] = []);
                                dateType[date[0]]['push'](o);

                                !dateType[date[0]]['lr'] && (dateType[date[0]]['lr'] = 0);
                                !types[type] && (types[type] = []);

                                for (var k = 0; k < (o.p_count * 1); k++) {
                                    types[type]['push'](o);
                                }
                                $.each(detail, function (j, d) {
                                    if (d) {
                                        var de = d.split('*');
                                        var selledPrice = de[0];
                                        var selledCount = de[1];
                                        yye += selledPrice * selledCount;
                                        cb += price * selledCount;
                                        dateType[date[0]]['lr'] += (selledPrice * selledCount) - (price * selledCount);
                                    }
                                });
                            });
                        }

                        data.cb = cb;
                        data.lr = lr;
                        data.yye = yye;
                        data.zj = zj;
                        data.dateType = dateType;
                        data.types = types;
                        defaultCfg.on.success.call(this, data);
                    },
                    error: function (data) {
                        defaultCfg.on.error.call(this, data);
                    }
                }
            }).send();
        }
    };
});

