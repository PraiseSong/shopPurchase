/**
 * Created with JetBrains PhpStorm.
 * User: praise
 * Date: 11/5/13
 * Time: 9:56 PM
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module){
    var $ = require('zepto.min.js');

    var html =  '<div class="shortMenu" id="J-shortMenu">'+
                '<div class="mainMenu touchStatusBtn">'+
                '<img src="assets/imgs/logo.png" width="60" height="60" alt="小店记账宝" />'+
                '</div>'+
                '</div>'+
                '<div class="shortFullMenu">'+
                '<div class="bd">'+
                '<span class="close">X</span>'+
                '<div class="t">'+
                '<a href="cashier.html"><img src="assets/imgs/cashier-48.png" alt="记账台"/>记账台</a>'+
                '</div>'+
                '<div class="b">'+
                '<a href="account.html"><img src="assets/imgs/home-48.png" alt="主页"/>我的小店</a>'+
                '</div>'+
                '<div class="l">'+
                '<a href="security_settings.php?v='+new Date().getTime()+'" target="_blank"><img src="assets/imgs/lock.png" alt="安全设置"/>安全设置</a>'+
                '</div>'+
                '<div class="r">'+
                '<a href="user_settings.php?v='+new Date().getTime()+'" target="_blank"><img src="assets/imgs/settings.png" alt="用户设置"/>用户设置</a>'+
                '</div>'+
                '<div class="c"></div>'+
                '</div>'+
                '</div>';

    $('body').append(html);
    var fullMenu = $('.shortFullMenu');
    fullMenu.bind('click', function (e){
        e.stopPropagation();
    });
    var menu = $('#J-shortMenu').get(0);
    var startX = 0;
    var startY = 0;
    var endX = 0;
    var endY = 0;
    menu.addEventListener("touchstart", function (e){
        //e.preventDefault();
        var target = e.targetTouches[0];
        if(target){
            startX = target.clientX;
            startY = target.clientY;
        }
    });
    menu.addEventListener("touchmove", function (e){
        e.preventDefault();
        var target = e.changedTouches[0];
        if(target){
            updateMenuPos(target.clientX-startX, target.clientY-startY);
            startX = target.clientX;
            startY = target.clientY;
        }
    });
    menu.addEventListener("touchend", function (e){
        //e.preventDefault();
        var target = e.changedTouches[0];
        if(target){
            startX = target.clientX;
            startY = target.clientY;
        }
    });
    $('#J-shortMenu .mainMenu').unbind().bind('click', function (e){
        e.preventDefault();
        e.stopPropagation();
        if(fullMenu.css('display') === 'block'){
            fullMenu.css('display', 'none');
        }else{
            fullMenu.css('display', 'block').css({
                left: ($(window).width()-parseInt(fullMenu.css('width'), 10))/2,
                bottom: ($(window).height()-parseInt(fullMenu.css('height'), 10))/2
            });
        }
        return;
    });
    $('body').bind('click', hide);
    fullMenu.find('.close').bind('click', hide);
    function updateMenuPos(x, y){
        var winW = $(window).width();
        var winH = $(window).height();
        var menuW = parseInt($(menu).css("width"), 10);
        var menuH = parseInt($(menu).css("height"), 10);
        var origin_x = parseInt($(menu).offset().left, 10);
        var origin_y = parseInt($(menu).offset().top, 10);
        x += origin_x;
        y += origin_y;
        if((x > (winW-menuW)) || (y > (winH -menuH))){
            return;
        }
        if(x < 0 || y < 0){
            return;
        }
        $(menu).css({
            "position": "absolute",
            left: x,
            top: y,
            bottom: 'auto'
        });
    }
    function hide(){
        if(fullMenu.css('display') === 'block'){
            fullMenu.css('display', 'none');
        }
    }
});