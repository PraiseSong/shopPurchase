/**
 * Created with JetBrains PhpStorm.
 * User: praise
 * Date: 10/19/13
 * Time: 11:41 PM
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module) {
    var $ = require('zepto.min.js');
    var IO = require("io.js");

    return {
        update: function (callback) {
            new IO({
                url: "userAuth.php",
                data: "action=update",
                on: {
                    success: function (data) {
                        if (data.bizCode === 1 && data.data && data.data.user) {
                            localStorage.setItem("user", JSON.stringify(data.data.user));
                        }
                        callback && callback.call(callback, data);
                    }
                }
            }).send();
        }
    };
});