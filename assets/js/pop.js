/**
 * Created with JetBrains PhpStorm.
 * User: praise
 * Date: 9/22/13
 * Time: 9:10 PM
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module) {
    var $ = require('zepto.min.js');

    var Pop = function (cfg){
        this.cfg = cfg || {};
        this.id = 'pop'+new Date().getTime();
    };
    Pop.prototype.renderBox = function (){
        var body = $('body');
        body.append('<div class="J-Pop-container" id="'+this.id+'"></div>');
        $('#'+this.id+'').css({
            display: 'none'
        });
        this.container = $('#'+this.id+'');
    };
    Pop.prototype.renderHd = function (){
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
    Pop.prototype.renderBd = function (){
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
    Pop.prototype.renderFt = function (){
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
    Pop.prototype.renderMask = function (){
        var body = $('body');
        var className = 'J-mask'+this.id;
        if(!body.find('.'+className+'').get(0)){
            body.append('<div class="'+className+'"></div>');
        }
        $('.'+className+'').css({
            display: 'none'
        });
        this.maskSelector = className;
    };
    Pop.prototype.renderHTML = function (){
        var html = 'body';

        return html;
    };
    Pop.prototype.adjustStyle = function (){
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
        $('.'+this.maskSelector+'').css({
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
            zIndex: 999999,
            '-webkit-border-radius': "5px",
            color: "#333",
            lineHeight: '22px'
        });
    };
    Pop.prototype.syncStyle = function (){
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
        $('.'+this.maskSelector+'').css({
            height: docH
        });
        this.container.css({
            top: (viewPortH-this.container.height())/2+window.scrollY,
            left: ($(window).width()-containerW)/2
        });
    };
    Pop.prototype.bindUI = function (){
        var cfg = this.cfg;
        var self = this;
        cfg.bindUI && cfg.bindUI.call(this);
        this.ft.find('.close').unbind().bind("click", function (e){
            e.preventDefault();
            self.hide();
        });
    };
    Pop.prototype.sync = function (){
        var hd = this.hd;
        var bd = this.bd;
        var ft = this.ft;
        var cfg = this.cfg;

        cfg.hd && hd.html(cfg.hd);
        cfg.bd && bd.html(cfg.bd);
        cfg.ft && ft.html(cfg.ft);
    };
    Pop.prototype.render = function (){
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
    Pop.prototype.show = function (){
        var self = this;

        $('.'+self.maskSelector+'').show();
        this.container.show();
        return this;
    };
    Pop.prototype.hide = function (){
        $('.'+this.maskSelector+'').hide();
        this.container.hide();
    };

    return Pop;
});


