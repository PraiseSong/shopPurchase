/**
 * Created by apple on 11/28/13.
 */
define(function (require, exports, module){
    /**
     * 一个非常简单的数据模版
     * @param {String} tem
     * @param {Object} data
     * @example '<p>{userName}</p><p>{userID}</p>'  {userName:"朱琦",userID:"53421"}
     * @return 返回已经填充数据的tem片段
     */
    var template = function (tem,data){
        var varReg = /{\w+}/g,
            keyReg = /^{(\w+)}$/,
            result;

        result = tem.replace(varReg,function ($0,$1){
            $0 = $0.replace(keyReg,function ($0,$1){
                for(var k in data){
                    data = data;

                    if(k === $1){
                        $1 = data[k];

                        //如果需要对数据进行过滤
                        if(template.filter){
                            $1 = template.filter.call(template.filter,k,$1,data) || $1;
                        }

                        return $1;
                    }
                }
                //假如服务端的数据与模版中的变量不匹配
                return $1 = '';
            });

            return $0;
        });

        return result;
    };

    return template;
});
