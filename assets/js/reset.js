/**
 * Created by apple on 11/24/13.
 */
define(function (require, exports, module){
    var $ = require('zepto.min.js');
    var Utils = require('utils.js');
    var AjaxForm = require('ajaxForm.js');

    window.alert = function (msg){
        navigator.notification.alert(
            msg,  // message
            function (){},         // callback
            '修改密码',            // title
            '知道了'                  // buttonName
        );
    };

    var forgotForm = new AjaxForm({
        node: $('.forgotBox form'),
        items: {
            token: {
                min: 1,
                errorMsg: {
                    empty: "请输入您邮箱中收到的密钥",
                    min: "密钥不正确"
                }
            },
            password: {
                min: 6,
                max: 50,
                errorMsg: {
                    empty: "请输入新登录密码",
                    min: "新登录密码不得少于6位",
                    max: "新登录密码不得多于50位"
                }
            },
            passwordc: {
                equal: $('.forgotBox input[type=password]'),
                errorMsg: {
                    empty: "输入和上面同样的新登录密码",
                    min: "输入和上面同样的新登录密码",
                    max: "输入和上面同样的新登录密码",
                    equal: "两次输入的新密码必须相同"
                }
            }
        },
        showErrorMsg: function (msg){
            alert(msg[0]);
        }
    });
    var callbacks = {
        success: function (data){
            var msg = data.data.msg ? data.data.msg[0] : data.memo;
            if (data && data.bizCode === 1) {
                setTimeout(function (){
                    location.href = "login.html";
                }, 3000);
                Utils.tip(msg);
            } else{
                navigator.notification.alert(
                    msg,  // message
                    function () {
                    },         // callback
                    '找回密码',            // title
                    '知道了'                  // buttonName
                );
            }
            $('#J-findBtn').bind('click', requestForgot).html('确认');
        },
        error: function (data){
            if(data && data.data){
                var msg = data.data.msg ? data.data.msg[0] : data.memo;
                alert(msg);
            }else{
                alert("对不起，发生异常");
            }
            $('#J-findBtn').bind('click', requestForgot).html('确认');
        }
    };
    function requestForgot(e){
        e.preventDefault();
        forgotForm.submit(function (){
            $('#J-findBtn').unbind().html("修改中...");
        }, callbacks.success, callbacks.error);
    }
    $('#J-findBtn').bind('click', requestForgot);
});
