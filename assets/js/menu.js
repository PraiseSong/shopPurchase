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
                '<div class="mainMenu">'+
                '<img src="assets/imgs/logo.png" width="60" height="60" alt="小店记账宝" />'+
                '</div>'+
                '</div>'+
                '<div class="shortFullMenu">'+
                '<div class="bd">'+
                '<div class="t">'+
                '<a href="performance.html"><img src="assets/imgs/money_bag.png" alt="历史报表"/>历史报表</a>'+
                '</div>'+
                '<div class="b">'+
                '<a href="account.html"><img src="assets/imgs/home-48.png" alt="主页"/>我的小店</a>'+
                '</div>'+
                '<div class="l">'+
                '<a href="cashier.html"><img src="assets/imgs/cashier-48.png" alt="记账台"/>记账台</a>'+
                '</div>'+
                '<div class="c"></div>'+
                '</div>'+
                '</div>';

    $('body').append(html);
    var fullMenu = $('.shortFullMenu');
    fullMenu.bind('click', function (e){
        e.stopPropagation();
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
    $('body').bind('click', function (e){
        if(fullMenu.css('display') === 'block'){
            fullMenu.css('display', 'none');
        }
    });
});