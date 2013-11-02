<?php
include_once('config/config.php');
include_once($libs_dir."/Mobile_Detect.php")
?>
<!DOCTYPE html>
<html manifest="cache.manifest">
<head>
    <meta charset="utf-8" />
    <meta content="initial-scale=1.0,user-scalable=no,maximum-scale=1,width=device-width" name="viewport" />
    <meta content="telephone=no" name="format-detection" />
    <meta content="yes" name="apple-mobile-web-app-capable" />
    <meta content="black" name="apple-mobile-web-app-status-bar-style" />
    <link href="static/imgs/logo.png" rel="apple-touch-icon-precomposed" />
    <title>
        <?php
            if(isset($page_name)){
                echo $page_name . '----' . constant("PRODUCT_NAME");
            }else{
                echo constant("PRODUCT_NAME");
            }
        ?></title>
    <link rel="stylesheet" href="static/css/reset.css" />
    <link rel="stylesheet" href="static/css/app.css" />
    <script src="static/libs/sea.js"></script>
    <script type="text/javascript">
        seajs.config({
            base: './static/js/'
        });
    </script>
</head>
<body>
<div class="main">