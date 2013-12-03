/**
 * Created with JetBrains PhpStorm.
 * User: praise
 * Date: 10/19/13
 * Time: 11:41 PM
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module){
    var $ = require('zepto.min.js');

    return {
        props2Array: function (props){
            props = props.split("|");
            var result = {};
            $.each(props, function (i, p){
                if(p){
                    var prop = p.split(":");
                    var name = prop[0];
                    var val = prop[1]['split'](',');
                    result[name] = val;
                }
            });
            return result;
        },
        loading: {
            show: function (text){
                text = text || "loading";
                var docH = $(document).height();
                var winH = $(window).height();

                if($('body').find(".mask").get(0)){
                    $('body').find(".mask").remove();
                }
                $('body').append("<div class=\"mask\"></div>");
                $('.mask').css({
                    height: docH
                });
                if($('body').find(".loadingBox").get(0)){
                    $('body').find(".loadingBox").remove();
                }
                $('body').append("<div class=\"loadingBox warn\">"+text+"</div>");
                $('.loadingBox').css({
                    left: ($(window).width() - parseInt($('.loadingBox').css("width"), 10)) / 2,
                    top: window.scrollY + 50
                });
            },
            updateText: function (text){
                $('.loadingBox').html(text);
            },
            error: function (text){
                $('.loadingBox').removeClass("warn").addClass("error").html(text);
            },
            warn: function (text){
                $('.loadingBox').removeClass("error").addClass("warn").html(text);
            },
            hide: function (){
                $('.mask').hide();
                $('.loadingBox').hide();
            }
        },
        //强制将小于10的数字转换为2位数字，如01-09
        to2Num: function (num){
            if(num < 10){
                num = '0'+num;
            }
            return num;
        }
    };
});