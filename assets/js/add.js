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
    function addType(){
        var prompt = window.prompt("请输入分类名称");
        if(prompt){
           type.add(prompt, function (data){console.log(data)
               if(data.bizCode === 1 && data.data && data.data.id){
                   $('#J-types-hide').val(data.data.id);
                   queryTypes();
               }else{
                   alert(data.memo);
               }
           });
        }
    }
    queryTypes();
    $('#J-addType').on("click", addType);

    /*上传图片*/
    var btn = $('#J-takePhoto-btn');
    var prev = $('#J-photoPreview');
    function readURL(input) {
        if (input.files && input.files[0]) {
            if(window.FileReader){
                var reader = new FileReader();
                reader.onload = function (e) {
                    if(e.target.result.indexOf("data:image") < 0){
                        return alert("您上传的可能不是图片！");
                    }
                    prev.html('<img src="'+e.target.result+'">');
                }

                reader.readAsDataURL(input.files[0]);
            }else{
                alert('对不起，您的设备不支持高级上传功能');
            }
        }
    }
    var takePhoto = function (e){
        e.preventDefault();
        readURL(btn[0]);
    };
    btn.on('change', takePhoto);
    btn.on('click', function (){
        $(this).val('');
        prev.html('加载中...');
    });

    /*添加属性*/
    var addBtn = $('#J-addProps-btn');
    var pop = null;
    var addPropsForm = function (){
        var html = '<form class="addPropsForm form-default" novalidate>'+
            '<div class="input-skin first-child">'+
            '<div class="box"><input autocapitalize="off" type="text" placeholder="属性名称,如:颜色" class="J-propName-input"></div>'+
            '</div>'+
            '<div class="input-skin flexBox propsBox last-child">'+
            '<p>属性值</p>'+
            '<div class="box" id="J-propValsContainer">'+
            '<div class="valueBox"><input autocapitalize="off" type="text" placeholder="如：红色" /></div>'+
            '<a href="javascript:void(0)" class="J-addValue-btn">增加一个属性值</a>' +
            '</div>'+
            '</div>'+
            '</form>';
        pop = pop || new Pop({
            hd: "添加商品属性",
            bd: html,
            bindUI: function (){
                bindUI.call(this);
            },
            styles: {
                width: 260
            }
        });
        function bindUI(){
            var delBtns = $('.J-delProp');
            delBtns.unbind().bind("click", function (e){
                $(this).parent().remove();
            });
            $('.J-addValue-btn').unbind().bind('click', function (e){
                e.preventDefault();
                var html =  '<div class="valueBox">'+
                    '<input autocapitalize="off" type="text" /><span class="J-delProp btn btn-del">删除</span>' +
                    '</div>';
                if($('.noProps').get(0)){
                    $('.noProps').remove();
                }
                $('#J-propValsContainer').prepend(html);
                bindUI();
            });
            pop.ft.find('.btn1').unbind().bind('click', function (e){
                e.preventDefault();
                var names = $('.addPropsForm .J-propName-input');
                var values = [];
                var namesVal = [];
                var valueBoxes = $('#J-propValsContainer input[type=text]');
                var propsContainer = $('#J-propsHTMLBox');
                var error = false;
                if(names.length <= 0){
                    return alert("缺少属性名称");
                }
                if(names.length >= 1){
                    $.each(names, function (i, name){
                        if(!$.trim($(name).val())){
                            if(names.length === 1){
                                alert("属性名称不能为空");
                            }else{
                                alert("第"+(i+1)+"个属性名称不能为空");
                            }
                            error = true;
                            return false;
                        }
                    });
                }
                if(error){
                    return;
                }
                if(valueBoxes.length <= 0){
                    return alert('缺少属性值');
                }
                if(valueBoxes.length >= 1){
                    $.each(valueBoxes, function (i, valueBox){
                        if(!$.trim($(valueBox).val())){
                            alert("第"+(i+1)+"个属性值不能为空");
                            error = true;
                            return false;
                        }
                    });
                }
                if(error){
                    return;
                }
                $.each(valueBoxes, function (i, box){
                    values.push($.trim($(box).val()));
                });
                $.each(names, function (j, name){
                    namesVal.push($.trim($(name).val()));
                });
                if(propsContainer.find('.prop').length <= 0){
                    propsContainer.html('');
                }
                var html = '<div class="prop"><span class="v">'+namesVal[0]+':'+values.join(",")+'</span>' +
                    '<span class="btn btn-del">删除</span>'
                '</div>';
                propsContainer.append(html);
                syncProperties();
                pop.hide();
                $('#J-propsHTMLBox .btn-del').unbind().bind('click', function (){
                    $(this).parent().remove();
                    syncProperties();
                    if($('#J-propsHTMLBox .prop').length <= 0){
                        return $('#J-propsHTMLBox').html('暂无商品属性');
                    }
                });
                function syncProperties(){
                    var node = $('#J-properties-field');
                    var props = propsContainer.find('.prop .v');
                    var value = [];
                    $.each(props, function (i, p){
                        value.push($.trim($.trim($(p).html())));
                    });
                    node.val(value.join('|'));
                }
                return false;
            });
        }
        pop.render().show().syncStyle();
    };
    addBtn.on('click', function (e){
        e.preventDefault();
        addPropsForm();
    });

    $('#J-addPropduct-btn').click(function (e){
        var pNameNode = $('#name');
        var pPriceNode = $('#price');
        var pCount = $('#count');
        var from = $('input[name=from]');
        var man = $('input[name=man]');
        var photo = $('#J-takePhoto-btn');
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
        }else if(!$.trim(pCount.val())){
            pCount.focus();
            alert('数量不能为空');
            return false;
        }else if(!/^\d+$/.test($.trim(pCount.val()))){
            pCount.select().focus();
            alert('数量必须为数字');
            return false;
        }

        $.each(from, function (i, f){
            if($(f).attr('checked')){
                hasFrom = true;
                return false;
            }
        });
        $.each(man, function (i, f){
            if($(f).attr('checked')){
                hasMan = true;
                return false;
            }
        });

//        if(!hasMan){
//            alert('必须选择一个采购人');
//            return false;
//        }else if(!hasFrom){
//            alert('必须选择一个采购源');
//            return false;
//        }
        if(photo.get(0) && !$.trim(photo.val())){
            alert('请上传商品图片');
            return false;
        }

        if($('.kc').get(0)){
            $('#count').val($('#count').val()*1+$('.kc').html()*1);
        }

        $(this).unbind().bind('click', function (e){
            return false;
        }).html("提交中...");
    });
});



