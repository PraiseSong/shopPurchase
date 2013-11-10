/**
 * 小工具模块
 * User: praise
 * Date: 9/7/13
 * Time: 5:12 PM
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module){
    var $ = require('zepto.min.js');
    var Widgets = require('widgets.js');

    //强制将小于10的数字转换为2位数字，如01-09
    function to2Num(num){
        if(num < 10){
            num = '0'+num;
        }
        return num;
    }

    //根据指定的img获取附件数据base64
    function queryBase64Attachment(imgs){
        $.each(imgs, function (i, img){
            var id = $(img).attr('data-id');
            if(src = getBase64Attachment(id)){
                $(img).attr('data-src', null).attr('src', src);
            }else if(!$(img).attr('src')){
                var src = $(img).attr('data-src').split('/');
                new Widgets.IO({
                    url: "controler/getBase64.php",
                    data: "src="+encodeURI(src[1]),
                    on: {
                        success: function (data){
                            if(data.bizCode === 1 && data.data && data.data.base64){
                                $(img).attr('data-src', null).attr('src', data.data.base64);
                                setBase64Attachment(id, data.data.base64);
                            }
                        }
                    }
                }).send();
            }
        });
    }

    function setBase64Attachment(id, src){
        var attachments = localStorage.getItem('attachments');
        if(attachments){
            attachments = JSON.parse(attachments);
        }else{
            attachments = {};
        }
        attachments[id] = src;
        localStorage.setItem('attachments', JSON.stringify(attachments));
    };
    function getBase64Attachment(id){
        var attachments = localStorage.getItem('attachments');
        if(attachments){
            attachments = JSON.parse(attachments);
        }else{
            return null;
        }

        return attachments[id];
    };

    return {
        to2Num: to2Num,
        queryBase64: queryBase64Attachment,
        setBase64: setBase64Attachment,
        getBase64: getBase64Attachment
    };
});
