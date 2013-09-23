/**
 * Created with Praise Song(http://labs.cross.hk).
 * User: Praise
 * Date: 13-9-7
 * Time: 下午1:23
 */
//query product
$(function (){
    var dataList = $('.J-dataList');

    var ProductsGetter = {
        pageNum : 1,
        io: function (parameters){
            var parameters = parameters || {};
            var api = 'controler/queryProducts.php';
            $.ajax({
                url: parameters.api || api,
                type: parameters.type || 'post',
                data: parameters.data || '',
                success: ProductsGetter.success,
                dataType: "json"
            });
        },
        Data2HTML: function (data){
            var html = '<li data-id="p_'+data.id+'">'+
                '<div class="imgBox"><img src="'+data.attachment+'" alt="'+data.name+'" /></div>'+
                '<div class="info">'+
                '<p class="pName">'+data.name+'</p>'+
                '<div class="extra">'+
                '<p class="kc">'+data.count+'</p>'+
                '<p class="cb">'+data.price+'</p>'+
                '</div>'+
                '</li>';
            return html;
        },
        success: function (data){
            ProductsGetter.pageNum++;
            if(data.code*1 === 1){
                if(data.products.length > 0){
                    ProductsGetter.render(data.products);
                }else{
                    ProductsGetter.noData(data);
                }
            }else{
                ProductsGetter.failure(data);
            }
        },
        abort: function (){},
        failure: function (){},
        render: function (data){
            var html = '';
            $.each(data, function (i, p){
                var pObj = {
                    id: p.p_id,
                    name: p.p_name,
                    frome: p.p_from,
                    man: p.p_man,
                    count: p.p_count,
                    price: p.p_price,
                    attachment: p.p_pic
                };
                html += ProductsGetter.Data2HTML(pObj);
            });

            dataList.append(html);

            ProductsGetter.bindUI();
        },
        noData: function (){

        },
        bindUI: function (){
            var pName = '';
            var pPrice = 0;
            var pId = null;

            function bindToAddSellPrice(){
                var self = this;
                this.bd.find('.J-add-sellPrice').bind('click', function (e){
                    e.preventDefault();
                    var html = '<div class="webkit-box"><p>价格</p>';
                    html += '<input type="number" class="tag-obj input-text input-popUnitPrice" />';
                    html += '<span class="unit-operator">X</span><select class="J-Pop-countSelector"></select>';
                    html += '<span class="btn btn-del">删除</span></div>';
                    $(this).before(html);
                    bindToDel.call(self);
                });
            }
            function bindToCount(){
                $('#J-sellCount').bind('blur', function (){
                    var val = $(this).val();
                    if(!/\d+/.test(val)){
                        return;
                    }
                    var html = '';
                    var countSelector = $('.J-Pop-countSelector');
                    for(var i = 1; i < (val*1)+1; i++){
                        html += '<option value='+i+'>'+i+'</option>';
                    }
                    countSelector.html(html);
                    var options = countSelector.find("option");
                    countSelector.find("option")[options.length-1].selected = true;
                });
            }
            function bindToDel(){
                this.bd.find('.btn-del').unbind().bind('click', function (e){
                    $(this).parent().remove();
                });
            }
            function bindToOK(){
                var btn = this.ft.find("btn1");
                var sellCount = $.trim($('#J-sellCount').val())*1;

            }
            var html = '<div class="webkit-box"><p>数量</p><input type="tel" class="tag-obj input-text" id="J-sellCount" />';
            html += '</div>';
            html += '<div class="webkit-box"><p>价格</p><input type="number" class="tag-obj input-text input-popUnitPrice" />';
            html += '<span class="unit-operator">X</span><select class="J-Pop-countSelector"></select>';
            html += '</div>';
            html += '<a href="javascript:void(0)" class="J-add-sellPrice">增加一种价格</a>';
            ProductsGetter.pop = ProductsGetter.pop || new $.Pop({
                bd: html,
                bindUI: function (){
                    bindToAddSellPrice.call(this);
                    bindToCount.call(this);
                    bindToOK.call(this);
                }
            });
            ProductsGetter.pop.render();
            var fn = function (e){
                pName = $.trim($(this).find('.pName').html());
                pId = $.trim($(this).attr("data-id"));
                pPrice = $.trim($(this).find('.cb').html())*1;
                ProductsGetter.pop.show().hd.html(pName+' 的销售');
                ProductsGetter.pop.bd.html(html);
                ProductsGetter.pop.bindUI();
            };
            dataList.find("li").unbind().bind('click', fn);
        }
    };

    ProductsGetter.io({
        data: "page="+ProductsGetter.pageNum+"&limit=2"
    });

    $('#J-loadMore-bttn').click(function (e){
        e.preventDefault();
        ProductsGetter.io({
            data: "page="+ProductsGetter.pageNum+"&limit=2"
        });
    });
});
