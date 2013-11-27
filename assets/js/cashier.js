/**
 * Created with JetBrains PhpStorm.
 * User: praise
 * Date: 10/19/13
 * Time: 11:41 PM
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module){
    var $ = require('zepto.min.js');

    $('#J-showPerfBtn').on("click", function (){
        $('#J-perf').show();
        $(this).hide();
    });
    $('#J-perf .close').on("click", function (){
        $('#J-showPerfBtn').show();
        $('#J-perf').hide();
    });
});