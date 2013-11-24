/**
 * Created with JetBrains PhpStorm.
 * User: praise
 * Date: 10/19/13
 * Time: 11:41 PM
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module){
    var $ = require('zepto.min.js');

    //隐藏地址栏控件
    $(window).on("load", function (){
        window.scrollTo(0, 1);
    });

    //为所有touchStatusBtn按钮添加touch状态，提升用户体验
    $('.touchStatusBtn').get(0).addEventListener("touchstart", function (e){
        var self = e.currentTarget;
        $(self).css({
            "-webkit-transform": "scale(.85)",
            opacity: .6
        });
    });
    $('.touchStatusBtn').get(0).addEventListener("touchend", function (e){
        var self = e.currentTarget;
        $(self).css({
            "-webkit-transform": "scale(1)",
            opacity: 1
        });
    });

    //在standalone模式下，保持链接不外跳
    $('a').on("click",
        function( event ){
            event.preventDefault();
            location.href = $( event.target ).attr( "href" );
        }
    );
});