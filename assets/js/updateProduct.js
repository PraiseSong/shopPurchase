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
    var IO = require("io.js");
    var type = require('types.js');

    function queryTypes(){
        type.query(function (data){
            if(data.bizCode === 1 && data.data && data.data.types.length >= 1){
                var options = '<option value="">商品分类</option>';
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
                $('#J-typesSelector').html('<select>'+options+'</select>');
                $('#J-typesSelector select').unbind().bind("change", function (){
                    $('#J-types-hide').val($('#J-typesSelector select').val());
                });
            }
        });
    }
    queryTypes();

    $('#J-editProduct-btn').click(function (e){
        var pNameNode = $('#name');
        var pPriceNode = $('#price');
        var from = $('input[name=from]');
        var man = $('input[name=man]');
        var photo = $('#J-takePhoto-btn');
        var pCount = $('#count');
        var hasFrom = false;
        var hasMan = false;

        if(!$.trim(pNameNode.val())){
            alert('商品不能为空');
            pNameNode.focus();
            return false;
        }else if(!$.trim(pPriceNode.val())){
            pPriceNode.focus();
            alert('单价不能为空');
            return false;
        }else if($.trim(pCount.val()) && !/^\d+$/.test($.trim(pCount.val()))){
            pCount.select().focus();
            alert('数量必须为数字');
            return false;
        }

        var sure = window.confirm("确认更改么？");
        if(sure){
            $(this).unbind().bind('click', function (e){
                return false;
            }).html("提交中...");
        }else{
            return false;
        }
    });
});



