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

            new $.Pop().show();
        },
        noData: function (){

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
