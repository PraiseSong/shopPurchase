/**
 * Created with JetBrains PhpStorm.
 * User: praise
 * Date: 10/19/13
 * Time: 11:41 PM
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module){
    var $ = require('zepto.min.js');

    var AjaxForm = function (cfg){
        var defCfg = {
            node: null,
            items: {},
            showErrorMsg: function (){}
        };
        for(i in defCfg){
            if(cfg[i]){
                defCfg[i] = cfg[i];
            }
        }
        this.cfg = defCfg;
        this.init();
    };
    AjaxForm.prototype = {
        init: function (){
            var node = this.cfg.node;
            this.fields = node.find('*[name]');
            this.validated = false;
            this.errorMsg = [];
        },
        submit: function (start, success, error){
            this.errorMsg = [];

            if(this.validator()){
                this.errorMsg = [];
                var data = [];
                $.each(this.fields, function (i, field){
                    var name = $(field).attr('name');
                    var val = $.trim($(field).val());
                    data.push(name+"="+encodeURI(val));
                });
                start && start();
                $.ajax({
                    timeout: 3000,
                    url: this.cfg.node.attr("action"),
                    dataType: "json",
                    data: data.join("&"),
                    type: this.cfg.node.attr("method"),
                    success: success,
                    error: error
                });
            }else{
                this.cfg.showErrorMsg.call(this, this.errorMsg);
            }
        },
        validator: function (){
            var self = this;
            var validated = 0;
            $.each(this.fields, function (i, field){
                var name = $(field).attr('name');
                var val = $.trim($(field).val());
                var rules = self.cfg.items[name];
                if(rules){
                    var min = rules.min,
                        max = rules.max,
                        pattern = rules.pattern,
                        equal = null,
                        msg = rules.errorMsg;

                    if(rules.equal !== undefined){
                        equal = $.trim(rules.equal.val());
                    }

                    if(!val){
                        Alert.call(self, msg.empty);
                    }else if(min && val.length < min){
                        Alert.call(self, msg.min);
                    }else if(max && val.length > max){
                        Alert.call(self, msg.max);
                    }else if(pattern && !new RegExp(pattern).test(val)){
                        Alert.call(self, msg.pattern);
                    }else if(equal && val !== equal){
                        Alert.call(self, msg.equal);
                    }else{
                        validated++;
                    }
                }
            });

            validated === this.fields.length ? (this.validated = true) : (this.validated = false);
            return this.validated;
        },
        getErrorMsg: function (){
            return this.errorMsg;
        }
    };

    function Alert(msg){
        this.errorMsg.push(msg);
    }

    return AjaxForm;
});