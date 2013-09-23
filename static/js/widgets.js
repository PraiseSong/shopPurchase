/**
 * Created with JetBrains PhpStorm.
 * User: praise
 * Date: 9/22/13
 * Time: 9:10 PM
 * To change this template use File | Settings | File Templates.
 */
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
};
$.extends($.Pop, $.Widgets);
$.Pop.prototype.renderBox = function (){
    var body = $('body');
    if(!body.find(".J-Pop-container").get(0)){
        body.append('<div class="J-Pop-container"></div>');
    }
    $('.J-Pop-container').css({
        display: 'none'
    });
    this.container = $('.J-Pop-container');
};
$.Pop.prototype.renderHd = function (){
    var container = $('.J-Pop-container');
    if(!container.find('.J-Pop-hd').get(0)){
        container.append('<header class="J-Pop-hd">header</header>');
    }
    $('.J-Pop-hd').css({
        padding: 20,
        textAlign: "center",
        fontSize: 15,
        fontWeight: 700,
        borderBottom: '1px solid rgb(187, 187, 187)'
    });
    this.hd = $('.J-Pop-hd');
};
$.Pop.prototype.renderBd = function (){
    var container = $('.J-Pop-container');
    if(!container.find('.J-Pop-bd').get(0)){
        container.append('<section class="J-Pop-bd">'+this.renderHTML()+'</section>');
        $('.J-Pop-bd').css({
            padding: 20,
            height: 100,
            overflow: "auto"
        });
    }
    this.bd = $('.J-Pop-bd');
};
$.Pop.prototype.renderFt = function (){
    var container = $('.J-Pop-container');
    var html = '<a class="btn btn1">确定</a>';
    html += '<a class="btn btn2 close">取消</a>';
    if(!container.find('.J-Pop-ft').get(0)){
        container.append('<footer class="J-Pop-ft">'+html+'</footer>');
    }
    $('.J-Pop-ft').css({
        display: "-webkit-box",
        borderTop: '1px solid rgb(187, 187, 187)'
    });
    $('.J-Pop-ft .btn').css({
        display: "block",
        textDecoration: "none",
        color:  "rgb(6, 67, 107)",
        fontSize: 14,
        textAlign: "center",
        height: 40,
        lineHeight: '40px',
        '-webkit-box-flex': '1',
        cursor: "pointer"
    });
    var btn = $('.J-Pop-ft .btn');
    $.each(btn, function (i, n){
        if(i !== 0){
            $(n).css({
                borderLeft: '1px solid rgb(187, 187, 187)'
            });
        }
    });
    this.ft = $('.J-Pop-ft');
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

    $('.J-mask').css({
        background: 'rgba(0, 0, 0, .5)',
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 100,
        width: "100%",
        height: viewPortH
    });
    $('.J-Pop-container').css({
        width: 240,
        background: '#fff',
        position: "absolute",
        top: (viewPortH-244)/2+window.scrollY,
        left: ($(window).width()-240)/2,
        zIndex: 999999999,
        '-webkit-border-radius': "5px",
        color: "#333",
        lineHeight: '22px'
    });
};
$.Pop.prototype.syncStyle = function (){
    var viewPortH = 0;

    if($(document).height() <= $(window).height()){
        viewPortH = $(window).height();
    }else{
        viewPortH = $(document).height();
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
    this.bd.css({
        height: "auto"
    });
    this.container.css({
        width: 240,
        background: '#fff',
        position: "absolute",
        top: (viewPortH-$('.J-Pop-container').height())/2+window.scrollY,
        left: ($(window).width()-240)/2,
        zIndex: 999999999,
        '-webkit-border-radius': "5px",
        color: "#333",
        lineHeight: '22px'
    });
};
$.Pop.prototype.bindUI = function (){
    var cfg = this.cfg;
    var self = this;
    cfg.bindUI && cfg.bindUI.call(this);
    $('.J-Pop-ft .close').unbind().bind("click", function (e){
        e.preventDefault();
        self.hide();
    });
};
$.Pop.prototype.sync = function (){
    var container = $('.J-Pop-container');
    var hd = $('.J-Pop-hd');
    var bd = $('.J-Pop-bd');
    var ft = $('.J-Pop-ft');
    var cfg = this.cfg;
    var self = this;

    cfg.hd && hd.html(cfg.hd);
    cfg.bd && bd.html(cfg.bd);
    cfg.ft && ft.html();

    setTimeout(function (){
        self.syncStyle();
    }, 1500);
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
};
$.Pop.prototype.show = function (){
    $('.J-mask').show();
    $('.J-Pop-container').show();
    return this;
};
$.Pop.prototype.hide = function (){
    $('.J-mask').hide();
    $('.J-Pop-container').hide();
};

