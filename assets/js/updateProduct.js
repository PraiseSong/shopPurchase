/**
 * Created with Praise Song(http://labs.cross.hk).
 * User: Praise
 * Date: 13-9-7
 * Time: 上午11:34
 */
//take a photo
define(function (require, exports, module){
    var $ = require('zepto.min.js');
    var type = require('types.js');
    var Utils = require("utils.js");
    var IO = require("io.js");

    window.alert = function (msg) {
        navigator.notification.alert(
            msg,  // message
            function () {
            },         // callback
            '修改商品',            // title
            '知道了'                  // buttonName
        );
    }; 

    var queryString = Utils.queryString2Obj();

    if(queryString && queryString.pageNum){
        var pageNum = queryString.pageNum;
        var id = queryString.id;
        var typeID = queryString.type;

        $('.back').attr("href", $('.back').attr("href")+"?pageNum="+pageNum+"&id="+id+"&type="+typeID);
    }

    function queryProductById(){
        new IO({
            url: "products.php",
            data: "id="+id+"&action=queryById",
            timeoutcallback: function (){
                Utils.loading.hide();
                navigator.notification.confirm(
                    "查询商品超时！",  // message
                    function (which) {
                        if(which === 1){
                            queryProductById();
                        }else if(which === 2){
                            location.href = $('.back').attr("href");
                        }
                    },         // callback
                    '超时',            // title
                    '重试,返回'                  // buttonName
                );
            },
            on: {
                start: function (){
                    Utils.loading.show("获取商品信息...");
                },
                success: function (data){
                    Utils.loading.hide();
                    if(data.bizCode !== 1){
                        navigator.notification.confirm(
                            data.memo,  // message
                            function (which) {
                                if(which === 1){
                                    queryProductById();
                                }else if(which === 2){
                                    location.href = $('.back').attr("href");
                                }
                            },         // callback
                            '查询商品时发生异常',            // title
                            '重试,返回'                  // buttonName
                        );
                    }else if(data.data && data.data.product && data.data.product.p_id){
                        $('#name').val(data.data.product.p_name);
                        $('#price').val(data.data.product.p_price);
                        $('.kc').html(data.data.product.p_count);
                    }
                },
                error: function (data){
                    Utils.loading.hide();
                    navigator.notification.confirm(
                        msg,  // message
                        function (which) {
                            if(which === 1){
                                queryProductById();
                            }else if(which === 2){
                                location.href = $('.back').attr("href");
                            }
                        },         // callback
                        '查询商品时发生异常',            // title
                        '重试,返回'                  // buttonName
                    );
                }
            }
        }).send();
    }

    function queryTypes(){
        type.query(function (data){
            if(data.bizCode === 1 && data.data && data.data.types.length >= 1){
                var options = '<option value="">商品分类</option>';
                $.each(data.data.types, function (i, type){
                    var selected = '';
                    if(typeID && (type.id === typeID)){
                        selected = "selected";
                    }
                    options += '<option value="'+type.id+'" '+selected+'>'+type.name+'</option>';
                });
                $('#J-typesSelector').html('<select>'+options+'</select>');
            }
        });
    } 
    function update(){ 
        var pNameNode = $('#name');
        var pPriceNode = $('#price');
        var pCount = $('#count');

        if(!$.trim(pNameNode.val())){
            return alert("商品名称不能为空！");
        }else if(!$.trim(pPriceNode.val())){
            return alert("商品价格不能为空！");
        }else if(!$('#J-typesSelector select').val()){
            return alert("请选择商品分类！");
        }

        function updateIO(){
            $('#J-editProduct-btn').unbind().bind('click', function (e){
                return false;
            }).html("修改中...");
            new IO({
                url: "products.php",
                data: "id="+id+"&action=update&name="+$.trim(pNameNode.val())+"&from=&man=&type="+$('#J-typesSelector select').val()+
                    "&count="+$.trim(pCount.val())+"&price="+$.trim(pPriceNode.val()),
                timeoutcallback: function (){
                    navigator.notification.confirm(
                        "更新商品超时",  // message
                        function (which) {
                            if(which === 1){
                                updateIO();
                            }else{
                                $('#J-editProduct-btn').unbind().click(update).html("确定");
                            }
                        },         // callback
                        '超时！',            // title
                        '重试,取消'                  // buttonName
                    );
                },
                on: {
                    success: function (data){
                        if(data.bizCode !== 1){
                            navigator.notification.confirm(
                                data.memo,  // message
                                function (which) {
                                    if(which === 1){
                                        updateIO()
                                    }
                                },         // callback
                                '更新失败！',            // title
                                '重试,取消'                  // buttonName
                            );
                        }else if(data.data && data.data.product && data.data.product.p_id){
                            navigator.notification.confirm(
                                $.trim(pNameNode.val()) + " 更新成功",  // message
                                function (which) {
                                    if(which === 1){
                                        $('#name').val(data.data.product.p_name);
                                        $('#price').val(data.data.product.p_price);
                                        $('#kc').val("");
                                        $('.kc').html(data.data.product.p_count);
                                        var options = $('#J-typesSelector option');
                                        $.each(options, function (i, option){
                                            if($(option).val() === data.data.product.p_type){
                                                $(option).attr("selected", "selected");
                                                return false;
                                            }
                                        });
                                    }
                                },         // callback
                                '更新成功！',            // title
                                '知道了,取消'                  // buttonName
                            );
                            $('#J-editProduct-btn').unbind().click(update).html("确定");
                        }
                    },
                    error: function (data){
                        navigator.notification.confirm(
                            msg,  // message
                            function (which) {
                                if(which === 1){
                                    updateIO()
                                }
                            },         // callback
                            '更新商品时发生异常',            // title
                            '重试,取消'                  // buttonName
                        );
                    }
                }
            }).send();
        }
        navigator.notification.confirm(
            "您确认修改 "+pNameNode.val(),  // message
            function (which) {
                if(which === 1){
                    updateIO();
                }
            },         // callback
            '您确认修改？',            // title
            '改,取消'                  // buttonName
        );
    }

    queryTypes();
    $('#J-editProduct-btn').click(update);
    queryProductById();
});



