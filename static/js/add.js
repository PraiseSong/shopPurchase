/**
 * Created with Praise Song(http://labs.cross.hk).
 * User: Praise
 * Date: 13-9-7
 * Time: 上午11:34
 */
//take a photo
$(function (){
    /*上传图片*/
    var btn = $('#J-takePhoto-btn');
    var prev = $('.J-photoPreview');
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                if(e.target.result.indexOf("data:image") < 0){
                    return alert("您上传的可能不是图片！");
                }
                prev.html('<img src="'+e.target.result+'">');
            }

            reader.readAsDataURL(input.files[0]);
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
    var addPropsForm = function (){
        var html = '<form class="addPropsForm" novalidate><fieldset>'+
                        '<div class="filed-group">'+
                            '<label>属性名称</label>'+
                            '<input type="text" placeholder="如：颜色" id="J-propName-input">'+
                        '</div>'+
                        '<div class="filed-group">'+
                            '<label>属性值</label>'+
                            '<div class="J-propValsContainer">'+
                                '<div class="valueBox"><input type="text" placeholder="如：红色" /></div>'+
                                '<a href="javascript:void(0)" class="J-addValue-btn">增加一个属性值</a>' +
                            '</div>'+
                        '</div>'+
                   '</fieldset></form>';
        var pop = new $.Pop({
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
                var valueBoxes = $('.J-propValsContainer .valueBox');
                if(valueBoxes.length <= 1){
                    return false;
                }
                $(this).parent().remove();
            });
            $('.addPropsForm .close').unbind().bind('click', function (e){
                closePop();
                return false;
            });
            $('.J-addValue-btn').unbind().bind('click', function (e){
                e.preventDefault();
                var html =  '<div class="valueBox">'+
                                '<input type="text" /><span class="J-delProp btn btn-del">删除</span>' +
                            '</div>';
                if($('.noProps').get(0)){
                    $('.noProps').remove();
                }
                $('.J-propValsContainer').prepend(html);
                bindUI();
            });
            this.ft.find('.btn1').unbind().bind('click', function (e){
                e.preventDefault();
                var name = $.trim($('.addPropsForm #J-propName-input').val());
                var values = [];
                var valueBoxes = $('.J-propValsContainer input[type=text]');
                var propsContainer = $('.J-propsHTMLBox');
                $.each(valueBoxes, function (i, box){
                    values.push($.trim($(box).val()));
                });
                if(!name){
                    $('.addPropsForm #J-propName-input').focus();
                    return alert("属性名称不能为空");
                }else if(!values.join('')){
                    return alert('属性值不能为空');
                }
                if(propsContainer.find('.prop').length <= 0){
                    propsContainer.html('');
                }
                var html = '<div class="prop"><span class="v">'+name+':'+values.join(",")+'</span>' +
                                '<span class="btn btn-del">删除</span>'
                            '</div>';
                propsContainer.append(html);
                syncProperties();
                pop.hide();
                $('.J-propsHTMLBox .btn-del').unbind().bind('click', function (){
                    $(this).parent().remove();
                    syncProperties();
                    if($('.J-propsHTMLBox .prop').length <= 0){
                        return $('.J-propsHTMLBox').html('暂无商品属性');
                    }
                });
                function syncProperties(){
                    var node = $('.J-properties-field');
                    var props = propsContainer.find('.prop .v');
                    var value = '';
                    $.each(props, function (i, p){
                        value += $.trim($(p).html()) + '|';
                    });
                    node.val(value);
                }
                return false;
            });
        }
        pop.render().show();
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

        if(!hasMan){
            alert('必须选择一个采购人');
            return false;
        }else if(!hasFrom){
            alert('必须选择一个采购源');
            return false;
        }else if(!$.trim(photo.val())){
            alert('请上传商品图片');
            return false;
        }

        $(this).attr("disabled", true).unbind().bind('click', function (e){
            return false;
        });
    });
});


