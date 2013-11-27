/**
 * Created with JetBrains PhpStorm.
 * User: praise
 * Date: 10/19/13
 * Time: 11:41 PM
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module){
    var $ = require('zepto.min.js');
    var IO = require("io.js");

    function callback(data){
        if(data.data && data.data.redirect){
            var originHref = location.href;
            if(data.data.redirect.indexOf(originHref) <= 0){
                location.href = data.data.redirect;
            }
        }
    }

    new IO({
        url: "controler/userAuth.php",
        on: {
            success: function (data){
                  callback(data);
            }
        }
    }).send();
});