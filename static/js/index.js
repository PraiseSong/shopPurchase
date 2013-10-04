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
            var html = '<li data-id="'+data.id+'">'+
                '<div class="imgBox" data-src="'+data.attachment+'" data-id="'+data.id+'"><img src="static/imgs/ajax-loader.gif"></div>'+
                '<div class="info">'+
                '<p class="pName">'+data.name+'</p>'+
                '<div class="extra">'+
                '<p class="kcBox">库存：<span class="kc">'+data.count+'</span> 个</p>'+
                '<p class="cbBox">成本：&yen; <span class="cb">'+data.price+'</span>元</p>'+
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
            $('#J-loadMore-btn').click(ioByBtn).html("加载更多");
            $('.init-loading').remove();
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

            var imgs = dataList.find('.imgBox');
            $.each(imgs, function (i, img){
                var id = $(img).attr('data-id');
                if(src = ProductsGetter.getAttachments(id)){
                    var imgHtml = '<img src="'+src+'" />';
                    $(img).attr('data-src', null).html(imgHtml);
                }else if(!$(img).attr('src')){
                    var src = $(img).attr('data-src').split('/');
                    $.ajax({
                        url: "controler/getBase64.php",
                        type: "post",
                        data: "src="+encodeURI(src[1]),
                        success: function (data){
                            var imgHtml = '<img src="'+data+'" />';
                            $(img).attr('data-src', null).html(imgHtml);
                            ProductsGetter.setAttachments(id, data);
                        }
                    });
                }
            });
        },
        /**
         * 根据商品id，在本地保存对应的商品图片的base64
         * @param id
         * @param src
         */
        setAttachments: function (id, src){
            var attachments = localStorage.getItem('attachments');
            if(attachments){
                attachments = JSON.parse(attachments);
            }else{
                attachments = {};
            }
            attachments[id] = src;
            localStorage.setItem('attachments', JSON.stringify(attachments));
        },
        /**
         * 获取本地存储的产品图片的base64字符
         * @param id 商品id
         * @returns String 返回商品图片的base64
         */
        getAttachments: function (id){
            var attachments = localStorage.getItem('attachments');
            if(attachments){
                attachments = JSON.parse(attachments);
            }else{
                return null;
            }

            return attachments[id];
        },
        noData: function (){
            $('.datalist-status').show();
            ProductsGetter.dataStatusTimers && clearTimeout(ProductsGetter.dataStatusTimers);
            ProductsGetter.dataStatusTimers = setTimeout(function (){
                $('.datalist-status').hide();
            }, 5000)
        },
        bindUI: function (){
            var pName = '';
            var pPrice = 0;
            var pId = null;
            var pMan = '';
            var sellCount = 0;
            var currentProduct = null;

            function bindToAddSellPrice(){
                var self = this;
                this.bd.find('.J-add-sellPrice').bind('click', function (e){
                    e.preventDefault();
                    var html = '<div class="webkit-box"><p>价格</p>';
                    html += '<input type="number" class="tag-obj input-text input-popUnitPrice" />';
                    html += '<span class="unit-operator">X</span><select class="J-Pop-countSelector"></select>个';
                    html += '<span class="btn btn-del">删除</span></div>';
                    $(this).before(html);
                    renderCountSelector();
                    bindToDel.call(self);
                });
            }
            function renderCountSelector(){
                var val = $('#J-sellCount').val();
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
                for(var j = 0; j < countSelector.length; j++){
                    var s = countSelector[j];
                    var ops = $(s).find('option');
                    ops[ops.length-1].selected = true;
                }
            }
            function bindToCount(){
                $('#J-sellCount').bind('blur', function (){
                    renderCountSelector();
                });
            }
            function bindToDel(){
                this.bd.find('.btn-del').unbind().bind('click', function (e){
                    $(this).parent().remove();
                });
            }
            function bindToOK(){
                var self = this;
                var btn = this.ft.find(".btn1");

                btn.unbind().bind('click', function (e){
                    e.preventDefault();
                    sellCount = $.trim($('#J-sellCount').val())*1;
                    if(!sellCount){
                        return alert('销售数量不能为空');
                    }else if(!/\d+/.test(sellCount)){
                        return alert('销售数量必须是正数');
                    }
                    var countSelector = $('.J-Pop-countSelector');
                    var unitPrices = $('.input-popUnitPrice');
                    var selectorsVal = 0;
                    $.each(countSelector, function (i, s){
                        selectorsVal += $(s).val()*1;
                    });
                    if(selectorsVal !== sellCount){
                        return alert('总销售数量不匹配');
                    }

                    var sellDetail = '';
                    $.each(unitPrices, function (i, price){
                        if(!$.trim($(price).val())){
                            sellDetail += '';
                        }else{
                            sellDetail += $.trim($(price).val())+'*'+$(countSelector[i]).val();
                        }
                        if(sellDetail){
                            sellDetail += '|';
                        }
                    });
                    if(!sellDetail){
                        return alert("价格还没有录入");
                    }
                    pMan = self.bd.find('input[name=man]').val();
                    var data = 'count='+sellCount+"&id="+pId+'&detail='+sellDetail+'&man='+encodeURI(pMan);
                    sellRecordIO(data);
                    ProductsGetter.pop.hide();
                });
            }
            function sellRecordIO(data){
                $.ajax({
                    url: "controler/sellRecord.php",
                    data: data || "",
                    dataType: 'json',
                    type: "POST",
                    success: function (data){
                        if(data.code){
                            var newCount = currentProduct.find(".kc").html()*1 - sellCount;
                            currentProduct.find(".kc").html(newCount);
                            queryTodayOperation();
                        }
                    }
                });
            }
            var html = '<div class="webkit-box manBox"><p>谁？</p><div class="tag-obj">';
            html += '<label><input type="radio" name="man" checked value="黄伟丽">黄伟丽</label>';
            html += '<label><input type="radio" name="man" value="朱琦">朱琦</label>';
            html += '</div></div>';
            html += '<div class="webkit-box"><p>数量</p><input type="tel" class="tag-obj input-text" id="J-sellCount" />';
            html += '</div>';
            html += '<div class="webkit-box"><p>价格</p><input type="number" class="tag-obj input-text input-popUnitPrice" />';
            html += '<span class="unit-operator">X</span><select class="J-Pop-countSelector"></select>个';
            html += '</div>';
            html += '<a href="javascript:void(0)" class="J-add-sellPrice">增加一种价格</a>';
            ProductsGetter.pop = ProductsGetter.pop || new $.Pop({
                bd: html,
                bindUI: function (){
                    bindToAddSellPrice.call(this);
                    bindToCount.call(this);
                    bindToOK.call(this);
                },
                styles: {
                    width: 260
                }
            });
            ProductsGetter.pop.render();
            var fn = function (e){
                currentProduct = $(this);
                pName = $.trim($(this).find('.pName').html());
                pId = $.trim($(this).attr("data-id"));
                pPrice = $.trim($(this).find('.cb').html())*1;
                ProductsGetter.pop.show().hd.html(pName+' 的销售');
                ProductsGetter.pop.bd.html(html);
                ProductsGetter.pop.bindUI();
                ProductsGetter.pop.syncStyle();
            };
            dataList.find("li").unbind().bind('click', fn);
        }
    };

    ProductsGetter.io({
        data: "page="+ProductsGetter.pageNum+"&limit=10&attachmentsType=base64"
    });

    function ioByBtn(e){
        e.preventDefault();
        $('#J-loadMore-btn').html('<img src="static/imgs/ajax-loader.gif" />请求中...').unbind();
        ProductsGetter.io({
           data: "page="+ProductsGetter.pageNum+"&limit=10&attachmentsType=base64"
        });
    }
    $('#J-loadMore-btn').click(ioByBtn);

    /**
     * 查询今日运营情况
     */
    function queryTodayOperation(){
        var today = $('.todayOperation');
        var yyeNode = today.find('.yye'),
            lrNode = today.find('.lr'),
            cbNode = today.find('.cb');

        var api = 'controler/queryTodayOperation.php';

        $.ajax({
            url: api,
            dataType: "json",
            type: "POST",
            success: function (data){
                if(data.code){
                    renderTodayOperation(data.result);
                }
            }
        });

        function renderTodayOperation(data){
            var cb = 0;
            var lr = 0;
            var yye = 0;
            $.each(data, function (i, o){
                var price = o.p_price * 1;
                var detail = o.detail.split('|');
                $.each(detail, function (j, d){
                    if(d){
                        var de = d.split('*');
                        var selledPrice = de[0];
                        var selledCount = de[1];
                        yye += selledPrice * selledCount;
                        cb += price * selledCount;
                    }
                });
            });

            yyeNode.html(yye);
            cbNode.html(cb);
            lrNode.html(yye-cb);
        }
    }
    queryTodayOperation();
});
