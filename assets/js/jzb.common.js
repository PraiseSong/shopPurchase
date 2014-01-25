/**
 * Created with JetBrains PhpStorm.
 * User: praise
 * Date: 10/19/13
 * Time: 11:41 PM
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module){
    var $ = require('zepto.min.js');
    var Utils = require('utils.js');
    var IO = require("io.js");

    var nonetworkhtml = '<div class="flexBox error noNetwork" id="J-noNetwork">'+
        '<img src="assets/imgs/warning.png" width="24" height="24" alt="警告"/>'+
        '<span class="box">'+
        '您当前的网络不可用！'+
        '</span>'+
        '</div>';
    setInterval(function (){
        if (Utils.network()) {
            $('#J-noNetwork').remove();
        }
    }, 500);
    setInterval(function (){
        if (!Utils.network() && !$('#J-noNetwork').get(0)) {
            $('body').prepend(nonetworkhtml);
        }
    }, 1000);
});
