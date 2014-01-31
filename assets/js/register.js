/**
 * Created by apple on 11/24/13.
 */
define(function (require, exports, module){
    var $ = require('zepto.min.js');
    var AjaxForm = require('ajaxForm.js');

    window.alert = function (msg){
        navigator.notification.alert(
            msg,  // message
            function (){},         // callback
            '小店记账宝',            // title
            '知道了'                  // buttonName
        );
    };

    var geoPosition = {};
    navigator.geolocation.getCurrentPosition(getPosSuccess, function (){});
    function getPosSuccess(position) {
        geoPosition = position.coords.latitude+","+position.coords.longitude;
        $('#J-geoPosition').val(geoPosition);
    }
    $('#J-ua').val(JSON.stringify(device));

//    $('#J-updateCheckcode').on("click", updateCheckcode);
//    function updateCheckcode(){
//        var imgBox = $('#J-checkCodeImgBox');
//        imgBox.html("<p>获取中...</p>");
//        imgBox.append("<img src=\"http://jzb.rib.hk/models/captcha.php\" alt=\"验证码\" style='display:none;' />");
//        imgBox.find("img").on("load", function (){
//            imgBox.find("p").remove();
//            imgBox.find("img").show();
//        });
//    }
    var loginForm = new AjaxForm({
        node: $('.registerBox form'),
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
                    empty: "请输入常用邮箱，建议使用QQ邮箱",
                    min: "请输入正确的电子邮箱",
                    pattern: "请输入正确的电子邮箱"
                }
            },
            password: {
                min: 6,
                max: 50,
                errorMsg: {
                    empty: "请输入登录密码",
                    min: "登录密码不得少于6位",
                    max: "登录密码不得多于50位"
                }
            },
            passwordc: {
                equal: $('.registerBox input[type=password]'),
                errorMsg: {
                    empty: "输入和上面同样的登录密码",
                    min: "输入和上面同样的登录密码",
                    max: "输入和上面同样的登录密码",
                    equal: "两次输入的密码必须相同"
                }
            }//,
//            displayname: {
//                min: 5,
//                max: 25,
//                errorMsg: {
//                    empty: "请输入您家的小店名",
//                    min: "小店名不得少于5个字符",
//                    max: "小店名不得多于25个字符"
//                }
//            },
//            captcha: {
//                min: 5,
//                max: 5,
//                errorMsg: {
//                    empty: "输入右侧的验证码",
//                    min: "验证码不少于5位字符",
//                    max: "验证码不多于5位字符"
//                }
//            }
        },
        showErrorMsg: function (msg){
            alert(msg[0]);
        }
    });
    var callbacks = {
        success: function (data){
            if(data && data.bizCode === 1){
                alert("注册成功，请登录");
                location.href = data.data.redirect;
                $('#J-registerBtn').bind('click', requestRegister).html('确认');
            }else{
                var msg = data.data.msg[0] || data.memo;
                alert(msg);
                $('#J-registerBtn').bind('click', requestRegister).html('确认');
            }
        },
        error: function (data){
            $('#J-registerBtn').bind('click', requestRegister).html('确认');
        },
        requestRegister: requestRegister
    };
    function requestRegister(e){
        e.preventDefault();
        $('#J-email').val($('#J-email').val().replace(/\s/g, ""));
        loginForm.submit(function (){
            $('#J-registerBtn').unbind().html("注册中...");
        }, callbacks.success, callbacks.error);
    }
    $('#J-registerBtn').bind('click', requestRegister);

    return callbacks;
});
