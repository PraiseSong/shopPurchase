<?php
/**
 * Created by PhpStorm.
 * User: apple
 * Date: 11/20/13
 * Time: 6:10 PM
 */
require_once("qqConnect2.0/API/qqConnectAPI.php");
$qc = new QC();
$qc->qq_login();
?>
<!DOCTYPE html>
<!--<html manifest="cache.manifest">-->
<html xmlns="http://www.w3.org/1999/html">
<head>
    <meta charset="utf-8" />
    <meta content="initial-scale=1.0,user-scalable=no,maximum-scale=1,width=device-width" name="viewport" />
    <meta content="telephone=no" name="format-detection" />
    <meta content="yes" name="apple-mobile-web-app-capable" />
    <meta content="black" name="apple-mobile-web-app-status-bar-style" />
    <meta property="qc:admins" content="20612357606212603" />
    <link href="assets/imgs/logo.png" rel="apple-touch-icon-precomposed" />
    <link rel="stylesheet" href="assets/css/reset.css" />
    <link rel="stylesheet" href="assets/css/common.css" />
    <title>
        跳转到QQ认证
    </title>
</head>
<body>
<p style="text-align: center;margin: 30px 0;">正在跳转到 QQ 认证...</p>
</body>
</html>