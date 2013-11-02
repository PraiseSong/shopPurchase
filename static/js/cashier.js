/**
 * Created with JetBrains PhpStorm.
 * User: praise
 * Date: 10/31/13
 * Time: 7:38 PM
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module){
    var Widgets = require('widgets.js');
    var $ = require('zepto.min.js');

    var pop = null;

    var Cashier = {
        show: function (cfg){
            Cashier.productMan = '';//销售员
            Cashier.sellCount= 0;//销售数量

            //绑定事件到增加一个销售价格的按钮上
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
            //渲染一个销售量下拉列表
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
            //销售blur事件到销售数量
            function bindToCount(){
                $('#J-sellCount').bind('blur', function (){
                    renderCountSelector();
                });
            }
            //绑定事件到删除一个价格
            function bindToDel(){
                this.bd.find('.btn-del').unbind().bind('click', function (e){
                    $(this).parent().remove();
                });
            }
            //绑定事件到确定提交销售数据的按钮
            function bindToOK(){
                var self = this;
                var btn = this.ft.find(".btn1");

                btn.unbind().bind('click', function (e){
                    e.preventDefault();
                    Cashier.sellCount = $.trim($('#J-sellCount').val())*1;
                    if(!Cashier.sellCount){
                        return alert('销售数量不能为空');
                    }else if(!/\d+/.test(Cashier.sellCount)){
                        return alert('销售数量必须是正数');
                    }

                    var countSelector = $('.J-Pop-countSelector');
                    var unitPrices = $('.input-popUnitPrice');
                    var selectorsVal = 0;
                    $.each(countSelector, function (i, s){
                        selectorsVal += $(s).val()*1;
                    });
                    if(selectorsVal !== Cashier.sellCount){
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
                    Cashier.productMan = self.bd.find('input[name=man]').val();
                    var data = 'count='+Cashier.sellCount+"&id="+Cashier.currentProductID+'&detail='+sellDetail+'&man='+encodeURI(Cashier.productMan);
                    sellRecordIO(data);
                    pop.hide();
                });
            }
            //发送收款请求
            function sellRecordIO(data){
                new Widgets.IO({
                    data: data,
                    url: "controler/sellRecord.php",
                    on: {
                        success: function (data){
                            if(data.bizCode === 1){
                                cfg.success && cfg.success.call(Cashier, data);
                            }
                        }
                    }
                }).send();
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

            pop = pop || new Widgets.Pop({
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
            pop.render();

            Cashier.currentProduct = cfg.product;
            Cashier.currentProductName = $.trim(cfg.product.find('.pName').html());//当前产品名称
            Cashier.currentProductID = $.trim(cfg.product.attr("data-id"));//当前产品id
            Cashier.currentCB = $.trim(cfg.product.find('.cb').html())*1;//当前产品的成本

            pop.show().hd.html(Cashier.currentProductName+' 的销售');
            pop.bd.html(html);
            pop.bindUI();
            pop.syncStyle();
        }
    };

    return Cashier;
});
