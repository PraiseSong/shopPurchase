/**
 * Created by apple on 11/29/13.
 */
define(function (require, exports, module){
    var $ = require('zepto.min.js');
    var Pop = require("pop.js");
    require("../css/login.css");

    var html = '<div class="loginBox container">'+
        '<form class="form-default" action="login.php" method="post">'+
        '<div class="input-skin first-child">'+
            '   <input type="text" placeholder="用户名" name="username" id="J-username" autocapitalize="off" />'+
            '   </div>'+
        '<div class="input-skin last-child">'+
            '   <input type="password" placeholder="登录密码" name="password" id="J-password" autocapitalize="off" />'+
            '   </div>'+
        '   </form>'+
    '<div class="openLogin">'+
    '   <a href="qq_login.php" title="QQ登录" class="touchStatusBtn" target="_blank">'+
    '       <img src="assets/imgs/qq_logo.png" alt="QQ登录"/>'+
    '   登录'+
    '   </a>'+
    '   </div>'+
    '<div class="flexBox">'+
    '   <a class="box" href="forgot-password.php" title="找回登录密码" target="_blank">忘记登录密码</a>'+
    '</div>'+
    '</div>';

    var pop = new Pop({
        hd: "登录",
        bd: html,
        styles: {
            height: 177
        }
    });
    pop.render();
    pop.show();
    pop.bd.css({
        padding: "5px"
    }).find(".loginBox").css({
            margin: "0"
        });
    pop.ft.find(".btn1").attr("id", "J-loginBtn");
    pop.syncStyle();
    pop.bd.find(".openLogin").on("click", function (){
        pop.hide();
    });

    var login = require("login.js");
    var loginUI = {
        ui: pop
    };
    loginUI.callback = {
        success: function (data){
            if(data.bizCode === 1){
                pop.hide();
            }else{
                alert(data.memo);
            }
        }
    };
    login.success = function (data){
        loginUI.callback.success.call(loginUI.callback.success, data);
    };

    return loginUI;
});
