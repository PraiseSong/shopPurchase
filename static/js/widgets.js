/**
 * Created with JetBrains PhpStorm.
 * User: praise
 * Date: 9/22/13
 * Time: 9:10 PM
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module) {
    var $ = require('zepto.min.js');

    $.Widgets = function (){};
    $.Widgets.prototype = {
        show: function (){},
        render: function (){},
        hide: function (){},
        bindUI: function (){}
    };

    $.extends = function (sub, par){
        $.each(par.prototype, function (i, p){
            if(typeof p === 'function'){
                sub.prototype[i] = p;
            }
        })
    };

    /**
     * Pop
     * @param cfg
     * @constructor
     */
    $.Pop = function (cfg){
        this.cfg = cfg || {};
        this.id = 'pop'+new Date().getTime();
    };
    $.extends($.Pop, $.Widgets);
    $.Pop.prototype.renderBox = function (){
        var body = $('body');
        body.append('<div class="J-Pop-container" id="'+this.id+'"></div>');
        $('#'+this.id+'').css({
            display: 'none'
        });
        this.container = $('#'+this.id+'');
    };
    $.Pop.prototype.renderHd = function (){
        var container = this.container;
        if(container.find('.J-Pop-hd').get(0)){
            container.find('.J-Pop-hd').remove();
        }
        container.append('<header class="J-Pop-hd">header</header>');
        container.find('.J-Pop-hd').css({
            padding: 20,
            textAlign: "center",
            fontSize: 15,
            fontWeight: 700,
            borderBottom: '1px solid rgb(187, 187, 187)'
        });
        this.hd = container.find('.J-Pop-hd');
    };
    $.Pop.prototype.renderBd = function (){
        var container = this.container;
        if(container.find('.J-Pop-bd').get(0)){
            container.find('.J-Pop-bd').remove();
        }
        var h = this.cfg.styles ? this.cfg.styles.height : 100;
        container.append('<section class="J-Pop-bd">'+this.renderHTML()+'</section>');
        container.find('.J-Pop-bd').css({
            padding: 20,
            height: h,
            overflow: "auto"
        });

        this.bd = container.find('.J-Pop-bd');
    };
    $.Pop.prototype.renderFt = function (){
        var container = this.container;
        var html = '';
        var isCloseBtn = false;
        var btns = this.cfg.btns;
        if(btns){
            if(btns.length === 1){
                isCloseBtn = true;
            }
            $.each(btns, function (i, btn){
                html += '<a class="btn btn'+(i+1)+' '+(isCloseBtn ? "close" : "")+'">'+btn+'</a>';
            });
        }else{
            html += '<a class="btn btn1">确定</a>';
            html += '<a class="btn btn2 close">取消</a>';
        }
        if(container.find('.J-Pop-ft').get(0)){
            container.find('.J-Pop-ft').remove();
        }
        container.append('<footer class="J-Pop-ft">'+html+'</footer>');
        container.find('.J-Pop-ft').css({
            display: "-webkit-box",
            borderTop: '1px solid rgb(187, 187, 187)'
        });
        container.find('.J-Pop-ft .btn').css({
            display: "block",
            textDecoration: "none",
            color:  "rgb(6, 67, 107)",
            fontSize: 14,
            textAlign: "center",
            height: 40,
            lineHeight: '40px',
            '-webkit-box-flex': '1',
            cursor: "pointer",
            '-webkit-border-radius': "0"
        });
        var btn = container.find('.J-Pop-ft .btn');
        $.each(btn, function (i, n){
            if(i !== 0){
                $(n).css({
                    borderLeft: '1px solid rgb(187, 187, 187)'
                });
            }
        });
        this.ft = container.find('.J-Pop-ft');
    };
    $.Pop.prototype.renderMask = function (){
        var body = $('body');
        if(!body.find('.J-mask').get(0)){
            body.append('<div class="J-mask"></div>');
        }
        $('.J-mask').css({
            display: 'none'
        });
    };
    $.Pop.prototype.renderHTML = function (){
        var html = 'body';

        return html;
    };
    $.Pop.prototype.adjustStyle = function (){
        var viewPortH = 0;

        if($(document).height() <= $(window).height()){
            viewPortH = $(window).height();
        }else{
            viewPortH = $(document).height();
        }

        if(this.cfg.styles && this.cfg.styles.width){
            var containerW = this.cfg.styles.width;
        }else{
            containerW = 240;
        }
        $('.J-mask').css({
            background: 'rgba(0, 0, 0, .5)',
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 100,
            width: "100%",
            height: viewPortH
        });
        this.container.css({
            width: containerW,
            background: '#fff',
            position: "absolute",
            top: (viewPortH-244)/2+window.scrollY,
            left: ($(window).width()-containerW)/2,
            zIndex: 999999999,
            '-webkit-border-radius': "5px",
            color: "#333",
            lineHeight: '22px'
        });
    };
    $.Pop.prototype.syncStyle = function (){
        var viewPortH = 0;
        var docH = 0;

        if($(document).height() <= $(window).height()){
            viewPortH = $(window).height();
            docH = $(window).height();
        }else{
            viewPortH = $(window).height();
            docH = $(document).height();
        }

        if(this.cfg.styles && this.cfg.styles.width){
            var containerW = this.cfg.styles.width;
        }else{
            containerW = 240;
        }
        $('.J-mask').css({
            height: docH
        });
        this.container.css({
            top: (viewPortH-this.container.height())/2+window.scrollY,
            left: ($(window).width()-containerW)/2
        });
    };
    $.Pop.prototype.bindUI = function (){
        var cfg = this.cfg;
        var self = this;
        cfg.bindUI && cfg.bindUI.call(this);
        this.ft.find('.close').unbind().bind("click", function (e){
            e.preventDefault();
            self.hide();
        });
    };
    $.Pop.prototype.sync = function (){
        var hd = this.hd;
        var bd = this.bd;
        var ft = this.ft;
        var cfg = this.cfg;

        cfg.hd && hd.html(cfg.hd);
        cfg.bd && bd.html(cfg.bd);
        cfg.ft && ft.html(cfg.ft);
    };
    $.Pop.prototype.render = function (){
        this.renderMask();
        this.renderBox();
        this.renderHd();
        this.renderBd();
        this.renderFt();
        this.adjustStyle();
        this.sync();
        this.bindUI();
        return this;
    };
    $.Pop.prototype.show = function (){
        var self = this;

        $('.J-mask').show();
        this.container.show();
        return this;
    };
    $.Pop.prototype.hide = function (){
        $('.J-mask').hide();
        this.container.hide();
    };
    $.Alert = function (msg){
        $.Alert.self = new $.Pop({
            hd: "夜市记账",
            bd: msg,
            btns: ['关闭'],
            styles: {
                height: 40
            }
        });
        $.Alert.self.render().show().syncStyle();
        return $.Alert.self;
    }

    var IO = function (cfg){
        var defaultCfg = {
            url: null,
            dataType: "json",
            type: "post",
            data: null,
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
        this.cfg = defaultCfg;
    };
    IO.prototype = {
        start: function (){
            this.cfg.on.start.call(this);
        },
        success: function (data){
            this.cfg.on.success.call(this, data);
        },
        error: function (data){
            this.cfg.on.error.call(this, data);
        },
        send: function (){
            this.start();

            var self = this;

            this.ajaxObj = $.ajax({
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

    /**
     * Created by zhuqi on 13-10-29.
     */
    /**
     * 数据列表
     * @param options
     * @constructor
     */
    var DataList = function (cfg){
        var defaultCfg = {
            container: null,
            template: null,
            ajaxCfg: {
                url: null,
                data: null
            },
            on: {
                noData: function (){},
                start: function (){},
                success: function (){},
                error: function (){},
                filter: function (data){
                    return data;
                },
                bindUI: function (){}
            }
        };

        cfg.ajaxCfg && ($.extend(defaultCfg.ajaxCfg, cfg.ajaxCfg));
        cfg.on && $.extend(defaultCfg.on, cfg.on);
        if(cfg.container){
            defaultCfg.container = cfg.container;
        }
        if(cfg.template){
            defaultCfg.template = cfg.template;
        }

        this.cfg = defaultCfg;
        this.ajaxCfg = defaultCfg.ajaxCfg;

        this.initializer();
    };
    DataList.prototype = {
        initializer: function (){
            //数据存储器
            this.dataList = [];
            //初始化数据请求总量
            this.dataAmount = 0;
            //默认的页码
            this.pageNum = 1;
            if(this.cfg.pageNum){
                this.pageNum = this.cfg.pageNum;
            }
        },
        success: function (data){
            var self = this

            if(data.data.products.length <= 0){
                return this.noData(data);
            }

            if(parseInt(data.bizCode,10) !== 1){
                self.failure(data);
                return ;
            }

            self.cfg.on.success.call(self, data);
            this.pageNum++;
        },
        noData: function (data){
            this.cfg.on.noData.call(this, data);
        },
        start: function (){
            this.cfg.on.start.call(this);
        },
        failure: function (data){
            this.cfg.on.failure.call(this, data);
        },
        error: function (data){
            this.cfg.on.error.call(this, data);
        },
        send: function (){
            var self = this;

            var page = '';
            if($.trim(this.ajaxCfg.data) && !/\&$/.test(this.ajaxCfg.data)){
                page = '&pageNum='+this.pageNum;
            }else{
                page = 'pageNum='+this.pageNum;
            }

            self.io = new IO({
                url: this.ajaxCfg.url,
                data: this.ajaxCfg.data+page,
                on: {
                    start: function (){
                        self.start();
                    },
                    error: function (data){
                        self.error(data);
                    },
                    success: function (data){
                        self.success(data);
                    }
                }
            });
            self.io.send();
        },
        renderData: function (data){
            var self = this;
            var html = '';

            for(var i = 0,l = data.length;i < l;i++){
                data[i] = self.cfg.on.filter(data[i]);
                html += dataTemplate(self.cfg.template,data[i]);
            }
            self.cfg.container.append(html);
            self.bindUI();
        },
        cleaner: function (){
            this.pageNum = 1;
            this.cfg.container.html('');
        },
        abort: function (){
            this.io.abort();
        },
        bindUI: function (){
            this.cfg.on.bindUI();
        }
    };

    /**
     * 一个非常简单的数据模版
     * @param {String} tem
     * @param {Object} data
     * @example '<p>{userName}</p><p>{userID}</p>'  {userName:"朱琦",userID:"53421"}
     * @return 返回已经填充数据的tem片段
     */
    var dataTemplate = function (tem,data){
        var varReg = /{\w+}/g,
            keyReg = /^{(\w+)}$/,
            result;

        result = tem.replace(varReg,function ($0,$1){
            $0 = $0.replace(keyReg,function ($0,$1){
                for(var k in data){
                    data = data;

                    if(k === $1){
                        $1 = data[k];

                        //如果需要对数据进行过滤
                        if(dataTemplate.filter){
                            $1 = dataTemplate.filter.call(dataTemplate.filter,k,$1,data) || $1;
                        }

                        return $1;
                    }
                }
                //假如服务端的数据与模版中的变量不匹配
                return $1 = '';
            });

            return $0;
        });

        return result;
    };

    var ListView = function (options){

    }

    return {
        Pop: $.Pop,
        DataTem: dataTemplate,
        DataList: DataList,
        ListView: ListView,
        IO: IO
    }
});


