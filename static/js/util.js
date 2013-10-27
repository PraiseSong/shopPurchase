/**
 * 小工具模块
 * User: praise
 * Date: 9/7/13
 * Time: 5:12 PM
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module){
    function to2Num(num){
        if(num < 10){
            num = '0'+num;
        }
        return num;
    }

    return {
        to2Num: to2Num
    };
});
