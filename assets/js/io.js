/**
 * Created with JetBrains PhpStorm.
 * User: praise
 * Date: 10/19/13
 * Time: 11:41 PM
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module){
    var $ = require('zepto.min.js');
    var Utils = require('utils.js');

    var user = localStorage.getItem("user");
    if (user) {
        user = JSON.parse(user);
    }

    var IO = function (cfg){
        var defaultCfg = {
            timeoutcallback: function (){},
            url: null,
            dataType: "json",
            type: "post",
            data: "",
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
            //defaultCfg.type = cfg.type;
        }
        if(cfg.data){
            defaultCfg.data = cfg.data;
        }
        if(cfg.cache !== undefined){
            defaultCfg.cache = cfg.cache;
        }
        if(cfg.timeoutcallback){
            defaultCfg.timeoutcallback = cfg.timeoutcallback;
        }
        this.cfg = defaultCfg;
    };
    IO.prototype = {
        start: function (){
            this.cfg.on.start.call(this);
        },
        success: function (data){
            //安全验证不通过
            if(data.bizCode === 4){
            }
            this.cleanerTimerouter();
	        PhoneGap.exec("成功: "+this.cfg.url, JSON.stringify(data));
	   
            this.cfg.on.success.call(this, data);
        },
        error: function (data){
            this.cleanerTimerouter();
			PhoneGap.exec("失败: "+this.cfg.url, JSON.stringify(data));
        },
        noConnect: function (data){
            navigator.notification.alert(
                "请检查您的网络连接！",  // message
                function (){},         // callback
                '小店记账宝',            // title
                '知道了'                  // buttonName
            );

            this.cleanerTimerouter();
            this.cfg.on.error.call(this, data);
        },
        cleanerTimerouter: function (){
            this.timeouter && clearInterval(this.timeouter);
        },
        send: function (){
            if (!Utils.network()) {
                this.noConnect(this, {bizCode: 0, memo: "请检查您的网络连接！", data:{}});
                return false;
            }

	        PhoneGap.exec("发送: "+this.cfg.url, JSON.stringify(this.cfg.data));
            this.start();

            var self = this;

            if(!user && this.cfg.url.indexOf("login") < 0 && this.cfg.url.indexOf("register") < 0){
                return self.success({
                    bizCode: 0,
                    memo: "没有用户信息",
                    data: []
									
                });
            }
            if(this.cfg.data){
                this.cfg.data += '&username='+ encodeURI(user.username)+'&localpassword='+user.hash_pw+'&api='+this.cfg.url;
            }else{
                this.cfg.data += 'username='+ encodeURI(user.username)+'&localpassword='+user.hash_pw+'&api='+this.cfg.url;
            }

            this.startTimeout = 1;

            this.ajaxObj = $.ajax({
                url: 'http://jzb.rib.hk/client.php'+"?t="+new Date().getTime(),
                dataType: this.cfg.dataType,
                data: this.cfg.data,
                type: this.cfg.type,
                success: function (data){self.success(data);},
                error: function (data){self.error(data);}
            });
            this.timeouter = setInterval(function (){
                self.startTimeout++;
                if(self.startTimeout > 30){
                    self.timeoutCallback();
                }
            }, 1000);
        },
        timeoutCallback: function (){
            PhoneGap.exec("超时");

            this.timeouter && clearInterval(this.timeouter);
            this.cfg.timeoutcallback && this.cfg.timeoutcallback.call(this, {});
            this.abort();
        },
        abort: function (){
            this.ajaxObj.abort();
        }
    };

    return IO;
});
