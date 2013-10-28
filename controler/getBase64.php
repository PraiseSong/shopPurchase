<?php
if(!$_POST){
    exit('非法访问');
}
$src = @$_POST['src'];
$result = array();

if($src){
    $file = '../attachments/'.$src.'.txt';
    $handle = @fopen($file, 'r');
    if($handle){
        $base64 = @fread($handle, filesize($file));
        fclose($handle);
        if($base64){
            $result['code'] = 1;
            $result['data'] = $base64;
        }
    }else{
        $result['code'] = 0;
        $result['memo'] = '无法读取base64数据';
    }
}else{
    $result['code'] = 0;
    $result['memo'] = '缺少附件地址的参数';
}

echo json_encode($result);
?>