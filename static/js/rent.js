/**
 * Created with JetBrains PhpStorm.
 * User: praise
 * Date: 10/27/13
 * Time: 1:47 PM
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module){
    var $ = require("zepto.min.js");

    var promptTitle = '请设定今日租金';
    var defaultPrice = 70;
    var ioType = "post";
    var url = 'controler/rent.php';

    function query(){
        $.ajax({
            type: ioType,
            url: url,
            dataType: "json",
            data: "action=query",
            success: function (data){
                if(data.code !== 1){
                    add();
                }
            }
        });
    }
    function add(){
        var rent = window.prompt(promptTitle, defaultPrice);
        if(rent){
            $.ajax({
                type: ioType,
                url: url,
                dataType: "json",
                data: 'action=add&price='+rent,
                success: function (data){
                    if(data.code === 1 && data.data && data.data.id){
                        //saveToLocal(data.data);
                    }
                }
            });
        }
    }
    query();
});
