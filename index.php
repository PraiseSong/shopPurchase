<?php
require_once("models/config.php");

$ua = strtolower($_SERVER['HTTP_USER_AGENT']);
$ua_checker = array(
    'android' => preg_match('/android/', $ua),
    'iphone' => preg_match('/iphone|ipod|ipad/', $ua)
);
$device = "iPhone";
if ($ua_checker['android']) {
    $device = "android";
} else if ($ua_checker['iphone']) {
    $device = "iPhone";
}

  $screenshots_dir = "assets/imgs/screenshots/".$device;

  if(!is_dir($screenshots_dir)){
      exit($screenshots_dir." 不是一个有效的目录");
  }
  $config = $screenshots_dir.'/config.json';

  $config_handle = $handle = fopen($config, "r");
  if(!$config_handle){
      exit("产品缩略图的config.json无法打开");
  }
  $config_text = fread($config_handle, filesize($config));
  if(!$config_text){
      exit("无法读取产品缩略图的config.json或config.json没有内容");
  }
  $config_text = json_decode($config_text);

  $imgs = array();
  if ($screenshots_dir_handle = opendir($screenshots_dir)) {
    while (($file = readdir($screenshots_dir_handle)) !== false) {
        if ($file!="." && $file!=".." && $file !== "config.json") {
            $filename = preg_split('/\./', $file);
            $alt = $config_text->$filename[0];
            $src = $screenshots_dir."/$file";
            array_push($imgs, "<img src=\"$src\" alt=\"$alt\">");
        }
    }
    closedir($screenshots_dir_handle);
  }else{
      exit($screenshots_dir." 无法打开");
  }
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <meta content="initial-scale=1.0,user-scalable=no,maximum-scale=1,width=device-width" name="viewport"/>
    <meta content="telephone=no" name="format-detection"/>
    <meta content="yes" name="apple-mobile-web-app-capable"/>
    <meta content="black" name="apple-mobile-web-app-status-bar-style"/>
    <link href="assets/imgs/logo.png" rel="apple-touch-icon-precomposed"/>
    <title>
        小店记账宝
    </title>
    <link rel="stylesheet" href="assets/css/reset.css"/>
    <link rel="stylesheet" href="assets/css/common.css"/>
    <link rel="stylesheet" href="assets/css/index.css"/>
    <link rel="stylesheet" href="assets/libs/style.css"/>
    <script src="assets/libs/swipe.js"></script>
    <script src="assets/libs/sea.js"></script>
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
<div class="container">
    <div class="flexBox logoanddownload">
        <div class="box logoBox">
            <img src="assets/imgs/logo.png" alt="小店记账宝" width="70"/>

            <p>
                <?php echo $websiteName; ?>
            </p>

            <p class="version">
                当前版本 <?php echo $version; ?>
            </p>
        </div>
        <div class="downloadBtnBox box">
            <a href="#" title="下载iOS版" target="_blank" class="ios flexBox">
                <img src="assets/imgs/iphone.png" width="32" alt="下载iOS版"/>
                  <span class="box">
                      下载iOS版
                  </span>
            </a>
            <a href="#" title="下载安卓版" target="_blank" class="android flexBox">
                <img src="assets/imgs/android.png" width="32" alt="下载安卓版"/>
                  <span class="box">
                      下载安卓版
                  </span>
            </a>
            <a href="itms-services://?action=download-manifest&url=http://jizhangbao.com.cn/app.plist" title="下载越狱版" target="_blank" class="yy flexBox">
                <img src="assets/imgs/skullcandy.png" width="32" alt="下载越狱版"/>
                  <span class="box">
                      下载越狱版
                  </span>
            </a>
        </div>
    </div>
    <?php if(count($imgs) > 0): ?>
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
</body>
<script>
    seajs.use("index.js");
</script>
</html>