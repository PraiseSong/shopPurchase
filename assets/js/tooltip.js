/**
 * Created by apple on 11/24/13.
 */
define(function (require, exports, module){
    var $ = require('zepto.min.js');

    var Tooltip = function (cfg){
        var defCfg = {
            node: null
        };
        for(i in defCfg){
            if(cfg[i]){
                defCfg[i] = cfg[i];
            }
        }
        this.cfg = defCfg;
        this.render();
    };
    Tooltip.prototype = {
        render: function (){
            if(title = $(this.cfg.node).attr("data-title")){
                this.title = title;
                this.bindUI();
            }
        },
        bindUI: function (){
            var self = this;
            $(this.cfg.node).unbind("focus").bind("focus", function (){
                self.show();
            });
            $(this.cfg.node).unbind("blur").bind("blur", function (){
                self.hide();
            });
        },
        show: function (){
            var xy = $(this.cfg.node).offset();
            var id = "tooltip"+new Date().getTime();
            var origin = $(this.cfg.node).attr("data-tooltip");
            if(origin && $('#'+origin+'').get(0)){
                $('#'+origin+'').remove();
                id = origin;
            }
            $(this.cfg.node).attr("data-tooltip", id).parent().append('<span class="tooltip" id="'+id+'">'+this.title+'</span>');
            var extraTop = 30;
            $('#'+id+'').css({
                left: xy.left + 10,
                top: xy.top - extraTop,
                "display": "block"
            });
            this.tip = $('#'+id+'');
        },
        hide: function (){
            this.tip.remove();
        }
    };

    return Tooltip;
});
