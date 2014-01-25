/**
 * Created with JetBrains PhpStorm.
 * User: praise
 * Date: 10/19/13
 * Time: 11:41 PM
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module){
    var $ = require('zepto.min.js');
    var backs = $('.header .back');
    if(backs.length >= 1){
        $.each(backs, function (i, back){
            if(!$(back).attr("data-norouting")){
                var prev = localStorage.getItem("prev");
                if(prev === location.href || !prev){
                    if(!localStorage.getItem("user")){
                        prev = "login.html";
                    }else{
                        prev = "cashier.html";
                    }
                }
                $(back).attr("href", "javascript:void(0)");
                $(back).unbind().bind("click", function (){
                    window.plugins.nativeControls.hideTabBar();
                    history.back();
                });
                localStorage.setItem("prev", location.href);
            }
        });
    }
});