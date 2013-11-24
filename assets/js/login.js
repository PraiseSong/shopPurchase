/**
 * Created by apple on 11/24/13.
 */
define(function (require, exports, module){
    var $ = require('zepto.min.js');
    var Tooltip = require('tooltip.js');

    new Tooltip({
        node: $('#J-username')
    });
    new Tooltip({
        node: $('#J-password')
    });
});
