/**
 * Created with Praise Song(http://labs.cross.hk).
 * User: Praise
 * Date: 13-9-7
 * Time: 上午11:34
 */
//take a photo
define(function (require, exports, module){
    var $ = require('zepto.min.js');
    var Pop = require('pop.js');
    var type = require('types.js');
    var IO = require("io.js");
    var Utils = require("utils.js");
    var Prompt = require("prompt.js");

    setInterval(function (){
        if(!Utils.network() || (Utils.network() === "4G") || (Utils.network() === "wifi") || (Utils.network() === "3G")){
            return $('#J-normalNetWork').remove();
        }
        if (Utils.network() && (Utils.network() !== "4G") && (Utils.network() !== "wifi") && (Utils.network() !== "3G")) {
            if(!$('#J-normalNetWork').get(0)){
                var normalNetworkHtml = '<div class="flexBox warn normalNetWork" id="J-normalNetWork">'+
                    '<img src="assets/imgs/bulb_red.png" width="24" height="24" alt="警告"/>'+
                    '<span class="box">'+
                    '您当前的网络有些慢哦'+
                    '</span>'+
                    '</div>';
                $('body').prepend(normalNetworkHtml);
                return ;
            }
        }
    }, 500);

    window.alert = function (msg) {
        navigator.notification.alert(
            msg,  // message
            function () {
            },         // callback
            '入库',            // title
            '知道了'                  // buttonName
        );
    };

    var addTypePromptObj = null;
    var addTypeIO = null;

    function queryTypes(){
        type.query(function (data){
            var options = '<option value="">商品分类</option>';
            if(data.bizCode === 1 && data.data && data.data.types.length >= 1){
                var existType = $('#J-types-hide');
                if(existType.get(0)){
                    existType = existType.val();
                }
                $.each(data.data.types, function (i, type){
                    var selected = '';
                    if(existType && (type.id === existType)){
                        selected = "selected";
                    }
                    options += '<option value="'+type.id+'" '+selected+'>'+type.name+'</option>';
                });
            }else{
                options = '<option value="">无商品分类</option>';
            }
            $('#J-typesSelector').html('<select>'+options+'</select>');
            $('#J-typesSelector select').unbind().bind("change", function (){
                if(addTypeIO){
                    $('#J-addType').on("click", addType).html("添加分类");
                    addTypeIO.ajaxObj.abort();
                }
            });
        });
    }

    function addType(){
        if(!addTypePromptObj){
            addTypePromptObj = new Prompt({
                hd: "入库",
                placeholder: "请输入分类名称",
                callback: function (){
                    if(this.val()){
                        $('#J-addType').unbind().html("处理中...");
                        addTypeIO = type.add(this.val(), function (data){
                            if(data.bizCode === 1 && data.data && data.data.id){
                                $('#J-types-hide').val(data.data.id);
                                $('#J-addType').on("click", addType).html("添加分类");
                                queryTypes();
                            }else{
                                $('#J-addType').on("click", addType).html("添加分类");
                            }
                        }, function (){
                            $('#J-addType').on("click", addType).html("添加分类");
                        });
                    }
                }
            });
        }
        addTypePromptObj.render().show().syncStyle();
    }
    queryTypes();
    $('#J-addType').on("click", addType);

    /*上传图片*/
    var nav = $('#J-uploadNav');
    var navBtns = nav.find("a");
    var prev = $('#J-photoPreview');
    var uploadStatus = $('#J-uploadStatus');
    var imageURL = null;
    var quality = 5;
    var ft = null;
    var isUploading = false;
    navBtns.bind("click", function (e){
        e.preventDefault();

        if(isUploading){
           return Utils.tip("当前有图片正在上传，请稍等！", 1500);
        }

        navBtns.removeClass("active");
        $(this).addClass("active");

        if(Utils.network() === "4G" || Utils.network() === "wifi"){
            quality = 100;
        }else if(Utils.network() === "3G"){
            quality = 20;
        }



        if($(this).hasClass("camera")){
            navigator.camera.getPicture(uploadPhoto, function (msg){
                uploadStatus.find(".error");
                uploadStatus.find(".loading");
            },{ quality: quality,
                allowEdit: true,
                destinationType: navigator.camera.DestinationType.FILE_URI });
        }
        if($(this).hasClass("photo")){
            navigator.camera.getPicture(uploadPhoto, function (msg){
                uploadStatus.find(".error");
                uploadStatus.find(".loading");
            },{ quality: quality,
                allowEdit: true,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY });
        }
    });
    function uploadPhoto(imageURI) {
        uploadStatus.find(".error").hide();
        uploadStatus.find(".loading").show();
        imageURL = imageURI;
        prev.html("<img src="+imageURI+" />");
        var options = new FileUploadOptions();
        options.fileKey="file";
        options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
        options.mimeType="image/jpeg";

        if(ft){
            //ft.abort();
        }else{
            ft = new FileTransfer();
        }
        ft.upload(imageURI, "http://jzb.rib.hk/controlers/upload.php?action=phonegap&t="+new Date().getTime(), win, fail, options);
        isUploading = true;
    } 
   
    function win(r) {
        isUploading = false;

        if(!r.response){
            $('#J-pic').val("");
            uploadStatus.find(".error").show();
            uploadStatus.find(".loading").hide();
            return navigator.notification.confirm(
                "商品图片上传失败",  // message
                function (which) {
                    if(which === 1){
                        uploadPhoto(imageURL);
                    }
                },         // callback
                '入库',            // title
                '重试,算了'                  // buttonName
            );
        }

        $('#J-pic').val(r.response);
        uploadStatus.find(".error").hide();
        uploadStatus.find(".loading").hide();
    }

    function fail(error) {
        isUploading = false;

        $('#J-pic').val("");
        uploadStatus.find(".error").show();
        uploadStatus.find(".loading").hide();
        navigator.notification.confirm(
            "上传商品图片出错",  // message
            function (which) {
                if(which === 1){
                    uploadPhoto(imageURL);
                }
            },         // callback
            '入库',            // title
            '重试,算了'                  // buttonName
        );
    }

    /*添加属性*/
//    var addBtn = $('#J-addProps-btn');
//    var pop = null;
//    var addPropsForm = function (){
//        var html = '<form class="addPropsForm form-default" novalidate>'+
//            '<div class="input-skin first-child">'+
//            '<div class="box"><input autocapitalize="off" type="text" placeholder="属性名称,如:颜色" class="J-propName-input"></div>'+
//            '</div>'+
//            '<div class="input-skin flexBox propsBox last-child">'+
//            '<p>属性值</p>'+
//            '<div class="box" id="J-propValsContainer">'+
//            '<div class="valueBox"><input autocapitalize="off" type="text" placeholder="如：红色" /></div>'+
//            '<a href="javascript:void(0)" class="J-addValue-btn">增加一个属性值</a>' +
//            '</div>'+
//            '</div>'+
//            '</form>';
//        pop = pop || new Pop({
//            hd: "添加商品属性",
//            bd: html,
//            bindUI: function (){
//                bindUI.call(this);
//            },
//            styles: {
//                width: 260
//            }
//        });
//        function bindUI(){
//            var delBtns = $('.J-delProp');
//            delBtns.unbind().bind("click", function (e){
//                $(this).parent().remove();
//            });
//            $('.J-addValue-btn').unbind().bind('click', function (e){
//                e.preventDefault();
//                var html =  '<div class="valueBox">'+
//                    '<input autocapitalize="off" type="text" /><span class="J-delProp btn btn-del">删除</span>' +
//                    '</div>';
//                if($('.noProps').get(0)){
//                    $('.noProps').remove();
//                }
//                $('#J-propValsContainer').prepend(html);
//                bindUI();
//            });
//            pop.ft.find('.btn1').unbind().bind('click', function (e){
//                e.preventDefault();
//                var names = $('.addPropsForm .J-propName-input');
//                var values = [];
//                var namesVal = [];
//                var valueBoxes = $('#J-propValsContainer input[type=text]');
//                var propsContainer = $('#J-propsHTMLBox');
//                var error = false;
//                if(names.length <= 0){
//                    return alert("缺少属性名称");
//                }
//                if(names.length >= 1){
//                    $.each(names, function (i, name){
//                        if(!$.trim($(name).val())){
//                            if(names.length === 1){
//                                alert("属性名称不能为空");
//                            }else{
//                                alert("第"+(i+1)+"个属性名称不能为空");
//                            }
//                            error = true;
//                            return false;
//                        }
//                    });
//                }
//                if(error){
//                    return;
//                }
//                if(valueBoxes.length <= 0){
//                    return alert('缺少属性值');
//                }
//                if(valueBoxes.length >= 1){
//                    $.each(valueBoxes, function (i, valueBox){
//                        if(!$.trim($(valueBox).val())){
//                            alert("第"+(i+1)+"个属性值不能为空");
//                            error = true;
//                            return false;
//                        }
//                    });
//                }
//                if(error){
//                    return;
//                }
//                $.each(valueBoxes, function (i, box){
//                    values.push($.trim($(box).val()));
//                });
//                $.each(names, function (j, name){
//                    namesVal.push($.trim($(name).val()));
//                });
//                if(propsContainer.find('.prop').length <= 0){
//                    propsContainer.html('');
//                }
//                var html = '<div class="prop"><span class="v">'+namesVal[0]+':'+values.join(",")+'</span>' +
//                    '<span class="btn btn-del">删除</span>'
//                '</div>';
//                propsContainer.append(html);
//                syncProperties();
//                pop.hide();
//                $('#J-propsHTMLBox .btn-del').unbind().bind('click', function (){
//                    $(this).parent().remove();
//                    syncProperties();
//                    if($('#J-propsHTMLBox .prop').length <= 0){
//                        return $('#J-propsHTMLBox').html('暂无商品属性');
//                    }
//                });
//                function syncProperties(){
//                    var node = $('#J-properties-field');
//                    var props = propsContainer.find('.prop .v');
//                    var value = [];
//                    $.each(props, function (i, p){
//                        value.push($.trim($.trim($(p).html())));
//                    });
//                    node.val(value.join('|'));
//                }
//                return false;
//            });
//        }
//        pop.render().show().syncStyle();
//    };
//    addBtn.on('click', function (e){
//        e.preventDefault();
//        addPropsForm();
//    });

    $('#J-addPropduct-btn').click(function (e){
        e.preventDefault();
        sendAddRequest();
    });

    var addRequestTimer = null;
    function sendAddRequest(){
        var pNameNode = $('#name');
        var pPriceNode = $('#price');
        var pCount = $('#count'); 
        var photo = $('#J-pic');

        if(uploadStatus.find(".error").css("display") !== "none"){
            Utils.tip("上传商品失败，尝试重新选择图片");
            return;
        }

        if(!$.trim(photo.val()) && (uploadStatus.find(".loading").css("display") === "none" && uploadStatus.find(".error").css("display") === "none")){
            alert('请上传商品图片');
            window.scrollTo(0, 0);
            return false;
        }else if(!$.trim(pNameNode.val())){
            alert('名称不能为空');
            window.scrollTo(0, pNameNode.offset().top);
            return false;
        }else if(!$.trim(pPriceNode.val())){
            window.scrollTo(0, pPriceNode.offset().top);
            alert('单价不能为空');
            return false;
        }else if(!$.trim(pCount.val())){
            window.scrollTo(0, pCount.offset().top);
            alert('数量不能为空');
            return false;
        }else if(!/^\d+$/.test($.trim(pCount.val()))){
            window.scrollTo(0, pCount.offset().top);
            alert('数量必须为数字');
            return false;
        }else if(!$('#J-typesSelector select').val()){
            alert("请选择一个商品分类");
            window.scrollTo(0, $('#J-typesSelector select').offset().top);
            return false;
        }

        if(uploadStatus.find(".loading").css("display") !== "none"){
            Utils.tip("正在提交商品图片...");
            $('#J-addPropduct-btn').unbind().bind('click', function (e){
                e.preventDefault();
            }).html("请等待...");
            if(addRequestTimer){
                clearInterval(addRequestTimer);
            }
            addRequestTimer = setInterval(function (){
                sendAddRequest();
            }, 1000);
            return;
        }

        var data = "action=add&name="+$.trim(pNameNode.val())+"&price="+$.trim(pPriceNode.val())+"&count="+
            $.trim(pCount.val())+"&type="+$('#J-typesSelector select').val()+"&attachment="+$.trim(photo.val())+
            "&props="+$.trim($('#J-properties-field').val());

        $('#J-addPropduct-btn').unbind().bind('click', function (e){
            e.preventDefault();
        }).html("正在入库...");

        if(addRequestTimer){
            clearInterval(addRequestTimer);
        }

        new IO({
            url: "products.php",
            data: data,
            timeoutcallback: function (){
                navigator.notification.alert(
                    "入库超时，请重试！",  // message
                    function () {
                        $('#J-addPropduct-btn').unbind().click(function (e){
                            e.preventDefault();
                            sendAddRequest();
                        }).html('录入');
                    },         // callback
                    '入库',            // title
                    '知道了'                  // buttonName
                );
            },
            on: {
                success: function (data){
                    if(data.bizCode !== 1){
                        return navigator.notification.confirm("", function (which){
                            if(which === 1){
                                sendAddRequest();
                            }else if(which === 2){
                                $('#J-addPropduct-btn').unbind().click(function (e){
                                    e.preventDefault();
                                    sendAddRequest();
                                }).html('录入');
                            } 
                        }, data.memo, "重试,取消");  
                    }  
 
                    alert(""+$.trim(pNameNode.val())+" 入库成功");
                    location.reload();
                },
                error: function (data){
                    if(!Utils.network()){
                        $('#J-addPropduct-btn').unbind().click(function (e){
                            e.preventDefault();
                            sendAddRequest();
                        }).html('录入');
                        return;
                    }
                    navigator.notification.confirm("", function (which){
                        if(which === 1){
                            sendAddRequest();
                        }else if(which === 2){
                            $('#J-addPropduct-btn').unbind().click(function (e){
                                e.preventDefault();
                                sendAddRequest();
                            }).html('录入');
                        }
                    }, "入库失败", "重试,取消");
                } 
            }
        }).send();
    }
});



