/**
 * Created by apple on 12/3/13.
 */
define(function (require, exports, module){
    var $ = require("zepto.min.js");
    var IO = require("io.js");

    new IO({
        url: "controler/userAuth.php",
        on: {
            success: function (data){
                if(data.data && data.data.user && data.data.user.user_id){
                    loginSuccessed(data.data.user);
                    return ;
                }
            },
            error: function (){
                location.href = "login.html";
            }
        }
    }).send();

    function loginSuccessed(data){
        $('#J-storeName').html(data.displayname);
        $('.username').html(data.username);
        $('.email').html(data.email);
    }
});
