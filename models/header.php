<!DOCTYPE html>
<html manifest="cache.manifest">
<head>
    <meta charset="utf-8" />
    <meta content="initial-scale=1.0,user-scalable=no,maximum-scale=1,width=device-width" name="viewport" />
    <meta content="telephone=no" name="format-detection" />
    <meta content="yes" name="apple-mobile-web-app-capable" />
    <meta content="black" name="apple-mobile-web-app-status-bar-style" />
    <meta property="qc:admins" content="20612357606212603" />
    <link href="assets/imgs/logo.png" rel="apple-touch-icon-precomposed" />
    <title>
        <?php echo $websiteName; ?>
    </title>
    <link rel="stylesheet" href="assets/css/reset.css" />
    <link rel="stylesheet" href="assets/css/common.css" />
    <script src="assets/libs/sea.js"></script>
    <script type="text/javascript">
        seajs.config({
            base: './assets/js/',
            map: [
                //[".js", ".js?t=" + new Date().getTime()]
            ]
        });
    </script>
</head>
