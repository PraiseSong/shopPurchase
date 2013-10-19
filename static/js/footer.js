/**
 * Created with JetBrains PhpStorm.
 * User: praise
 * Date: 10/19/13
 * Time: 11:41 PM
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module){
    var $ = require('zepto.min.js');

    var footer = $('#footer'),
        header = $('#header'),
        main = $('.main');

    var winH = $(window).height();
    main.css({
        '-webkit-overflow-scrolling': "touch",
        height: winH - parseInt(footer.css('height'), 10) - parseInt(header.css('height'), 10),
        marginTop: parseInt(header.css('height'), 10)+20,
        marginBottom: parseInt(footer.css('height'), 10)+20
    });
});