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

    var UserAuth = {};
    function callback(data){
        if(UserAuth.callback){
            UserAuth.callback.call(UserAuth, data);
        }else{
            setTimeout(function (){
                callback(data)
            }, 3000);
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

    return UserAuth;
});