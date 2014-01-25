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
            '找回密码',            // title
            '知道了'                  // buttonName
        );
    };

    $('#J-updateCheckcode').on("click", updateCheckcode);
    function updateCheckcode(){
        var imgBox = $('#J-checkCodeImgBox');
        if(imgBox.find('img').get(0)){
            imgBox.find('img').remove();
        }
        imgBox.html("<p>获取中...</p>");
        imgBox.append("<img src=\"http://115.29.39.106/models/captcha.php?t="+new Date().getTime()+"\" alt=\"验证码\" style='display:none;' />");
        imgBox.find("img").unbind().on("load", function (){
            imgBox.find("p").remove();
            imgBox.find("img").show();
        });
    }

    var forgotForm = new AjaxForm({
        node: $('.forgotBox form'),
        items: {
            username: {
                min: 2,
                max: 20,
                pattern: "^\.{2,20}$",
                errorMsg: {
                    empty: "请输入用户名",
                    min: "用户名不得少于2个中英文或数字",
                    max: "用户名不得多于20个中英文或数字",
                    pattern: "用户名必须是2到20位中英文或数字"
                }
            },
            email: {
                min: 5,
                pattern: "^\.+@{1,1}\.+\\.{1,1}\.+$",
                errorMsg: {
                    empty: "请输入您当时注册时的邮箱",
                    min: "请输入正确的电子邮箱",
                    pattern: "请输入正确的电子邮箱"
                }
            },
            captcha: {
                min: 5,
                max: 5,
                errorMsg: {
                    empty: "输入右侧的验证码",
                    min: "验证码不少于5位字符",
                    max: "验证码不多于5位字符"
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
                    location.href = "reset-password.html";
                }, 3000);
                Utils.tip(msg);
            } else if (data && data.bizCode === 0) {
                navigator.notification.alert(
                    msg,  // message
                    function () {
                    },         // callback
                    '找回密码',            // title
                    '知道了'                  // buttonName
                );
            } else if (data && data.bizCode === 2) {
                navigator.notification.confirm(msg, function (which) {
                    if (which === 1) {
                        location.href = "reset-password.html";
                    }
                }, "找回密码", "继续,取消");
            }else{
                navigator.notification.alert(
                    msg,  // message
                    function () {
                    },         // callback
                    '找回密码',            // title
                    '知道了'                  // buttonName
                );
            }
            $('#J-findBtn').bind('click', requestForgot).html('找回');
        },
        error: function (data){
            if(data && data.data){
                var msg = data.data.msg ? data.data.msg[0] : data.memo;
                alert(msg);
            }else{
                alert("对不起，发生异常");
            }
            $('#J-findBtn').bind('click', requestForgot).html('找回');
        }
    };
    function requestForgot(e){
        e.preventDefault();
        $('#J-email').val($('#J-email').val().replace(/\s/g, ""));
        forgotForm.submit(function (){
            $('#J-findBtn').unbind().html("处理中...");
        }, callbacks.success, callbacks.error);
    }
    $('#J-findBtn').bind('click', requestForgot);
});
