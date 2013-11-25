/**
 * Created by apple on 11/24/13.
 */
define(function (require, exports, module){
    var $ = require('zepto.min.js');
    var Tooltip = require('tooltip.js');
    var AjaxForm = require('ajaxForm.js');

    new Tooltip({
        node: $('#J-username')
    });
    new Tooltip({
        node: $('#J-password')
    });
    var loginForm = new AjaxForm({
        node: $('form'),
        items: {
            username: {
                min: 5,
                max: 20,
                pattern: "^[\\w|\\d]{5,20}$",
                errorMsg: {
                    empty: "请输入用户名",
                    min: "用户名不得少于5个英文或数字",
                    max: "用户名不得多于20个英文或数字",
                    pattern: "用户名必须是5到20位英文或数字"
                }
            },
            password: {
                min: 8,
                max: 50,
                errorMsg: {
                    empty: "请输入登录密码",
                    min: "登录密码不得少于8位",
                    max: "登录密码不得多于50位"
                }
            }
        },
        showErrorMsg: function (msg){
            alert(msg[0]);
        }
    });
    $('#J-loginBtn').on('click', function (e){
        e.preventDefault();
        loginForm.submit();
    });
});
