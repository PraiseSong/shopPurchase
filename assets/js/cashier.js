/**
 * Created with JetBrains PhpStorm.
 * User: praise
 * Date: 10/19/13
 * Time: 11:41 PM
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module){
    var $ = require('zepto.min.js');
    var IO = require("io.js");
    require("userAuth.js");

    $('#J-showPerfBtn').on("click", function (){
        showPerf();
    });
    $('#J-perf .close').on("click", function (){
        hidePerf();
    });
    $('#J-queryProductsBtn').on('click', function (e){
        e.preventDefault();
        gotoQueryProducts();
    });
    $('#J-backToCashierBtn').on("click", function (e){
        e.preventDefault();
        gotoCashier();
    });
    $('#J-addPriceBtn').on("click", function (){
        addPrice();
    });
    $('#J-soldCount').on("blur", function (){
        changePricesSelect();
    });
    $('#J-queryBtn').on("click", function (){
        pageNum = 1;
        queryProducts();
    });
    $('#J-requestMoreBtn').on("click", function (){
        queryProducts();
    });
    setTimeout(function (){
        var type = require("types.js");
        type.query(function (data){
            if(data.bizCode === 1 && data.data && data.data.types.length >= 1){
                var options = '<option value="">商品分类</option>';
                $.each(data.data.types, function (i, type){
                    options += '<option value="'+type.id+'">'+type.name+'</option>';
                });
                $('#J-parentTypes').html(options);
                $('#J-parentTypes').unbind().bind("change", function (){
                    pageNum = 1;
                    queryProducts();
                });
            }
        });
    }, 2000);

    function gotoCashier(){
        window.scrollTo(0, 0);
        $('#J-cashierContainer').show();
        $('#J-queryProductsContainer').hide();
    }
    function gotoQueryProducts(){
        window.scrollTo(0, 0);
        $('#J-cashierContainer').hide();
        $('#J-queryProductsContainer').show();
    }
    function addPrice(){
        var count = getCount();
        if(!count){
            return ;
        }else if(count === 1){
            return alert('当前销售数量为1，不能增加其它价格');
        }
        var selects = $('#J-prices select');
        var selectedCount = 0;
        var options = '';
        $.each(selects, function (i, select){
            var val = $(select).val();
            if($.trim(val) && /^\d+$/.test(val*1)){
                selectedCount+=val*1;
            }
        });
        for(var i=1;i<count+1;i++){
            var selected = '';
            if(i === (count-selectedCount)){
                selected = "selected";
            }
            options += '<option value="'+i+'" '+selected+'>'+i+'</option>';
        }
        var html = '<li class="flexBox">'+
            '<input type="number" autocapitalize="off" class="box" />'+
            '<span>&Chi;</span>'+
            '<select class="box">'+
            options+
            '</select>'+
            '<span class="box J-del">删除</span>'+
        '</li>';
        $('#J-prices').append(html);
        $('#J-prices .J-del').unbind().bind("click", function (e){
            $(this).parent().remove();
        });
    }
    function showPerf(){
        $('#J-perf').show();
        $('#J-showPerfBtn').hide();
    }
    function hidePerf(){
        $('#J-showPerfBtn').show();
        $('#J-perf').hide();
    }
    function changePricesSelect(){
        var count = getCount();
        if(count){
            var selects = $('#J-prices select');
            var options = '';
            for(var i=1;i<count+1;i++){
                options += '<option value="'+i+'">'+i+'</option>';
            }
            $.each(selects, function (i, select){
                $(select).html(options);
            });
        }
    }
    function getCount(){
        var count = $.trim($('#J-soldCount').val());
        if(!count){
            alert("请填写销售数量");
            return false;
        }else if(count*1 === 0){
            alert("销售数量不能为0");
            return false;
        }else if(!/^\d+$/.test(count)){
            alert("销售数量必须是整数");
            return false;
        }
        count = count*1;
        return count;
    }
    var pageNum = 1;
    function queryProducts(){
        var parentType = $.trim($('#J-parentTypes').val());
        var searchText = $.trim($('#J-searchText').val());
        var data = '';
        if(parentType){
            data+="type="+parentType;
        }
        if(searchText){
            if(data){
                data+='&name='+encodeURI(searchText);
            }else{
                data+='name='+encodeURI(searchText);
            }
        }
        if(data){
            new IO({
                url: "controler/queryProducts.php",
                data: data+"&pageNum="+pageNum,
                on: {
                    success: function (result){
                        if(result.bizCode === 1){
                            if(result.data.products.length >= 1){
                                pageNum++;
                                renderProducts(data);
                            }else{
                                noData(data);
                            }
                        }
                    }
                }
            }).send();
        }
    }
    function noData(data){
        console.log(data)
    }
    function renderProducts(data){
        console.log(data);
    }
});