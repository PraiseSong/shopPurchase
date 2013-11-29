/**
 * Created with JetBrains PhpStorm.
 * User: praise
 * Date: 10/19/13
 * Time: 11:41 PM
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module){
    var $ = require('zepto.min.js');

    var IO = function (cfg){
        var defaultCfg = {
            url: null,
            dataType: "json",
            type: "post",
            data: null,
            cache: false,
            on: {
                start: function (){},
                success: function (){},
                error: function (){}
            }
        };
        cfg.on && ($.extend(defaultCfg.on, cfg.on));
        if(cfg.url){
            defaultCfg.url = cfg.url;
        }
        if(cfg.dataType){
            defaultCfg.dataType = cfg.dataType;
        }
        if(cfg.type){
            defaultCfg.type = cfg.type;
        }
        if(cfg.data){
            defaultCfg.data = cfg.data;
        }
        if(cfg.cache !== undefined){
            defaultCfg.cache = cfg.cache;
        }
        this.cfg = defaultCfg;
    };
    IO.prototype = {
        start: function (){
            this.cfg.on.start.call(this);
        },
        success: function (data){
            var extraResult = this.cfg.on.success.call(this, data);
            if(extraResult !== false && data.bizCode === 0 && data.data && data.data.redirect && data.data.redirect.indexOf("login") !== -1){
                var loginUI = require("loginUI.js");
                if(loginUI.ui){
                    loginUI.ui.show();
                    loginUI.ui.syncStyle();
                }
            }
        },
        error: function (data){
            this.cfg.on.error.call(this, data);
        },
        send: function (){
            this.start();

            var self = this;

            if(this.cfg.cache === false){
                if(/\?/.test(this.cfg.url)){
                    this.cfg.url+="t="+new Date().getTime();
                }else{
                    this.cfg.url+="?t="+new Date().getTime();
                }
            }
            this.ajaxObj = $.ajax({
                timeout: 3000,
                url: this.cfg.url,
                dataType: this.cfg.dataType,
                data: this.cfg.data,
                type: this.cfg.type,
                success: function (data){self.success(data);},
                error: function (data){self.error(data);}
            });
        },
        abort: function (){
            this.ajaxObj.abort();
        }
    };

    return IO;
});
