/**
 * Created with JetBrains PhpStorm.
 * User: praise
 * Date: 9/22/13
 * Time: 9:10 PM
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module) {
    var $ = require('zepto.min.js');
    var Pop = require('pop.js');

    var Prompt = function (cfg){
        this.cfg = cfg || {};
        if(!this.cfg.type){
            this.cfg.type = "text";
        }
        if(!this.cfg.placeholder){
            this.cfg.placeholder = '';
        }
        this.cfg.styles = {
            height: "auto"
        }
        this.cfg.bindUI = function (){
            var self = this;
            this.ft.find(".btn1").unbind().bind('click', function (e){
                e.preventDefault();
                self.hide();
                self.cfg.callback.call(self);
            });
        };
        var style = 'style="width:100%;display: block;height:40px;line-height:40px;border:1px solid #ddd;-webkit-border-radius: 5px;"';
        this.cfg.bd = '<input type="'+this.cfg.type+'" '+style+' placeholder="'+this.cfg.placeholder+'" autocapitalize="off">';
        this.id = 'prompt'+new Date().getTime();
    };
    Prompt.prototype = new Pop;
    Prompt.prototype.val = function (){
        return $.trim(this.bd.find('input').val());
    };

    return Prompt;
});


