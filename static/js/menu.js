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
                '<span class="lt"></span>'+
                '<span class="rt"></span>'+
                '<span class="lb"></span>'+
                '<span class="rb"></span>'+
                '</div>'+
                '</div>'+
                '<div class="shortFullMenu">'+
                '<div class="bd">'+
                '<div class="t">'+
                '<a href="operation.php"><img src="static/imgs/money_bag.png" alt="销售数据"/>历史业绩</a>'+
                '</div>'+
                '<div class="b">'+
                '<a href="cashier.php"><img src="static/imgs/home-48.png" alt="主页"/>主页</a>'+
                '</div>'+
                '<div class="l">'+
                '<a href="cashier.php"><img src="static/imgs/cashier-48.png" alt="记账台"/>记账台</a>'+
                '</div>'+
                '<div class="c"></div>'+
                '</div>'+
                '</div>';

    $('body').append(html);
    var fullMenu = $('.shortFullMenu');
    var animationEnd = function (){
        fullMenu.removeClass('scale-out').css('display', 'none');
    };
    $('#J-shortMenu .mainMenu').unbind().bind('click', function (e){
        e.preventDefault();
        if($.os && $.os.android){

            return;
        }
        if(fullMenu.hasClass('scale-in')){
            hideMenu();
        }else{
            showMenu();
        }
    });
    function showMenu(){
        fullMenu.get(0).removeEventListener('webkitAnimationEnd', animationEnd);
        fullMenu.css('display', 'block').addClass('scale-in');
    }
    function hideMenu(){
        fullMenu.addClass('scale-out').removeClass('scale-in');
        fullMenu.get(0).addEventListener('webkitAnimationEnd', animationEnd, false);
    }
});