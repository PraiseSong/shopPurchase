/**
 * Created with Praise Song(http://labs.cross.hk).
 * User: Praise
 * Date: 13-9-7
 * Time: 上午11:34
 */
//take a photo
$(function (){
    /*上传图片*/
    var btn = $('.J-takePhotoBox input[type=file]');
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

    /*添加属性*/
    var addBtn = $('#J-addProps-btn');
    var addPropsForm = function (){
        var html = '<form class="pure-form addPropsForm" novalidate><fieldset>'+
                        '<div class="pure-control-group  filed-group">'+
                            '<label>属性名称</label>'+
                            '<input type="text" placeholder="如：颜色" id="J-propName-input">'+
                        '</div>'+
                        '<div class="pure-control-group  filed-group">'+
                            '<label>属性值</label>'+
                            '<div class="J-propValsContainer">'+
                                '<div class="valueBox"><input type="text" placeholder="如：红色" /></div>'+
                                '<a href="javascript:void(0)" class="J-addValue-btn">增加一个属性值</a>' +
                            '</div>'+
                        '</div>'+
                       '<div class="pure-controls">'+
                            '<button class="pure-button pure-button-error J-addPropVal-btn">确定</button>'+
                            '<button class="pure-button close">关闭</button>'+
                       '</div>'+
                   '</fieldset></form>';
        function renderHTML(html){
            var body = $('body');
            if(!body.find('.addPropsForm').get(0)){
                $('.addPropsForm').remove();
            }
            body.append(html);
        }
        function renderMask(){
            var body = $('body');
            if(!body.find('.mask').get(0)){
                $('.mask').remove();
            }
            body.append('<div class="mask"></div>');
        }
        function adjustStyle(){
            $('.mask').css({
                background: 'rgba(0, 0, 0, .5)',
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 100,
                width: "100%",
                height: $(document).height()
            });
            $('.addPropsForm').css({
                background: '#fff',
                position: "absolute",
                top: ($(window).height()-$('.addPropsForm').height())/2+window.scrollY,
                left: ($(window).width()-250)/2,
                zIndex: 101,
                width: "auto",
                '-webkit-border-radius': "10px",
                '-webkit-box-shadow': '3px 3px 3px rgb(25, 25, 25)'
            });
        }
        function closePop(){
            $('.addPropsForm').remove();
            $('.mask').remove();
        }
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
                                '<input type="text" /><span class="J-delProp">删除</span>' +
                            '</div>';
                if($('.noProps').get(0)){
                    $('.noProps').remove();
                }
                $('.J-propValsContainer').prepend(html);
                bindUI();
            });
            $('.J-addPropVal-btn').unbind().bind('click', function (e){
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
                                '<span class="J-delProp">删除</span>'
                            '</div>';
                propsContainer.append(html);
                syncProperties();
                closePop();
                $('.J-propsHTMLBox .J-delProp').unbind().bind('click', function (){
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
        renderHTML(html);
        renderMask();
        adjustStyle();
        bindUI();
    };
    addBtn.on('click', function (e){
        e.preventDefault();
        addPropsForm();
    });

    $('#J-addPropduct-bttn').click(function (e){
        var pNameNode = $('#name');
        var pPriceNode = $('#price');
        var pCount = $('#count');
        var from = $('input[name=from]');
        var man = $('input[name=man]');
        var photo = $('.J-takePhotoBox input[type=file]');
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
    });
});


