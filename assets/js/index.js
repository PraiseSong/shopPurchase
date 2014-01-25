/**
 * Created by apple on 1/13/14.
 */
define(function (require, exports, module) {
    var $ = require('zepto.min.js');

    window.onload = function (){
        setTimeout(function (){
            window.scrollTo(0, 0);
        }, 1000);
    };

    window.mySwipe = new Swipe(document.getElementById('slider'), {
        speed: 100,
        auto: 5000,
        transitionEnd: function (index, ele){
            $('#J-currentScreenName').html($(ele).find('img').attr("alt"));
            $('#J-triggers span').removeClass("current");
            var triggers = $('#J-triggers span');
            $.each($('#J-triggers span'), function (i, trigger){
                if(i === index){
                    $(trigger).addClass("current");
                    return false;
                }
            });
        }
    });
});