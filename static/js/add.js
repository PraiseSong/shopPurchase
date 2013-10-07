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
    var pop = null;
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
        pop = pop || new $.Pop({
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

        $(this).unbind().bind('click', function (e){
            return false;
        }).html("提交中...");
    });
});

/**
 * 查询分类
 */
$(function (){
    var typesBox = $('.typesBox');
    var api = 'controler/types.php';
    var pop = null;
    var addTypeBtnHTML = '<a href="javascript:void(0)" id="J-addType">&#43; 添加分类</a>';

    queryTypes();

    function noData(){
        typesBox.html('<p>暂无商品分类</p>'+addTypeBtnHTML);
        bindUI();
    }

    function bindUI(){
        var addbtn = $('#J-addType');
        var typeSelect = $('#J-types');
        addbtn.get(0) && addbtn.unbind().bind('click', function (e){
            e.preventDefault();
            var html = '<div class="filed-group"><label>名称</label><input type="text" id="J-typeName" /></div>';
            pop = new $.Pop({
                hd: "添加商品分类",
                bd: html,
                bindUI: function (){
                    this.ft.find('.btn1').bind("click", function (e){
                        e.preventDefault();
                        var name = $.trim($('#J-typeName').val());
                        if(!name){
                            $('#J-typeName').focus();
                            return alert("请输入分类名称");
                        }else if(name.length === 1){
                            $('#J-typeName').focus();
                            return alert('分类名称至少要2个字符吧');
                        }

                        addType();
                    })
                },
                styles: {
                    height: "auto"
                }
            });
            pop.render().show().syncStyle();
        });

        typeSelect.get(0) && typeSelect.unbind().bind("change", function (){
            syncTypeHidden();
        });
    }

    function syncTypeHidden(){
        var options = $('#J-types').find("option");
        var id = null;
        $.each(options, function (i, o){
            if($(o).attr("selected")){
                id = $(o).attr("data-id");
                return false;
            }
        });
        $('#J-types-hide').val(id);
    }

    function addType(){
        $.ajax({
            url: api,
            data: "action=add&name="+encodeURI($.trim($('#J-typeName').val())),
            dataType: "json",
            type: "POST",
            success: function (data){
                if(data.code === 1 && data.data){
                    console.log("添加分类成功");
                    queryTypes();
                    pop.hide();
                }
            }
        });
    }

    function queryTypes(){
        $.ajax({
            url: api,
            data: "action=query",
            dataType: "json",
            type: "POST",
            success: function (data){
                if(data.code === 1){
                    if(data.data.length >= 1){
                        renderTypes(data.data);
                    }else{
                        noData();
                    }
                }
            }
        });
    }

    function renderTypes(data){
        var html = '<select id="J-types" class="full-screen">';
        $.each(data, function (i, type){
            var currentName = $('#J-typeName').get(0) && $.trim($('#J-typeName').val());
            var selected = '';
            if(currentName && type.name === currentName){
                selected = "selected";
            }
            html += '<option data-id="'+type.id+'" '+selected+'>'+type.name+'</option>';
        });
        html += '</select>';
        html += addTypeBtnHTML;
        typesBox.html(html);
        bindUI();
        syncTypeHidden();
    }
});


