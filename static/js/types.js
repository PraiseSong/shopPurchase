/**
 * Created with JetBrains PhpStorm.
 * User: praise
 * Date: 11/2/13
 * Time: 11:16 AM
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module){
    var $ = require('zepto.min.js');
    var Widgets = require('widgets.js');

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
            pop = new Widgets.Pop({
                hd: "添加商品分类",
                bd: html,
                bindUI: function (){
                    var self = this;
                    this.ft.find('.btn1').unbind().bind("click", function (e){
                        e.preventDefault();
                        var name = $.trim($('#J-typeName').val());
                        if(!name){
                            $('#J-typeName').focus();
                            return alert("请输入分类名称");
                        }else if(name.length === 1){
                            $('#J-typeName').focus();
                            return alert('分类名称至少要2个字符吧');
                        }

                        addType.call(self);
                    })
                },
                styles: {
                    height: "auto"
                }
            });
            pop.render().show().syncStyle();
        });

        typeSelect.get(0) && typeSelect.unbind().bind("change", function (){
            syncTypeHidden.call();
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
        var self = this;
        $.ajax({
            url: api,
            data: "action=add&name="+encodeURI($.trim(self.bd.find('#J-typeName').val())),
            dataType: "json",
            type: "POST",
            success: function (data){
                if(data.bizCode === 1 && data.data.types){
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
                if(data.bizCode === 1){
                    if(data.data.types.length >= 1){
                        renderTypes(data.data.types);
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
            var currentName = pop && $.trim(pop.bd.find('#J-typeName').val());
            var selected = '';
            if(currentName && type.name === currentName){
                selected = "selected";
            }else if($('#J-types-hide').val() && type.id === $('#J-types-hide').val()){
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