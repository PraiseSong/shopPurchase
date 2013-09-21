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
                success: ProductsGetter.success
            });
        },
        Data2HTML: function (data){
            var html = '<li>'+
                '<img src="'+data.attachment+'" alt="'+data.name+'" />'+
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
            console.log(data)
        },
        abort: function (){},
        failure: function (){},
        render: function (){

        }
    };

    ProductsGetter.io({
        data: "limit=10&page="+ProductsGetter.pageNum+""
    });
});
