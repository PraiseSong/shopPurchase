/**
 * Created by apple on 1/13/14.
 */
define(function (require, exports, module) {
    var $ = require('zepto.min.js');
    var IO = require("io.js");
    var Utils = require("utils.js");
    var TEM = require("template.js");

    IO.prototype.send = function (){
        if (!Utils.network()) {
            this.noConnect(this, {bizCode: 0, memo: "请检查您的网络连接！", data:{}});
            return false;
        }

        PhoneGap.exec("发送: "+this.cfg.url, JSON.stringify(this.cfg.data));
        this.start();

        var self = this;

        if(this.cfg.data){
            this.cfg.data += '&username=username&api='+this.cfg.url;
        }else{
            this.cfg.data += 'username=username&api='+this.cfg.url;
        }
        this.ajaxObj = $.ajax({
            timeout: 30000,
            url: 'http://115.29.39.106/client.php'+"?t="+new Date().getTime(),
            dataType: this.cfg.dataType,
            data: this.cfg.data,
            type: this.cfg.type,
            success: function (data){self.success(data);},
            error: function (data){self.error(data);}
        });
    };

    var box = $('#J-helps');
    var tem =   '<li data-id="{id}">'+
                '<header id="{alias}" name="{alias}">{title}</header>'+
                '<div class="content">{content}</div>'+
                '<footer>'+
                '<p>这条是否对我有帮助？</p>'+
                '<p class="btns">'+
                '<a href="javascript:void(0)" class="J-is" data-id="{id}">'+
                '   <img src="assets/imgs/smile.gif" width="24" height="24" alt="是"/>'+
                '</a>'+
                '<a href="javascript:void(0)" class="J-isnot" data-id="{id}">'+
                '<img src="assets/imgs/cry.gif" width="24" height="24" alt="否"/>'+
                '</a>'+
                '</p>'+
                '</footer>'+
                '</li>';
    var hash = location.hash;

    if(hash){
        hash = hash.substr(1);
    }else{
        hash = "";
    }

    function request(){
        var io = new IO({
            url: "help.php",
            data: "action=query&alias="+hash+"",
            on: {
                success: function (data){
                    if(data.bizCode === 1 && data.data.helpList){
                        if(data.data.helpList.length <= 0){
                            box.html('<p style="text-align: center;">对不起，没有找到帮助内容！<a href="javascript:void(0)" class="J-tryagain">请重试</a></p>');
                            bindUI();
                            return ;
                        }
                        renderHTML(data.data.helpList);
                    }else{
                        box.html('<p style="text-align: center;color: red;">'+data.memo+' <a href="javascript:void(0)" class="J-tryagain">请重试</a></p>');
                        bindUI();
                    }
                },
                error: function (){
                    box.html('<p style="text-align: center;color: red;">查询帮助内容发生异常！<a href="javascript:void(0)" class="J-tryagain">请重试</a></p>');
                    bindUI();
                }
            }
        });
        io.send();
    }

    function renderHTML(helpList){
        var html = '';
        $.each(helpList, function (i, help){
            html += TEM(tem, help);
        });
        box.html(html);

        bindUI();
    }

    function bindUI(){
        $('.J-tryagain').unbind().bind('click', function (e){
            e.preventDefault();
            request();
        });
        $('.J-is').unbind().bind('click', function (e){
            e.preventDefault();
            var id = $(this).attr("data-id");
            new IO({
                url: "help.php",
                data: "action=is&id="+id+""
            }).send();
            Utils.tip("能够帮助到您，是我的荣幸 :-)", 2000);
        });
        $('.J-isnot').unbind().bind('click', function (e){
            e.preventDefault();
            var id = $(this).attr("data-id");
            new IO({
                url: "help.php",
                data: "action=isnot&id="+id+""
            }).send();
            Utils.tip("如果您的问题还没有解决，请向小店记账宝的微信号发出求救！在微信里订阅xiaodianjizhangbao", 10000);
        });
    }

    request();
});