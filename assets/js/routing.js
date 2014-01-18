define(function (require, exports, module){
    var $ = require('zepto.min.js');

    var Routing = {
        init: function (fn){
            var self = Routing;
            fn = fn || function (){};
            $(window).unbind("load.routing").bind('load.routing', function (){
                onload_handler.call(self, fn);
            });
        },
        /**
         * @returns {null} or {Object} 返回当前页面的对象，如果没有当前页面的数据，则返回null
         */
        getCurrentPage: function (){
            var exists = JSON.parse(localStorage.getItem("routing"));
            var result = null;
            exists && $.each(exists, function (i, page){
                if(page && page.url && page.url === location.href){
                    result = page;
                }
            });
            return result;
        },
        /**
         * @returns {null} or {String} 返回前一个页面的URL地址，如果没有则返回null
         */
        getBackPage: function (){
            if(current = Routing.getCurrentPage()){
                return current.prev ? current.prev.url : null;
            }else{
                return null;
            }
        },
        /**
         * @returns {null} or {String} 返回后一个页面的URL地址，如果没有则返回null
         */
        getForwardPage: function (){
            if(current = Routing.getCurrentPage()){
                return current.next ? current.next.url : null;
            }else{
                return null;
            }
        },
        /**
         * @returns {null} or {Array} 返回本地存储的所有页面的路径信息，如果没有则返回null
         */
        getAllPage: function (){
            var exists = JSON.parse(localStorage.getItem("routing"));
            return exists ? exists : null;
        },
        reset: function (fn, extraData){
            fn = fn || function (){};
            localStorage.removeItem('routing');
            onload_handler(fn, extraData);
        }
    };

    function onload_handler(fn, extraData){
        var data = extraData || {
            url: location.href,
            prev: null,
            next: null
        };

        if(!localStorage.getItem("routing")){
            data.isFirst = true;
            localStorage.setItem('routing', JSON.stringify([data]));
        }else{
            var exist = JSON.parse(localStorage.getItem("routing"));
            var last = exist[exist.length-1];
            var self = null;//当前页面
            var prev = null;
            var isBreak = false;
            //默认把前一个页面做为当前页面的prev
            if(last && last['url'] !== data.url){
                //确保保存的前一个页面的prev和当前的页面不重复，以免出现死循环中转
                if(last['prev'] && last['prev']['url'] !== data.url){
                    prev = last;
                }else if(!last['prev']){
                    prev = last;
                }
            }
            var next = null;
            var currentIndex = null;
            var targetIndex = null;//插入新页面的目标位置

            $.each(exist, function (i, o){
                if(o && data && o.url && data.url && o.url === data.url){
                    self = data;

                    if(exist[i-1]){
                        if(exist[i-1]['url'] !== data.url){
                            if(exist[i-1]['prev'] && exist[i-1]['prev']['url'] !== data.url){
                                prev = exist[i-1];
                            }else if(!exist[i-1]['prev']){
                                prev = exist[i-1];
                            }
                        }
                    }

                    if(exist[i+1]){
                        next = exist[i+1];
                    }

                    currentIndex = i;
                    targetIndex = i;

                    if(o.isFirst){
                        var _data = {
                            isFirst: true,
                            prev: null,
                            next: next,
                            url: location.href
                        };
                        Routing.reset(fn, _data);
                        exist.splice(i, exist.length-i);
                        isBreak = true;
                    }
                }

                if(currentIndex === 0){
                    prev = null;
                }
                if(currentIndex === exist.length-1){
                    //next = null;
                }
            });
            if(isBreak){
                fn();
                return false;
            }
            $.each(exist, function (k, o){
                //如果保存的页面跳转路径发生变化
                if(prevPage = document.referrer){
                    if(o && o.url && o.url === prevPage && o.url && data.url !== prevPage){
                        prev = o;
                        //o.next = null;
                        //next = null;
                        targetIndex = k+1;
                        //exist.splice(targetIndex, exist.length-k);
                        return false;
                    }
                }
            });
            $.each(exist, function (d, o){
                //去除重复的记录
                if(o && o.url && o.url === data.url){
                    exist.splice(d, 1, {});
                    return false;
                }
            });
            data.prev = prev;
            data.next = next;
            if(exist[targetIndex]){
                exist.splice(targetIndex, 1, data);
            }else{
                exist[targetIndex] = data;
            }
            $.each(exist, function (d, o){
                if(d === exist.length-1){
                    o.next = null;
                    return false;
                }
                if(!o.url){
                    exist.splice(d, 1);
                }
            });
            localStorage.setItem('routing', JSON.stringify(exist));
            fn();
        }
    };

    return Routing;
});