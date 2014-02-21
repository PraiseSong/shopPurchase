<?php
require_once("models/config.php");

$ua = strtolower($_SERVER['HTTP_USER_AGENT']);
$ua_checker = array(
    'android' => preg_match('/android/', $ua),
    'iphone' => preg_match('/iphone|ipod|ipad/', $ua)
);
$device = false;
$imgs = array();
if ($ua_checker['android']) {
    $device = "android";
} else if ($ua_checker['iphone']) {
    $device = "iPhone";
}

if(stripos($ua, 'webkit') && !$device){
    $device = "iPhone";
}

if($device){
    $screenshots_dir = "assets/imgs/screenshots/".$device;

    if(is_dir($screenshots_dir)){
        $config = $screenshots_dir.'/config.json';

        $config_handle = $handle = fopen($config, "r");
        if(!$config_handle){
            //exit("产品缩略图的config.json无法打开");
        }
        $config_text = fread($config_handle, filesize($config));
        if(!$config_text){
            //exit("无法读取产品缩略图的config.json或config.json没有内容");
        }
        $config_text = json_decode($config_text);

        if ($screenshots_dir_handle = opendir($screenshots_dir)) {
            while (($file = readdir($screenshots_dir_handle)) !== false) {
                if ($file!="." && $file!=".." && $file !== "config.json") {
                    $filename = preg_split('/\./', $file);
                    if($filename[0]){
                        $alt = $config_text->$filename[0];
                        $src = $screenshots_dir."/$file";
                        if($alt && $src){
                            array_push($imgs, "<img src=\"$src\" alt=\"$alt\">");
                        }
                    }
                }
            }
            closedir($screenshots_dir_handle);
        }else{
            //exit($screenshots_dir." 无法打开");
        }
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <meta name="baidu-tc-cerfication" content="816c8ab30314eda7a925cae8918fb130" />
    <meta name="description" content="小店记账宝是一款面向小商户的轻量级记账工具。帮助您轻松管理小店日常运营数据、货品数据。您再也不需要手抄本了，随身带部手机即可完成店铺每日的运营；您再也不需要在电脑里安装一大堆记账软件，现在只需要在您心爱的手机里打开小店记账宝即可">
    <meta name="keywords" content="记账宝,小店记账宝/账务管理/店铺账务管理/手机记账,手机进销存/iPhone记账/Android记账/小店铺记账/夜市记账/摆摊记账,货品管理/销售数据管理,记账宝网站,小店记账宝网站,记账宝官方网站,下载小店记账宝,下载记账宝,小店数据管理,小店运营管理,小店货品管理,小店记账软件">
    <meta charset="utf-8"/>
    <meta content="initial-scale=1.0,user-scalable=no,maximum-scale=1,width=device-width" name="viewport"/>
    <meta content="telephone=no" name="format-detection"/>
    <meta content="yes" name="apple-mobile-web-app-capable"/>
    <meta content="black" name="apple-mobile-web-app-status-bar-style"/>
    <meta name="apple-itunes-app" content="app-id=805541586">
    <meta name="google-site-verification" content="_cWcSIxwgfYWssv1sEMxhHvb-YzjhTO6inWfuogdnBY" />
    <meta name="msvalidate.01" content="71BE92EDF492EA24798598C27A3134E2" />
    <meta name="renderer" content="webkit" />
    <link href="assets/imgs/logo.png" rel="apple-touch-icon-precomposed"/>
    <link rel="shortcut icon" href="assets/imgs/favicon.ico" type="image/x-icon" />
    <title>
        小店记账宝
    </title>
    <style type="text/css">
        dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,code,form,fieldset,legend,textarea,p,blockquote,th,td,em,b,i,ins,del{zoom:1;margin:0;padding:0}
        input{vertical-align:middle;margin-left:-4px 0 0 -2px;zoom:1}
        table{border-collapse:collapse;border-spacing:0}
        ins,del{text-decoration:none}
        fieldset,img{border:none}
        address,caption,cite,code,dfn,em,strong,th,var,b,i{font-style:normal;font-weight:400}
        ul,li{list-style:none;zoom:1}
        caption,th{text-align:left}
        h1,h2,h3,h4,h5,h6{font-size:100%;font-weight:400}
        q:before,q:after{content:''}
        hr{height:1px;border-top:1px solid #e4e4e4;margin:0;padding:0}
        abbr,acronym{border:0;font-variant:normal}
        sup{vertical-align:text-top}
        sub{vertical-align:text-bottom}
        legend{color:#000}
        a{color:#3a97df;text-decoration:none}
        a:hover{color:#40759e;text-decoration:underline}
        form{margin:0}
        button{cursor:pointer;margin:0;padding:0}
        body{font-size:14px;background:#fff;color:#686868;line-height:18px;font-family:Arial;margin:0;padding:0}
        input,select,button{font-family:Arial}
        .clearfix{zoom:1}
        .clearfix:after{content:".";display:block;height:0;clear:both;visibility:hidden}
        .left{float:left}
        .right{float:right}
        .clear{clear:both}
        .hide{display:none}
        .show{display:block}
    </style>
    <style type="text/css">
        body{font-size:15px;color:#666;-webkit-text-size-adjust:none}
        a{color:#1caded}
        input[type=tel],input[type=number],input[type=text],input[type=email],input[type=url],input[type=search]{-webkit-appearance:none;-webkit-box-shadow:inset 1px 1px 5px #ECEBEB}
        *{-webkit-tap-highlight-color:rgba(255,255,255,0);-webkit-touch-callout:none;touch-callout:none}
        a:hover{text-decoration:none}
        .left{float:left}
        .right{float:right}
        .avatarBox{width:100px;height:100px;position:relative;overflow:hidden;margin:0 auto}
        .avatarBox .skin,.avatarBox img{position:absolute;left:0;top:0}
        .avatarBox .skin{position:absolute;z-index:2;width:100%;height:100%}
        .avatarBox img{z-index:1;width:100%;height:100%}
        .form-default{border:1px solid #ddd;-webkit-border-radius:10px}
        .form-default .input-skin{width:100%;overflow:hidden;height:44px;border-bottom:1px solid #ddd}
        .form-default .first-child{-webkit-border-top-left-radius:10px;-webkit-border-top-right-radius:10px;-webkit-border-bottom-left-radius:0;-webkit-border-bottom-right-radius:0}
        .form-default input[type=text],.form-default input[type=password],.form-default input[type=tel],.form-default input[type=email],.form-default input[type=url],.form-default input[type=number],.form-default textarea{background:#fff;display:block;line-height:44px;border:none;width:100%;text-align:left;text-indent:10px;outline:none;height:100%;font-size:15px}
        .form-default input[type=text]:focus,.form-default input[type=password]:focus,.form-default input[type=tel]:focus,.form-default input[type=email]:focus,.form-default input[type=url]:focus,.form-default input[type=number]:focus,.form-default textarea:focus{background:#faf8f0}
        .form-default .last-child{border-bottom:none;-webkit-border-bottom-left-radius:10px;-webkit-border-bottom-right-radius:10px}
        .openLogin{display:0;line-height:24px;height:24px;margin:20px auto}
        .openLogin img{width:24px;height:24px}
        .openLogin a{display:inline-block;margin-right:5px;color:#666;height:100%;overflow:auto;width:70px}
        .openLogin a img{float:left;margin-right:3px}
        .btn{display:block;-webkit-border-radius:5px;height:40px;line-height:40px;width:100%;color:#fff;text-align:center;font-size:20px;border:none;cursor:pointer}
        input.btn{-webkit-appearance:button}
        .btn:hover{color:#fff}
        .btn-primary{background:#f50;text-shadow:1px 1px 2px #cf4703}
        .btn-default{background:#1caded;text-shadow:1px 1px 2px #0389c4}
        .flexBox{width:100%;zoom:1}
        .flexBox:after{content:".";display:block;height:0;clear:both;visibility:hidden}
        .flexBox .box{display:block;-webkit-box-flex:1;float:left}
        .tooltip{position:absolute;z-index:10;background:#f4f8fa;border:1px solid #bce8f1;color:#1caded;display:none;height:22px;line-height:22px;pointer-events:none;padding:3px 10px}
        .header{display:0;height:44px;line-height:44px;width:100%;font-size:20px;background:#282d36;font-weight:400;margin-bottom:10px}
        .header .back{margin-right:10px;font-size:16px}
        .header .back img{width:24px;height:24px;float:left;margin-top:10px}
        .header span,.header .back{display:block;color:#fff}
        .header span{-webkit-box-flex:1;text-align:center}
        .step{border-bottom:1px solid #ddd;margin-bottom:10px;font-size:14px;padding:0 10px 10px}
        #error,#success{-webkit-border-radius:5px;line-height:30px}
        #error{color:#a94442;background-color:#f2dede;border:1px solid #ebccd1}
        #success{color:#3c763d;background-color:#dff0d8;border:1px solid #d6e9c6}
        .warn,.info,.error{-webkit-border-radius:10px;line-height:30px;padding:5px 10px}
        .warn{background:#fcf8e3;border:1px solid #faebcc}
        .error{background:#f2dede;border:1px solid #ebccd1;color:#a94442}
        .perf .detail{position:relative}
        .perf .detail .close{position:absolute;z-index:2;top:10px;right:10px}
        .perf .detail .gotoDetail{position:absolute;z-index:2;display:block;top:42px;right:1px;height:122px;background:#fff;text-align:center;border-left:1px solid #ddd;width:40px}
        .perf .detail .gotoDetail img{width:24px;height:24px;display:block;-webkit-transform:rotate(-180deg);margin:49px auto 0}
        .perf .detail table{width:100%;border:1px solid #ddd}
        .perf .detail table td{line-height:30px}
        .perf .detail table tr td:first-child{text-align:center}
        .perf .detail .tag{height:30px;width:30px;display:block;-webkit-border-radius:30px;text-align:center;line-height:30px;font-size:16px;margin:5px auto}
        .perf .detail .zu td:last-child{color:#ba974a}
        .perf .detail .y td:last-child{color:#5f8944}
        .perf .detail .z td:last-child{color:#9238d7}
        .perf .detail .c td:last-child{color:#000}
        .perf .detail .zu .tag{background:#f8cb69;color:#a3740d}
        .perf .detail .y .tag{background:#5f8944;color:#fff}
        .perf .detail .z .tag{background:#9238d7;color:#fff}
        .perf .detail .c .tag{background:#000;color:#fff}
        .perf .detail table tr td:last-child{text-indent:10px;font-size:18px}
        .perf .detail td a{font-size:14px;font-weight:700}
        .query{background:url(../imgs/query.png);background-size:24px 24px;background-repeat:no-repeat;background-position:0 0;padding-left:25px;display:block;height:24px;line-height:24px}
        .plist li{-webkit-box-shadow:0 0 10px #b3b3b3;margin-bottom:10px;-webkit-border-radius:3px;width:auto}
        .plist .selected{background:#FAF7AC}
        .plist li footer{height:30px;line-height:30px;background:#f4f4f4;border-top:1px solid #ddd}
        .plist li footer a{text-align:center;border-right:1px solid #ddd}
        .plist li footer a:first-child{-webkit-border-bottom-left-radius:3px}
        .plist li footer a:last-child{border-right:none;-webkit-border-bottom-right-radius:3px}
        .plist li img{max-width:100px}
        .plist li .imgSkin{width:100px;max-width:100px;overflow:hidden;margin-right:10px;-webkit-border-top-left-radius:3px}
        .plist li .information{line-height:25px;max-width:50%;padding:3px 5px 3px 0}
        .plist li .information .count{color:#578c0c}
        .plist li .information .price{color:#660711}
        .mask{background:rgba(0,0,0,.5);position:absolute;z-index:99999999;left:0;top:0;width:100%;height:100%}
        .loadingBox{position:absolute;z-index:999999999;left:20px;top:50px;width:90%;text-align:center;font-weight:700;line-height:22px;border:none;padding:10px 0}
        .loadingBox.warn{background:#e0c232;color:#9f6406;text-shadow:1px 1px 1px #fbf3cd}
        .loadingBox.error{background:#e55d19;color:#fff;text-shadow:1px 1px 1px #4a1b03}
        .userAvatarBox{-webkit-border-radius:60px;border:5px solid #ddd;text-align:center;height:60px;width:60px;display:block;overflow:hidden}
        .menu a{height:42px;line-height:42px;color:#333;border-bottom:1px solid #ddd;display:0;-webkit-tap-highlight-color:rgba(0,0,0,0.3)}
        .menu a .icon{display:block;width:24px;height:24px;margin:9px 10px 0}
        .menu a .text{display:block;-webkit-box-flex:1}
        .charts .chart{margin-bottom:10px;position:relative;height:45px}
        .charts .chart .trigger{display:block;height:45px;width:100%}
        .charts .chart .back,.charts .chart .front{position:absolute;left:0;top:0;width:100%;height:100%}
        .charts .chart .back{-webkit-box-shadow:0 0 5px rgba(51,51,51,.44);background:#f3f3f3}
        .charts .chart .front{z-index:2;background:#561d00;color:#fff;font-size:12px;overflow:hidden}
        .charts .chart .front p{line-height:22px;padding:0 5px}
        .shortMenu,.shortFullMenu{position:fixed;z-index:99999999;left:10px;bottom:10px;-webkit-tap-highlight-color:rgba(0,0,0,0)}
        .shortMenu .mainMenu,.shortFullMenu .bd{width:60px;height:60px;background:rgba(0,0,0,.7);-webkit-border-radius:60px;position:relative;cursor:pointer;-webkit-box-shadow:0 0 8px #606060}
        .shortFullMenu .bd .close{display:block;width:30px;height:30px;position:absolute;top:-10px;right:-10px;-webkit-border-radius:30px;text-align:center;line-height:30px;background:#f50;color:#fff;font-weight:700;font-size:20px}
        .shortMenu .mainMenu{overflow:hidden;background:#fff;border:5px solid #fff}
        .shortFullMenu .bd a{color:#000;display:block}
        .shortMenu .mainMenu .lt,.shortMenu .mainMenu .rt,.shortMenu .mainMenu .lb,.shortMenu .mainMenu .rb{display:block;position:absolute;width:15px;height:15px;background:#ddd;-webkit-border-radius:15px}
        .shortMenu .mainMenu .lt,.shortMenu .mainMenu .lb{left:13px}
        .shortMenu .mainMenu .rt,.shortMenu .mainMenu .rb{right:13px}
        .shortMenu .mainMenu .lt,.shortMenu .mainMenu .rt{top:13px}
        .shortMenu .mainMenu .lb,.shortMenu .mainMenu .rb{bottom:13px}
        .shortFullMenu{left:-200px;bottom:-200px;display:none}
        .shortFullMenu .bd{width:200px;height:200px;-webkit-border-radius:10px;background:rgba(255,255,255,.9)}
        .shortFullMenu .bd img{display:block;width:36px;height:36px;margin:0 auto 5px}
        .shortFullMenu .bd .t,.shortFullMenu .bd .r,.shortFullMenu .bd .b,.shortFullMenu .bd .l,.shortFullMenu .bd .c{position:absolute;width:70px;height:60px;-webkit-border-radius:10px;text-align:center}
        .shortFullMenu .bd .t,.shortFullMenu .bd .b{left:65px}
        .shortFullMenu .bd .t{top:5px}
        .shortFullMenu .bd .b{bottom:5px}
        .shortFullMenu .bd .l,.shortFullMenu .bd .r{top:70px}
        .shortFullMenu .bd .l{left:5px}
        .shortFullMenu .bd .r{right:5px}
        .shortFullMenu .bd .c{top:70px;left:65px}
        100%{-webkit-transform:scale(0);left:-200px;bottom:-200px}
        .scale-in{-webkit-animation:scale-in .5s both}
        .scale-out{-webkit-animation:scale-out .5s both}
        .field-group{height:40px;line-height:40px;display:0}
        .field-group.filed-tip{height:auto;line-height:22px;margin-bottom:0;font-size:12px}
        .field-group.filed-tip .warn{-webkit-border-radius:5px;color:#f50;padding:2px}
        .field-group .label{width:80px}
        .field-group .field{-webkit-box-flex:1}
        .field-group .input-text{display:block;text-indent:4px;line-height:40px;height:38px;-webkit-appearance:none;-webkit-box-shadow:inset 1px 1px 5px #ECEBEB}
        .input-text{-webkit-border-radius:3px;border:1px solid #ddd}
        .globalTip{position:absolute;z-index:999999;left:0;top:0;background:#d9edf7;color:#31708f;border:1px solid #bce8f1;-webkit-border-radius:3px;opacity:0;-webkit-box-shadow:0 0 5px #777;width:80%;padding:5px}
        .globalTipMask{opacity:0;position:absolute;z-index:999998;left:0;top:0;width:100%;background:rgba(255,255,255,.3)}
        .menuList a{display:0;border-bottom:1px solid #ddd;line-height:40px;text-align:left;padding:0 10px}
        .menuList a span{-webkit-box-flex:1;display:block;word-wrap:break-word}
        .menuList .arrow{-webkit-transform:rotate(180deg);margin:8px 0 0}
        .youneed{margin-bottom:30px}
        .youneed header{font-weight:700;padding-left:10px;font-size:18px;height:40px;line-height:40px}
        .youneed a{border-bottom:1px solid #ddd;padding-left:10px;line-height:30px;height:30px;display:block}
        .noNetwork,.normalNetWork{-webkit-border-radius:0;width:auto}
        .container,#error li,#success li{padding:0 10px}
        .step .current,.t-f50,.plist li .information .name{color:#f50}
        .perf .detail small,.noNetwork img,.normalNetWork img{margin-right:5px}
        .plist li:last-child,.charts .chart:last-child{margin-bottom:0}
        .menu,.menuList{-webkit-border-radius:5px;border:1px solid #ddd}
        .menu a:last-child,.menuList a:last-child{border:none}
    </style>
    <style type="text/css">
        html,body,div,span,object,iframe,h1,h2,h3,h4,h5,h6,p,del,dfn,em,img,ins,kbd,q,samp,small,strong,b,i,dl,dt,dd,ol,ul,li,fieldset,form,label,table,tbody,tfoot,thead,tr,th,td,article,aside,footer,header,nav,section{border:0;outline:0;font-size:100%;vertical-align:baseline;background:transparent;margin:0;padding:0}
        body{-webkit-text-size-adjust:none;font-family:sans-serif;min-height:416px}
        h1{font-size:33px;text-align:center;color:#212121;margin:50px 0 15px}
        h2{font-size:14px;font-weight:700;color:#3c3c3c;margin:20px 10px 10px}
        small{display:block;font-size:12px;margin:0 10px 30px}
        a{font-size:12px;color:#3c3c3c;margin:0 0 0 10px}
        html,body{background:#f3f3f3}
        #console{font-size:12px;font-family:Inconsolata, Monaco, Consolas, "Andale Mono", "Bitstream Vera Sans Mono", "Courier New", Courier, monospace;color:#999;line-height:18px;margin-top:20px;max-height:150px;overflow:auto}
        #mySwipe div b{display:block;font-weight:700;color:#14ADE5;font-size:20px;text-align:center;box-shadow:0 1px #EBEBEB;background:#fff;border-radius:3px;border:1px solid;border-color:#E5E5E5 #D3D3D3 #B9C1C6;margin:10px;padding:100px 10px}
    </style>
    <style type="text/css">
        .swipe{overflow:hidden;visibility:hidden;position:relative;-webkit-box-shadow:0 0 10px #333}
        .swipe-wrap{overflow:hidden;position:relative}
        .swipe-wrap > div{float:left;width:100%;position:relative;overflow:hidden}
        body{background:#efebe3}
        .container{width:230px;max-width:240px;margin-left:auto;margin-right:auto;padding:10px 5px}
        .logoBox{margin-right:10px;text-align:center;line-height:25px}
        .version{font-family:Arial, Helvetica, sans-serif;color:#8d8d8d;font-size:12px;margin-top:15px}
        .downloadBtnBox a{cursor:pointer;margin-bottom:10px;height:40px;line-height:40px;font-size:15px;-webkit-border-radius:5px;padding-right:5px;margin-left:0;overflow:hidden;display:block;width:134px}
        .downloadBtnBox a img{margin-top:4px;float:left;margin-right:10px}
        .downloadBtnBox .android{background:#fff;color:#72920B}
        .downloadBtnBox a:last-child{margin-bottom:0}
        .logoanddownload{margin-bottom:20px}
        .screenshots{max-width:200px;margin:0 auto 20px}
        .triggerBox{margin-bottom:10px}
        .currentScreenName{font-size:14px;width:60px;float:right}
        .triggers span{display:inline-block;width:7px;height:7px;-webkit-border-radius:7px;background:#cac7c2;margin-right:3px}
        .triggers span.current{background:#1c80ac}
        .triggers span:last-child{margin-right:0}
        .screenshots img{max-width:200px}
        #header{line-height:25px;font-size:16px;text-align:center;color:#333;-webkit-box-shadow:0 1px 5px #d0ccc1;background:#f4f4f4;border-bottom:1px solid #d0ccc1;padding:5px 0}
        .partners .content .h{font-size:15px;border-bottom:1px solid #c5c1ba;margin-bottom:10px;line-height:30px}
        .partners .content ul li{display:block;margin:3px 0}
        .partners .content ul li a{display:block;zoom:1;-webkit-border-radius:5px;margin:0;padding:3px}
        .partners .content ul li a:hover{background:#fff}
        .partners .content ul li a:after{content:".";display:block;height:0;clear:both;visibility:hidden}
        .partners .content ul li a span{line-height:36px}
        .partners .content ul li img{margin-right:10px;max-width:36px;float:left}
        #footer{font-size:12px;text-align:center;line-height:20px;padding:30px 0}
        .downloadBtnBox .ios,.downloadBtnBox .yy{background:#000;color:#fff}
    </style>
    <script>
        function Swipe(e,t){"use strict";function h(){o=s.children;f=o.length;if(o.length<2)t.continuous=false;if(i.transitions&&t.continuous&&o.length<3){s.appendChild(o[0].cloneNode(true));s.appendChild(s.children[1].cloneNode(true));o=s.children}u=new Array(o.length);a=e.getBoundingClientRect().width||e.offsetWidth;s.style.width=o.length*a+"px";var n=o.length;while(n--){var r=o[n];r.style.width=a+"px";r.setAttribute("data-index",n);if(i.transitions){r.style.left=n*-a+"px";g(n,l>n?-a:l<n?a:0,0)}}if(t.continuous&&i.transitions){g(v(l-1),-a,0);g(v(l+1),a,0)}if(!i.transitions)s.style.left=l*-a+"px";e.style.visibility="visible"}function p(){if(t.continuous)m(l-1);else if(l)m(l-1)}function d(){if(t.continuous)m(l+1);else if(l<o.length-1)m(l+1)}function v(e){return(o.length+e%o.length)%o.length}function m(e,n){if(l==e)return;if(i.transitions){var s=Math.abs(l-e)/(l-e);if(t.continuous){var f=s;s=-u[v(e)]/a;if(s!==f)e=-s*o.length+e}var h=Math.abs(l-e)-1;while(h--)g(v((e>l?e:l)-h-1),a*s,0);e=v(e);g(l,a*s,n||c);g(e,0,n||c);if(t.continuous)g(v(e-s),-(a*s),0)}else{e=v(e);b(l*-a,e*-a,n||c)}l=e;r(t.callback&&t.callback(l,o[l]))}function g(e,t,n){y(e,t,n);u[e]=t}function y(e,t,n){var r=o[e];var i=r&&r.style;if(!i)return;i.webkitTransitionDuration=i.MozTransitionDuration=i.msTransitionDuration=i.OTransitionDuration=i.transitionDuration=n+"ms";i.webkitTransform="translate("+t+"px,0)"+"translateZ(0)";i.msTransform=i.MozTransform=i.OTransform="translateX("+t+"px)"}function b(e,n,r){if(!r){s.style.left=n+"px";return}var i=+(new Date);var u=setInterval(function(){var a=+(new Date)-i;if(a>r){s.style.left=n+"px";if(w)S();t.transitionEnd&&t.transitionEnd.call(event,l,o[l]);clearInterval(u);return}s.style.left=(n-e)*(Math.floor(a/r*100)/100)+e+"px"},4)}function S(){E=setTimeout(d,w)}function x(){w=0;clearTimeout(E)}var n=function(){};var r=function(e){setTimeout(e||n,0)};var i={addEventListener:!!window.addEventListener,touch:"ontouchstart"in window||window.DocumentTouch&&document instanceof DocumentTouch,transitions:function(e){var t=["transitionProperty","WebkitTransition","MozTransition","OTransition","msTransition"];for(var n in t)if(e.style[t[n]]!==undefined)return true;return false}(document.createElement("swipe"))};if(!e)return;var s=e.children[0];var o,u,a,f;t=t||{};var l=parseInt(t.startSlide,10)||0;var c=t.speed||300;t.continuous=t.continuous!==undefined?t.continuous:true;var w=t.auto||0;var E;var T={};var N={};var C;var k={handleEvent:function(e){switch(e.type){case"touchstart":this.start(e);break;case"touchmove":this.move(e);break;case"touchend":r(this.end(e));break;case"webkitTransitionEnd":case"msTransitionEnd":case"oTransitionEnd":case"otransitionend":case"transitionend":r(this.transitionEnd(e));break;case"resize":r(h);break}if(t.stopPropagation)e.stopPropagation()},start:function(e){var t=e.touches[0];T={x:t.pageX,y:t.pageY,time:+(new Date)};C=undefined;N={};s.addEventListener("touchmove",this,false);s.addEventListener("touchend",this,false)},move:function(e){if(e.touches.length>1||e.scale&&e.scale!==1)return;if(t.disableScroll)e.preventDefault();var n=e.touches[0];N={x:n.pageX-T.x,y:n.pageY-T.y};if(typeof C=="undefined"){C=!!(C||Math.abs(N.x)<Math.abs(N.y))}if(!C){e.preventDefault();x();if(t.continuous){y(v(l-1),N.x+u[v(l-1)],0);y(l,N.x+u[l],0);y(v(l+1),N.x+u[v(l+1)],0)}else{N.x=N.x/(!l&&N.x>0||l==o.length-1&&N.x<0?Math.abs(N.x)/a+1:1);y(l-1,N.x+u[l-1],0);y(l,N.x+u[l],0);y(l+1,N.x+u[l+1],0)}}},end:function(e){var n=+(new Date)-T.time;var r=Number(n)<250&&Math.abs(N.x)>20||Math.abs(N.x)>a/2;var i=!l&&N.x>0||l==o.length-1&&N.x<0;if(t.continuous)i=false;var f=N.x<0;if(!C){if(r&&!i){if(f){if(t.continuous){g(v(l-1),-a,0);g(v(l+2),a,0)}else{g(l-1,-a,0)}g(l,u[l]-a,c);g(v(l+1),u[v(l+1)]-a,c);l=v(l+1)}else{if(t.continuous){g(v(l+1),a,0);g(v(l-2),-a,0)}else{g(l+1,a,0)}g(l,u[l]+a,c);g(v(l-1),u[v(l-1)]+a,c);l=v(l-1)}t.callback&&t.callback(l,o[l])}else{if(t.continuous){g(v(l-1),-a,c);g(l,0,c);g(v(l+1),a,c)}else{g(l-1,-a,c);g(l,0,c);g(l+1,a,c)}}}s.removeEventListener("touchmove",k,false);s.removeEventListener("touchend",k,false)},transitionEnd:function(e){if(parseInt(e.target.getAttribute("data-index"),10)==l){if(w)S();t.transitionEnd&&t.transitionEnd.call(e,l,o[l])}}};h();if(w)S();if(i.addEventListener){if(i.touch)s.addEventListener("touchstart",k,false);if(i.transitions){s.addEventListener("webkitTransitionEnd",k,false);s.addEventListener("msTransitionEnd",k,false);s.addEventListener("oTransitionEnd",k,false);s.addEventListener("otransitionend",k,false);s.addEventListener("transitionend",k,false)}window.addEventListener("resize",k,false)}else{window.onresize=function(){h()}}return{setup:function(){h()},slide:function(e,t){x();m(e,t)},prev:function(){x();p()},next:function(){x();d()},stop:function(){x()},getPos:function(){return l},getNumSlides:function(){return f},kill:function(){x();s.style.width="";s.style.left="";var e=o.length;while(e--){var t=o[e];t.style.width="";t.style.left="";if(i.transitions)y(e,0,0)}if(i.addEventListener){s.removeEventListener("touchstart",k,false);s.removeEventListener("webkitTransitionEnd",k,false);s.removeEventListener("msTransitionEnd",k,false);s.removeEventListener("oTransitionEnd",k,false);s.removeEventListener("otransitionend",k,false);s.removeEventListener("transitionend",k,false);window.removeEventListener("resize",k,false)}else{window.onresize=null}}}}if(window.jQuery||window.Zepto){(function(e){e.fn.Swipe=function(t){return this.each(function(){e(this).data("Swipe",new Swipe(e(this)[0],t))})}})(window.jQuery||window.Zepto)}
    </script>
    <script>
        /*! Sea.js 2.1.1 | seajs.org/LICENSE.md
         //# sourceMappingURL=sea.js.map
         */(function(t,u){function v(b){return function(c){return Object.prototype.toString.call(c)==="[object "+b+"]"}}function Q(){return w++}function I(b,c){var a;a=b.charAt(0);if(R.test(b))a=b;else if("."===a){a=(c?c.match(E)[0]:h.cwd)+b;for(a=a.replace(S,"/");a.match(J);)a=a.replace(J,"/")}else a="/"===a?(a=h.cwd.match(T))?a[0]+b.substring(1):b:h.base+b;return a}function K(b,c){if(!b)return"";var a=b,d=h.alias,a=b=d&&F(d[a])?d[a]:a,d=h.paths,g;if(d&&(g=a.match(U))&&F(d[g[1]]))a=d[g[1]]+g[2];g=a;var e=h.vars;
            e&&-1<g.indexOf("{")&&(g=g.replace(V,function(a,b){return F(e[b])?e[b]:a}));a=g.length-1;d=g.charAt(a);b="#"===d?g.substring(0,a):".js"===g.substring(a-2)||0<g.indexOf("?")||".css"===g.substring(a-3)||"/"===d?g:g+".js";g=I(b,c);var a=h.map,l=g;if(a)for(var d=0,f=a.length;d<f&&!(l=a[d],l=x(l)?l(g)||g:g.replace(l[0],l[1]),l!==g);d++);return l}function L(b,c){var a=b.sheet,d;if(M)a&&(d=!0);else if(a)try{a.cssRules&&(d=!0)}catch(g){"NS_ERROR_DOM_SECURITY_ERR"===g.name&&(d=!0)}setTimeout(function(){d?
            c():L(b,c)},20)}function W(){if(y)return y;if(z&&"interactive"===z.readyState)return z;for(var b=s.getElementsByTagName("script"),c=b.length-1;0<=c;c--){var a=b[c];if("interactive"===a.readyState)return z=a}}function e(b,c){this.uri=b;this.dependencies=c||[];this.exports=null;this.status=0;this._waitings={};this._remain=0}if(!t.seajs){var f=t.seajs={version:"2.1.1"},h=f.data={},X=v("Object"),F=v("String"),A=Array.isArray||v("Array"),x=v("Function"),w=0,p=h.events={};f.on=function(b,c){(p[b]||(p[b]=
            [])).push(c);return f};f.off=function(b,c){if(!b&&!c)return p=h.events={},f;var a=p[b];if(a)if(c)for(var d=a.length-1;0<=d;d--)a[d]===c&&a.splice(d,1);else delete p[b];return f};var m=f.emit=function(b,c){var a=p[b],d;if(a)for(a=a.slice();d=a.shift();)d(c);return f},E=/[^?#]*\//,S=/\/\.\//g,J=/\/[^/]+\/\.\.\//,U=/^([^/:]+)(\/.+)$/,V=/{([^{]+)}/g,R=/^\/\/.|:\//,T=/^.*?\/\/.*?\//,n=document,q=location,B=q.href.match(E)[0],k=n.getElementsByTagName("script"),k=n.getElementById("seajsnode")||k[k.length-
            1],k=((k.hasAttribute?k.src:k.getAttribute("src",4))||B).match(E)[0],s=n.getElementsByTagName("head")[0]||n.documentElement,N=s.getElementsByTagName("base")[0],O=/\.css(?:\?|$)/i,Y=/^(?:loaded|complete|undefined)$/,y,z,M=536>1*navigator.userAgent.replace(/.*AppleWebKit\/(\d+)\..*/,"$1"),Z=/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^\/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g,$=/\\\\/g,r=f.cache={},C,G={},H={},D={},j=e.STATUS={FETCHING:1,
            SAVED:2,LOADING:3,LOADED:4,EXECUTING:5,EXECUTED:6};e.prototype.resolve=function(){for(var b=this.dependencies,c=[],a=0,d=b.length;a<d;a++)c[a]=e.resolve(b[a],this.uri);return c};e.prototype.load=function(){if(!(this.status>=j.LOADING)){this.status=j.LOADING;var b=this.resolve();m("load",b);for(var c=this._remain=b.length,a,d=0;d<c;d++)a=e.get(b[d]),a.status<j.LOADED?a._waitings[this.uri]=(a._waitings[this.uri]||0)+1:this._remain--;if(0===this._remain)this.onload();else{for(var g={},d=0;d<c;d++)a=
            r[b[d]],a.status<j.FETCHING?a.fetch(g):a.status===j.SAVED&&a.load();for(var h in g)if(g.hasOwnProperty(h))g[h]()}}};e.prototype.onload=function(){this.status=j.LOADED;this.callback&&this.callback();var b=this._waitings,c,a;for(c in b)if(b.hasOwnProperty(c)&&(a=r[c],a._remain-=b[c],0===a._remain))a.onload();delete this._waitings;delete this._remain};e.prototype.fetch=function(b){function c(){var a=g.requestUri,b=g.onRequest,c=g.charset,d=O.test(a),e=n.createElement(d?"link":"script");if(c&&(c=x(c)?
            c(a):c))e.charset=c;var f=e;d&&(M||!("onload"in f))?setTimeout(function(){L(f,b)},1):f.onload=f.onerror=f.onreadystatechange=function(){Y.test(f.readyState)&&(f.onload=f.onerror=f.onreadystatechange=null,!d&&!h.debug&&s.removeChild(f),f=null,b())};d?(e.rel="stylesheet",e.href=a):(e.async=!0,e.src=a);y=e;N?s.insertBefore(e,N):s.appendChild(e);y=null}function a(){delete G[f];H[f]=!0;C&&(e.save(d,C),C=null);var a,b=D[f];for(delete D[f];a=b.shift();)a.load()}var d=this.uri;this.status=j.FETCHING;var g=
        {uri:d};m("fetch",g);var f=g.requestUri||d;!f||H[f]?this.load():G[f]?D[f].push(this):(G[f]=!0,D[f]=[this],m("request",g={uri:d,requestUri:f,onRequest:a,charset:h.charset}),g.requested||(b?b[g.requestUri]=c:c()))};e.prototype.exec=function(){function b(a){return e.get(b.resolve(a)).exec()}if(this.status>=j.EXECUTING)return this.exports;this.status=j.EXECUTING;var c=this.uri;b.resolve=function(a){return e.resolve(a,c)};b.async=function(a,g){e.use(a,g,c+"_async_"+w++);return b};var a=this.factory,a=
            x(a)?a(b,this.exports={},this):a;a===u&&(a=this.exports);null===a&&!O.test(c)&&m("error",this);delete this.factory;this.exports=a;this.status=j.EXECUTED;m("exec",this);return a};e.resolve=function(b,c){var a={id:b,refUri:c};m("resolve",a);return a.uri||K(a.id,c)};e.define=function(b,c,a){var d=arguments.length;1===d?(a=b,b=u):2===d&&(a=c,A(b)?(c=b,b=u):c=u);if(!A(c)&&x(a)){var g=[];a.toString().replace($,"").replace(Z,function(a,b,c){c&&g.push(c)});c=g}d={id:b,uri:e.resolve(b),deps:c,factory:a};if(!d.uri&&
            n.attachEvent){var f=W();f&&(d.uri=f.src)}m("define",d);d.uri?e.save(d.uri,d):C=d};e.save=function(b,c){var a=e.get(b);a.status<j.SAVED&&(a.id=c.id||b,a.dependencies=c.deps||[],a.factory=c.factory,a.status=j.SAVED)};e.get=function(b,c){return r[b]||(r[b]=new e(b,c))};e.use=function(b,c,a){var d=e.get(a,A(b)?b:[b]);d.callback=function(){for(var a=[],b=d.resolve(),e=0,f=b.length;e<f;e++)a[e]=r[b[e]].exec();c&&c.apply(t,a);delete d.callback};d.load()};e.preload=function(b){var c=h.preload,a=c.length;
            a?e.use(c,function(){c.splice(0,a);e.preload(b)},h.cwd+"_preload_"+w++):b()};f.use=function(b,c){e.preload(function(){e.use(b,c,h.cwd+"_use_"+w++)});return f};e.define.cmd={};t.define=e.define;f.Module=e;h.fetchedList=H;h.cid=Q;f.resolve=K;f.require=function(b){return(r[e.resolve(b)]||{}).exports};h.base=(k.match(/^(.+?\/)(\?\?)?(seajs\/)+/)||["",k])[1];h.dir=k;h.cwd=B;h.charset="utf-8";var B=h,P=[],q=q.search.replace(/(seajs-\w+)(&|$)/g,"$1=1$2"),q=q+(" "+n.cookie);q.replace(/(seajs-\w+)=1/g,function(b,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       c){P.push(c)});B.preload=P;f.config=function(b){for(var c in b){var a=b[c],d=h[c];if(d&&X(d))for(var e in a)d[e]=a[e];else A(d)?a=d.concat(a):"base"===c&&("/"===a.slice(-1)||(a+="/"),a=I(a)),h[c]=a}m("config",b);return f}}})(this);
    </script>
    <script type="text/javascript">
        seajs.config({
            base: './assets/js/',
            map: [
                [".js", ".js?t=" + new Date().getTime()]
            ]
        });
    </script>
</head>
<body>
<div id="header">
    让小店的记账更简单
</div>
<div class="container">
    <div class="flexBox logoanddownload">
        <div class="box logoBox">
            <img src="assets/imgs/logo.png" alt="小店记账宝" width="70"/>

            <p>
                <?php echo $websiteName; ?>
            </p>

            <p class="version">
                最新版本 <?php echo $version; ?>
            </p>
        </div>
        <div class="downloadBtnBox box">
            <a href="https://itunes.apple.com/us/app/xiao-dian-ji-zhang-bao/id805541586?ls=1&mt=8#weixin.qq.com" title="下载iOS版" target="_blank" class="ios flexBox">
                <img src="assets/imgs/iphone.png" width="32" alt="下载<?php echo $websiteName; ?>iOS版"/>
                  <span class="box">
                      下载iOS版
                  </span>
            </a>
            <a href="download/xiaodianjizhangbao.apk#weixin.qq.com" title="下载安卓版" target="_blank" class="android flexBox">
                <img src="assets/imgs/android.png" width="32" alt="下载<?php echo $websiteName; ?>安卓版"/>
                  <span class="box">
                      下载安卓版
                  </span>
            </a>
            <a href="itms-services://?action=download-manifest&url=http://jizhangbao.com.cn/app.plist#weixin.qq.com" title="下载越狱版" target="_blank" class="yy flexBox">
                <img src="assets/imgs/skullcandy.png" width="32" alt="下载<?php echo $websiteName; ?>越狱版"/>
                  <span class="box">
                      下载越狱版
                  </span>
            </a>
        </div>
    </div>
    <?php if(count($imgs) > 0 && ($device === 'iPhone' || $device === 'android')): ?>
    <div class="screenshots">
        <div class="triggerBox flexBox">
            <div class="triggers box" id="J-triggers">
                <?php
                  foreach($imgs as $k=>$img){
                      $current = '';
                      if($k === 0){
                          $current = 'class="current"';
                      }
                      echo "<span $current></span>";
                  }
                ?>
            </div>
            <span class="currentScreenName" id="J-currentScreenName">产品展示</span>
        </div>
        <div id='slider' class='swipe'>
            <div class='swipe-wrap'>
                <?php
                foreach($imgs as $k=>$img){
                    $current = '';
                    if($k === 0){
                        $current = 'class="current"';
                    }
                    echo "<div>".$img."</div>";
                }
                ?>
            </div>
        </div>
    </div>
    <? endif; ?>
</div>

<div class="partners">
    <div class="container">
        <div class="content">
            <div class="h">去应用市场下载</div>
            <ul>
                <li>
                    <a href="http://www.25pp.com" target="_blank" class="flexBox">
                        <img src="assets/imgs/ppzs.png" alt="PP助手(iPhone游戏)"/>
                        <span class="box">
                            PP助手(iPhone游戏)
                        </span>
                    </a>
                </li>
                <li>
                    <a href="http://zhushou.360.cn/" target="_blank" class="flexBox">
                        <img src="assets/imgs/360zs.png" alt="360手机助手"/>
                        <span class="box">
                            360手机助手
                        </span>
                    </a>
                </li>
                <li>
                    <a href="http://android.app.qq.com/" target="_blank" class="flexBox">
                        <img src="assets/imgs/qq.png" alt="应用宝"/>
                        <span class="box">
                            应用宝
                        </span>
                    </a>
                </li>
                <li>
                    <a href="http://as.baidu.com/a/appsearch?pre=web_am_index" target="_blank" class="flexBox">
                        <img src="assets/imgs/baidu.png" alt="百度手机助手"/>
                        <span class="box">
                            百度手机助手
                        </span>
                    </a>
                </li>
                <li>
                    <a href="http://zs.91.com/" target="_blank" class="flexBox">
                        <img src="assets/imgs/91.png" alt="91手机助手"/>
                        <span class="box">
                            91手机助手
                        </span>
                    </a>
                </li>
                <li>
                    <a href="http://apk.hiapk.com/himarket/" target="_blank" class="flexBox">
                        <img src="http://cdn.r.apk.hiapk.com/web2/themes/t1/images/logo72.png" alt="安卓市场"/>
                        <span class="box">
                            安卓市场
                        </span>
                    </a>
                </li>
                <li>
                    <a href="http://www.appchina.com/" target="_blank" class="flexBox">
                        <img src="http://static.yingyonghui.com/icon/72/9999.png" alt="应用汇"/>
                        <span class="box">
                            应用汇
                        </span>
                    </a>
                </li>
                <li>
                    <a href="http://www.wandoujia.com/apps" target="_blank" class="flexBox">
                        <img src="assets/imgs/wdj.png" alt="碗豆荚"/>
                        <span class="box">
                            碗豆荚
                        </span>
                    </a>
                </li>
                <li>
                    <a href="http://apk.gfan.com/apps_7_1_1.html" target="_blank" class="flexBox">
                        <img src="assets/imgs/jf.png" alt="机锋市场"/>
                        <span class="box">
                            机锋市场
                        </span>
                    </a>
                </li>
                <li>
                    <a href="http://m.163.com/android/" target="_blank" class="flexBox">
                        <img src="assets/imgs/wy.png" alt="网易应用市场"/>
                        <span class="box">
                            网易应用市场
                        </span>
                    </a>
                </li>
                <li>
                    <a href="http://mm.10086.cn/" target="_blank" class="flexBox">
                        <img src="http://u5.mm-img.com/rs/res1/21/2013/12/14/a278/699/32699278/logo1140x1407031345623_src.jpg" alt="中国移动MM应用市场"/>
                        <span class="box">
                            中国移动MM应用市场
                        </span>
                    </a>
                </li>
                <li>
                    <a href="http://www.anzhi.com/applist.html" target="_blank" class="flexBox">
                        <img src="http://img4.anzhi.com/data1/icon/201401/17/cn.goapk.market_97869700.jpg" alt="安智市场"/>
                        <span class="box">
                            安智市场
                        </span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</div>

<div id="footer">
    <p>
        记账宝版权所有 © 2014 - 2015
    </p>
    <p>
        浙ICP备08107985号-4
    </p>
</div>
</body>
<script>
    seajs.use("index.js");
</script>
</html>