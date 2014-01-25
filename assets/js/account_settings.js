/**
 * Created with JetBrains PhpStorm.
 * User: praise
 * Date: 9/22/13
 * Time: 9:10 PM
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module) {
    var $ = require('zepto.min.js');
    var IO = require("io.js");
    var Utils = require("utils.js");

    var queryString = Utils.queryString2Obj();
    var tagHtml = '';
    var tag = "";
    if(!queryString.tag){
        return;
    }
    switch (queryString.tag) {
        case "displayname":
            tag = "小店名称";
            window.alert = function (msg) {
                navigator.notification.alert(
                    msg,  // message
                    function () {
                    },         // callback
                    '小店名设置',            // title
                    '知道了'                  // buttonName
                );
            };
            tagHtml =   '<div class="field-group filed-tip">' +
                        '<p class="label"></p>' +
                        '<p>如：伟丽发饰店<span class="warn">(不少于5个中文字符)</span></p>' +
                        '</div>' +
                        '<div class="field-group">' +
                        '<p class="label">' +
                        '小店名称' +
                        '</p>' +
                        '<input class="field input-text" autocapitalize="off" name="displayname" type="text" />'+
                        '</div>';
            break;
        case "email":
            tag = "邮箱";
            window.alert = function (msg) {
                navigator.notification.alert(
                    msg,  // message
                    function () {
                    },         // callback
                    '邮箱设置',            // title
                    '知道了'                  // buttonName
                );
            };
            tagHtml =   '<div class="field-group filed-tip">' +
                        '<p class="label"></p>' +
                        '<p>如：jizhangbao@qq.com</p>' +
                        '</div>' +
                        '<div class="field-group">' +
                        '<p class="label">常用邮箱</p>' +
                        '<input class="field input-text" autocapitalize="off" type="email" name="email" />' +
                        '</div>'
            break;
    }
    $('#J-tagHtml').html(tagHtml);
    $('#J-title').html(tag+"设置");
    var user = JSON.parse(localStorage.getItem("user"));
    $('input[name='+queryString.tag+']').val((user[queryString.tag] || ""));

    function validation() {
        var result = true;
        var node = $('input[name='+queryString.tag+']');
        var nodeVal = $.trim(node.val());
        switch(queryString.tag){
            case "displayname":
                if (!nodeVal) {
                    alert('请输入您家的小店名称');
                    result = false;
                } else if (nodeVal && (nodeVal.length < 5 || nodeVal.length > 25)) {
                    alert('小店名称不得少于5个字符,多于25个字符');
                    result = false;
                }
                break;
            case "email":
                node.val(nodeVal.replace(/\s/g, ""));
                nodeVal = $.trim(node.val());
                if (!nodeVal) {
                    alert('请输入常用邮箱，建议使用QQ邮箱');
                    result = false;
                } else if (nodeVal && !new RegExp('^\.+@{1,1}\.+\\.{1,1}\.+$').test(nodeVal)) {
                    alert("请输入正确的电子邮箱");
                    result = false;
                }
                break;
        }

        return result;
    }

    function submitSettings(e) {
        e.preventDefault();
        if (validation()) {
            requestSettings();
        }
    }

    function requestSettings() {
        switch(queryString.tag){
            case "displayname":
                break;
            case "email":
                break;
        }
        navigator.notification.confirm("确认更新"+tag+"？", function (which) {
            if (which === 1) {
                var data = "action=update&"+queryString.tag+"=" + $.trim($('input[name='+queryString.tag+']').val());
                $('#J-ok').unbind();
                new IO({
                    url: "account_settings.php",
                    data: data,
                    on: {
                        start: function () {
                            $('#J-responseResult').html('');
                            Utils.loading.show("正在修改"+tag+"...");
                        },
                        success: function (data) {
                            if (data.bizCode === 1) {
                                Utils.loading.warn("更新"+tag+"成功");
                                localStorage.setItem("user", JSON.stringify(data.data.user));
                                $('#J-responseResult').html(data.memo);
                                $('input[name='+queryString.tag+']').val(data.data.user[queryString.tag]);
                                setTimeout(function () {
                                    Utils.loading.hide();
                                }, 1500);
                            } else {
                                $('#J-responseResult').html(data.memo);
                                Utils.loading.hide();
                            }
                            $('#J-ok').bind('click', submitSettings);
                        },
                        error: function () {
                            Utils.loading.error("更新"+tag+"发生异常，请重试");
                            $('#J-ok').bind('click', submitSettings);
                            setTimeout(function () {
                                Utils.loading.hide();
                            }, 1500);
                        }
                    }
                }).send();
            }
        }, ""+tag+"设置", "确认,取消");
    }

    $('#J-ok').bind('click', submitSettings);
});


