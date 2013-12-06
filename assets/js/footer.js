/**
 * Created with JetBrains PhpStorm.
 * User: praise
 * Date: 10/19/13
 * Time: 11:41 PM
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module){
    var $ = require('zepto.min.js');
    var Routing = require("routing.js");

    if(((location.href.indexOf(".html") !== -1) || (location.href.indexOf(".php") !== -1)) && (location.href.indexOf("index") === -1)){
        require('menu.js');
    }

    //隐藏地址栏控件
    window.onload = function (){
        setTimeout(function (){
            window.scrollTo(0, 1);
        }, 100);
    };

    //为所有touchStatusBtn按钮添加touch状态，提升用户体验
    setInterval(function (){
        var touchStatusBtns = $('.touchStatusBtn');
        $.each(touchStatusBtns, function (i, btn){
            if(!$(btn).attr("data-hasTouchStatusListener")){
                $(btn).get(0).removeEventListener("touchstart");
                $(btn).get(0).removeEventListener("touchmove");
                $(btn).get(0).removeEventListener("touchend");

                $(btn).attr("data-hasTouchStatusListener", 1);

                $(btn).get(0).addEventListener("touchstart", function (e){
                    var self = e.currentTarget;
                    $(self).css({
                        "-webkit-transform": "scale(.97)",
                        opacity: .6
                    });
                });
                $(btn).get(0).addEventListener("touchmove", function (e){
                    var self = e.currentTarget;
                    $(self).css({
                        "-webkit-transform": "scale(1)",
                        opacity: 1
                    });
                });
                $(btn).get(0).addEventListener("touchend", function (e){
                    var self = e.currentTarget;
                    $(self).css({
                        "-webkit-transform": "scale(1)",
                        opacity: 1
                    });
                });
            }
        });
    }, 1500);

    //在standalone模式下，保持链接不外跳
    if(navigator.standalone){
        $('a').on("click",
            function( e ){
                e.preventDefault();
                var href = $( e.currentTarget ).attr( "href" );
                if(!href){
                    return false;
                }
                if($.trim(href) && href === "javascript:void(0)"){
                    return false;
                }else if($.trim(href)){
                    location.href = href;
                }
            }
        );
    }

    Routing.init();
    if(routingBack = Routing.getBackPage()){
        $('.header .back').attr("href", routingBack);
    }else if(history.length <= 1){
        $('.header .back').attr("href", "javascript:window.open('','_self').close()");
    }else{
        $('.header .back').on('click', function (e){
            e.preventDefault();
            history.back();
        });
    }
});